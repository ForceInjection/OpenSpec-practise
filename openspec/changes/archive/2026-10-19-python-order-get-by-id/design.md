## Context

见 `proposal.md` 的 Why。当前状态：

- Node.js `src/http/server.js` 已有 `GET /api/orders/:id`，直接调用 `orderRepo.findById(id)`，未命中返回 404 `{code: "NOT_FOUND", message: "Order not found"}`。
- Python `src/services/order.py` 只有 `create_order` 与 `list_orders`；`src/api/server.py` 只有 `POST /api/orders` 与 `GET /api/orders`，没有按 ID 查询路由。
- Python 的 `MemoryRepo[T]` 已提供 `find_by_id(id)`，无需新增仓库能力。
- `order-management` 主规范的「订单查询」需求已定义 200/404 两条场景，因此本次不需要 delta spec。

## Goals / Non-Goals

**Goals:**

- Python 端补齐 `GET /api/orders/{id}`，行为与 Node.js 对齐（存在返回 200 + Order，不存在返回 404）。
- 保持分层：HTTP 层只做参数解析与错误映射，查询逻辑放在 `OrderService`。
- 用测试锁定两条场景，并把 Python 测试数从 6 提升到 7。

**Non-Goals:**

- 不做订单归属/权限校验（Node 现状与 spec 均未要求）。
- 不统一双实现的错误响应结构（Node `{code,message}` vs Python `{detail}` 是既有全局差异）。
- 不改动 Node.js 代码，也不新增 spec delta。

## Decisions

**D1: 在 `OrderService` 新增 `get_order(order_id)`，由路由调用**

与 Python 既有 `create_order` / `list_orders` 的分层方式一致，HTTP 层保持薄。Node 的 `server.js` 直接访问 `orderRepo`，但 Python 侧所有端点都经过 service，跟随本实现的既有约定更重要。

- 备选：路由直接调用 `order_repo.find_by_id(id)`——少一层，但与 Python 其他端点风格不一致，弃用。

**D2: 未命中返回 FastAPI `HTTPException(404, detail="Order not found")`**

沿用 Python 现有错误通道（如 `CART_ITEM_NOT_FOUND` → 404 `detail`），不为此端点单独引入 `{code,message}`。`error-handling` 规范要求统一错误结构，Python 端整体尚未对齐，属独立债务；本次只补查询能力，不扩大范围。

- 备选：返回自定义 `{code: "NOT_FOUND", message: ...}`——会与 Python 其他端点不一致，形成新的局部例外，弃用。
- 备选：增加全局异常处理器统一错误格式——跨所有端点，应作为独立 change，弃用。

**D3: 使用 `response_model=Order` 输出**

Pydantic 模型以 `alias` 暴露 camelCase（`userId`、`totalCents`、`priceCents`），FastAPI 默认按 alias 序列化，保证与 Node 的订单 JSON 字段一致。

- 备选：手工拼 dict——重复模型定义，易漂移，弃用。

**D4: `.openspec.yaml` 声明 `skip_specs: true`，不生成 delta spec**

行为契约已存在于 `order-management`，本次是纯实现对齐。`openspec validate` 拒绝零 delta 且未声明 `skip_specs` 的 change；不应为了通过校验而虚构需求。

- 备选：写一个 MODIFIED delta 复述「订单查询」需求——没有内容变化，只会制造噪声，弃用。

**D5: 测试使用独立 userId（如 `user_order_detail`）**

Python 的 `MemoryRepo` 是 `server.py` 模块级单例，测试共享状态。使用专属 userId 避免与既有测试的订单/购物车数据互相干扰。

- 备选：为测试增加重置 fixture——需要重构依赖注入，超出本次范围，弃用。

## Risks / Trade-offs

- [双实现 404 响应体不同（`detail` vs `code/message`）] → 已在 `CLAUDE.md` 与实践中记录为已知差异；本次不扩大范围，后续可单独做错误格式统一 change。
- [按 ID 查询不校验订单归属] → 与 Node 现状和 spec 一致；若未来引入多租户/权限，需要新需求与新 change。
- [Python 测试共享模块级状态] → 使用独立 userId，避免顺序耦合；测试之间不共享订单数据。

## Migration Plan

无迁移。新增只读端点，纯增量；Python 端无需数据迁移，Node 端不改动。

## Open Questions

无。
