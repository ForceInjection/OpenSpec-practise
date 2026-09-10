## Context

双实现订单能力现状：Node 订单对象含 `userId` 字段，Python `Order` 模型（Pydantic）**不含** `user_id`——两实现的订单 JSON 响应已存在字段差异。仓库层：Node `OrderRepo` 只有 `save`/`findById`（无 `findAll`，而 `ProductRepo` 有）；Python `MemoryRepo[T]` 是泛型仓库，自带 `find_all()`。路由：`POST /api/orders` 与 `GET /api/orders/:id` 双实现齐备，无列表端点。

## Goals / Non-Goals

**Goals:**
- 双实现新增按 `userId` 过滤的订单列表服务方法与 `GET /api/orders` 路由
- 补齐 Python `Order.user_id` 字段，使双实现订单 JSON 结构对齐
- 未提供 `userId` 时显式报错（400 + `MISSING_USER_ID`）

**Non-Goals:**
- 不做分页、排序参数（当前规模不需要，留待新 change）
- 不做管理员视角的"全部订单"查询
- 不触碰支付/状态流转（payment 能力另行处理）

## Decisions

**D1: userId 过滤在服务层完成，Node `OrderRepo` 补 `findAll()`**
单进程内存 Map，订单规模下全量取出后过滤即可；Python 直接用泛型 `find_all()` + 列表过滤，Node 给 `OrderRepo` 补 `findAll()`（与 `ProductRepo` 形态对齐）。
- 备选：repo 层新增 `findByUserId(userId)` —— 为单一调用方加仓库方法，当前无性能诉求，YAGNI，弃用。

**D2: 未提供 `userId` 返回 400 + `MISSING_USER_ID`，而非返回全部订单**
"无过滤参数返回全站订单"是管理语义，会泄漏他人订单，也与既有按用户隔离的模型冲突；显式报错让契约清晰。
- 备选：返回全部订单 —— 管理与用户语义混淆，弃用。

**D3: Python `Order` 模型补 `user_id`（alias `userId`）**
按用户过滤的前提是订单记录归属；Node 侧订单已含 `userId`，Python 缺失属于实现差异而非契约差异。补字段后双实现订单 JSON 对齐，属纯增量字段。
- 备选：Python 侧单独维护 user→orders 映射 —— 引入第二数据源，一致性风险大于收益，弃用。

**D4: 列表按创建顺序返回，不定义排序契约**
`Map`/`dict` 均保持插入序，"创建顺序"是自然结果；spec 不锁定排序细节，未来若需排序参数走新 change。

**D5: 错误通道同构**
沿用既有模式：Node `Error('MISSING_USER_ID')` → `sendError` 400；Python 端点为必填 query 参数时由 FastAPI 自动 422，为保持与 spec（400 + MISSING_USER_ID）一致，改为 `Optional` 接收后在服务层抛 `ValueError("MISSING_USER_ID")`，HTTP 层映射 400。

## Risks / Trade-offs

- [Python 订单 JSON 新增 userId 字段影响既有消费者] → 本仓库内测试是唯一消费者，断言为字段新增而非变更；双实现对齐是收益
- [无分页在大订单量下响应过大] → MVP 内存实现规模有限；spec 未承诺分页，未来可增量添加
- [OrderRepo.findAll 返回 Map 迭代序依赖] → Node/Python 的 Map/dict 均保证插入序，行为确定

## Migration Plan

无迁移。新增只读端点 + 纯增量字段，dev/prod 范围沿用惯例仅落地 dev `server.js`。

## Open Questions

无。
