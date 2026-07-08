# product-query Specification

## Purpose
TBD - created by archiving change add-product-get-by-id. Update Purpose after archive.
## Requirements
### Requirement: 按 ID 查询单个商品
系统 SHALL 提供按商品 ID 查询单个商品详情的接口。客户端通过 GET 请求指定商品 ID，系统返回该商品的完整信息（id、name、priceCents、stock），若商品不存在则返回 404 错误。

**Priority**: P0
**Rationale**: RESTful API 的基本操作，前端商品详情页、购物车校验、订单创建等场景均需要此接口。

#### Scenario: 查询存在的商品
- **WHEN** 客户端发送 `GET /api/products/{id}`，且该 ID 对应的商品存在
- **THEN** 系统返回 200 状态码及该商品的完整 JSON 对象（id、name、priceCents、stock）

#### Scenario: 查询不存在的商品
- **WHEN** 客户端发送 `GET /api/products/{id}`，且该 ID 对应的商品不存在
- **THEN** 系统返回 404 状态码及错误信息 `{"code": "NOT_FOUND", "message": "Product not found"}`

