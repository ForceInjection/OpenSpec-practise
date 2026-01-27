# Design: Ecommerce Mini Architecture

## Architecture

采用单体分层架构，确保关注点分离与可测试性。

```mermaid
graph TD
    Client[HTTP Client] --> API[HTTP Layer / Controllers]
    API --> Service[Service Layer / Use Cases]
    Service --> Domain[Domain Layer / Entities]
    Service --> Repo[Repository Layer]
    Repo --> Store[Data Store (Memory/File)]
```

### Layers

| 层级         | 目录 (`src/`)       | 职责                                                    | 依赖方向              |
| :----------- | :------------------ | :------------------------------------------------------ | :-------------------- |
| **接口层**   | `http/`             | 处理 HTTP 请求，参数解析，鉴权，响应格式化              | -> Application        |
| **应用层**   | `services/`         | 用例编排（Orchestration），如“下单”涉及扣库存、清购物车 | -> Domain, Repo       |
| **领域层**   | `domain/`           | 纯净的业务实体 (`types.ts`) 与逻辑，无外部依赖          | None                  |
| **基础设施** | `repo/`, `persist/` | 数据持久化实现（Memory/File）                           | Implementation Detail |

## Data Flow (Order Creation)

1. **User** 发起 `POST /api/orders` 请求。
2. **HTTP Layer** 解析 Token，验证用户身份。
3. **Order Service** 接收请求：
   - 调用 **Cart Service** 获取当前购物车商品。
   - 调用 **Catalog Service** 扣减库存（事务一致性边界）。
   - 计算总价，生成订单实体。
4. **Order Repo** 保存订单数据。
5. **HTTP Layer** 返回 `201 Created` 及订单详情。

## Data Models

### Consistency Strategy

- **MVP**: 内存锁（JS单线程特性）保证原子性。
- **Production**: 文件锁或数据库事务（建议）。

### Storage

- **Products**: Read-only (loaded on startup) or append-only.
- **Orders**: Append-only.
- **Carts**: Key-Value (User -> Cart).
