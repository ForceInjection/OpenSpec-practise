## 1. Node.js 服务层与单元测试

- [x] 1.1 在 `examples/ecommerce-mini/src/services/cart.js` 的 CartService 新增 `removeItem(userId, productId)`：找到并移除匹配 productId 的条目；无匹配时抛 `Error('CART_ITEM_NOT_FOUND')`；修改后保存并返回购物车。验证：`__tests__/unit.spec.js` 新增用例——成功移除、移除不存在条目抛错且购物车不变、多条目仅移除目标条目，`npm test` 该组用例通过

## 2. Node.js HTTP 层与集成测试

- [x] 2.1 在 `examples/ecommerce-mini/src/http/server.js` 新增路由：`GET /api/cart/items`（复用 dev 固定用户 `user_dev`，返回 200 + Cart）；`DELETE /api/cart/items/{productId}`（200 + 更新后 Cart，`CART_ITEM_NOT_FOUND` 映射 404 + code/message body）。验证：`__tests__/integration.spec.js` 新增 E2E 用例断言 200/404 状态码与响应体，`npm test` 全绿

## 3. Python 服务层与 API

- [x] 3.1 在 `examples/ecommerce-mini-python/src/services/cart.py` 新增 `remove_item(user_id, product_id)`：无匹配条目时 `raise ValueError("CART_ITEM_NOT_FOUND")`。验证：`tests/test_smoke.py` 新增对应用例，`pytest` 通过
- [x] 3.2 在 `examples/ecommerce-mini-python/src/api/server.py` 新增端点：`GET /api/cart/items`（200 + Cart）；`DELETE /api/cart/items/{product_id}`（200 + 更新后 Cart；捕获 `CART_ITEM_NOT_FOUND` 映射 404）。验证：`tests/test_smoke.py` 新增 E2E 断言 200/404，`pytest` 全绿

## 4. 双实现一致性收尾

- [x] 4.1 Node.js 与 Python 行为对齐抽查：同一操作序列（加购 2 种商品 → 移除其一 → 查询）在两套实现的响应体结构一致（userId/items 字段）。验证：比对两侧 integration/smoke 测试断言字段一致
- [x] 4.2 全量回归。验证：`examples/ecommerce-mini` 下 `npm test`（unit + integration + performance）与 `examples/ecommerce-mini-python` 下 `pytest` 全部通过
