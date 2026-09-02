## Context

双实现均为四层架构（HTTP → Service → Domain → Repository）。购物车查询（`getCart`/`get_cart`）与数量上限（99）已在服务层实现，但两套代码均无"移除条目"逻辑、无购物车查询/移除 HTTP 路由。现有购物车路由仅 `POST /api/cart/items`（返回整个 Cart 对象）。Domain 层 Cart/CartItem 结构两语言对齐：`{ userId, items: [{ id, productId, quantity }] }`。

## Goals / Non-Goals

**Goals:**
- 双实现新增 `removeItem`/`remove_item` 服务方法与对应 HTTP 路由
- 复用已有 `getCart`/`get_cart` 惰性建车逻辑承载查询接口
- 行为契约与 delta spec 一致（404 语义、多条目隔离）

**Non-Goals:**
- 不改动数量限制（99）规则与加购流程
- 不做购物车整体清空接口暴露（`clearCart` 已有，无 spec 需求，不在此 change 暴露）
- 不引入商品信息联查（Cart 返回条目 ID/数量，与现有 POST 响应保持一致）

## Decisions

**D1: 移除按 `productId` 而非条目内部 `id`**
购物车条目自带内部 `id`（`item_xxx`），但调用方（前端/测试）只有 `productId` 语义明确；内部 `id` 无业务含义。故 `DELETE /api/cart/items/{productId}` 按 `productId` 匹配。
- 备选：按 item.id 删除 —— 暴露无业务意义的内部标识，且需额外查询映射，弃用。

**D2: 移除不存在的条目返回 `CART_ITEM_NOT_FOUND` (404)，而非幂等成功**
"删除目标不存在"通常意味着调用方数据视图与服务器不一致，显式报错利于发现问题；REST 语义上 DELETE 不存在的资源返回 404 也是惯例。与 error-handling 现有错误码风格一致（`PRODUCT_NOT_FOUND` 等均带 `code + message` JSON 体）。
- 备选：幂等 no-op 返回 200 —— 交互上更宽容，但掩盖数据不一致，且 spec 场景语义含糊，弃用。

**D3: 查询与移除接口均返回整个 Cart 对象（200）**
现有 `POST /api/cart/items` 返回更新后的 Cart，新接口沿用同一响应形态，客户端可用同一类型消费，测试断言简单。
- 备选：DELETE 返回 204 无 body —— 与既有 API 风格不一致，弃用。

**D4: Python 移除语义复用现有错误通道**
Python 服务层以 `ValueError(code)` 表达业务错误（`PRODUCT_NOT_FOUND`/`MAX_QUANTITY_EXCEEDED` 先例），HTTP 层统一映射 code → 状态码。`remove_item` 对缺失条目抛 `ValueError("CART_ITEM_NOT_FOUND")`，`server.py` 映射 404。Node 端以 `Error('CART_ITEM_NOT_FOUND')` + `sendError` 分支同构实现。

## Risks / Trade-offs

- [删除响应体结构被前端预期为旧形态] → 本 change 仅新增路由，`POST`/`GET` 响应均保持 Cart 全量返回，无既有契约变更
- [规格化 404 后，未来若改为幂等语义需同步改 spec] → 属行为变更，将走新 change 流程，符合 SDD 约束
- [单测新增共享服务实例的购物车状态累积] → 测试用例相对断言或独立 userId，沿用现有测试惯例（见 integration.spec.js 的隔离模式）

## Migration Plan

无迁移。新增路由为纯增量。注意：`server.prod.js` 是独立维护的精简路由表（不含此前的 get-by-id、search 路由），本次变更沿用先前实践（add-product-get-by-id、add-product-search）的范围约定，仅落地 dev `server.js`；prod 路由表不在此 change 内扩展。

## Open Questions

无。
