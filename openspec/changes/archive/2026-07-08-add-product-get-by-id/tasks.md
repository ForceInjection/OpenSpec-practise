## 1. Node.js 实现

- [x] 1.1 在 `server.js` 中添加 `GET /api/products/:id` 路由，调用 `catalogService.getProduct(id)`，返回商品 JSON 或 404

## 2. Python 实现

- [x] 2.1 在 `server.py` 中添加 `@app.get("/api/products/{id}")` 端点，调用 `catalog_svc.get_product(id)`，返回 Product 或 `HTTPException(404)`

## 3. 测试

- [x] 3.1 Node.js: 在 `unit.spec.js` 中添加查询存在商品和 404 两个测试用例
- [x] 3.2 Python: 在 `test_smoke.py` 中添加查询存在商品和 404 两个测试用例

## 4. 验证

- [x] 4.1 运行 `npm test` 验证 Node.js 测试通过
- [x] 4.2 运行 `pytest` 验证 Python 测试通过
