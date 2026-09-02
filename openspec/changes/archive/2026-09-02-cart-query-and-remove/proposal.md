## Why

购物车能力存在 **spec 与代码倒挂**：`cart-management` 规范声明了「购物车商品移除」需求，但 Node.js 与 Python 双实现均无移除方法、无对应 HTTP 接口；反之，购物车查询逻辑（`getCart`/`get_cart`）在服务层已存在，却既无 spec 需求也无 HTTP 路由。补齐「查看购物车 + 移除商品」闭环，让最小电商系统的购物车链路（加购 → 查看 → 移除 → 下单）完整可演示。

## What Changes

- **新增购物车查询 API** `GET /api/cart/items`：返回当前用户的购物车（含商品明细列表）。
- **新增移除购物车商品 API** `DELETE /api/cart/items/{productId}`：按商品 ID 移除购物车条目；商品不在购物车时返回 `CART_ITEM_NOT_FOUND` (404)。
- **规范修订**（`cart-management`）：
  - ADDED「购物车查询」需求（含场景：查询空购物车 / 查询含商品购物车）
  - MODIFIED「购物车商品移除」需求（细化场景：成功移除 / 移除不存在的商品 / 多条目购物车仅移除目标商品）

## Capabilities

### New Capabilities

无。两个行为变更均归属既有 `cart-management` 能力，不引入新 capability 路径。

### Modified Capabilities

- `cart-management`: ADDED「购物车查询」需求；MODIFIED「购物车商品移除」需求（补充不存在商品与多条目购物车的场景语义）

## Impact

- **Node.js**（`examples/ecommerce-mini/`）：
  - `src/services/cart.js`：新增 `removeItem(userId, productId)`（查询复用已有 `getCart`）
  - `src/http/server.js`：新增 `GET /api/cart/items` 与 `DELETE /api/cart/items/{productId}` 路由
  - `__tests__/`：unit 与 integration 测试补充
- **Python**（`examples/ecommerce-mini-python/`）：
  - `src/services/cart.py`：新增 `remove_item(user_id, product_id)`
  - `src/api/server.py`：新增对应端点
  - `tests/`：测试补充
- **API 契约**：新增两个只读/写端点，均为增量，无 breaking change；不影响 Node/Python 之外的实现
