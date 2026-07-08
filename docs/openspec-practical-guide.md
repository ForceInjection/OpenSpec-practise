# OpenSpec 实战指南

## 1. 引言

OpenSpec 是一种以规格（Spec）为中心的工程方法与工具链，旨在通过统一的结构化文档与自动化工作流，提升复杂系统在设计到交付全周期的确定性与可验证性。本文结合一个小型电商网站的完整案例，演示从架构设计、系统设计、模块设计、接口设计，到单元测试、集成测试（覆盖接口层验收）、性能测试的全流程，以促进在真实项目中落地。

> **进阶阅读**：关于本案例的 AI 协作全流程复盘（Prompt 设计与交互记录）及 Python 版本的跨语言复刻验证，请参考 [OpenSpec 实战指南：AI 辅助软件工程全流程深度复盘](./openspec-ai-workflow-analysis.md)。
>
> **CLI 参考手册**：关于 OpenSpec CLI 的完整命令说明（init、validate、archive 等），请参考 [OpenSpec 使用手册](./openspec-user-manual.md)。
>
> **培训材料**：本项目提供了配套的演示文稿 [OpenSpec 使用手册](./openspec-user-manual.pptx)，适合用于团队培训与技术分享。

---

## 2. 方法论与 OpenSpec 核心概念

OpenSpec 不仅仅是一套文档格式，更是一种 **Spec 驱动开发（Spec-Driven Development）** 的工程实践。它主张“以规格为源”，确保代码与测试始终与设计保持一致，解决传统开发中“文档落后于代码”的顽疾。

### 2.1 核心哲学

> **术语说明**：本文中"规格"与"Spec"同义，均指 OpenSpec 定义的文档结构；"规范"与"规格"可互换使用，不作区分。

OpenSpec 的设计遵循四大原则：

- **流动而非僵化 (Fluid not rigid)**：不设强制关卡，按需创建文档。
- **迭代而非瀑布 (Iterative not waterfall)**：在构建中学习，随时修正规格。
- **简单而非复杂 (Easy not complex)**：轻量级启动，无繁琐流程。
- **存量优先 (Brownfield-first)**：不仅适用于新项目，也能通过 Delta 机制平滑接入现有代码库。

### 2.2 目录结构与单一事实来源

OpenSpec 将项目状态分为两个核心区域，确保“当前状态”与“变更过程”分离：

- **项目配置 (`openspec/config.yaml`)**
  项目级别的配置文件，声明 Schema 类型（`spec-driven`）、项目上下文（技术栈、架构约束等）以及各文档类型的规则（Rules）。此配置会被注入到每一次 AI 规划请求中。

- **Source of Truth (`openspec/specs/`)**
  这是系统**当前**的真实行为描述。所有已发布的特性都必须在此处有对应的规格定义。目录结构按能力（Capability）划分，如 `catalog-management/spec.md`, `payment/spec.md`。

- **Proposed Changes (`openspec/changes/`)**
  这是**进行中**的变更。每个变更是一个独立的文件夹（如 `openspec/changes/add-login/`），包含完整的上下文：
  - **元数据 (`.openspec.yaml`)**：变更的 Schema 类型与创建时间，由 CLI 自动管理。
  - **Proposal (`proposal.md`)**：**Why & What**。阐述背景、意图、范围与能力清单。
  - **Design (`design.md`)**：**How**。技术方案、架构图与数据流。
  - **Specs (Deltas)**：**Changes**。按能力（Capability）组织的规格修改草案，每个能力一个文件夹。
  - **Tasks (`tasks.md`)**：**Steps**。具体的实施步骤与验收标准。

当变更开发完成并归档（Archive）后，其 Delta Spec 会合并入主 Spec，形成新的事实来源。

### 2.3 工作流与 CLI 工具

OpenSpec 提供了两种主要的工作流方式：CLI 和 Slash Commands（AI 协作）。

#### 2.3.1 命令行工具 (CLI)

CLI (`openspec`) 适合人类开发者进行管理操作：

- **初始化 (`init`)**：一键生成标准目录结构，配置 `.openspec` 环境。
- **浏览与查看 (`list` / `view`)**：快速检索现有的变更与规格。
- **校验 (`validate`)**：检查文档结构的合法性。
- **归档 (`archive`)**：将完成的变更移入归档区。

#### 2.3.2 AI 协作指令 (Slash Commands)

OpenSpec 1.0+ 引入了 OPSX 工作流，实现了**动态指令体系**——AI 不再接收静态指令，而是主动查询 CLI 了解当前项目状态和文档依赖。

在支持的 AI 编辑器（如 Cursor、Claude Code、Qoder、Junie、Lingma IDE、ForgeCode 等 20+ 工具）中，推荐使用斜杠命令（Slash Commands）驱动开发：

**默认 Core 配置**：

| 命令                          | 作用                                                          |
| :---------------------------- | :------------------------------------------------------------ |
| `/opsx:propose <description>` | 一步创建变更并生成所有规划文档（proposal/design/specs/tasks） |
| `/opsx:explore`               | 进入探索模式，思考问题、调查代码库，不写代码                  |
| `/opsx:apply`                 | 按照 tasks.md 实现任务，动态读取当前变更上下文                |
| `/opsx:archive`               | 完成并归档当前变更，提示是否同步 Delta Spec 到主规范          |

**扩展工作流命令**（通过 `openspec config profile` 开启）

| 命令                 | 作用                                 |
| :------------------- | :----------------------------------- |
| `/opsx:new`          | 仅初始化变更目录结构（不创建文档）   |
| `/opsx:continue`     | 按依赖顺序创建下一个文档（逐步模式） |
| `/opsx:ff`           | 快进生成所有规划文档（一步到位）     |
| `/opsx:verify`       | 验证实现是否与规范一致               |
| `/opsx:sync`         | 将 Delta Spec 合并到主规范（不归档） |
| `/opsx:bulk-archive` | 批量归档多个已完成的变更             |
| `/opsx:onboard`      | 15 分钟全流程引导                    |

OPSX 工作流与旧版的最大区别在于：**动作而非阶段**。可以在任意时刻编辑任意文档，不存在阶段锁定。

**v1.5.0 新特性**：

- **Explore First（探索优先）**：`/opsx:explore` 作为推荐的起点。在不确定方案时，先进入探索模式调查代码库、对比选项、澄清需求——零成本的思考阶段，避免盲目开发。详见本指南第 6 章的真实探索过程复盘。
- **Fluid Workflow（流式迭代）**：强化「流动而非僵化」的核心理念。所有规划文档可在实现过程中随时调整，不存在阶段锁。发现设计问题？直接编辑对应文档即可，AI 会自动感知变更。
- **Stores（跨仓库规划，Beta）**：当项目涉及多个代码仓库（如微服务、前后端分离）时，可将规范集中在一个独立的 store 仓库中统一管理。各代码仓库通过 `references` 声明只读依赖。详见 [OpenSpec 使用手册 §3.5](./openspec-user-manual.md#35-各文件说明)。

### 2.4 验证与可观测性

- **结构化校验 (Validation)**
  OpenSpec 内部使用结构化 Schema（如 Zod）对 Spec 文档进行校验，确保文档不仅仅是文本，而是符合定义的结构化数据。这使得自动生成测试用例（Test Case Generation）成为可能。用户只需运行 `openspec validate` 即可触发此校验，无需手动编写 Schema。

- **遥测 (Telemetry)**
  内置基于 PostHog 的匿名遥测（可选），用于收集命令执行数据（如 `command_executed`），帮助团队分析工具使用频率与流程瓶颈。设计上严格遵循隐私原则，不收集参数、IP 或业务内容，并支持 `OPENSPEC_TELEMETRY=0` 环境变量完全关闭。

---

## 3. 迭代流程总览

OpenSpec 的迭代流程围绕着“规格优先”展开，但并不强制要求繁琐的审批流程。

### 3.1 目标与范围 (Proposal)

在任何代码开始之前，首先通过 `proposal.md` 定义**Why**和**What**。

- **业务目标**：例如“构建一个最小可用的电商下单流程”。
- **非功能性指标 (SLO)**：
  - p99 延迟 < 100ms
  - 支持 50 RPS 并发
  - 内存数据存储（Demo 阶段）

### 3.2 规格初始化

使用 CLI 快速初始化项目结构（如果你直接使用 `examples/ecommerce-mini` 源码，此步骤已完成，可跳过）：

```bash
openspec init --tools none
```

如果你使用的是配套源码，可运行以下命令确认规范文档完整无误（v1-mvp 已归档至 `changes/archive/`，此处为历史参考）：

```bash
openspec validate v1-mvp
```

在 `openspec/changes/` 下创建一个新的变更集（如 `v1-mvp`），并包含以下文件：

#### 3.2.1 `proposal.md` (宏观意图)

这是项目的起点，清晰定义了“我们为什么要做这个”以及“成功的标准是什么”。

```markdown
# Proposal: Ecommerce Mini MVP

## Why

### Background

本项目起源于社区关于 AI 编程的深度探讨，需要一个完整的实战案例来演示 OpenSpec 规范在 AI 辅助编程中的具体应用。

### Problem Statement

需要一个规范化的方式来确保人与 AI 对需求达成一致，同时保持代码与文档的同步。

### Alternatives Considered

1. **直接编写代码**: 快速但缺乏文档支撑。
2. **传统需求文档**: 与代码分离，容易过时。
3. **OpenSpec 规范驱动**: 先定义规范，再编写代码，保持一致性 ✓ 已选择此方案。

## What Changes

### New Resources Added

- **领域模型**: Product、User、Cart、Order 等核心实体。
- **API 接口**: 商品、购物车、订单、支付等 RESTful 接口。

### New Capabilities

- 商品列表查询与上架。
- 购物车管理（添加、移除）。
- 下单结算与库存扣减。

## Capabilities

### New Capabilities

- `catalog-management`: 商品列表查询、商品上架与库存扣减管理
- `cart-management`: 购物车商品添加、移除与数量限制
- `order-management`: 订单创建、订单查询与总价计算
- `payment`: 订单支付与状态流转
- `domain-model`: 核心业务实体定义
- `error-handling`: 统一错误响应格式与标准错误码体系

### Modified Capabilities

（无，本次为全新 MVP 项目）

## Impact

- **受影响代码**: `ecommerce-mini/src/` (Node.js), `ecommerce-mini-python/src/` (Python)
- **新增 API**: 8 个 REST 端点（GET /api/products, POST /api/products, POST /api/cart/items, DELETE /api/cart/items/:id, POST /api/orders, GET /api/orders/:id, POST /api/payments/:orderId, GET /metrics）
- **依赖**: Node.js 零 npm 依赖；Python 依赖 FastAPI + Pydantic

## Scope

### In Scope

- 商品列表查询与上架。
- 购物车管理（添加、移除）。
- 下单结算与库存扣减。
- 订单支付模拟。
- 内存存储与文件持久化。

### Out of Scope

- 复杂搜索与推荐。
- 真实支付网关集成。
- 后台管理界面。

## Goals (SLO)

- **Latency**: 核心接口 p99 < 100ms。
- **Concurrency**: 支持 50 RPS。
- **Quality**: 核心逻辑测试覆盖率 > 80%。
```

#### 3.2.2 其他核心文件

- `design.md`: 系统设计草案（架构图、数据流）。
- `specs/`: 具体的接口定义与数据模型。
- `tasks.md`: 拆解后的开发任务。

### 3.3 架构与系统设计

基于 Proposal，在 `design.md` 中确定：

- **边界**：明确 Catalog, Cart, Order, User 等模块的职责。
- **数据流**：绘制“用户 -> 加购 -> 下单 -> 支付”的关键路径。
- **接口**：定义 RESTful API 的 URL 结构与 Verb。

### 3.4 规范驱动实现

这是 OpenSpec 的核心——**代码是对规格的映射**。

- 领域层 (`domain/`)：直接映射 Spec 中的数据模型。
- 接口层 (`http/`)：直接映射 Spec 中的 API 定义。
- 测试层 (`__tests__/`)：直接映射 Spec 中的验收标准 (Scenarios)。

### 3.5 验证与度量

- **自动化测试**：运行单元测试与集成测试，确保实现符合 Spec。
- **基线度量**：在开发阶段就运行性能基准测试 (`performance.spec.js`)，确保 SLO 达标。
- **规范验证**：使用 `openspec validate` 命令验证规范文档格式是否正确。

```bash
# 验证变更规范（v1-mvp 已归档，此处为历史参考）
openspec validate v1-mvp

# 验证成功输出（示例）
Change 'v1-mvp' is valid
```

> **注意**：验证命令会检查 Proposal 章节完整性、目录结构、Delta Header 格式以及 Scenario 覆盖率。详细的验证规则与错误排查请参考 [OpenSpec 使用手册 - 6. 验证与常见错误](./openspec-user-manual.md#6-验证与常见错误)。

### 3.6 归档与沉淀

当 `v1-mvp` 开发完成并通过验收后，运行 `/opsx:archive`（推荐）或 CLI 命令 `openspec archive`。这会将变更集中的 Spec 合并到主规范目录 (`openspec/specs/`)，成为系统最新的事实来源。

---

## 4. 案例背景：小型电商网站

### 4.1 核心域与上下文

本案例构建一个名为 `ecommerce-mini` 的微型电商系统，包含五个核心上下文：

- **Catalog (商品)**: 管理商品信息与库存。
- **User (用户)**: 身份识别与认证。
- **Cart (购物车)**: 临时存放欲购买商品。
- **Order (订单)**: 交易的核心单据与状态流转。
- **Payment (支付)**: 资金结算模拟。

### 4.2 简化假设

为了聚焦 OpenSpec 流程，本项目做了以下工程折衷：

- **数据存储**：仅使用内存 Map 或本地文件，不依赖外部 DB。
- **单体架构**：所有模块运行在同一个 Node.js 进程中，通过模块导入通信。
- **环境依赖**：仅依赖 Node.js (v20+)，零 npm 依赖（生产级扩展除外）。

### 4.3 非功能性目标

- **延迟**：核心 API (GET /products, POST /orders) p99 < 100ms。
- **可靠性**：订单数据在服务重启后不丢失（需持久化扩展）。
- **质量**：核心业务逻辑覆盖率 > 80%。

---

## 5. 架构设计

### 5.1 分层架构

本项目采用经典的四层架构，确保关注点分离：

| 层级         | 目录 (`src/`)       | 职责                                                    | 依赖方向              |
| :----------- | :------------------ | :------------------------------------------------------ | :-------------------- |
| **接口层**   | `http/`             | 处理 HTTP 请求，参数解析，鉴权，响应格式化              | -> Application        |
| **应用层**   | `services/`         | 用例编排（Orchestration），如“下单”涉及扣库存、清购物车 | -> Domain, Repo       |
| **领域层**   | `domain/`           | 纯净的业务实体 (`types.js`) 与逻辑，无外部依赖          | None                  |
| **基础设施** | `repo/`, `persist/` | 数据持久化实现（Memory/File）                           | Implementation Detail |

### 5.2 边界与依赖规则

- **严格单向依赖**：HTTP -> Service -> Domain。
- **依赖倒置**：Service 层定义 Repository 接口，Infrastructure 层实现它（本示例简化为直接调用）。
- **数据隔离**：模块间不直接访问对方数据库，必须通过 Service 接口调用。

### 5.3 数据流概览

以“下单”场景为例：

1. **User** 发起 `POST /api/orders` 请求。
2. **HTTP Layer** 解析 Token，验证用户身份。
3. **Order Service** 接收请求：
   - 调用 **Cart Service** 获取当前购物车商品。
   - 调用 **Catalog Service** 扣减库存（事务一致性边界）。
   - 计算总价，生成订单实体。
4. **Order Repo** 保存订单数据。
5. **HTTP Layer** 返回 `201 Created` 及订单详情。

---

## 6. 系统设计

### 6.1 接口协议

采用标准的 RESTful JSON 风格。

- **URL 规范**：资源复数形式，如 `/api/products`。
- **状态码**：
  - `200 OK`: 查询/修改成功。
  - `201 Created`: 资源创建成功。
  - `400 Bad Request`: 业务校验失败（如购物车为空）。
  - `401 Unauthorized`: 未登录。
  - `409 Conflict`: 资源冲突（如库存不足）。

### 6.2 数据模型

在 OpenSpec 中，我们首先在 `changes/archive/2025-01-27-v1-mvp/specs/domain-model/spec.md` 中定义模型。规范文件必须使用 Delta Header + Requirement + Scenario 格式：

**Spec 定义 (`changes/archive/2025-01-27-v1-mvp/specs/domain-model/spec.md`)**:

```markdown
# Domain Model Specification

## Overview

核心业务实体定义，不依赖任何外部框架。

## ADDED Requirements

### Requirement: 商品实体定义

系统 SHALL 定义商品实体，包含唯一标识、名称、价格和库存。

**Priority**: P0 (Critical)

**Rationale**: 商品是电商系统的核心实体，是所有交易的基础。

#### Scenario: 创建有效商品

Given 需要创建新商品
When 提供商品信息 { id, name, priceCents, stock }
Then 商品实体创建成功
And id 格式为 prod_xxxx
And priceCents >= 0
And stock >= 0

---

### Requirement: 库存非负校验

库存扣减后 MUST NOT 为负数。

**Priority**: P0 (Critical)

**Rationale**: 库存为负会导致超卖，影响业务准确性。

#### Scenario: 库存不足时扣减

Given 商品库存为 5
When 尝试扣减 6 个库存
Then 抛出 OUT_OF_STOCK 错误
And 库存保持不变
```

**代码实现 (`src/domain/types.js` / JSDoc)**:

由于本项目使用原生 JS，我们通过 JSDoc 实现对 Spec 的映射：

```javascript
/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {number} priceCents
 * @property {number} stock
 */
```

### 6.3 错误处理

统一错误响应结构，便于前端处理：

```json
{
  "code": "OUT_OF_STOCK",
  "message": "商品 [prod_123] 库存不足"
}
```

---

## 7. 模块详细设计

### 7.1 Catalog (商品域)

- **Capabilities**:
  - `listProducts()`: 全量查询（Demo 不做分页）。
  - `getProduct(id)`: 详情查询。
  - `deductStock(id, qty)`: 原子扣减库存，需处理并发竞争（Demo 简化为单线程锁）。

### 7.2 Cart (购物车域)

- **Capabilities**:
  - `addToCart(userId, item)`: 增量更新。
  - `clearCart(userId)`: 下单后清空。
- **Storage**: Key 为 `userId`，Value 为 `Cart` 对象。

### 7.3 Order (订单域)

- **Capabilities**:
  - `createOrder(userId)`: 核心复杂逻辑，协调 Cart 与 Catalog。
  - `payOrder(orderId)`: 状态流转 `PENDING` -> `PAID`。

---

## 8. 接口设计

OpenSpec 的核心优势在于使用 **Markdown** 编写可读性极强的规格文档，同时保持结构化。在 v1.2.0 中，规范按能力（Capability）组织，每个能力一个文件夹。以下是 `openspec/changes/archive/2025-01-27-v1-mvp/specs/catalog-management/spec.md` 和 `openspec/changes/archive/2025-01-27-v1-mvp/specs/order-management/spec.md` 的真实片段：

```markdown
# Catalog Management Specification

## Overview

商品目录管理能力，涵盖商品的查询、上架与库存管理。

## ADDED Requirements

### Requirement: 商品列表查询

系统 SHALL 提供商品列表查询接口，返回所有可用商品。

**Priority**: P0 (Critical)

**Rationale**: 商品浏览是电商系统的核心入口功能，用户必须能够查看可购买的商品。

#### Scenario: 获取所有商品

Given 系统中存在商品数据
When 用户请求 GET /api/products
Then 返回状态码 200
And 返回商品数组 Product[]
```

```markdown
# Order Management Specification

## Overview

订单管理能力，涵盖订单的创建、查询与总价计算。

## ADDED Requirements

### Requirement: 订单创建

系统 SHALL 支持从用户购物车结算生成订单，过程中处理库存扣减与购物车清空。

**Priority**: P0 (Critical)

**Rationale**: 订单创建是交易的核心流程，涉及多模块协调（Cart -> Catalog -> Order）。

#### Scenario: 成功创建订单

Given 用户购物车中有商品
And 商品库存充足
When 发送 POST /api/orders 携带 { userId }
Then 返回状态码 201
And 返回新创建的订单 Order
And 订单状态为 PENDING_PAYMENT
And 购物车被清空
And 库存被扣减

#### Scenario: 创建订单时库存不足

Given 用户购物车中有商品
And 商品库存不足
When 发送 POST /api/orders 携带 { userId }
Then 返回状态码 409
And 返回错误码 OUT_OF_STOCK
```

> **注意**：
>
> - 必须使用 `## ADDED/MODIFIED/REMOVED Requirements` 作为 Delta Header。
> - 每个需求使用 `### Requirement: <标题>` 格式，描述中必须包含 `SHALL` 或 `MUST`。
> - 每个需求必须包含 `**Priority**` 和 `**Rationale**` 字段。
> - 每个需求至少包含一个 `#### Scenario:` 块，使用 Gherkin 格式（Given/When/Then）。
> - 这里的 `Product[]` 和 `Order` 引用了 `domain-model/spec.md` 中定义的数据模型，保持了定义的一致性。
>
>   **格式检查**：编写完成后，务必运行 `openspec validate <change-name>` 验证格式，避免因章节标题或 Scenario 缺失导致后续流程阻塞。本案例中使用的命令为 `openspec validate v1-mvp`（v1-mvp 已归档至 `changes/archive/`）。

## 9. 规范驱动实现

这是 OpenSpec 的核心——**代码是对规格的映射**。在编写代码时，开发者（或 AI）应始终打开 Spec 文件作为参考。

### 9.1 追踪矩阵

建立 Spec ↔ 代码 ↔ 测试 的映射关系，确保每一条 Spec 都有代码落地：

| Spec 定义 (Requirements)           | 代码实现 (Implementation)                             | 验证方式 (Verification) |
| :--------------------------------- | :---------------------------------------------------- | :---------------------- |
| `POST /api/orders`                 | `src/http/server.js` (Route Handler)                  | Integration Test        |
| `Response 409: Stock insufficient` | `catch (e) { if (e.message === 'OUT_OF_STOCK') ... }` | Unit Test (Error Case)  |
| `Order.totalCents` (Model)         | `src/domain/types.js` (Interface)                     | JSDoc / Code Review     |
| `p99 < 100ms` (SLO)                | `performance.spec.js` (Performance Test)              | CI Pipeline             |

**实践建议**：在代码注释中引用对应的 Spec 章节，如 `// 对应 Spec: POST /api/orders`。

### 9.2 目录结构映射

```text
OpenSpec-practise/
├── docs/                            <-- 文档目录
│   ├── openspec-user-manual.md          <-- OpenSpec 使用手册
│   ├── openspec-practical-guide.md  <-- 实战指南（本文档）
│   └── openspec-ai-workflow-analysis.md  <-- AI 协作流程分析
├── openspec/                        <-- OpenSpec 规范目录
│   ├── config.yaml                  <-- 项目配置（技术栈、规则等）
│   ├── specs/                       <-- 主规范（归档后的事实来源）
│   │   ├── catalog-management/spec.md
│   │   ├── cart-management/spec.md
│   │   ├── order-management/spec.md
│   │   ├── payment/spec.md
│   │   ├── domain-model/spec.md
│   │   ├── error-handling/spec.md
│   │   └── product-query/spec.md    <-- v1.5.0 新增：按 ID 查询商品
│   └── changes/                     <-- 变更目录
│       ├── archive/                 <-- 已归档变更
│       │   ├── 2025-01-27-v1-mvp/   <-- MVP 变更规范（已归档）
│       │   │   ├── .openspec.yaml   <-- 变更元数据
│       │   │   ├── proposal.md      <-- 对应提案文档
│       │   │   ├── design.md        <-- 对应设计文档
│       │   │   ├── tasks.md         <-- 对应任务清单
│       │   │   └── specs/           <-- Delta 规范（按能力组织）
│       │   │       ├── catalog-management/spec.md
│       │   │       ├── cart-management/spec.md
│       │   │       ├── order-management/spec.md
│       │   │       ├── payment/spec.md
│       │   │       ├── domain-model/spec.md
│       │   │       └── error-handling/spec.md
│       │   └── 2026-07-08-add-product-get-by-id/  <-- v1.5.0 工作流实践
├── examples/
│   ├── ecommerce-mini/              <-- Node.js Implementation
│   │   └── src/
│   │       ├── domain/types.js      <-- 对应 Spec 中的 Data Models
│   │       ├── services/            <-- 对应 Spec 中的 Business Rules
│   │       ├── http/server.js       <-- 对应 Spec 中的 API Definitions
│   │       └── persist/             <-- 对应 Design 中的 Storage Strategy
│   └── ecommerce-mini-python/       <-- Python Implementation
```

### 9.3 代码实现示例

**Controller 层 (`src/http/server.js`)**:

```javascript
// 对应 Spec: POST /api/orders
if (pathname === "/api/orders" && req.method === "POST") {
  const body = await readJson(req);
  try {
    // 编排业务逻辑 (Orchestration)
    // 1. 检查购物车 (Rule: Cart Not Empty)
    // 2. 检查库存 (Rule: Stock Check)
    // 3. 创建订单
    const order = orderService.createOrder(body.userId);
    return sendJson(res, 201, order);
  } catch (e) {
    if (e.message === "CART_EMPTY")
      return sendError(res, "CART_EMPTY", "购物车为空", 400);
    if (e.message === "OUT_OF_STOCK")
      return sendError(res, "OUT_OF_STOCK", "库存不足", 409);
    throw e;
  }
}
```

---

## 10. 验证与评估：确保实现符合规格

编写代码后，如何有效评估实现与 Spec 之间的一致性？本节介绍 OpenSpec 推荐的验证方法与工具。

### 10.1 追踪矩阵（Traceability Matrix）

追踪矩阵已在 [9.1 追踪矩阵](#91-追踪矩阵) 中给出，建议在编写代码阶段同步维护，确保每一条 Spec 都有对应的代码实现与测试验证。

### 10.2 从 Scenario 到测试用例

OpenSpec 的 Gherkin 格式场景天然适合转化为测试用例：

**Spec 中的场景**（`specs/order-management/spec.md`）：

```gherkin
#### Scenario: 成功创建订单

Given 用户购物车中有商品
And 商品库存充足
When 发送 POST /api/orders 携带 { userId }
Then 返回状态码 201
And 返回新创建的订单 Order
And 购物车被清空
And 库存被扣减
```

**对应的集成测试**（`__tests__/integration.spec.js`）：

> 以下示例假设测试环境服务运行在 `http://localhost:3000`（`base` 变量指向该地址）。

```javascript
it('完整购物流程', async () => {
  // 1. 上架商品 → Given 商品库存充足
  const res1 = await fetch(`${base}/api/products`, {...})
  assert.strictEqual(res1.status, 201)

  // 2. 加购 → Given 用户购物车中有商品
  const res2 = await fetch(`${base}/api/cart/items`, {...})
  assert.strictEqual(res2.status, 200)

  // 3. 下单 → When 发送 POST /api/orders
  const res3 = await fetch(`${base}/api/orders`, {...})
  assert.strictEqual(res3.status, 201)  // Then 返回状态码 201
  const order = await res3.json()
  assert.strictEqual(order.totalCents, 1000)  // Then 返回新创建的订单
  assert.strictEqual(order.status, 'PENDING_PAYMENT')
})
```

### 10.3 与 TDD 的关系

OpenSpec **不是替代 TDD，而是与 TDD 协同**：

```text
传统 TDD: 需求 → 写测试 → 写代码 → 重构
OpenSpec + TDD: 需求 → 写 Spec → 验证 Spec → 写测试（基于 Scenario）→ 写代码 → 重构
```

**关键区别**：

- **Spec 先于测试**：Spec 是人与 AI 的共识，测试是 Spec 的技术实现
- **Scenario 直接映射**：每个 Gherkin Scenario 可以对应一个测试用例
- **AI 可理解**：Spec 使用自然语言 + 结构化格式，AI 能直接参与生成测试
- **Scenario 即 AI Prompt**：每个 Gherkin Scenario 可以直接作为 AI 生成测试代码的 Prompt，在 AI 协作场景下大幅提升效率——只需将 Scenario 粘贴给 AI，便可获得完整的测试用例骨架

> 遇到格式报错？请参考 [OpenSpec 使用手册 - 6. 验证与常见错误](./openspec-user-manual.md#6-验证与常见错误) 排查问题。

### 10.4 代码审查清单

在 PR 审查时，检查实现与 Spec 的一致性：

- [ ] 每个 Requirement 都有对应的代码实现
- [ ] 每个 Scenario 都有对应的测试用例
- [ ] 边界场景（如库存不足、订单不存在）都有覆盖
- [ ] SLO 指标（如 p99 延迟）有性能测试验证
- [ ] 代码注释中引用了对应的 Spec 章节

---

## 11. 测试设计：验证规格

测试不是事后补充，而是规格的可执行版本。

### 11.1 单元测试 (`src/domain/logic.spec.js`)

针对纯函数逻辑，如金额计算、状态机流转。

- _Spec_: "订单总价等于所有条目单价乘以数量之和"
- _Test_: 使用 Node.js 原生测试运行器

```javascript
import { test } from "node:test";
import assert from "node:assert";
import { calculateTotal } from "./logic.js";

test("calculateTotal sums up item prices", () => {
  const items = [
    { priceCents: 100, quantity: 2 },
    { priceCents: 50, quantity: 1 },
  ];
  const total = calculateTotal(items);
  assert.strictEqual(total, 250);
});
```

### 11.2 集成测试 (`__tests__/integration.spec.js`)

模拟真实用户路径，验证模块间协作。

- 流程：注册 -> 登录 -> 浏览 -> 加购 -> 下单 -> 支付。
- 运行方式：`node --test examples/ecommerce-mini/__tests__/integration.spec.js`

### 11.3 性能基线 (`performance.spec.js`)

定义并验证 SLO。

- _Spec_: "下单接口 p99 < 100ms"
- _Test_: 脚本并发发送请求，统计延迟分布，若 p99 > 100ms 则测试失败。

---

## 12. 示例代码操作手册

### 12.1 准备环境

- **Node.js**: 需安装 v20.0.0 或更高版本（使用了 `node:test` 和 `fetch`）。
- **Git**: 用于版本控制。
- **Editor**: 推荐使用 VS Code。

本项目无 `package.json` 依赖（除开发工具外），不仅展示了原生能力，也降低了试运行门槛。

### 12.2 运行开发版服务

开发版使用内存存储，重启后数据重置。

```bash
# 启动服务
node examples/ecommerce-mini/src/http/server.js

# 在另一个终端运行测试套件
node --test examples/ecommerce-mini/__tests__/
```

### 12.3 运行生产版服务

生产版开启了文件持久化、鉴权与幂等性检查。

```bash
# 启动生产服务 (Port 3002)
node examples/ecommerce-mini/src/http/server.prod.js
```

---

## 13. 生产级扩展实践

为了演示 OpenSpec 如何应对复杂性，我们在 `server.prod.js` 中引入了三个高级特性。

### 13.1 持久化存储 (`src/persist/fileStore.js`)

**Spec 变更**: 系统需要即使在重启后也能保留用户数据。

**实现**:

- 实现 `FileStore` 类，使用 `fs.writeFileSync` 原子写入 JSON 文件。
- 启动时从磁盘加载数据到内存 Map。

### 13.2 鉴权与安全

**Spec 变更**: 所有非公开接口必须携带 Bearer Token。

**实现**:

- 增加 `Bearer Token` 格式校验中间件。
- 拦截非公开接口（公开接口如 `GET /api/products` 豁免）的无 Authorization 头请求，返回 `401 Unauthorized`。
- 完整的 Token 签发逻辑（如 HMAC-SHA256 / JWT）可在此扩展实现。

### 13.3 幂等性 (Idempotency)

**Spec 变更**: 对同一订单的重复支付请求，系统应返回相同结果且不重复扣款。

**实现**:

- 客户端在 Header 中发送 `Idempotency-Key`。
- 服务端解析该请求头（入口已预留），扩展点位于 `server.prod.js` 中 `POST /api/orders` 处理函数内的 `idempotencyKey` 判断块，开发者可在此接入 Redis 或内存缓存实现查重。

### 13.4 可观测性

**Spec 变更**: 系统需暴露 `/metrics` 端点供监控采集。

**实现**:

- 记录每个路由的请求次数与耗时。
- 暴露 JSON 格式指标：`{ "requests": 100, "latencies": { "p99": 12 } }`（延迟单位为 ms）。

---

## 14. 结语

通过 `ecommerce-mini` 案例，我们展示了 OpenSpec 如何贯穿从 "Proposal" 到 "Production" 的全生命周期。

- **文档即设计**：结构化的 Spec 澄清了思路。
- **代码即映射**：清晰的分层架构使实现变得机械而简单。
- **测试即验收**：自动化的脚本保证了重构的信心。

希望本实战指南能帮助你在实际项目中更好地应用 OpenSpec 方法论。
