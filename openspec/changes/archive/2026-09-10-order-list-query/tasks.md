## 1. Node.js 服务层与单元测试

- [x] 1.1 在 `examples/ecommerce-mini/src/repo/memoryRepo.js` 的 OrderRepo 新增 `findAll()`（返回全部订单数组，与 ProductRepo 形态一致）。验证：`__tests__/unit.spec.js` 新增用例——保存 2 单后 `findAll()` 长度为 2 且按创建顺序，`npm test` 该组通过
- [x] 1.2 在 `examples/ecommerce-mini/src/services/order.js` 新增 `listOrders(userId)`：`findAll()` 过滤 `o.userId === userId` 后返回；`userId` 为空时抛 `Error('MISSING_USER_ID')`。验证：单测覆盖「该用户订单返回」「他人订单不混入」「空 userId 抛错」，`npm test` 通过

## 2. Node.js HTTP 层与集成测试

- [x] 2.1 在 `examples/ecommerce-mini/src/http/server.js` 新增 `GET /api/orders` 路由：读取 `userId` query 参数调用 `listOrders`，200 + Order[]；错误映射补 `MISSING_USER_ID` → 400。验证：`__tests__/integration.spec.js` 新增 E2E——创建 2 单后列表返回 2 单、无订单用户返回空数组、缺 userId 返回 400 + code=MISSING_USER_ID，`npm test` 全绿

## 3. Python 服务层、模型与 API

- [x] 3.1 在 `examples/ecommerce-mini-python/src/domain/models.py` 的 Order 补 `user_id: str = Field(..., alias="userId")`；`src/services/order.py` 的 `create_order` 写入该字段。验证：`tests/test_smoke.py` 既有用例不回归（订单 JSON 新增 userId 字段），`pytest` 通过
- [x] 3.2 在 `src/services/order.py` 新增 `list_orders(user_id)`：`find_all()` 过滤 `o.user_id == user_id`；空 `user_id` 抛 `ValueError("MISSING_USER_ID")`。`src/api/server.py` 新增 `GET /api/orders`（userId 为 Optional query 参数）+ `MISSING_USER_ID` → 400 映射。验证：`tests/test_smoke.py` 新增 E2E——同一用户 2 单返回 2 单、无订单用户空数组、缺 userId 400 detail 含 MISSING_USER_ID，`pytest` 全绿

## 4. 双实现一致性收尾

- [x] 4.1 行为对齐抽查：同一序列（用户 A 下 2 单、用户 B 下 1 单 → A 列表 2 单 / B 列表 1 单 / 空用户空数组 / 缺参 400）双实现断言字段一致（id/userId/status/totalCents）。验证：比对两侧测试断言
- [x] 4.2 全量回归与新特性验证。验证：Node `npm test`（unit+integration+performance）与 Python `pytest` 全绿；`openspec validate order-list-query --type change` 通过；`openspec validate --report findings` 输出 findings 报告且 exit code 正常（v1.12.0 新特性）
