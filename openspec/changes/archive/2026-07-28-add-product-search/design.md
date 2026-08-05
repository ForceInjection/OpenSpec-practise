## Context

当前 `GET /api/products` 在 Node.js 中直接调用 `catalogService.list()`，Python 中调用 `catalog_svc.list_products()`，均返回全量商品。服务层已有 `findAll`/`find_all` 的基础查询能力。本变更在保持无参行为不变的前提下，为列表接口增加按名称模糊过滤。

## Goals / Non-Goals

**Goals:**
- 双实现（Node.js + Python）行为一致：支持 `name` 查询参数的模糊匹配
- 无 `name` 参数时完全保持现有行为（向后兼容）
- 过滤逻辑放在服务层而非 HTTP 层，保持分层职责清晰

**Non-Goals:**
- 不做分页（Demo 阶段，数据量小）
- 不做全文搜索或索引（如 PostgreSQL tsvector）
- 不修改按 ID 查询（product-query）行为

## Decisions

### Decision 1: 过滤逻辑放在服务层

`CatalogService.list(name)` / `list_products(name)` 接收可选参数，内部完成模糊匹配过滤；HTTP 层只负责解析查询参数并透传。

**Rationale**: 保持分层架构的依赖方向（HTTP → Service），服务层可独立测试，与现有 `getProduct` 的模式一致。

**Alternatives Considered**:
1. **HTTP 层过滤**: 职责混淆，测试困难，违反分层原则。
2. **仓储层过滤**: 过度设计——仓储层保持通用数据访问语义，过滤是业务行为。

### Decision 2: 大小写不敏感的包含匹配

名称匹配使用大小写不敏感的 `includes` 语义（Node.js `toLowerCase().includes()` / Python `lower() in`）。

**Rationale**: 用户输入习惯不一致（如 "iPhone" vs "iphone"），模糊匹配应降低大小写敏感度。Demo 阶段不做分词或通配符。

**Alternatives Considered**:
1. **精确匹配**: 过于严格，无法满足"模糊搜索"意图。
2. **正则表达式**: 引入转义与注入风险，Demo 阶段不值得。

### Decision 3: 排序参数白名单校验

`sort` 参数只接受 `price_asc` 和 `price_desc` 两个值，其余值静默忽略（保持自然顺序）。

**Rationale**: 白名单避免注入风险（值不做任何动态执行），静默忽略而非报错保持向后兼容——旧客户端传未知参数不会被破坏。

**Alternatives Considered**:
1. **未知值返回 400**: 过于严格，破坏向后兼容。
2. **直接拼接 SQL ORDER BY**: 引入注入风险，且本项目无数据库。

### Decision 4: 排序在服务层完成

过滤和排序都发生在 `CatalogService.list(name, sort)` 内，HTTP 层仅透传参数。排序使用语言内建排序（Node.js `Array.sort` / Python `sorted`），无额外依赖。

**Rationale**: 与 Decision 1 一致——业务行为归属服务层，HTTP 层保持薄。Demo 数据量下内存排序性能充足。

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| Python `Optional[str] = None` 与 Node.js `undefined` 默认值语义略有差异 | 两实现均以"参数为 null/undefined/空串时返回全量"为统一契约，测试覆盖 |
| 模糊匹配与排序为 O(n log n) 全量遍历 | Demo 数据量小（<100 商品），SLO p99 < 100ms 不受影响 |
| 排序稳定性（同价商品顺序）跨语言不一致 | 排序仅按 priceCents 比较，同价顺序不作为契约；测试断言只验证价格序 |
