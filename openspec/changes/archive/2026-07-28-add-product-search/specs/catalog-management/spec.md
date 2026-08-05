## MODIFIED Requirements

### Requirement: 商品列表查询

系统 SHALL 提供商品列表查询接口。客户端可通过可选的 `name` 查询参数按名称模糊过滤商品；未提供 `name` 参数时，返回所有可用商品。

**Priority**: P0 (Critical)

**Rationale**: 商品浏览是电商系统的核心入口功能。随着商品数量增长，用户需要按名称定位目标商品，同时保持全量列表的向后兼容。

#### Scenario: 获取所有商品（无过滤）

- **WHEN** 用户请求 `GET /api/products`（不带 `name` 参数）
- **THEN** 返回状态码 200
- **AND** 返回商品数组 Product[]，包含所有可用商品

#### Scenario: 按名称模糊搜索

- **WHEN** 用户请求 `GET /api/products?name=<keyword>`
- **THEN** 返回状态码 200
- **AND** 返回商品数组 Product[]，仅包含名称匹配 `<keyword>` 的商品（大小写不敏感的包含匹配）

#### Scenario: 搜索无结果

- **WHEN** 用户请求 `GET /api/products?name=<keyword>`，且没有商品名称匹配 `<keyword>`
- **THEN** 返回状态码 200
- **AND** 返回空数组 Product[]

## ADDED Requirements

### Requirement: 商品列表按价格排序

系统 SHALL 支持通过可选的 `sort` 查询参数对商品列表按价格排序。`sort=price_asc` 表示价格升序，`sort=price_desc` 表示价格降序；未提供 `sort` 参数时保持自然顺序。

**Priority**: P1 (High)

**Rationale**: 价格排序是商品浏览的常见需求，与名称搜索组合可满足"按价格找商品"的典型场景。

#### Scenario: 按价格升序排序

- **WHEN** 用户请求 `GET /api/products?sort=price_asc`
- **THEN** 返回状态码 200
- **AND** 返回商品数组 Product[]，按 priceCents 升序排列

#### Scenario: 按价格降序排序

- **WHEN** 用户请求 `GET /api/products?sort=price_desc`
- **THEN** 返回状态码 200
- **AND** 返回商品数组 Product[]，按 priceCents 降序排列

#### Scenario: 搜索与排序组合

- **WHEN** 用户请求 `GET /api/products?name=<keyword>&sort=price_asc`
- **THEN** 返回状态码 200
- **AND** 返回名称匹配 `<keyword>` 的商品数组，按 priceCents 升序排列

#### Scenario: 无效排序参数

- **WHEN** 用户请求 `GET /api/products?sort=invalid`
- **THEN** 返回状态码 200
- **AND** 返回商品数组 Product[]，保持自然顺序（忽略无效的 sort 值）
