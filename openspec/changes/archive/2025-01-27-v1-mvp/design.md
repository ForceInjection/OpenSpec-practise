# Design: Ecommerce Mini Architecture

## Context

本项目是一个 Spec-Driven Development 演示项目，采用双语言实现（Node.js 和 Python），构建一个最小可用的电商下单流程。

**约束条件**：

- Node.js 实现：v20+，零 npm 依赖，使用原生 `http` 模块
- Python 实现：FastAPI + Pydantic，提供类型安全和自动文档
- 存储：开发环境使用内存 Map，生产扩展使用文件持久化
- 单体架构：所有模块运行在同一进程中

## Goals / Non-Goals

**Goals:**

- 清晰的四层分层架构，确保关注点分离与可测试性
- Spec 到代码的直接映射关系，每个 Requirement 有对应的实现和测试
- 内存存储的 MVP 版本支持快速验证，同时保留生产扩展路径
- Node.js 和 Python 实现共享相同的 API 契约和业务行为

**Non-Goals:**

- 分布式微服务架构
- 真实数据库（MySQL/PostgreSQL/MongoDB）
- 真实支付网关集成
- 水平扩展与负载均衡
- 前端 UI

## Decisions

### Decision 1: 单体分层架构

采用经典四层架构，确保关注点分离。

```mermaid
graph TD
    Client[HTTP Client] --> API[HTTP Layer / Controllers]
    API --> Service[Service Layer / Use Cases]
    Service --> Domain[Domain Layer / Entities]
    Service --> Repo[Repository Layer]
    Repo --> Store[Data Store (Memory/File)]
```

| 层级         | 目录 (`src/`)       | 职责                                                    | 依赖方向              |
| :----------- | :------------------ | :------------------------------------------------------ | :-------------------- |
| **接口层**   | `http/`             | 处理 HTTP 请求，参数解析，鉴权，响应格式化              | -> Application        |
| **应用层**   | `services/`         | 用例编排（Orchestration），如"下单"涉及扣库存、清购物车 | -> Domain, Repo       |
| **领域层**   | `domain/`           | 纯净的业务实体 (`types.js`) 与逻辑，无外部依赖          | None                  |
| **基础设施** | `repo/`, `persist/` | 数据持久化实现（Memory/File）                           | Implementation Detail |

**Rationale**: 分层架构是最适合教学和演示的模式，依赖方向清晰（HTTP -> Service -> Domain），每层可独立测试。

**Alternatives Considered**:

1. **微服务架构**: 每个域一个服务。过重，不适合演示项目。
2. **扁平脚本**: 所有逻辑在单文件中。不可维护，无法展示架构设计。

### Decision 2: 内存优先存储

MVP 阶段使用 JavaScript `Map` / Python `dict` 作为内存存储。

**Rationale**: 零依赖、即时启动、满足 SLO（p99 < 100ms）。

**Trade-off**: 进程重启后数据丢失。通过生产扩展中的 `FileStore` 缓解。

**Alternatives Considered**:

1. **SQLite**: 增加外部依赖，违背零依赖目标。
2. **Redis**: 需要外部服务，增加环境复杂度。

### Decision 3: 原生 HTTP (Node.js) / FastAPI (Python)

Node.js 使用原生 `http` 模块，Python 使用 FastAPI 框架。

**Rationale**: Node.js 端展示无框架实现能力；Python 端展示生产级框架的类型安全和自动文档生成。

**Trade-off**: Node.js 端需要手动实现路由和 JSON 解析，代码量较大但教学价值高。

### Decision 4: 分（Cents）为单位的价格

所有价格使用整数分（cents）表示，如 `priceCents: 1999` 代表 19.99 元。

**Rationale**: 避免浮点精度问题（如 `0.1 + 0.2 !== 0.3`），这是金融计算的行业标准做法。

## Data Flow (Order Creation)

以"下单"场景为例，展示关键数据流：

1. **User** 发起 `POST /api/orders` 请求。
2. **HTTP Layer** 解析 Token，验证用户身份。
3. **Order Service** 接收请求：
   - 调用 **Cart Repo** 获取当前购物车商品。
   - 验证购物车非空（否则抛出 CART_EMPTY）。
   - 遍历购物车条目，调用 **Product Repo** 验证库存并计算总价。
   - 库存不足则抛出 OUT_OF_STOCK。
   - 扣减库存（模拟事务）。
   - 生成订单实体（status: PENDING_PAYMENT）。
4. **Order Repo** 保存订单数据。
5. **Cart Repo** 清空用户购物车。
6. **HTTP Layer** 返回 `201 Created` 及订单详情。

## Data Models

### Storage Strategy

- **Products**: 读多写少，启动时加载或按需添加。
- **Orders**: 仅追加（Append-only），创建后状态仅从 PENDING_PAYMENT 变为 PAID。
- **Carts**: Key-Value 结构（User -> Cart），下单后清空。

### Consistency Strategy

- **MVP**: 利用 JavaScript 单线程特性保证原子性（无并发竞争）。
- **Production**: 文件锁或数据库事务（建议）。

## Risks / Trade-offs

| 风险                           | 影响                     | 缓解措施                                    |
| :----------------------------- | :----------------------- | :------------------------------------------ |
| 单线程库存扣减无真正并发保护   | 高并发下可能超卖         | MVP 可接受；生产环境使用数据库事务          |
| 内存存储进程重启后数据丢失     | 测试数据需重新初始化     | 生产扩展中实现 FileStore 文件持久化         |
| 开发环境 Mock 鉴权绕过安全检查 | 无法测试真实鉴权流程     | 生产服务器 (server.prod.js) 实现 JWT 中间件 |
| Node.js 手动 HTTP 路由匹配     | 路由逻辑复杂度随端点增长 | 教学项目端点有限，可控范围内                |
