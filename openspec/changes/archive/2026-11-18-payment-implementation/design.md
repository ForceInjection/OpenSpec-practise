## Context

见 `proposal.md` 的 Why。当前状态：

- Node `OrderService` 只有 `createOrder` / `listOrders`；订单对象含 `status: 'PENDING_PAYMENT'`，但没有任何代码将其流转到 `PAID`——`PAID` 在双实现的类型定义（JSDoc 与 Pydantic `Literal`）中存在，纯靠类型「许诺」。
- Python `Order.status` 为 `Literal["PENDING_PAYMENT", "PAID"]`，同样无流转代码。
- 双实现均无 `POST /api/payments/*` 路由。
- `payment` 主规范的 4 个场景已定义完整契约（200+PAID / 404 NOT_FOUND / 状态机 / 幂等重复支付），本次不需要 delta spec。

## Goals / Non-Goals

**Goals:**

- 双实现补齐 `POST /api/payments/:orderId`，行为与 spec 逐场景对齐。
- 状态机约束（仅 PENDING_PAYMENT → PAID）在服务层集中保证。
- 重复支付按幂等成功处理：返回 200 + 当前订单，不产生第二次扣减。
- Node 18 → 22、Python 7 → 8 全绿。

**Non-Goals:**

- 不引入支付网关、金额流转或交易记录实体（spec 未要求，MVP 内存模型）。
- 不统一双实现的错误响应结构（Node `{code,message}` vs Python `{detail}` 是既有全局差异，属 error-handling 独立 change）。
- 不在 Node prod server 落地支付路由（沿用「dev 全量、prod 最小」的既有惯例）。
- 不改动主 spec 与归档 change。

## Decisions

**D1: 支付方法放在 `OrderService`，不新建 PaymentService**

支付在本模型中就是订单状态的一次流转，没有独立的支付实体、金额账户或交易流水要管；新建 PaymentService 只会引入一层无状态的转发。Node 与 Python 均在 `OrderService` 增加 `payOrder` / `pay_order`。

- 备选：独立 PaymentService + 支付记录仓库——为 4 个场景引入第二实体，YAGNI，弃用。

**D2: 重复支付按「幂等成功」处理，返回 200 + 当前订单**

spec 给了两个合法选项（幂等成功 / 提示已支付）。幂等成功对客户端最简单：重复请求与首次成功的可观察结果一致（200 + PAID 订单），无需客户端区分错误类型；同时天然满足「不产生重复扣款」。

- 备选：返回 409 + `ALREADY_PAID`——需要新增错误码并同步 error-handling spec 的错误码清单，扩大本次范围，弃用。

**D3: 状态校验与流转集中在服务层一次完成**

`payOrder(orderId)`：`findById` 未命中 → `NOT_FOUND`；`status === 'PENDING_PAYMENT'` → 置 `PAID` 并保存；`status === 'PAID'` → 原样返回（幂等）。订单对象只含这两种状态，服务层即可完整闭合状态机，HTTP 层只做参数解析与映射。

- 备选：HTTP 层先查再调服务——查询与流转分离会产生竞态窗口且逻辑重复，弃用。

**D4: 404 通道沿用各自实现的既有错误风格**

Node：`sendError(res, 'NOT_FOUND', 'Order not found', 404)`，与 `GET /api/orders/:id` 完全一致。Python：`HTTPException(404, detail="Order not found")`，与订单详情端点一致。双实现的 `{code,message}` vs `{detail}` 差异是已记录的全局债务，本次不扩大范围处理。

- 备选：借本次统一错误格式——波及 Python 全部端点与其既有测试断言，应作为独立 change，弃用。

**D5: `.openspec.yaml` 声明 `skip_specs: true`**

行为契约已存在于 `payment` 主规范，本次纯实现对齐。不为通过校验虚构 MODIFIED delta。

## Risks / Trade-offs

- [幂等成功掩盖了「重复扣款」的真实业务风险] → MVP 无真实资金流；spec 明确允许该选项；未来接支付网关时需要交易流水与真实的幂等键，属新 change。
- [支付无鉴权/归属校验] → 与订单查询、Node dev 全部端点一致（mock 身份模型）；引入用户体系时再补。
- [Python 测试共享模块级状态] → 新测试使用独立 `user_payment`，与既有用例隔离。

## Migration Plan

无迁移。新增只读语义的支付端点（仅改订单状态），纯增量；Node prod 不落地该路由，dev 与 Python 立即可用。

## Open Questions

无。
