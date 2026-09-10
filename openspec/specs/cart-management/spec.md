# Cart Management Specification

## Purpose

购物车管理能力，涵盖商品的添加、查询、移除及数量限制规则。购物车是用户选购商品到下单结算之间的临时存储，其内容是订单创建的直接输入。

## Requirements

### Requirement: 购物车商品添加

系统 SHALL 支持将商品添加到用户购物车，并返回更新后的购物车状态。

**Priority**: P0 (Critical)

**Rationale**: 购物车是电商下单流程的核心环节，用户必须能够将商品加入购物车。

#### Scenario: 添加商品到购物车

Given 用户已登录且商品存在
When 发送 POST /api/cart/items 携带 { productId, quantity }
Then 返回状态码 200
And 返回更新后的购物车 Cart

#### Scenario: 添加已存在商品时数量累加

Given 购物车中已存在某商品，数量为 2
When 再次添加该商品，数量为 3
Then 该商品在购物车中的数量变为 5

#### Scenario: 添加不存在的商品

Given 商品 ID 在系统中不存在
When 尝试将该商品添加到购物车
Then 抛出 PRODUCT_NOT_FOUND 错误

---

### Requirement: 购物车商品移除

系统 SHALL 支持按商品 ID 从购物车中移除条目。移除不存在的商品条目时，系统 MUST 返回 `CART_ITEM_NOT_FOUND` 错误。

**Priority**: P1 (High)

**Rationale**: 用户需要能够调整购物车内容，移除不需要的商品；明确"条目不存在"的错误语义，便于调用方识别数据不一致。

#### Scenario: 移除购物车商品

Given 购物车中存在商品条目
When 发送 DELETE /api/cart/items/{productId}
Then 返回状态码 200
And 返回更新后的购物车 Cart，该商品条目已被移除

#### Scenario: 移除不存在于购物车的商品

Given 购物车中不存在指定 productId 的商品条目
When 发送 DELETE /api/cart/items/{productId}
Then 抛出 CART_ITEM_NOT_FOUND 错误
And 购物车保持不变

#### Scenario: 多条目购物车仅移除目标商品

Given 购物车中包含商品 A 与商品 B
When 发送 DELETE /api/cart/items/{productId-A}
Then 商品 A 的条目被移除
And 商品 B 的条目保留

---

### Requirement: 购物车数量限制

单个商品在购物车中数量 MUST NOT 超过 99。

**Priority**: P2 (Medium)

**Rationale**: 防止恶意刷单和异常数据，保护系统稳定性。

#### Scenario: 添加商品数量在限制内

Given 购物车中某商品数量为 0
When 添加该商品数量为 99
Then 添加成功

#### Scenario: 添加商品数量超出限制

Given 购物车中某商品数量为 0
When 尝试添加该商品数量为 100
Then 抛出 MAX_QUANTITY_EXCEEDED 错误
And 购物车保持不变

#### Scenario: 累加后数量超出限制

Given 购物车中某商品数量为 50
When 尝试再添加该商品数量为 50
Then 抛出 MAX_QUANTITY_EXCEEDED 错误
And 购物车中该商品数量保持 50

### Requirement: 购物车查询

系统 SHALL 提供查询当前用户购物车的接口。用户尚无购物车记录时，返回空购物车（items 为空数组）。

**Priority**: P1 (High)

**Rationale**: 查看购物车是"加购 → 结算"之间的必要环节，也是移除操作后确认结果的依据。服务层已有查询逻辑，补齐接口与规范以闭合行为契约。

#### Scenario: 查询空购物车

Given 当前用户没有购物车记录
When 发送 GET /api/cart/items
Then 返回状态码 200
And 返回购物车 Cart，items 为空数组

#### Scenario: 查询含商品的购物车

Given 当前用户购物车中已添加商品条目
When 发送 GET /api/cart/items
Then 返回状态码 200
And 返回购物车 Cart，items 包含已添加的商品条目
