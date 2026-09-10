# 把静默失败堵死：OpenSpec v1.13.0 工作流实践

OpenSpec v1.12.0 与 v1.13.0 相继发布（2026-09），均无 breaking change。v1.13.0 的主题可以概括为一句话：**archive 和 delta 解析器不再悄悄改掉或丢掉你写的内容**。本文通过真实案例「订单列表查询」（order-list-query）演示升级后的完整工作流（Explore → Propose → Apply → Archive），并记录两个版本中对实践有实际影响的变化——包括 `validate --report findings` 首跑就在本仓库抓到 3 个真实问题。

## 一、两个版本的变化要点（实践视角）

### v1.12.0：校验报告与有据规划

- **`openspec validate --report findings`** — 只输出 errors/warnings/info 的聚焦报告，保留 totals 与 exit code，适合 CI 钩子
- **Code-grounded planning** — propose/explore 模板要求先检查相关代码、测试、文档再写 artifacts；「不要问用户代码里已有答案的事实」
- 修复：Node 20 兼容（chalk 降级）、npm Git 安装、依赖安全补丁

### v1.13.0：delta 解析器与 archive 的健壮性

- **archive 不再改写 fenced 代码块** — 空行整理变为 fence-aware，YAML/Python 示例在多次归档间保持原样
- **`*`/`+` 列表符的 REMOVED/RENAMED 现在生效** — 此前只有 `-` 被识别：validate 通过、archive 报成功、需求却原样不动
- **重复的 delta 段落全部生效** — 此前文件里出现两个 `## ADDED Requirements` 只应用一份就归档（在 fenced 示例里记录 OpenSpec 语法就会自然触发）
- **apply 对无 delta specs 的 change 发出警告** — 提示写 specs 或声明 `skip_specs: true`，与 validate 的零 delta 拒绝对齐
- **explore 列出 spec 清单** — 新模板明确要求 `openspec list --specs`：`openspec list` 只显示 in-flight changes，不显示项目已有能力
- **propose 先加载项目上下文** — `openspec context --json` 确认 root 后才读 `config.yaml` 的 `context` 字段；无 OpenSpec root 时停下询问而非静默初始化
- **update 修复损坏的 command 文件** — 此前只比对 skill 文件就判定"已是最新"

## 二、实践案例：order-list-query

### 2.1 Explore：新模板的第一次实战

按 v1.13 explore 模板走了一遍新的盘点路径：`openspec list --specs` 列出 7 个能力的需求计数，再对照双实现的路由表找缺口。剩余缺口四个：订单列表查询（小-中）、购物车清空接口（极小）、订单支付实现（大）、商品删除（中-大，涉库存引用）。

选定**订单列表查询**：`GET /api/orders?userId=` 返回订单历史——下单后「查看我的订单」是订单闭环的自然缺口；repo 层已有遍历能力，工作量可控；纯 ADDED 需求。

explore 阶段读代码时发现一个双实现差异：**Python `Order` 模型没有 `user_id` 字段**，而 Node 的订单对象一直携带 `userId`。这意味着按用户过滤的前提是先补齐模型——这个发现直接改变了 design 的内容。

### 2.2 Propose：新流程的 context 加载

按新 propose 模板第 2 步先跑 `openspec context --json`（返回权威 root 路径），确认后才读 `config.yaml` 的 `context` 字段作为规划约束。四个 artifacts：

- **proposal.md** — Modified Capability: `order-management`，ADDED「订单列表查询」
- **specs/order-management/spec.md** — 3 个场景：有订单用户返回全部订单 / 无订单用户返回空数组 / 缺 `userId` 返回 400 + `MISSING_USER_ID`
- **design.md** — 5 个决策，核心三条：过滤在服务层完成（Node `OrderRepo` 补 `findAll()`，与 `ProductRepo` 对齐）；缺参显式 400 而非返回全量订单（管理语义泄漏他人订单）；Python `Order` 模型补 `user_id`（alias `userId`），使双实现订单 JSON 对齐——纯增量字段
- **tasks.md** — 4 组 7 任务，每条带验证标准

### 2.3 Apply：同一坑第二次踩到

双实现落地各约 20 行。但 Node 集成测试首跑即失败：下单断言期望 201、实际 400（CART_EMPTY）——**与 PR #11 修复的性能测试是同一个坑**：dev 购物车端点固定 `user_dev`，测试却用别的 userId 下单。修正为 `user_dev` 视角的相对断言（记录前置订单数，断言 +2）；多用户隔离断言放到 Python 侧——Python 购物车请求自带 `userId`，天然支持多用户 E2E。

这个重复踩坑本身值得记入实践账本：**dev 服务器的 mock 身份模型（固定 user_dev）与测试的多用户意图存在结构性张力**。unit 层测隔离（直连服务层）、integration 层测单用户闭环 + Python 侧补多用户，是当前架构下的合理分工。

测试结果：Node 18/18、Python 6/6 全绿。

### 2.4 validate --report findings：首跑抓到 3 个真实问题

收尾阶段用 v1.12 的新报告模式跑了一次主 specs 校验：

```text
$ openspec validate --report findings --specs
spec/cart-management
  [WARNING] overview: Purpose section is too brief (less than 50 characters)
spec/payment
  [WARNING] overview: Purpose section is too brief (less than 50 characters)
spec/product-query
  [WARNING] overview: Purpose section is still a placeholder rather than
  a Purpose anyone wrote ...
Totals: 7 passed, 0 failed (7 items)
```

三个警告全部属实：cart/payment 的 Purpose 确实不足 50 字符；**product-query 的 Purpose 还是 v1.5.0 实践归档时 CLI 写入的 `TBD - created by archiving change ...` 占位符**，至今无人补写。逐一修复后 findings 清零。这正好完整验证了 v1.9.0（Purpose 格式）→ v1.11.0（占位符警告）→ v1.12.0（findings 报告）三个版本的演进闭环——工具逐版本补上的守护，在真实仓库里就是逐版本浮出的历史欠账。

### 2.5 Archive

`openspec archive` 一条命令完成合并（+1 added）与归档，产物为 `openspec/changes/archive/2026-09-10-order-list-query/`。归档后全量校验：无 active changes、7 specs 全部通过、findings 为空。

## 三、实践总结

### 3.1 v1.13.0 的价值是「消灭静默失败」

此前 delta 解析器的三个静默失败模式（`*`/`+` 列表符不生效、重复 delta 段落只应用一份、fenced 空行被改写）共同点是：**工具链报告成功，结果却是错的**。这类失败比崩溃更危险——它污染的是"单一事实来源"本身。v1.13.0 把它们全部变成"要么生效、要么报错"。

### 3.2 工具守护的复利

从 v1.9.0 到 v1.13.0，五次升级在同一个点上持续加码：spec 的内容质量。Purpose 格式迁移 → 占位符警告 → findings 报告，每一层守护都在下一次实践中兑现了价值。SDD 的工具链价值不只是"生成更快"，更是"漂移更早被发现"。

### 3.3 遗留观察

- dev 服务器固定 `user_dev` 的 mock 身份模型已两次干扰集成测试，未来若再做用户维度的实践（如订单归属、支付），值得评估把 dev 身份改为可传参
- payment 能力仍是"spec 完整、代码为零"的最大缺口，适合作为一次独立的中型实践
- 本次变更评审时新确认：Python 端从未实现 `GET /api/orders/{id}`，主 spec「订单查询」需求（2 场景）目前仅在 Node 落地——可作为下次小型实践的候选

---

_本文基于 [OpenSpec Practise](https://github.com/ForceInjection/OpenSpec-practise) 仓库的 `order-list-query` 实践（2026-09-10），完整产物见 `openspec/changes/archive/2026-09-10-order-list-query/`。_
