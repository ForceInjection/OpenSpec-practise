## Why

商品列表接口 `GET /api/products` 目前只支持全量返回，商品增多后客户端无法按名称定位目标商品。搜索是商品浏览的核心入口需求，与现有按 ID 查询（product-query）互补。

## What Changes

- **Node.js**: `server.js` 的 `GET /api/products` 路由解析 `name` 查询参数，支持模糊匹配过滤；解析 `sort` 参数支持按价格排序
- **Python**: `server.py` 的 `GET /api/products` 端点添加 `name`、`sort` 查询参数
- **服务层**: `CatalogService.list` 增加可选的名称过滤和排序参数（Node.js `list(name, sort)` / Python `list_products(name=None, sort=None)`）
- 未传 `name`/`sort` 参数时保持现有全量返回行为（向后兼容）

## Capabilities

### New Capabilities

（无——不引入新能力目录）

### Modified Capabilities

- `catalog-management`: 「商品列表查询」需求从"返回所有商品"扩展为"支持按名称模糊过滤与按价格排序"

## Impact

- **受影响代码**: `examples/ecommerce-mini/src/http/server.js`、`examples/ecommerce-mini/src/services/catalog.js`、`examples/ecommerce-mini-python/src/api/server.py`、`examples/ecommerce-mini-python/src/services/catalog.py`
- **API 变更**: `GET /api/products?name=<keyword>&sort=price_asc|price_desc`（新增可选参数，向后兼容）
- **测试**: 双实现各添加搜索与排序场景测试
- **依赖**: 无新增依赖
