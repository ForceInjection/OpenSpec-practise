## MODIFIED Requirements

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

## ADDED Requirements

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
