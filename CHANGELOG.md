# Changelog

本项目跟随 OpenSpec（[Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec)）版本演进的实践记录。

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
