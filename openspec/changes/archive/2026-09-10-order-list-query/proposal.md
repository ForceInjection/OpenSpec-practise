## Why

订单能力目前只有「创建」与「按 ID 查单个」，用户下单后无法查看自己的订单历史——这是订单闭环「下单 → 查看 → 跟踪」中缺失的第一环。仓库层 `findAll` 已具备，补一个列表查询接口即可闭合，同时让双实现的订单 API 形态对齐（商品/购物车均已有列表查询）。

## What Changes

- **新增订单列表查询 API** `GET /api/orders?userId=<id>`：返回指定用户的订单数组（按创建顺序），无该用户订单时返回空数组。
- **规范修订**（`order-management`）：
  - ADDED「订单列表查询」需求（含场景：查询有订单的用户 / 查询无订单的用户 / 未提供 userId）

## Capabilities

### New Capabilities

无。行为变更归属既有 `order-management` 能力。

### Modified Capabilities

- `order-management`: ADDED「订单列表查询」需求（按 userId 过滤的订单数组查询）

## Impact

- **Node.js**（`examples/ecommerce-mini/`）：
  - `src/services/order.js`：新增 `listOrders(userId)`
  - `src/http/server.js`：新增 `GET /api/orders` 路由
  - `__tests__/`：unit 与 integration 测试补充
- **Python**（`examples/ecommerce-mini-python/`）：
  - `src/services/order.py`：新增 `list_orders(user_id)`
  - `src/api/server.py`：新增对应端点
  - `tests/`：测试补充
- **API 契约**：新增一个只读端点，纯增量，无 breaking change
