# Proposal: Ecommerce Mini MVP

## Intent

构建一个最小可用的电商系统 `ecommerce-mini`，用于演示 OpenSpec 的端到端迭代流程。
目标是实现用户从浏览商品到下单支付的核心闭环。

## Scope

### In Scope

- **Catalog**: 商品列表查询。
- **Cart**: 购物车管理（添加、移除）。
- **Order**: 下单结算、库存扣减。
- **User**: 基础身份识别（Mock Token）。
- **Infrastructure**: 内存存储（MVP）、RESTful API。

### Out of Scope

- **复杂搜索与推荐。
- 真实支付网关集成。
- 后台管理界面。
- 分布式部署。

## Goals (SLO)

- **Latency**: 核心接口 p99 < 100ms。
- **Concurrency**: 支持 50 RPS。
- **Quality**: 核心逻辑测试覆盖率 > 80%。
