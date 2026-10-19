# 从安全加固到链接 spec：OpenSpec v1.14.3 工作流实践

OpenSpec v1.13.1 至 v1.14.3 在一个月内连续发布了六个版本，均无 breaking change。与 v1.13.0「消灭静默失败」的主题不同，这一段版本的主线是**收紧边界**：把配置注入、路径逃逸、符号链接、未知元数据这些容易被忽视的入口逐个封住，同时让校验和归档的行为更可预测。

本文用一个真实的小实践「Python 订单详情查询」（`python-order-get-by-id`）走一遍升级后的工作流，并记录升级过程中实际检查过的兼容性项。这个 change 也是本仓库第一次使用 `skip_specs: true`——一个值得单独说明的机制。

## 一、六个版本的变化要点（实践视角）

### 1.1 v1.13.1：安全加固与 profile-aware skills

这是六个版本里安全分量最重的一个：

- **配置注入防护** — `config.yaml` 中的值不能再向 agent 指令注入内容；构造过的仓库文件不能让 `openspec update` / `openspec archive` 卡死；仓库内的 `.npmrc` 不能重定向更新检查。这直接关系到「克隆一个陌生仓库就让 AI 跑起来」的安全模型。
- **Profile-aware skills** — 生成的 skills/commands 只包含当前 profile 安装的工作流，并能匹配「openspec propose」「do an openspec apply」这类自然语言触发。
- **Project check** — 工作流在写任何文件前确认项目已运行 `openspec init`，不会顺手创建 `openspec/` 目录。
- **`status` 的 Next 提示** — 输出最后一行给出推动 change 前进的确切命令，恢复一个 change 不再需要背工作流。
- **Archive 加固** — 拒绝仅大小写不同的需求名、`FROM:`/`TO:` 不成对的 RENAMED、不会被读取的 delta 文件；批量归档先检查全部目标再写主 spec。
- **任务进度** — `+`、`1.`、`1)` 列表符下的任务也能计数；`[~]` 等未知标记一律算未完成，不再把未完成工作藏起来。

### 1.2 v1.13.2：verify 与 Windows 归档

- **`/opsx:verify` 更诚实** — 不再把跳过的检查报告为通过；REMOVED 需求在行为消失后通过，RENAMED 需求按原行为检查。
- **Windows archive** — 不再残留 `.openspec-archive.lock`；目录重命名被系统阻止时也能完成而不是回滚。
- **CRLF 保留** — 重写 spec、`.bashrc`、`.zshrc`、`CLAUDE.md` 时保持原行尾，Windows 用户不再得到整文件 diff。
- **任务组自带测试与文档** — 每个任务组负责自己的测试和文档更新，而不是推迟到最后一组；onboarding 会先要求确认任务拆分。
- **场景丢失提示** — `MODIFIED` 块删除场景时，报错会同时说明该块新增了什么。

### 1.3 v1.14.0：十种工具与归档浏览

- **10 种新工具** — Amp、AtomCode、Code Studio、DeepSeek Harness、EasyCode、GigaCode、Grok Build、GSD、Veai、Warp。
- **`openspec list --archived` / `--all`** — 直接浏览归档 change，支持 JSON 输出和排序；`openspec view` 也增加了归档区。
- **`openspec view` 显示工作流状态** — 每个 active change 的 schema 与 artifact 完成/就绪/阻塞状态一目了然。
- **`openspec version`** — 显示已安装版本与安装方式；`--check` 和 `--json` 便于工具读取更新信息。
- **未知 `.openspec.yaml` 键** — `status`、`validate`、`archive` 会点名被忽略的键（如 `skip_design`），`validate --strict` 直接失败。
- **`show --json`** — requirement 和 scenario 带 `name`，JSON 消费者不必再解析 Markdown。
- **`project.md` 迁移** — `openspec init` 引导把旧 `project.md` 迁到 `config.yaml`。

### 1.4 v1.14.1：启动提速与增量写入

- **启动更快** — 每个命令只加载需要的代码，`openspec --version` / `--help` 从 485 个 module 降到 24 个。
- **增量写 spec** — agent 每起草完一个能力的 spec 文件就落盘，长任务中断也能保留已写内容；`/opsx:continue` 会补齐缺失的 spec。
- **500 字符需求提示** — 超过 500 字符的 requirement 产生 warning，`validate --strict` 失败（包括 change 中的新需求）。
- **`openspec view` 不再列出归档** — 归档浏览交给 `openspec list --archived`。
- **Apply 完成先 review** — 所有任务勾完后提示「任务完成，请 review 后再 archive」，不再直接宣布可以归档。

### 1.5 v1.14.2：扩展元数据与归档告警

- **`x-` 扩展键** — `.openspec.yaml` 顶层以 `x-` 开头的键归用户所有（如 `x-tracker`、`x-jiraKey`），OpenSpec 忽略且 `--strict` 通过；其他未知键仍会报警。
- **Archive 文本丢弃告警** — delta 中不会被带入主 spec 的文本（额外的 `##` 段、首个 requirement 前的散文）会告警，`--strict` 下失败。
- **Verify 检查 REMOVED 需求** — 先从主 spec 读取原始文本，再在代码中搜索；文本不可恢复时报告「未验证」而不是通过。
- **符号链接目录** — `openspec/`、`openspec/changes`、`openspec/specs` 可以是符号链接。
- **Brace 深度限制** — 嵌套超过 16 层的 artifact 模式直接报错。

### 1.6 v1.14.3：链接 spec 与 glob 边界

- **链接 spec 文件** — 一个能力的 `spec.md` 可以是指向项目内其他文件的符号链接；指向项目外仍然拒绝。
- **glob 路径不出 change 目录** — propose、ff、continue、explore 在写文件前检查所选路径，直接或经符号链接逃出 change 目录都会被拒绝。
- **移除 `braces` 依赖** — 安装 OpenSpec 不再带出未修补的 `braces`，`npm audit` 不再报 GHSA-vfj7-8cjw-p6xm。
- **CI 中的 `validate --all`** — 终端列数为 0 时 spinner 不再死循环；`OPEN_SPEC_INTERACTIVE=0` 和 `CI` 可关闭 spinner。
- **超宽 brace 模式** — 展开超过 1,024 条路径时直接拒绝，避免 `openspec status` 耗尽内存。

## 二、升级操作与兼容性检查

本仓库的升级路径与 CHANGELOG 中的历次升级一致：

```bash
npm install -g @fission-ai/openspec@1.14.3
openspec --version       # 1.14.3
openspec update --force  # 刷新 .claude/ 下的命令与技能
```

`openspec update --force` 刷新的 12 个文件（6 个 command + 6 个 skill）共 +353/−97 行。命令结尾还给出了一条重要提示：

```text
Note: 6 more workflows are available (new, continue, ff, bulk-archive, verify, onboard).
Add them with `openspec config profile`.
```

这说明**默认的 `core` profile 仍然是 6 个命令**：`propose`、`explore`、`apply`、`update`、`sync`、`archive`。`new`、`continue`、`ff`、`bulk-archive`、`verify`、`onboard` 是可选工作流，需要显式执行 `openspec config profile` 后再 `openspec update`。这次升级没有改变仓库的默认命令面，因此 `.claude/commands/opsx/` 里仍然只有原来的 6 个文件。

升级后的兼容性检查：

```text
$ openspec validate --specs --report findings
Scope: specs (7 items)
No item findings.
Totals: 7 passed, 0 failed (7 items)

$ openspec validate --archived
✓ change/2025-01-27-v1-mvp
✓ change/2026-07-08-add-product-get-by-id
✓ change/2026-07-28-add-product-search
✓ change/2026-09-02-cart-query-and-remove
✓ change/2026-09-10-order-list-query
Totals: 5 passed, 0 failed (5 items)
```

两个容易在升级时踩到的严格校验点，本仓库都安全：

- **500 字符需求**：现有 7 个主 spec 的所有 requirement 都短于 500 字符，v1.14.1 的新 warning 不会触发。
- **未知 `.openspec.yaml` 键**：5 个归档 change 的元数据只有 `schema` 和 `created`，两者都是已识别键；`--strict` 不受影响。

Node 18/18、Python 6/6 在升级后保持全绿。

## 三、实践案例：python-order-get-by-id

### 3.1 Explore：从 spec 清单找缺口

按 v1.13 起的模板先盘点能力：

```text
$ openspec list --specs
Specs:
  cart-management        requirements 4
  catalog-management     requirements 4
  domain-model           requirements 5
  error-handling         requirements 2
  order-management       requirements 4
  payment                requirements 2
  product-query          requirements 1
```

`order-management` 的「订单查询」需求已经定义了 200 和 404 两条场景，但对照双实现路由表会发现：Node 的 `server.js` 有 `GET /api/orders/:id`，Python 的 `server.py` 没有对应路由。这个缺口在 v1.13.0 实践文章的「遗留观察」里已经被点名，正好适合作为一次小型实践。

选择它的理由：

- 行为契约已经存在，不需要新的 spec 设计；
- 改动集中在 Python 的三个文件，能在一次会话内完成；
- 能闭合一个已经记录在案的双实现差异，而不是制造新的待办。

### 3.2 Propose：第一次使用 skip_specs

先按 v1.14 模板运行 `openspec context --json`，确认权威 root 后创建 change：

```bash
openspec new change python-order-get-by-id \
  --goal "Close the Python implementation gap for GET /api/orders/{id}"
```

关键决策是**不写 delta spec**。`order-management` 已经完整描述了「订单查询」的行为，本次只是实现对齐；`openspec validate` 会拒绝零 delta 的 change，除非在 `.openspec.yaml` 中声明：

```yaml
schema: spec-driven
created: 2026-10-19
goal: Close the Python implementation gap for GET /api/orders/{id}
skip_specs: true
```

`skip_specs` 不是「跳过规范思考」的捷径。它适用于纯重构、工具链、文档，或像本次这样**行为契约不变、只补实现**的场景。proposal、design、tasks 仍然照常生成，`specs` artifact 在 `openspec status` 中显示为 `skipped`：

```text
proposal: done
specs: skipped
design: done
tasks: done
```

如果为了通过校验而虚构一条 MODIFIED 需求，反而会污染主 spec 的单一事实来源。

### 3.3 Apply：补服务层、路由与测试

Python 侧改动了三个文件：

- `src/services/order.py`：新增 `get_order(order_id)`，委托 `MemoryRepo.find_by_id`；
- `src/api/server.py`：新增 `GET /api/orders/{id}`，使用 `response_model=Order`；未命中时抛 `HTTPException(404, detail="Order not found")`；
- `tests/test_smoke.py`：新增 `test_order_get_by_id`，覆盖存在与不存在两条路径。

测试使用独立的 `user_order_detail`，而不是复用其他测试的用户 ID。原因是 Python 的 `MemoryRepo` 是 `server.py` 里的模块级单例，测试共享同一份内存状态；独立的用户 ID 可以避免测试顺序耦合。断言同时检查了 camelCase 字段（`userId`、`totalCents`、`items[].productId`、`items[].priceCents`），确保 Python 的 Pydantic alias 与 Node 的订单 JSON 对齐。

Node 端不需要改动：`GET /api/orders/:id` 早已存在。两端仍有一个已知差异——Node 返回 `{code, message}`，Python 返回 FastAPI 的 `{detail}`。这属于 `error-handling` 规范层面的全局债务，本次没有扩大范围去改它。

结果：

```text
Node:   18 passed
Python: 7 passed
```

### 3.4 Validate：skip_specs 的可见性

```text
$ openspec validate python-order-get-by-id --type change
Change 'python-order-get-by-id' is valid
ℹ [INFO] file: skip_specs is set in .openspec.yaml: change declares no spec-level
  behavior changes, zero deltas accepted
```

这条 INFO 很重要：工具没有把 `skip_specs` 当成静默通过，而是明确告诉读者「这个 change 声明了没有 spec 级行为变化」。主 spec 仍然用 findings 模式校验：

```text
$ openspec validate --specs --report findings
Scope: specs (7 items)
No item findings.
Totals: 7 passed, 0 failed (7 items)
```

### 3.5 Archive：无 delta 合并的归档

```text
$openspec archive python-order-get-by-id
```

归档过程没有 delta 需要合并，只做 change 目录移动与收尾。归档后：

```text
$ openspec validate --archived
Totals: 6 passed, 0 failed (6 items)

$ openspec list --archived
Archived Changes:
  2026-10-19-python-order-get-by-id     ✓ Complete    2026/10/19
  2026-09-10-order-list-query           ✓ Complete    2026/9/10
  ...
```

### 3.6 本次实践的结果

| 检查项                                                   | 结果                            |
| -------------------------------------------------------- | ------------------------------- |
| `openspec validate python-order-get-by-id --type change` | valid（INFO: skip_specs）       |
| `openspec validate --specs --report findings`            | 7/7，无 findings                |
| `openspec validate --archived`                           | 6/6                             |
| Node `npm test`                                          | 18/18                           |
| Python `pytest`                                          | 7/7                             |
| Python 新增端点                                          | `GET /api/orders/{id}`，200/404 |

## 四、总结与遗留观察

### 4.1 这一轮版本的价值是「越界即报错」

v1.13.1 到 v1.14.3 的改动看似分散，但共同指向一个原则：**工具不能默默接受越界输入**。配置值不能注入指令，glob 不能逃出 change 目录，symlink 不能指向项目外，未知元数据不能悄悄忽略，归档不能悄悄丢掉文本。对 SDD 来说，规范是单一事实来源，任何「报告成功但结果不对」的路径都比崩溃更危险。

### 4.2 skip_specs 的边界

这次实践第一次使用 `skip_specs: true`。它适合「行为契约不变、只补实现」的 change；不适用于需求本身还在变化的情况。使用它时仍应保留完整的 proposal/design/tasks，并在 proposal 的 Capabilities 部分明确写出「无新增、无修改能力」及理由——让读者知道这是有意的选择，而不是漏写。

### 4.3 Profile 是显式的选择

默认 `core` profile 保持 6 个命令，降低日常认知负担；`verify`、`continue`、`ff` 等 expanded profile 工作流需要显式开启。本仓库暂时保持 core，因为现有实践已经能覆盖 Explore → Propose → Apply → Archive 的主链路；如果后续要验证「实现是否真的满足 artifacts」，可以单独评估启用 `verify`。

### 4.4 遗留观察

- **payment 仍是最大的 spec-code 缺口**：2 个需求、完整场景，零实现，适合一次独立的中型实践。
- **错误响应格式未统一**：Node `{code, message}` 与 Python `{detail}` 的差异仍在，`error-handling` 规范要求统一结构，值得单独做一次跨实现 change。
- **Node prod 路由覆盖不足**：`server.prod.js` 只有 products/cart POST/orders POST/metrics，缺少查询类端点；dev 与 prod 的行为差异需要在使用文档中持续标注。
- **dev 固定 `user_dev`**：这个 mock 身份模型已经两次干扰集成测试；如果后续做订单归属或支付实践，建议评估把 dev 身份改为可传参。

---

_本文基于 [OpenSpec Practise](https://github.com/ForceInjection/OpenSpec-practise) 仓库的 `python-order-get-by-id` 实践（2026-10-19），完整产物见 `openspec/changes/archive/2026-10-19-python-order-get-by-id/`。_
