# 命令退场，技能登场：OpenSpec 2.1.0 工作流实践

OpenSpec 迈入 2.x：v1.16.1 与 v1.17.0 是过渡，**v2.0.0 是项目的首个 BREAKING 大版本**——斜杠命令文件彻底移除，技能统一安装到 `.agents/skills/`；v2.1.0 补上全局技能安装。工作流本身（Explore → Propose → Apply → Archive）没有任何变化，变的是技能的安装位置与调用方式。

本文记录这次跨大版本升级的完整过程：`--dry-run` 预览 25 个文件的迁移、`.claude/` 目录的符号链接化改造，以及用 2.x 技能工作流完成 `payment-implementation`——补齐 7 个能力中最后一个「规范完整、代码为零」的缺口。

## 一、四个版本的变化要点

### 1.1 v1.16.1：delta 校验收紧

- **未识别的 delta 段落不再静默** — 需求写在 `## DEPRECATED Requirements` 这类未识别段落里时，`validate` 失败、`archive` 拒绝；此前只给 warning 并把该需求静默丢弃。这是 v1.13「消灭静默失败」主线的延续。
- **闭合 `##` 标题** — `## Purpose ##` 这类带闭合 `#` 的标题与常规形式同等解析。
- **telemetry 关闭下版本检查失效修复** — `version --check` 现在只在 `OPENSPEC_NO_UPDATE_CHECK` 时跳过。

### 1.2 v1.17.0：迁移预告

- **`openspec update` 一次升到位** — 从 0.12 以来的任意旧版本项目，无需多次 `--force` 即可完成迁移；未被修改的旧文件自动清理，改过的一律保留。
- **2.0 预告** — 命令文件将在 2.0 移除，提示一行命令可提前切换（`openspec config set delivery skills && openspec update`）。

### 1.3 v2.0.0：命令退场，技能统一

- **技能统一到 `.agents/skills/`** — 所有工具共用同一份技能文件；不读该目录的工具（Claude Code、Kiro）得到**符号链接**。
- **`/opsx:*` 斜杠命令移除** — 每个命令本来就有对应技能，双份维护没有意义。调用方式从 `/opsx:propose` 变为技能 `openspec-propose`（Codex 下为 `$openspec-propose`），或直接用自然语言请求。
- **旧文件清理** — `openspec update` 移除旧版生成的斜杠命令与重复技能；你改过的文件保留并列出。
- **`delivery` 设置废弃**（旧配置继续可用）；Amazon Q 支持移除。

### 1.4 v2.1.0：全局技能

- **技能可装全局** — 借助 Vercel 的 `skills` 安装器，一次安装、所有项目可用（需要 Git 与 GitHub 访问）。
- **scope 询问** — 交互模式下 `openspec update` 会问「技能留在项目内还是切全局」，选择前什么都不变；**CI 或 agent 环境（`OPEN_SPEC_INTERACTIVE=0`）不询问，就地刷新**。选择记录进 `openspec/config.yaml`。
- **npm 安装 Node 门槛升至 ≥ 22.20.0**；独立二进制无 Node 要求。

## 二、升级操作与迁移实测

```bash
npm install -g @fission-ai/openspec@2.1.0
openspec --version        # 2.1.0
openspec update --dry-run
```

`--dry-run` 一次列出 **25 个文件**的变更计划，这就是 2.0 迁移的全貌：

```text
25 file(s) would change:
  add     .agents/skills/.openspec-target  (openspec)
  add     .agents/skills/openspec-apply-change/SKILL.md  (openspec)
  ...（7 个技能文件迁入 .agents/skills/）
  delete  .claude/commands/opsx/apply.md  (claude)
  ...（6 个命令文件删除）
  add     .claude/skills/openspec-apply-change  (claude)
  delete  .claude/skills/openspec-apply-change/SKILL.md  (claude)
  ...（6 个技能真身改为链接）
```

`--force` 应用后，`.claude/skills/openspec-*` 全部变为相对符号链接：

```text
.claude/skills/openspec-propose -> ../../.agents/skills/openspec-propose
```

两个值得记录的细节：

- **scope 未被询问** — 非交互环境（`OPEN_SPEC_INTERACTIVE=0`）不出现「项目内 / 全局」提问，技能就地刷新留在项目内，`config.yaml` 未变。这正合本仓库的需要：公开教学仓库的技能应随仓库走，clone 者开箱即得。
- **`update` 的输出直接说明了变化** — `Removed: 6 command files (OpenSpec 2.0 installs skills only)`，旧布局的清理是显式的。

升级后回归全部通过：`validate --specs --strict` 7/7、findings 清零、`validate --archived` 7/7、Node 18/18、Python 7/7。本机 Node v26 ≥ 22.20，npm 安装不受新门槛影响。

## 三、实践案例：payment-implementation

### 3.1 为什么选 payment

v1.16.0 文章的遗留观察里，payment 是「最大的 spec-code 缺口」：2 个需求、4 个场景自 v1-MVP 归档以来零实现。更微妙的是，`PAID` 状态在双实现的类型定义中存在（JSDoc 联合类型与 Pydantic `Literal`），却没有任何代码把订单流转到这个状态——类型在「许诺」一个不存在的过渡。补齐它，订单生命周期「创建 → 支付」真正闭环。

同时，2.x 工作流本身没变、调用方式全变，正需要一次真实实践来验证新流程。

### 3.2 Propose：第一次用技能而非斜杠命令

调用技能 `openspec-propose`（替代原来的 `/opsx:propose`）后，流程与 1.x 完全一致：`openspec context --json` 确认 root → `openspec new change` → 按 `status --json` 的依赖顺序生成 artifacts。变化只在入口——命令文件没了，技能还在，自然语言「propose payment-implementation」同样能触发。

`payment` 规范已完整定义 4 个场景，本次声明 `skip_specs: true` 做纯实现对齐。设计的 5 个决策：

- **D1 方法放 `OrderService`** — 支付就是订单状态的一次流转，没有独立支付实体，新建 PaymentService 只是无状态转发；
- **D2 重复支付按幂等成功** — spec 允许「幂等成功或提示已支付」，幂等 200 对客户端最简单，天然满足「不产生重复扣款」；
- **D3 状态机集中在服务层** — `payOrder`：未命中抛 `NOT_FOUND`；`PENDING_PAYMENT` 才写 `PAID`；已 `PAID` 原样返回。订单只有两种状态，服务层即可闭合状态机；
- **D4 404 沿用各自错误风格** — Node `{code: "NOT_FOUND"}`、Python `{detail}`，不扩大范围统一；
- **D5 `skip_specs: true`** — 契约已存在，不为校验虚构 delta。

### 3.3 Apply：双实现各约 20 行

Node：`OrderService.payOrder(orderId)` + `POST /api/payments/:orderId` 路由 + catch 中的 `NOT_FOUND` → 404 映射。Python：`pay_order(order_id)`（未命中返回 `None`，路由层映射 404）+ `POST /api/payments/{id}`。测试各覆盖三条路径：支付成功 → `PAID`、重复支付幂等 200、不存在订单 404。Python 测试用独立 `user_payment` 隔离模块级共享状态。

### 3.4 对照 spec 逐场景核对

| spec 场景 | Node | Python |
| --- | --- | --- |
| 成功支付订单：200 + `PAID` | `payOrder` 写 `PAID` 并保存 | `pay_order` 同 |
| 支付不存在的订单：404 + `NOT_FOUND` | 抛 `NOT_FOUND` → 404 `{code}` | `None` → 404 `{detail}` |
| 有效状态转换：仅 PENDING_PAYMENT → PAID | 仅该分支写状态 | 同 |
| 重复支付：幂等成功，不重复扣款 | `PAID` 原样返回 200 | 同 |

### 3.5 验证结果

| 检查项 | 结果 |
| --- | --- |
| `openspec validate payment-implementation --type change` | valid（INFO: skip_specs） |
| `openspec validate --specs --strict` | 7/7 |
| Node `npm test` | **22/22**（18 + 3 单元 + 1 集成） |
| Python `pytest` | **8/8** |

## 四、总结与遗留观察

### 4.1 「命令退场」是去重，不是功能回退

`/opsx:*` 命令与技能本是一对多的重复暴露：同一份指令维护两份载体。2.0 砍掉命令、保留技能，调用入口从斜杠变为技能名或自然语言——对 AI agent 反而更自然。对本仓库的直接影响是文档口径：README 与 CLAUDE.md 的工作流表格从命令改为技能，历史文章中的 `/opsx:` 表述按惯例不改（它们记录的是当时的真实用法）。

### 4.2 dry-run 在大迁移中的价值

25 个文件的迁移计划一次列清，`add/delete` 与归属工具一目了然。跨大版本升级时先 `--dry-run` 再决定，是从「信任工具」到「审视工具」的分界。符号链接布局也值得留意：Windows 开发者若未开启开发者模式/符号链接权限，clone 后 `.claude/skills/` 可能不可用——此类问题在 CI 上以 `--scope project` + 真身目录方案规避。

### 4.3 七个能力闭环达成

`payment` 落地后，7 个主能力的 spec-code 缺口全部闭合：cart、catalog、order、payment、product-query、domain-model、error-handling 均有双实现覆盖。剩余已知债务只有一项——**Node `{code, message}` 与 Python `{detail}` 的错误响应结构差异**，适合作为下一次跨实现 change。

### 4.4 遗留观察

- **错误响应格式统一**：`error-handling` 规范要求统一结构，Python 全端点仍用 `{detail}`，是唯一在册债务。
- **Node prod 路由覆盖不足**：`server.prod.js` 仍只有 products/cart POST/orders POST/metrics；支付路由按惯例只落 dev。
- **dev 固定 `user_dev`**：mock 身份模型的观察延续，未变。
- **全局技能的取舍**：本仓库保持项目内技能；若未来个人机器上多项目共用 OpenSpec，可用 `openspec init --scope global` 切换，团队仓库切换前需先统一 CLI 版本。

---

_本文基于 [OpenSpec Practise](https://github.com/ForceInjection/OpenSpec-practise) 仓库的 `payment-implementation` 实践（2026-11-18），完整产物见 `openspec/changes/archive/2026-11-18-payment-implementation/`。_
