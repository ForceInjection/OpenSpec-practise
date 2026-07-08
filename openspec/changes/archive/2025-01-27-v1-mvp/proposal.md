# Proposal: Ecommerce Mini MVP

## Why

### Background

本项目起源于"AI 原力注入"社区关于 AI 编程的深度探讨。社区提出了"利用 OpenSpec 实现 Spec 驱动开发"的构想，需要一个完整的实战案例来演示 OpenSpec 规范在 AI 辅助编程中的具体应用。

### Problem Statement

传统的开发模式是 **需求 -> 人 -> 代码**，而 AI 辅助编程的兴起带来了新的挑战：

- AI 理解需求存在偏差，容易产生返工
- 人与 AI 之间缺乏统一的沟通语言
- 文档与代码容易脱节，难以保持一致性

需要一个规范化的方式来确保人与 AI 对需求达成一致，同时保持代码与文档的同步。

### Alternatives Considered

1. **直接编写代码**: 快速但缺乏文档支撑，不利于 AI 理解上下文。
2. **传统需求文档**: 与代码分离，容易过时。
3. **OpenSpec 规范驱动**: 先定义规范，再编写代码，保持一致性 ✓ 已选择此方案。

## What Changes

### New Resources Added

- **领域模型**: Product、User、Cart、Order 等核心实体。
- **API 接口**: 商品、购物车、订单、支付等 RESTful 接口。
- **测试用例**: 单元测试、集成测试、性能测试。

### New Capabilities

- **Catalog**: 商品列表查询与上架，库存管理。
- **Cart**: 购物车管理（添加、移除、数量限制）。
- **Order**: 下单结算、库存扣减、订单查询。
- **Payment**: 订单支付模拟与状态流转。
- **Infrastructure**: 内存存储（MVP）、文件持久化（生产扩展）。

## Capabilities

### New Capabilities

- `catalog-management`: 商品列表查询、商品上架与库存扣减管理
- `cart-management`: 购物车商品添加、移除与数量限制
- `order-management`: 订单创建（协调购物车与库存）、订单查询与总价计算
- `payment`: 订单支付与状态流转（PENDING_PAYMENT -> PAID）
- `domain-model`: 核心业务实体定义（Product, User, Cart, Order, CartItem, OrderItem）
- `error-handling`: 统一错误响应格式与标准错误码体系

### Modified Capabilities

（无，本次为全新 MVP 项目）

## Impact

- **受影响代码**: `ecommerce-mini/src/` (Node.js), `ecommerce-mini-python/src/` (Python)
- **新增 API**: 8 个 REST 端点（GET /api/products, POST /api/products, POST /api/cart/items, DELETE /api/cart/items/:id, POST /api/orders, GET /api/orders/:id, POST /api/payments/:orderId, GET /metrics）
- **依赖**: Node.js 零 npm 依赖；Python 依赖 FastAPI + Pydantic
- **数据存储**: 开发环境使用内存 Map，生产环境使用文件持久化

## Scope

### In Scope

- 商品列表查询与上架。
- 购物车管理（添加、移除）。
- 下单结算与库存扣减。
- 订单支付模拟。
- 基础身份识别（Mock Token）。
- 内存存储与文件持久化。
- RESTful API 接口。

### Out of Scope

- 复杂搜索与推荐。
- 真实支付网关集成。
- 后台管理界面。
- 分布式部署。

## Goals (SLO)

- **Latency**: 核心接口 p99 < 100ms。
- **Concurrency**: 支持 50 RPS。
- **Quality**: 核心逻辑测试覆盖率 > 80%。
