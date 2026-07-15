# Changelog

本项目跟随 OpenSpec（[Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec)）版本演进的实践记录。

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
