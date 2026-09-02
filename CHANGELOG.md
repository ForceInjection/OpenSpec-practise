# Changelog

本项目跟随 OpenSpec（[Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec)）版本演进的实践记录。

## v1.11.0 (2026-08-26)

OpenSpec v1.11.0 是一个评审体验升级的迭代，核心变化：

- **`openspec show <change> --diff`** — 查看 change 的精确差异：ADDED 显示全文本，MODIFIED 只显示真正变化的行（colorized unified diff），REMOVED/RENAMED 给出迁移信息，支持 `--json --diff` 供流水线使用
- **`openspec status --all`** — 一条命令查看所有 active changes，JSON 输出稳定排序、单 change 失败不中断扫描
- **explore 写入前确认** — 首个写操作前必须点名 artifacts 并单独征求明确同意，回答澄清问题不再视为同意写入
- **archive 内建 spec 合并** — CLI 不再有独立 `sync` 命令，`openspec archive` 一条命令完成合并 delta + 更新主 spec + 归档，并打印合并统计
- **validate 捕获未写的 Purpose 占位符**（默认 warning，`--strict` 失败）
- **explore 图表纯 ASCII 化**、Fish 补全修正等

本仓库跟进：

- CLI 升级至 1.11.0，通过 `openspec update --force` 刷新全部技能和命令文件
- 7 个文件更新（85 行新增），explore 模板新增写入前确认规则与纯 ASCII 图表约束
- 实践 `cart-query-and-remove` 完整工作流，详见下方

### 完整工作流实践：cart-query-and-remove

用 v1.11.0 工作流（Explore → Propose → Apply → **Archive 内建 sync**）补齐购物车闭环「查询 + 移除」，重点验证了 `show --diff` 新特性：

1. **Explore** — 盘点 spec-code 差距，发现「移除商品」spec 有声明无代码、「查询购物车」代码已有而 spec/HTTP 均缺（双向倒挂）
2. **Propose** — 生成 4 artifacts：ADDED「购物车查询」+ MODIFIED「购物车商品移除」（补不存在商品/多条目隔离场景）；tasks 按 v1.10.0 模板逐条写明验证标准
3. **validate 陷阱** — MODIFIED 中改场景名被拒（场景级无 RENAMED 机制），恢复原名后通过
4. **评审** — `show --diff` 演示两种渲染：ADDED 全文本、MODIFIED 仅显示真正变化的行
5. **Apply** — 双实现新增 `removeItem`/`remove_item` 与 GET/DELETE 路由，Node 14/14、Python 5/5 全绿
6. **Archive** — `openspec archive` 一条命令完成合并（+1 added / ~1 modified）+ 归档，主 spec 保真合并（未提及需求原样保留）

实践产物：`openspec/changes/archive/2026-09-02-cart-query-and-remove/`，主 spec `cart-management` 更新为 4 个 Requirement。详细复盘见 [v1.11.0 工作流实践文档](docs/openspec-v1.11.0-workflow-practice.md)。

## v1.10.0 (2026-08-19)

OpenSpec v1.10.0 是一个小迭代，核心变化：

- **tasks 模板要求验证标准** — 生成的任务必须写明"如何知道完成"（测试/命令/可观察结果），"Implement the thing" 不再合格
- **`openspec init --language`** — 非英语 artifacts 语言声明（SHALL/MUST 保持英文即可校验）
- **Zed Agent 工具支持**、安装脚本清理（不再有 npm allow-scripts 警告）
- **一批修复** — stores specs 指令路径、custom profile 只选 archive 不选 sync 的死角、feedback 标题、telemetry 输出到 stderr 等

本仓库跟进：

- v1.10.0 未单独停留，与 v1.11.0 一并跟进（两者均无 breaking change），CLI 一次性升级至 1.11.0
- v1.10.0 的模板变更（tasks 验证标准）在 v1.11.0 实践 `cart-query-and-remove` 中生效

## v1.9.0 (2026-08-13)

OpenSpec v1.9.0 是一个修复为主的迭代（25 commits），核心变化：

- **`validate --archived`** — 检查归档变更的任务完整性，可作为 CI 钩子
- **Command Code 工具支持** — 新增 `--tools command-code`
- **根解析更严格** — `list`/`validate` 在 OpenSpec 根外运行时明确报错
- **归档保真修复** — sync 时保留 `## Requirements` 周围的空行、EOF 统一为单个换行
- **schema fork 保真** — 保留注释、块标量风格和键顺序

本仓库跟进：

- CLI 升级至 1.9.0，通过 `openspec update --force` 刷新全部技能和命令文件
- 12 个文件更新（256 行新增），模板新增规划边界（planning boundary）声明、能力路径保留、store 标志粘性等改进

## v1.8.0 (2026-08-05)

OpenSpec v1.8.0 是一个中型迭代（34 PRs），核心变化：

- **非英语 spec 验证修复** — SHALL/MUST 在普通模式下改为指导性，中文需求可通过验证（strict 模式仍强制）——**直接影响我们的中文 spec 实践**
- **新工具支持** — 通用 agents 目录、MiniMax Code、Atlassian Rovo Dev CLI、GitHub Copilot 云代理（opt-in）
- **archive 退休能力** — `retire_capabilities: true` 可清理空能力 spec
- **嵌套子任务计数** — tasks.md 的嵌套 checkbox 计入进度
- **validate 提前捕获 scenario 丢失** — MODIFIED 需求会删除 scenario 时在编写期报错
- **遥测配置** — `telemetry.enabled: false` 可关闭

本仓库跟进：

- CLI 升级至 1.8.0（v1.7.0 直接跳级，无 breaking change）

## v1.7.0 (2026-07-28)

OpenSpec v1.7.0 是一个中型迭代（91 commits），核心变化：

- **新增 `/opsx:update` 技能** — 修订既有 change 的规划文档，保持 proposal/specs/design/tasks 之间的一致性，不修改代码
- **模板全面更新** — 移除 Claude 专属工具指令（AskUserQuestion/TodoWrite 改为通用描述），`view` 命令加入 store 支持，spec 描述强调 delta 语义
- **新工具支持** — ZCode、CodeArts Agent、Hermes Agent
- **Skills 发布** — workflow skills 发布至 skills.sh 平台
- **默认 Store** — 每个仓库可设置一个默认 store，简化跨仓库工作流
- **CLI 自动升级提示** — `openspec update` 检测到 CLI 版本过旧时主动提示升级
- **Windsurf 更名** — adapter 跟随更名为 Devin Desktop

本仓库跟进：

- 切换到 core profile（启用官方推荐完整工作流，含 update）
- 通过 `openspec update --force` 刷新全部技能和命令文件
- 新增 `/opsx:update` 命令与 `openspec-update-change` 技能
- 10 个文件更新（479 行新增）+ 2 个新文件

### 完整工作流实践：add-product-search

用 v1.7.0 的完整工作流（Explore → Propose → **Update** → Apply → Sync → Archive）新增「商品搜索与价格排序」功能，重点验证了 `/opsx:update` 新特性：

1. **Explore** — 分析候选需求，选定「按名称搜索」作为最小可验证变更
2. **Propose** — 生成 proposal/specs/design/tasks，声明 Modified Capability（catalog-management）
3. **Update（v1.7.0 新特性）** — 实施前新增「价格排序」需求，4 个 artifacts 一致性修订：
   - 判断排序是 ADDED（新关注点）而非 MODIFIED，避免 archive 时丢失细节
   - specs 新增 4 个 Scenario（升序/降序/组合/无效值）
4. **Apply** — 双实现（Node.js + Python）各改服务层与 HTTP 层，8/8 任务完成，测试全绿（10 + 4 pass）
5. **Sync** — 智能合并到主 spec：MODIFIED 保留未提及内容，ADDED 新增 Requirement
6. **Archive** — 一致性验证后归档至 `changes/archive/2026-07-28-add-product-search/`

实践产物：`openspec/specs/catalog-management/spec.md` 更新为 4 个 Requirement、11 个 Scenario。详细复盘见 [v1.7.0 工作流实践文档](docs/openspec-v1.7.0-workflow-practice.md)。

## v1.6.0 (2026-07-10)

OpenSpec v1.6.0 是一个小型迭代，核心变化：

- **CLI 自动授权** (`allowed-tools: Bash(openspec:*)`) — 所有生成的命令和技能文件新增此声明，AI 执行 `openspec` 命令时不再弹出权限确认，大幅减少操作打断
- **新增 `/opsx:update` 技能** — 支持在 apply 过程中更新规划文档
- **AI 工具扩展** — 新增 Oh My Pi (OMP) 和 Trae 两个 adapter
- **路径解析统一** — `validate`、`view`、`archive` 收敛到统一的 canonical resolution
- **修复** — 空 store 注册失败、archive 校验失败时的退出码错误

本仓库跟进：

- 通过 `openspec update --force` 刷新所有 `.claude/` 技能和命令文件
- 10 个文件更新，15 行新增

## v1.5.0 (2026-06-28)

OpenSpec v1.5.0 是三个版本积累的重大更新。详见 [升级解读文章](docs/openspec-v1.5.0-upgrade.md)。

三大变革：

- **Schema 驱动** — 指令从硬编码 TypeScript 源码抽离为 `schema.yaml`，AI 通过 `openspec instructions --json` 动态获取上下文
- **Stores (Beta)** — 规划成为独立的 Git 仓库，跨仓库统一管理
- **Explore First** — `/opsx:explore` 提升为推荐工作流入口

本仓库跟进：

- AI 工具从 `.qoder/` 迁移至 `.claude/`
- `examples/openspec/` 统一至根级 `openspec/`
- v1-mvp 归档至 `changes/archive/2025-01-27-v1-mvp/`
- 实践 `add-product-get-by-id` 完整 SDD 工作流（Explore→Propose→Apply→Sync→Archive）
- 全量文档升级，中英文对齐

## v1.3.1 (2026-05-07)

初始版本。基于 OpenSpec v1.3.1 的 SDD 实践，包含：

- 电商 MVP 示例（Node.js + Python 双实现）
- OpenSpec 使用手册、实战指南、AI 工作流分析三份文档
- `.qoder/` AI 工具配置
