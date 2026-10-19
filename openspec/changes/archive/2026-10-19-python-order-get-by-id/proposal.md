## Why

`order-management` 主规范的「订单查询」需求（含「查询存在的订单」「查询不存在的订单」两个场景）在 Node.js 实现中已经落地，但 Python 端从未实现 `GET /api/orders/{id}`——这是 v1.13.0 实践文档中明确记录的 spec-code 缺口。补齐该端点可让双实现的订单查询 API 形态对齐，并为后续 payment 等订单生命周期实践打好基础。

## What Changes

- **Python 新增订单详情查询 API** `GET /api/orders/{id}`：订单存在时返回 200 + Order，不存在时返回 404。
- **Python 服务层新增 `OrderService.get_order(order_id)`**：通过 `MemoryRepo.find_by_id` 读取订单，供 HTTP 层调用。
- **Python 测试补充**：覆盖「按 ID 查询存在的订单」与「查询不存在的订单」两条路径。
- **无规范变更**：`order-management` 已完整定义该行为，本次只做实现对齐；change 的 `.openspec.yaml` 声明 `skip_specs: true`。

## Capabilities

### New Capabilities

无。本次不引入新的系统行为。

### Modified Capabilities

无。`order-management` 的「订单查询」需求已存在且无需修改；本次是纯实现对齐（spec-code gap closure），因此不生成 delta spec。

## Impact

- **Python**（`examples/ecommerce-mini-python/`）：
  - `src/services/order.py`：新增 `get_order(order_id)`
  - `src/api/server.py`：新增 `GET /api/orders/{id}` 路由与 404 映射
  - `tests/test_smoke.py`：新增订单详情查询测试
- **Node.js**（`examples/ecommerce-mini/`）：无代码变更，`server.js` 已有 `GET /api/orders/:id`。
- **API 契约**：补齐一个已规范化的只读端点，纯增量，无 breaking change。
- **SLO**：内存单键查找，不引入新的性能目标；沿用现有 Node 下单 P99 < 100ms 基线。
