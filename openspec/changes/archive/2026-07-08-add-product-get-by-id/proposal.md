## Why

当前 `GET /api/products` 只支持列表查询，无法按 ID 获取单个商品详情。RESTful API 的常见消费者（前端、移动端、其他微服务）需要单个资源查询作为基础操作。服务层 (`getProduct`) 和仓储层 (`findById`) 已就绪，仅需暴露 HTTP 路由。

## What Changes

- **Node.js**: 在 `src/http/server.js` 中添加 `GET /api/products/:id` 路由
- **Python**: 在 `src/api/server.py` 中添加 `@app.get("/api/products/{id}")` 端点
- **测试**: 两个实现各添加对应的单元/集成测试用例（正常查询 + 404 场景）
- 两个实现共享相同的行为契约：找到商品返回 200 + JSON，未找到返回 404 + 错误体

## Capabilities

### New Capabilities

- `product-query`: 按 ID 查询单个商品，返回完整商品信息或 404 错误

### Modified Capabilities

（无——此为增量功能，不影响现有 catalog-management 规范的语义）

## Impact

- **受影响代码**: `examples/ecommerce-mini/src/http/server.js`、`examples/ecommerce-mini-python/src/api/server.py`
- **新增测试**: `examples/ecommerce-mini/__tests__/unit.spec.js`、`examples/ecommerce-mini-python/tests/test_smoke.py`
- **新增 API**: `GET /api/products/:id`（两个实现）
- **依赖**: 无新增依赖，利用现有的 service 层方法
