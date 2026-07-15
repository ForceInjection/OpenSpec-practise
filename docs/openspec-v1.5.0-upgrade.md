# 从硬编码到动态指令：OpenSpec v1.5.0 的三大变革

OpenSpec（[Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec)）在 v1.3.1 到 v1.5.0 之间累计了 600+ commits 的演进。如果你停留在 v1.3.1，升级后最直观的感受会是：**AI 更"懂"你的项目了**。背后是三个根本性的架构变革。

## 一、背景：v1.3.1 长什么样

在理解变化之前，先回顾 v1.3.1 时代的工作方式。

一个典型的 OpenSpec 开发流程是：在对话中输入 `/opsx:propose "做某个功能"`，AI 在 `openspec/changes/` 下生成 proposal.md、design.md、specs/、tasks.md，然后 `/opsx:apply` 按 tasks 逐一实现，最后 `/opsx:archive` 归档。

这套流程已经能工作，但存在三个痛点：

**指令是硬编码的。** 告诉 AI "怎么写 proposal" 的 prompt 写在 TypeScript 源码里。如果你的项目需要自定义模板（比如必须包含「回滚方案」章节），要么等官方发布新版本，要么在对话中反复提醒 AI——而 AI 经常忘记。

**阶段是锁死的。** 提案走完才能实现，实现走完才能归档。如果写到一半发现 design.md 需要调整，必须打断当前流程、手工编辑文档、再重新触发 apply。AI 不会主动感知这些变动。

**规划只属于一个仓库。** `openspec/` 放在项目根目录，天然假设一个仓库对应一套规划。当功能横跨 API 服务、前端、共享库三个仓库时，规划放在哪个仓库都不对。

v1.5.0 的三个核心变革，恰好对应这三个痛点。

## 二、变革一：Schema 驱动——让 AI 动态感知项目

v1.5.0 把指令从代码中抽离，放入 `schemas/spec-driven/schema.yaml`。这个文件声明了 artifact 的类型（proposal、specs、design、tasks）、依赖关系和每个 artifact 的生成指令。

```text
v1.3.1:  AI 收到写死的 prompt → 生成文档
v1.5.0:  AI 运行 openspec instructions <artifact> --json
         → 拉取当前项目的 context + template + rules
         → 基于最新信息生成文档
```

AI 执行 `/opsx:propose` 时不再是接收一段静态文本，而是先运行 `openspec instructions proposal --json`。这个命令返回的 JSON 包含：

- `context`：来自 `openspec/config.yaml` 的项目背景（技术栈、架构约束）
- `rules`：按 artifact 类型定义的规则（如"proposal 必须包含 SLO 指标"）
- `template`：当前 schema 定义的文档结构
- `dependencies`：已完成的 artifact 列表

**关键变化：你修改了 config.yaml 中的 rules，下一次 `/opsx:propose` 立即生效，不需要重启 IDE，不需要等新版本。**

由 Schema 驱动带来的自然结果是 **Fluid Workflow**——既然 AI 每次都会动态查询当前状态，阶段锁定就失去了意义。你可以在 Apply 中途回头修改 design.md，再次运行 `/opsx:apply` 时 AI 会自动感知变化。为此新增了一批扩展命令：

| 命令                 | 作用                               |
| -------------------- | ---------------------------------- |
| `/opsx:new`          | 仅初始化目录结构，逐步手动创建文档 |
| `/opsx:continue`     | 按依赖顺序创建下一个 artifact      |
| `/opsx:ff`           | 跳过文档直入实现                   |
| `/opsx:sync`         | 同步 delta spec 到主规范，不归档   |
| `/opsx:verify`       | 验证实现与规范的一致性             |
| `/opsx:bulk-archive` | 批量归档多个变更                   |
| `/opsx:onboard`      | 15 分钟互动式全流程引导            |

## 三、变革二：Stores——规划成为独立的 Git 仓库

既然 Schema 解决了"AI 如何理解项目"的问题，下一个问题是"规划应该放在哪"。

v1.5.0 引入 **Stores** 概念。一个 store 就是一个包含 `openspec/` 目录和 `.openspec-store/store.yaml` 身份文件的普通 Git 仓库。它只做一件事：**持有规划**。团队成员的代码仓库通过 `--store <id>` 或 `config.yaml` 中的指针指向它。

```bash
# 创建一个名为 team-plans 的 store
openspec store setup team-plans --path ~/openspec/team-plans

# 从此，任何命令都可以指向它
openspec new change add-login --store team-plans
openspec status --change add-login --store team-plans
```

团队其他成员：

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

代码仓库只需在 `config.yaml` 中声明一行：

```yaml
store: team-plans
```

此后在该仓库内运行任何 `openspec` 命令，自动指向 `team-plans` 这个 store，无需每次传 `--store` 标志。

Stores 是 Beta 功能，已知限制包括：同一 store id 只能有一个本地 checkout、OpenSpec 不做自动同步（git pull 由你手动完成）。但这恰是刻意设计——store 的版本控制完全由 Git 负责，OpenSpec 不介入。

> v1.4.0 曾引入 workspace/initiative 作为跨仓库规划的尝试，v1.5.0 用 stores 完全取代了这套概念。如果你在 v1.4.0 期间使用了 workspace，需要迁移到 stores；如果从 v1.3.1 直接升级，stores 是全新功能，无需迁移。

## 四、变革三：Explore First——先想清楚，再动手

前两个变革解决的是"怎么做"的问题，第三个解决的是"做什么"。

v1.3.1 的标准入口是 `/opsx:propose`。用户描述需求，AI 直接生成文档。这套流程的问题是：**AI 的"理解"经常和用户的"意图"有偏差**，而偏差要到代码写出来才暴露。

v1.5.0 将 `/opsx:explore` 从实验性功能提升为**推荐的起始点**。Explore 模式不创建任何文件，AI 会先调查代码库、对比方案、画出架构草图，如同一场零成本的头脑风暴。关键决策确认后再进入 `/opsx:propose`。

```text
v1.3.1:  propose → apply → archive
             ↑ 一步到位，偏差风险在后期暴露

v1.5.0:  explore → propose → apply → sync → archive
           ↑                          ↑
      零成本验证意图              归档前确保 spec 同步
```

这个理念贯穿了 v1.5.0 的文档设计——官方文档首页引导读者的第一句话是"Not sure what to build yet? Start with `/opsx:explore`"。

## 五、配套升级

三大变革之外，v1.5.0 还带来了一批基础设施增强：

**AI 工具生态。** 新增 Claude Code、Mistral Vibe、Oh My Pi、Trae 等 adapter，支持 25+ AI 编程助手。每个 adapter 实现统一的 `CommandContent` 接口，新增工具只需一个文件。

**全局安装。** `openspec init` 支持全局目录，团队可共享一套 AI 指令配置，个人项目不再需要重复初始化。

**配置增强。** `config.yaml` 中的容器字段支持 JSON 格式。Validator 的 SHALL/MUST 检测更准确，header 解析改为大小写不敏感。

**官方文档。** 全面重构，从"功能列表"式改为"场景引导"式——探索优先、按操作组织、强调可发现性。

## 六、取舍与升级

**Stores 是 Beta。** 命令名、flag、文件格式和 JSON 输出都可能在后续版本中变动。当前明确不做的事情：自动 clone/pull/push（由 Git 负责）、同一 store id 的多 checkout 支持。

**升级本身很简单：**

```bash
npm install -g @fission-ai/openspec@latest
cd your-project
openspec update
```

`openspec update` 会刷新所有 AI 工具配置文件，无需重新 `init`。

从 v1.3.1 到 v1.5.0，OpenSpec 的核心变化不是功能的堆叠，而是一次架构层面的重思考：**指令从代码变成了数据，规划从附属变成了独立实体，工作流从推送变成了拉取**。对用户而言，最直观的感受就是——AI 终于不再"瞎猜"了。

---

_本文基于对 [OpenSpec](https://github.com/Fission-AI/OpenSpec) v1.3.1 至 v1.5.0 的 diff 和变更日志分析。实践验证见 [OpenSpec Practise v1.5.0](https://github.com/ForceInjection/OpenSpec-practise/releases/tag/v1.5.0)。_
