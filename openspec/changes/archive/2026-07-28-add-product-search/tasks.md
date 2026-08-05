## 1. Node.js 实现

- [x] 1.1 修改 `src/services/catalog.js` 的 `list(name, sort)`，支持可选的名称模糊过滤（大小写不敏感）与价格排序（price_asc/price_desc 白名单）
- [x] 1.2 修改 `src/http/server.js` 的 `GET /api/products` 路由，解析 `name`、`sort` 查询参数并透传给服务层

## 2. Python 实现

- [x] 2.1 修改 `src/services/catalog.py` 的 `list_products(name=None, sort=None)`，支持可选的名称模糊过滤与价格排序
- [x] 2.2 修改 `src/api/server.py` 的 `GET /api/products` 端点，声明 `name`、`sort` 查询参数

## 3. 测试

- [x] 3.1 Node.js: 在 `__tests__/unit.spec.js` 添加搜索（命中/无结果/无参全量）与排序（升序/降序/无效值/组合）测试用例
- [x] 3.2 Python: 在 `tests/test_smoke.py` 添加搜索（命中/无结果/无参全量）与排序（升序/降序/无效值/组合）测试用例

## 4. 验证

- [x] 4.1 运行 `npm test` 验证 Node.js 测试通过
- [x] 4.2 运行 `pytest` 验证 Python 测试通过
