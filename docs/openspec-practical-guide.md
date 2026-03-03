# OpenSpec 实战指南

## 1. 引言

OpenSpec 是一种以规格（Spec）为中心的工程方法与工具链，旨在通过统一的结构化文档与自动化工作流，提升复杂系统在设计到交付全周期的确定性与可验证性。本文结合一个小型电商网站的完整案例，演示从架构设计、系统设计、模块设计、接口设计，到单元测试、接口测试、集成测试、性能测试的全流程，以促进在真实项目中落地。

> **进阶阅读**：关于本案例的 AI 协作全流程复盘（Prompt 设计与交互记录）及 Python 版本的跨语言复刻验证，请参考 [OpenSpec 实战指南：AI 辅助软件工程全流程深度复盘](./openspec-ai-workflow-analysis.md)。
>
> **CLI 参考手册**：关于 OpenSpec CLI 的完整命令说明（init、validate、archive 等），请参考 [OpenSpec 使用手册](./OpenSpec使用手册.md)。
>
> **培训材料**：本项目提供了配套的演示文稿 [OpenSpec 使用手册](./OpenSpec%20使用手册.pptx)，适合用于团队培训与技术分享。

---

## 2. 方法论与 OpenSpec 核心概念

OpenSpec 不仅仅是一套文档格式，更是一种**Spec 驱动开发（Spec-Driven Development）**的工程实践。它主张“以规格为源”，确保代码与测试始终与设计保持一致，解决传统开发中“文档落后于代码”的顽疾。

### 2.1 核心哲学

OpenSpec 的设计遵循四大原则：

- **流动而非僵化 (Fluid not rigid)**：不设强制关卡，按需创建文档。
- **迭代而非瀑布 (Iterative not waterfall)**：在构建中学习，随时修正规格。
- **简单而非复杂 (Easy not complex)**：轻量级启动，无繁琐流程。
- **存量优先 (Brownfield-first)**：不仅适用于新项目，也能通过 Delta 机制平滑接入现有代码库。

### 2.2 目录结构与单一事实来源

OpenSpec 将项目状态分为两个核心区域，确保“当前状态”与“变更过程”分离：

- **Source of Truth (`openspec/specs/`)**
  这是系统**当前**的真实行为描述。所有已发布的特性都必须在此处有对应的规格定义。目录结构通常按领域（Domain）划分，如 `auth/spec.md`, `payment/spec.md`。

- **Proposed Changes (`openspec/changes/`)**
  这是**进行中**的变更。每个变更是一个独立的文件夹（如 `openspec/changes/add-login/`），包含完整的上下文：
  - **Proposal (`proposal.md`)**：**Why & What**。阐述背景、意图与范围。
  - **Design (`design.md`)**：**How**。技术方案、架构图与数据流。
  - **Specs (Deltas)**：**Changes**。对 `openspec/specs/` 中现有规格的修改草案。
  - **Tasks (`tasks.md`)**：**Steps**。具体的实施步骤与验收标准。

当变更开发完成并归档（Archive）后，其 Delta Spec 会合并入主 Spec，形成新的事实来源。

### 2.3 工作流与 CLI 工具

OpenSpec CLI (`openspec`) 串联了从设计到交付的全流程，支持人类开发者与 AI Agent 协作：

- **初始化 (`init`)**：一键生成标准目录结构，配置 `.openspec` 环境。
- **浏览与查看 (`list` / `view`)**：快速检索现有的变更与规格，支持 JSON 输出供 AI 解析。
- **校验 (`validate`)**：基于 Schema 检查文档结构的合法性，确保 Spec 格式严谨。
- **归档 (`archive`)**：将完成的变更移入归档区，保持工作区整洁。

### 2.4 验证与可观测性

- **结构化校验 (Validation)**
  OpenSpec 引入了 Zod 等校验机制，确保 Spec 文档不仅仅是文本，而是符合 Schema 定义的结构化数据。这使得自动生成测试用例（Test Case Generation）成为可能。

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

## Goals (SLO)

- **Latency**: 核心接口 p99 < 100ms。
- **Quality**: 核心逻辑测试覆盖率 > 80%。

## Scope

- **In Scope**: Catalog, Cart, Order, User, Memory Storage.
- **Out of Scope**: Search, Recommendation, Payment Gateway.
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
# 验证变更规范
openspec validate v1-mvp

# 验证成功输出
✓ Change 'v1-mvp' is valid
```

验证会检查以下内容：

- `proposal.md` 是否包含 `## Why` 和 `## What Changes` 章节
- `specs/` 目录结构是否正确（必须有能力文件夹）
- 每个 spec.md 是否有 Delta Header（`## ADDED/MODIFIED/REMOVED Requirements`）
- 每个需求是否有正确的 `### Requirement:` 格式和 `#### Scenario:` 块

更多 CLI 命令请参考 [OpenSpec 使用手册](./OpenSpec使用手册.md)。

### 3.6 归档与沉淀

当 `v1-mvp` 开发完成并通过验收后，运行 `openspec archive`。这会将变更集中的 Spec 合并到主分支 (`openspec/specs/`)，成为系统最新的事实来源。

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
| **领域层**   | `domain/`           | 纯净的业务实体 (`types.ts`) 与逻辑，无外部依赖          | None                  |
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
  - `400 Bad Request`: 业务校验失败（如库存不足）。
  - `401 Unauthorized`: 未登录。
  - `409 Conflict`: 资源冲突（如重复下单）。

### 6.2 数据模型

在 OpenSpec 中，我们首先在 `specs/domain/spec.md` 中定义模型。规范文件必须使用 Delta Header + Requirement + Scenario 格式：

**Spec 定义 (`specs/domain/spec.md`)**:

```markdown
# Domain Specification

## Overview

定义核心业务实体与规则，不依赖任何外部框架。

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

OpenSpec 的核心优势在于使用 **Markdown** 编写可读性极强的规格文档，同时保持结构化。以下是 `openspec/specs/api/spec.md` 的真实片段：

```markdown
# API Specification

## Overview

定义对外 RESTful 接口契约，涵盖商品、购物车、订单、支付等核心功能。

## ADDED Requirements

### Requirement: 商品列表查询

系统 SHALL 提供商品列表查询接口，返回所有可用商品。

**Priority**: P0 (Critical)

**Rationale**: 商品浏览是电商系统的核心入口功能。

#### Scenario: 获取所有商品

Given 系统中存在商品数据
When 用户请求 GET /api/products
Then 返回状态码 200
And 返回商品数组 Product[]

---

### Requirement: 订单创建

系统 SHALL 支持结算购物车生成订单，处理库存扣减。

**Priority**: P0 (Critical)

**Rationale**: 订单创建是交易的核心流程。

#### Scenario: 成功创建订单

Given 用户购物车中有商品
And 商品库存充足
When 发送 POST /api/orders 携带 { userId }
Then 返回状态码 201
And 返回新创建的订单 Order

#### Scenario: 创建订单时库存不足

Given 用户购物车中有商品
And 商品库存不足
When 发送 POST /api/orders 携带 { userId }
Then 返回状态码 409
And 返回错误信息 "Stock insufficient"
```

> **注意**：
>
> - 必须使用 `## ADDED/MODIFIED/REMOVED Requirements` 作为 Delta Header。
> - 每个需求使用 `### Requirement: <标题>` 格式，描述中必须包含 `SHALL` 或 `MUST`。
> - 每个需求至少包含一个 `#### Scenario:` 块，使用 Gherkin 格式（Given/When/Then）。
> - 这里的 `Product[]` 和 `Order` 引用了 `domain/spec.md` 中定义的数据模型，保持了定义的一致性。

## 9. 规范驱动实现

这是 OpenSpec 的核心——**代码是对规格的映射**。在编写代码时，开发者（或 AI）应始终打开 Spec 文件作为参考。

### 9.1 追踪矩阵

建立 Spec ↔ 代码 ↔ 测试 的映射关系，确保每一条 Spec 都有代码落地。详见 [10.1 追踪矩阵（Traceability Matrix）](#101-追踪矩阵traceability-matrix)。

### 9.2 目录结构映射

```text
OpenSpec-practise/
├── docs/                            <-- 文档目录
│   ├── OpenSpec使用手册.md          <-- OpenSpec 使用手册
│   ├── openspec-practical-guide.md  <-- 实战指南（本文档）
│   └── openspec-ai-workflow-analysis.md  <-- AI 协作流程分析
├── examples/
│   ├── openspec/                    <-- OpenSpec 规范目录
│   │   └── changes/v1-mvp/          <-- MVP 变更规范
│   │       ├── proposal.md          <-- 对应提案文档
│   │       ├── design.md            <-- 对应设计文档
│   │       ├── tasks.md             <-- 对应任务清单
│   │       └── specs/
│   │           ├── api/spec.md      <-- 对应 API 规范
│   │           └── domain/spec.md   <-- 对应领域模型规范
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

建立 Spec ↔ 代码 ↔ 测试 的映射关系，确保每一条 Spec 都有代码落地：

| Spec 定义 (Requirements)           | 代码实现 (Implementation)                             | 验证方式 (Verification) |
| :--------------------------------- | :---------------------------------------------------- | :---------------------- |
| `POST /api/orders`                 | `src/http/server.js` (Route Handler)                  | Integration Test        |
| `Response 409: Stock insufficient` | `catch (e) { if (e.message === 'OUT_OF_STOCK') ... }` | Unit Test (Error Case)  |
| `Order.totalCents` (Model)         | `src/domain/types.js` (Interface)                     | TypeScript Compile      |
| `p99 < 100ms` (SLO)                | `performance.spec.js` (Performance Test)              | CI Pipeline             |

**实践建议**：在代码注释中引用对应的 Spec 章节，如 `// 对应 Spec: POST /api/orders`。

### 10.2 从 Scenario 到测试用例

OpenSpec 的 Gherkin 格式场景天然适合转化为测试用例：

**Spec 中的场景**（`specs/api/spec.md`）：

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

### 11.2 集成测试 (`integration.spec.js`)

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

- 增加 `POST /api/auth/login` 接口。
- 使用 HMAC-SHA256 签名生成 JWT（无第三方库实现）。
- 中间件拦截校验 `Authorization` 头。

### 13.3 幂等性 (Idempotency)

**Spec 变更**: 对同一订单的重复支付请求，系统应返回相同结果且不重复扣款。

**实现**:

- 客户端在 Header 中发送 `Idempotency-Key`。
- 服务端检查 Key 是否已存在：
  - 若存在，直接返回缓存的响应。
  - 若不存在，执行业务逻辑并缓存结果。

### 13.4 可观测性

**Spec 变更**: 系统需暴露 `/metrics` 端点供监控采集。

**实现**:

- 记录每个路由的请求次数与耗时。
- 暴露 JSON 格式指标：`{ "requests": 100, "latencies": { "p99": 12 } }`。

---

## 14. 结语

通过 `ecommerce-mini` 案例，我们展示了 OpenSpec 如何贯穿从 "Proposal" 到 "Production" 的全生命周期。

- **文档即设计**：结构化的 Spec 澄清了思路。
- **代码即映射**：清晰的分层架构使实现变得机械而简单。
- **测试即验收**：自动化的脚本保证了重构的信心。

希望本实战指南能帮助你在实际项目中更好地应用 OpenSpec 方法论。
