## Why

`payment` 是 7 个主 spec 中唯一「规范完整、代码为零」的能力——2 个需求、4 个场景（订单支付、404、状态流转、幂等重复支付）自 v1-MVP 归档以来从未实现，是历次实践文章遗留观察中持续点名的最大 spec-code 缺口。本次补齐双实现的支付端点，让订单生命周期「创建 → 支付」真正闭环，同时作为 OpenSpec 2.x 技能工作流的首次实践。

## What Changes

- **Node.js 新增支付 API** `POST /api/payments/:orderId`：订单存在且待支付时返回 200 并将状态置为 PAID；订单不存在返回 404 + `NOT_FOUND`；重复支付已支付订单返回幂等成功（200 + 订单原样）。
- **Python 新增支付 API** `POST /api/payments/{id}`：行为与 Node 对齐；未命中时抛 `HTTPException(404)`，沿用本实现既有错误通道。
- **双实现服务层新增支付方法**：Node `OrderService.payOrder(orderId)`、Python `OrderService.pay_order(order_id)`，状态机约束 PENDING_PAYMENT → PAID 在服务层保证。
- **测试补充**：Node 单元 + 集成、Python 端到端，覆盖支付成功、404、幂等重复支付三条路径。
- **无规范变更**：`payment` 主规范已完整定义上述行为，本次是纯实现对齐；`.openspec.yaml` 声明 `skip_specs: true`。

## Capabilities

### New Capabilities

无。不引入新的系统行为。

### Modified Capabilities

无。`payment` 的 2 个需求已存在且无需修改；本次只补实现（spec-code gap closure），不生成 delta spec。

## Impact

- **Node.js**（`examples/ecommerce-mini/`）：
  - `src/services/order.js`：新增 `payOrder(orderId)`
  - `src/http/server.js`：新增 `POST /api/payments/:orderId` 路由与 404 映射
  - `__tests__/`：单元与集成测试补充
- **Python**（`examples/ecommerce-mini-python/`）：
  - `src/services/order.py`：新增 `pay_order(order_id)`
  - `src/api/server.py`：新增 `POST /api/payments/{id}` 路由与 404 映射
  - `tests/test_smoke.py`：新增支付测试
- **API 契约**：补齐一个已规范化的端点，纯增量，无 breaking change。
- **SLO**：单键查找 + 一次保存，不引入新的性能目标；沿用现有下单 P99 < 100ms 基线。
