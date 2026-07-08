# OpenSpec 使用手册

基于项目的实践经验总结。

## 目录

- [OpenSpec 使用手册](#openspec-使用手册)
  - [目录](#目录)
  - [1. 简介](#1-简介)
    - [1.1 什么是规范驱动开发？](#11-什么是规范驱动开发)
    - [1.2 核心理念](#12-核心理念)
    - [1.3 核心价值](#13-核心价值)
  - [2. 安装](#2-安装)
    - [2.1 前置要求](#21-前置要求)
    - [2.2 安装命令](#22-安装命令)
    - [2.3 验证安装](#23-验证安装)
    - [2.4 配置 Shell 自动补全（可选）](#24-配置-shell-自动补全可选)
  - [3. 项目初始化](#3-项目初始化)
    - [3.1 初始化命令](#31-初始化命令)
    - [3.2 交互式配置](#32-交互式配置)
    - [3.3 非交互模式](#33-非交互模式)
    - [3.4 初始化后的目录结构](#34-初始化后的目录结构)
    - [3.5 各文件说明](#35-各文件说明)
  - [4. 创建变更提案](#4-创建变更提案)
    - [4.1 创建新变更](#41-创建新变更)
    - [4.2 示例：创建 AI Infrastructure CMDB 核心变更](#42-示例创建-ai-infrastructure-cmdb-核心变更)
    - [4.3 变更目录结构详解](#43-变更目录结构详解)
    - [4.4 各文件作用](#44-各文件作用)
    - [4.5 变更的生命周期](#45-变更的生命周期)
  - [5. 文档结构规范](#5-文档结构规范)
    - [5.1 proposal.md - 提案文档](#51-proposalmd---提案文档)
      - [5.1.1 为什么需要这些章节？](#511-为什么需要这些章节)
      - [5.1.2 完整格式模板](#512-完整格式模板)
    - [5.2 specs/ 目录 - 能力规范](#52-specs-目录---能力规范)
      - [目录结构示例](#目录结构示例)
    - [5.3 spec.md - 能力规范格式](#53-specmd---能力规范格式)
      - [5.3.1 格式要点速查表](#531-格式要点速查表)
      - [5.3.2 完整格式模板](#532-完整格式模板)
      - [5.3.3 正确示例](#533-正确示例)
      - [5.3.4 常见错误示例](#534-常见错误示例)
    - [5.4 design.md - 技术设计](#54-designmd---技术设计)
    - [5.5 tasks.md - 任务清单](#55-tasksmd---任务清单)
    - [5.6 格式速查](#56-格式速查)
    - [5.7 模板文件汇总](#57-模板文件汇总)
  - [6. 验证与常见错误](#6-验证与常见错误)
    - [6.1 验证命令](#61-验证命令)
    - [6.2 常见错误及解决方案](#62-常见错误及解决方案)
      - [6.2.1 错误 1：未找到任何 Delta](#621-错误-1未找到任何-delta)
      - [6.2.2 错误 2：需求条目解析失败](#622-错误-2需求条目解析失败)
      - [6.2.3 错误 3：缺少场景块](#623-错误-3缺少场景块)
    - [6.3 调试技巧](#63-调试技巧)
      - [6.3.1 查看 Delta 解析结果](#631-查看-delta-解析结果)
      - [6.3.2 查看变更状态](#632-查看变更状态)
      - [6.3.3 验证检查清单](#633-验证检查清单)
  - [7. 常用命令参考](#7-常用命令参考)
    - [7.1 初始化与创建](#71-初始化与创建)
    - [7.2 查看与验证](#72-查看与验证)
    - [7.3 归档与管理](#73-归档与管理)
    - [7.4 配置与调试](#74-配置与调试)
    - [7.5 全局选项](#75-全局选项)
    - [7.6 命令速查](#76-命令速查)
  - [8. 最佳实践](#8-最佳实践)
    - [8.1 提案编写最佳实践](#81-提案编写最佳实践)
      - [8.1.1 推荐做法](#811-推荐做法)
      - [8.1.2 避免的做法](#812-避免的做法)
      - [8.1.3 示例对比](#813-示例对比)
    - [8.2 规范编写最佳实践](#82-规范编写最佳实践)
      - [8.2.1 推荐做法](#821-推荐做法)
      - [8.2.2 避免的做法](#822-避免的做法)
    - [8.3 场景编写最佳实践](#83-场景编写最佳实践)
      - [8.3.1 Gherkin 格式要点](#831-gherkin-格式要点)
      - [8.3.2 好的场景示例](#832-好的场景示例)
      - [8.3.3 不好的场景示例](#833-不好的场景示例)
    - [8.4 迭代开发最佳实践](#84-迭代开发最佳实践)
    - [8.5 与 AI 协作最佳实践](#85-与-ai-协作最佳实践)
      - [8.5.1 OPSX 斜杠命令（Slash Commands，推荐）](#851-opsx-斜杠命令slash-commands推荐)
      - [8.5.2 与 AI 协作的技巧](#852-与-ai-协作的技巧)
    - [8.6 团队协作最佳实践](#86-团队协作最佳实践)
      - [8.6.1 代码审查清单](#861-代码审查清单)
      - [8.6.2 文档维护](#862-文档维护)
  - [9. 附录](#9-附录)
    - [9.1 支持的 AI 工具](#91-支持的-ai-工具)
    - [9.2 遥测设置](#92-遥测设置)
    - [9.3 常见问题 (FAQ)](#93-常见问题-faq)
      - [9.3.1 Q1：OpenSpec 与 Swagger/OpenAPI 有什么区别？](#931-q1openspec-与-swaggeropenapi-有什么区别)
      - [9.3.2 Q2：已有的项目如何引入 OpenSpec？](#932-q2已有的项目如何引入-openspec)
      - [9.3.3 Q3：规范写完后，AI 不遵循怎么办？](#933-q3规范写完后ai-不遵循怎么办)
      - [9.3.4 Q4：多个变更可以同时进行吗？](#934-q4多个变更可以同时进行吗)
      - [9.3.5 Q5：内部逻辑修改（如数据库状态变更）如何用外部可观察行为描述？](#935-q5内部逻辑修改如数据库状态变更如何用外部可观察行为描述)
      - [9.3.6 Q6：BDD 格式的 Spec（Given/When/Then）是由 AI 编写还是人工编写？](#936-q6bdd-格式的-specgivenwhenthen是由-ai-编写还是人工编写)
      - [9.3.7 Q7：业务逻辑复杂化后（如单方法数百行），如何维护基线 Spec 的可读性？](#937-q7业务逻辑复杂化后如单方法数百行如何维护基线-spec-的可读性)
    - [9.4 参考链接](#94-参考链接)

---

## 1. 简介

OpenSpec 是一个**规范驱动开发（Spec-Driven Development, SDD）框架**，专为 AI 编程助手设计。它通过在编写代码之前先定义规范，确保人与 AI 对需求达成一致。

### 1.1 什么是规范驱动开发？

传统开发流程通常是：需求 → 直接编码 → 测试 → 交付。

规范驱动开发的流程是：**需求 → 编写规范 → 验证规范 → 编码实现**。

这种方式的优势在于：

- 人与 AI 先就"做什么"达成一致，避免返工
- 规范文档作为契约，减少沟通成本
- 规范可以版本化管理，便于追溯

### 1.2 核心理念

| 理念                   | 含义                                                             |
| ---------------------- | ---------------------------------------------------------------- |
| **流动而非僵化**       | 文档可以随时更新，没有严格的阶段门槛                             |
| **迭代而非瀑布**       | 支持增量添加需求，逐步完善                                       |
| **简单而非复杂**       | 只需要 Markdown 文件，无复杂工具链                               |
| **兼顾存量与新建项目** | 既适用于已有代码库（Brownfield），也适用于全新项目（Greenfield） |

> **术语解释**：
>
> - **Brownfield（存量项目）**：指已经存在的、有历史代码的项目。OpenSpec 可以逐步引入，不必重构现有代码。
> - **Greenfield（新建项目）**：指从零开始的新项目。OpenSpec 可以从一开始就建立规范体系。

### 1.3 核心价值

1. **先达成一致再构建**
   - 在编写代码之前，人与 AI 先就规范达成共识
   - 避免 AI 理解偏差导致的返工

2. **保持组织性**
   - 每个变更都有自己的文件夹
   - 包含 proposal（提案）、specs（规范）、design（设计）、tasks（任务）

3. **流动迭代**
   - 随时更新任何文档
   - 没有僵化的阶段门槛

4. **工具兼容**
   - 支持 20+ AI 编程助手（Claude Code、Cursor、Junie、Lingma IDE 等）

---

## 2. 安装

本章节将介绍如何在本地环境中安装 OpenSpec CLI 工具，涵盖从环境检查到多平台包管理器安装的完整步骤，以确保后续操作的顺利执行。

### 2.1 前置要求

- **Node.js**：20.19.0 或更高版本
- **包管理器**：npm、pnpm、yarn 或 bun（任选其一）

> **检查 Node.js 版本**：
>
> ```bash
> node --version
> ```
>
> 如果版本过低，建议使用 [nvm](https://github.com/nvm-sh/nvm) 或 [fnm](https://github.com/Schniz/fnm) 管理 Node.js 版本。

### 2.2 安装命令

使用 npm 安装：

```bash
# 全局安装最新版的 openspec
npm install -g @fission-ai/openspec@latest
```

使用其他包管理器：

```bash
# pnpm（推荐，速度更快）
pnpm add -g @fission-ai/openspec@latest

# yarn
yarn global add @fission-ai/openspec@latest

# bun
bun install -g @fission-ai/openspec@latest
```

### 2.3 验证安装

```bash
# 查看版本号
openspec --version

# 查看帮助信息
openspec --help
```

安装成功后，你将看到类似输出(或者主动执行 `openspec --version` 查看版本号)：

```bash
1.5.0
```

### 2.4 配置 Shell 自动补全（可选）

自 v1.5.0 起，为了避免在某些终端（如 PowerShell）中出现编码问题，Shell 自动补全功能改为**手动开启（Opt-in）**。

如果你希望在终端中使用 `openspec` 的命令补全，可以运行以下命令生成并安装补全脚本（支持 bash、zsh、fish 等）：

```bash
# 查看补全命令帮助
openspec completion --help
```

---

## 3. 项目初始化

项目初始化是引入 OpenSpec 流程的第一步，通过生成标准化的目录结构和 AI 配置文件，为后续的规范驱动开发奠定基础，并自动完成与 IDE 和大模型工具的对接。

### 3.1 初始化命令

`openspec init` 是 OpenSpec 的入口命令，在项目根目录执行后，它会：

1. 引导选择需要集成的 AI 工具（或使用 `--tools` 参数跳过交互）
2. 创建 `openspec/` 工作目录（含 `config.yaml`、`changes/`、`specs/`）
3. 在所选 AI 工具的对应目录下生成斜杠命令和 Skills 文件

```bash
# 进入你的项目目录
cd your-project
# 执行初始化命令
openspec init
```

### 3.2 交互式配置

`openspec init` 默认是交互式的，会询问你要配置哪些 AI 工具：

```bash
? Which AI tools do you want to configure? (Press <space> to select)
❯◉ Claude Code
 ◯ Cursor
 ◯ GitHub Copilot
 ◯ Cline
 ◯ Windsurf
 ...
```

使用空格键选择，回车键确认。

> **Claude Code 用户提示**：如果你使用的是 Claude Code，请选择 **Claude Code**。OpenSpec v1.5.0 对 Claude Code 提供原生支持，会自动在 `.claude/commands/opsx/` 和 `.claude/skills/` 目录生成对应的命令和 Skills 文件。

### 3.3 非交互模式

如果需要在脚本或 CI/CD 环境中使用，可以跳过交互式配置：

```bash
# 跳过所有工具配置
openspec init --tools none

# 配置所有支持的 AI 工具
openspec init --tools all

# 只配置特定工具（逗号分隔）
openspec init --tools claude,cursor

# 配置 Claude Code
openspec init --tools claude
```

**常用工具标识符列表**：

| 工具名称           | `--tools` 参数值 |
| ------------------ | ---------------- |
| Claude Code        | `claude`         |
| Cursor             | `cursor`         |
| JetBrains Junie    | `junie`          |
| Lingma IDE         | `lingma`         |
| ForgeCode          | `forgecode`      |
| IBM Bob            | `bob`            |
| GitHub Copilot     | `github-copilot` |
| Cline              | `cline`          |
| Windsurf           | `windsurf`       |
| Amazon Q Developer | `amazon-q`       |
| Gemini CLI         | `gemini`         |
| Continue           | `continue`       |
| Roo Code           | `roocode`        |

> **完整列表**：运行 `openspec init --help` 可查看当前版本支持的所有工具标识符。

### 3.4 初始化后的目录结构

```text
your-project/
├── openspec/                     # OpenSpec 工作目录
│   ├── config.yaml               # 项目配置（技术栈、约定规则等，注入 AI 请求）
│   ├── changes/                  # 变更提案目录（每个功能/变更一个文件夹）
│   └── specs/                    # 主规范目录（已归档的规范）
├── .claude/                       # Claude Code 专属目录（示例）
│   ├── commands/opsx/            # /opsx 斜杠命令（供 IDE 直接调用）
│   │   ├── propose.md
│   │   ├── explore.md
│   │   ├── apply.md
│   │   └── archive.md
│   └── skills/                   # Agent Skills（AI 自动检测并加载）
│       ├── openspec-propose/SKILL.md
│       ├── openspec-explore/SKILL.md
│       ├── openspec-apply-change/SKILL.md
│       └── openspec-archive-change/SKILL.md
└── ... (项目其他文件)
```

> **注意**：`openspec init` 会根据你选择的 AI 工具，在对应目录生成命令和 Skills 文件。例如，选择 Claude Code 则生成 `.claude/commands/opsx/` 和 `.claude/skills/`，选择 Qoder 则生成 `.qoder/commands/opsx/` 和 `.qoder/skills/`。

### 3.5 各文件说明

| 文件/目录     | 用途                                           | 是否必需 |
| ------------- | ---------------------------------------------- | -------- |
| `config.yaml` | 项目背景、技术栈、约束条件、每类文档的规则注入 | 推荐填写 |
| `changes/`    | 存放活跃的变更提案                             | 必需     |
| `specs/`      | 存放已归档的规范                               | 可选     |

> **与旧版的区别**：v1.0.0 起，`openspec/AGENTS.md` 和 `openspec/project.md` 已移除。项目上下文统一写入 `openspec/config.yaml` 的 `context:` 字段，该字段会被注入到每一次 AI 规划请求中，比旧方式更可靠。

**config.yaml 结构示例**：

```yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  Testing: Jest with React Testing Library
  API: RESTful, documented in docs/api.md
  We maintain backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan for risky changes
  specs:
    - Use Given/When/Then format for scenarios
  design:
    - Include sequence diagrams for complex flows
  tasks:
    - Break tasks into max 2-hour chunks
```

---

## 4. 创建变更提案

在 OpenSpec 中，所有的功能开发、Bug 修复、架构变更都以“变更提案（Change）”为单位进行管理。

### 4.1 创建新变更

**方式一：使用斜杠命令（Slash Commands，推荐，一步完成）**:

```text
/opsx:propose <description>
```

这个命令会：

1. 推断出一个 kebab-case 变更名（如 `add-user-auth`）
2. 创建 `openspec/changes/<name>/`
3. 依次生成 `proposal.md`、`design.md`、`specs/`、`tasks.md` 所有文档

**方式二：仅创建变更目录（扩展工作流 Profile 下使用）**:

斜杠命令：

```text
/opsx:new <change-name>
```

等价 CLI 命令：

```bash
# 仅初始化变更目录结构，不创建任何初始文档
openspec new change <change-name>
```

仅初始化变更目录结构，不创建任何文档；适合配合 `/opsx:continue` 逐步手动生成文档时使用。

**命名建议**：使用 kebab-case（短横线分隔），名称应简洁明了地描述变更内容。

```text
# 好的命名示例
add-user-authentication
add-payment-module
fix-login-timeout

# 不好的命名示例
feature1           # 太模糊
addUserAuth        # 应使用 kebab-case
```

### 4.2 示例：创建 AI Infrastructure CMDB 核心变更

以下示例展示了如何使用斜杠命令快速初始化一个核心业务模块的变更，并由 AI 自动生成全套的骨架文档。

```text
/opsx:propose "实现 AI Infrastructure CMDB 核心功能"
```

AI 将自动创建变更并生成所有规划文档：

```bash
✓ Created change directory: openspec/changes/ai-infra-cmdb-core/
✓ Created proposal.md
✓ Created design.md
✓ Created specs/ directory
  ✓ specs/accelerator-management/spec.md
✓ Created tasks.md
✓ Created .openspec.yaml

Change 'ai-infra-cmdb-core' created successfully!
```

### 4.3 变更目录结构详解

```text
openspec/changes/<change-name>/
├── .openspec.yaml     # 变更元数据（ID、状态、创建时间等，由 CLI 自动管理）
├── proposal.md        # 提案文档【必填】描述 Why 和 What
├── design.md          # 技术设计文档（架构、数据模型、API 设计等）
├── tasks.md           # 实现任务清单（按里程碑组织的待办事项）
└── specs/             # 规范目录（存放能力规范文件）
    ├── <capability-1>/
    │   └── spec.md    # 能力规范（使用 Requirement + Scenario 格式）
    ├── <capability-2>/
    │   └── spec.md
```

### 4.4 各文件作用

| 文件                         | 作用                     | 是否必需 | 格式要求                                                                                              |
| ---------------------------- | ------------------------ | -------- | ----------------------------------------------------------------------------------------------------- |
| `proposal.md`                | 说明“为什么做”和“做什么” | **必需** | 必须包含 `## Why` 和 `## What Changes`（验证器强制检查）；推荐包含 `## Capabilities`（AI 工作流所需） |
| `specs/<capability>/spec.md` | 详细的需求和验收场景     | **必需** | 必须使用 Delta Header + Requirement + Scenario 格式                                                   |
| `design.md`                  | 技术实现方案             | 推荐     | 无严格格式要求                                                                                        |
| `tasks.md`                   | 实现任务清单             | 推荐     | 无严格格式要求                                                                                        |

### 4.5 变更的生命周期

```text
提案 (斜杠命令) → 编写规范 → 验证 (validate) → 实现 (apply) → 归档 (archive)
```

1. **提案**：`/opsx:propose <description>`（一步生成所有规划文档）
2. **编写规范**：编辑 proposal.md 和 specs/
3. **验证**：`openspec validate <name>`
4. **实现**：`/opsx:apply` 按照 tasks.md 执行开发
5. **归档**：`/opsx:archive` 将变更中的规范增量（Delta）合并回 `openspec/specs/` 主规范目录，并清理 `openspec/changes/` 下的临时目录，标志着该功能规范已正式「上线」

---

## 5. 文档结构规范

OpenSpec 强调文档的结构化和规范化，通过明确定义 `proposal.md` 的提案架构和 `spec.md` 的能力场景契约，确保 AI 助手和开发人员能够无歧义地解析需求并生成可靠的代码。**请务必遵循这些格式，否则 `openspec validate` 会失败。**

> **模板文件**：OpenSpec 内置了所有文档模板，可通过 `openspec templates` 命令查看各模板路径，或直接使用 `/opsx:propose` / `/opsx:new` 斜杠命令自动生成完整文档。

### 5.1 proposal.md - 提案文档

**核心要求：** proposal.md 必须包含 `## Why` 和 `## What Changes` 两个验证器强制检查的必需章节；推荐包含 `## Capabilities` 章节，作为 AI 自动生成 `specs/<name>/spec.md` 文件的关键输入。

#### 5.1.1 为什么需要这些章节？

OpenSpec 的设计理念是“先想清楚为什么做，再决定做什么，再明确影响哪些能力”：

- `## Why` - 说明变更的背景、问题和动机（**验证器强制检查**）
- `## What Changes` - 说明具体要添加、修改或删除什么（**验证器强制检查**）
- `## Capabilities` - 列出 New / Modified Capabilities，驱动 `specs/<name>/spec.md` 文件的生成（**推荐，AI 工作流所需**）

#### 5.1.2 完整格式模板

> 内置模板路径可通过 `openspec templates` 命令查看；`/opsx:propose` 斜杠命令会自动生成填充好的完整提案。

必需章节结构：

```text
proposal.md 结构：
├── ## Why 【必需 - 验证器强制检查】
│   ├── ### Background（背景）
│   ├── ### Problem Statement（问题描述）
│   └── ### Alternatives Considered（备选方案）
├── ## What Changes 【必需 - 验证器强制检查】
│   ├── ### New Resources Added（新增资源）
│   └── ### New Capabilities（功能点简述，自然语言概括即可）
├── ## Capabilities 【推荐 - AI 工作流所需，驱动 spec 文件生成】
│   ├── ### New Capabilities（kebab-case 标识符列表，每项对应 specs/<name>/ 目录）
│   └── ### Modified Capabilities（已有能力的 requirement 变更）
├── ## Impact（影响范围）
├── ## Scope（范围，可选）
│   ├── ### In Scope
│   └── ### Out of Scope
├── ## Goals（成功标准，可选）
└── ## References（参考链接，可选）
```

**注意**：章节标题必须完全匹配 `## Why` 和 `## What Changes`（区分大小写）。

### 5.2 specs/ 目录 - 能力规范

**核心要求：** specs/ 必须使用能力文件夹（capability folders），每个能力一个文件夹。

#### 目录结构示例

```text
specs/
├── accelerator-management/     # 能力一：加速器管理
│   └── spec.md
├── training-job-lifecycle/     # 能力二：训练任务生命周期
│   └── spec.md
├── inference-service/          # 能力三：推理服务
│   └── spec.md
└── relationship-management/    # 能力四：关系管理
    └── spec.md
```

**重要规则**：

- 不要在 specs/ 根目录直接放置 spec.md 文件
- 每个能力文件夹名称使用 kebab-case
- 文件夹名称应体现能力领域

### 5.3 spec.md - 能力规范格式

**核心要求：** 必须使用 Delta Header + Requirement + Scenario 格式。

#### 5.3.1 格式要点速查表

| 元素         | 格式                                     | 示例                             |
| ------------ | ---------------------------------------- | -------------------------------- |
| Delta Header | `## ADDED/MODIFIED/REMOVED Requirements` | `## ADDED Requirements`          |
| 需求标题     | `### Requirement: <标题>`                | `### Requirement: GPU 自动发现`  |
| 场景标题     | `#### Scenario: <标题>`                  | `#### Scenario: NVIDIA GPU 发现` |
| 场景内容     | Gherkin 格式                             | `Given/When/Then`                |

**Delta Header 选择说明**：

| Delta Header               | 适用场景                            |
| -------------------------- | ----------------------------------- |
| `## ADDED Requirements`    | 本次变更新增的能力或需求            |
| `## MODIFIED Requirements` | 对已有规范中某个 Requirement 的修改 |
| `## REMOVED Requirements`  | 明确废弃或删除的需求                |

#### 5.3.2 完整格式模板

> 内置模板路径可通过 `openspec templates` 查看。

必需格式结构：

```text
spec.md 结构：
├── # 能力名称
├── ## Overview（概述，推荐）
│   - 能力简介
│   - 解决的问题
└── ## ADDED/MODIFIED/REMOVED Requirements 【必需】
    ├── ### Requirement: <标题>
    │   ├── **Priority**: P0/P1/P2
    │   ├── **Rationale**: ...
    │   └── #### Scenario: <标题>
    │       └── Given/When/Then
```

#### 5.3.3 正确示例

> 以下示例展示核心 Requirement + Scenario 结构。完整示例（含 `## Overview` 段落）参见 `openspec/changes/archive/2025-01-27-v1-mvp/specs/domain-model/spec.md`（电商领域模型规范）：

```markdown
## ADDED Requirements

### Requirement: 商品实体定义

系统 SHALL 定义商品实体，包含唯一标识、名称、价格和库存。

**Priority**: P0 (Critical)

**Rationale**: 商品是电商系统的核心实体，是所有交易的基础。

#### Scenario: 创建有效商品

Given 需要创建新商品
When 提供商品信息 { id, name, priceCents, stock }
Then 商品实体创建成功
And id 格式为 prod_xxxx
And priceCents >= 0
And stock >= 0
```

#### 5.3.4 常见错误示例

❌ **错误示例**：

```markdown
## ADDED Requirements

### REQ-001: GPU Discovery # 错误：使用了自定义编号

System SHALL discover GPUs.

#### Scenario: Discovery # 错误：场景标题太模糊
```

✅ **正确写法**：

```markdown
## ADDED Requirements

### Requirement: GPU 自动发现 # 正确：使用标准格式

系统应自动发现集群中的 GPU 设备。

**Priority**: P0 (Critical)

**Rationale**: 核心功能需求。

#### Scenario: NVIDIA GPU 发现 # 正确：场景标题具体

Given 一个包含 NVIDIA GPU 节点的 Kubernetes 集群
When 发现代理部署到集群
Then 所有 NVIDIA GPU 被枚举并记录到 CMDB
```

### 5.4 design.md - 技术设计

技术设计文档没有严格的格式要求，但建议包含以下章节。

> 内置模板路径可通过 `openspec templates` 查看。

**建议章节结构**：

| 章节名称              | 建议内容                                                     |
| --------------------- | ------------------------------------------------------------ |
| Architecture Overview | 系统整体架构图（建议使用 Mermaid 或 ASCII 图）及层次关系说明 |
| Core Components       | 核心模块列表，每个模块的职责、边界和内部实现要点             |
| Data Model            | 关键实体的字段定义、类型、约束及实体间关系                   |
| API Design            | 接口路由、请求/响应格式、错误码规范                          |
| Integration Patterns  | 与外部系统/模块的集成方式，包括事件、队列、同步调用等        |
| Technology Stack      | 所选技术及库、选型理由和备选方案对比                         |
| Security              | 身份认证、权限控制、数据加密、输入校验等安全设计要点         |
| Deployment            | 环境要求、部署步骤、回滚方案                                 |

### 5.5 tasks.md - 任务清单

任务清单用于将设计拆解为可执行的实现步骤。建议按里程碑组织，使用 GitHub 风格的 Markdown 任务列表，以便在 IDE 中直接勾选。

> 内置模板路径可通过 `openspec templates` 查看。

**建议章节结构**：

- **Milestone**：按里程碑对实现步骤分组（如 M1 基础层、M2 API 层、M3 测试）。每个任务拆小，确保单个任务可在 2 小时内完成。
- **Definition of Done**：列出此里程碑的完成标准，如代码通过 CI、测试覆盖率达标、spec validate 通过等。
- **Progress Tracking**：利用 `- [x]` / `- [ ]` 标记完成进度，方便 IDE 内直观查看。

**示例**：

```markdown
## Milestone 1 - Domain Model

### Definition of Done

- 完成所有 P0 Requirement 的实现
- `openspec validate v1-mvp` 验证通过
- 单元测试覆盖所有领域实体

### Tasks

- [x] 定义 Product 实体类型（id、name、priceCents、stock）
- [x] 定义 Cart / CartItem 实体类型
- [ ] 定义 Order / OrderItem 实体类型
- [ ] 实现领域实体的编排验证逻辑

## Milestone 2 - Service Layer

### Definition of Done

- 所有服务方法均有对应集成测试

### Tasks

- [ ] 实现 CatalogService.getProduct / listProducts
- [ ] 实现 CartService.addItem / removeItem
- [ ] 实现 OrderService.checkout
```

### 5.6 格式速查

**proposal.md 必需章节**：

```text
├── ## Why 【必需 - 验证器强制检查】
│   ├── ### Background
│   ├── ### Problem Statement
│   └── ### Alternatives Considered
├── ## What Changes 【必需 - 验证器强制检查】
│   ├── ### New Resources Added
│   └── ### New Capabilities
└── ## Capabilities 【推荐 - AI 工作流所需，驱动 spec 文件生成】
    ├── ### New Capabilities
    └── ### Modified Capabilities
```

**specs/\[capability\]/spec.md 必需格式**：

```text
├── # 能力名称
├── ## Overview（推荐）
└── ## ADDED/MODIFIED/REMOVED Requirements 【必需】
    ├── ### Requirement: <标题>
    │   ├── **Priority**: P0/P1/P2
    │   ├── **Rationale**: ...
    │   └── #### Scenario: <标题>
    │       └── Given/When/Then
```

### 5.7 模板文件汇总

| 模板             | 对应内置文件（通过 `openspec templates` 查看完整路径） | 用途         |
| ---------------- | ------------------------------------------------------ | ------------ |
| proposal.md 模板 | `schemas/spec-driven/templates/proposal.md`            | 提案文档模板 |
| spec.md 模板     | `schemas/spec-driven/templates/spec.md`                | 能力规范模板 |
| design.md 模板   | `schemas/spec-driven/templates/design.md`              | 技术设计模板 |
| tasks.md 模板    | `schemas/spec-driven/templates/tasks.md`               | 任务清单模板 |

---

## 6. 验证与常见错误

在完成规范文档编写后，通过严格的本地校验流程可以提前拦截格式与结构问题，确保文档完全符合 OpenSpec 语法规范，从而为后续的 AI 自动化执行提供准确无误的输入。

### 6.1 验证命令

完成文档编写后，使用验证命令检查格式是否正确：

```bash
# 验证指定的变更文档是否符合格式要求
openspec validate <change-name>
```

验证成功时显示：

```bash
Change '<change-name>' is valid
```

验证失败时会显示具体错误信息。

### 6.2 常见错误及解决方案

#### 6.2.1 错误 1：未找到任何 Delta

**错误信息**：

```bash
✗ [ERROR] file: Change must have at least one delta. No deltas found. Ensure your change has a specs/ directory with capability folders (e.g. specs/http-server/spec.md) containing .md files that use delta headers (## ADDED/MODIFIED/REMOVED/RENAMED Requirements) and that each requirement includes at least one "#### Scenario:" block. Tip: run "openspec change show <change-id> --json --deltas-only" to inspect parsed deltas.
```

**原因**：specs/ 目录结构不正确，或者缺少有效的 Delta Header。

**解决方案**：

1. 确保 specs/ 下有能力文件夹：

   ```text
   specs/
   └── your-capability/      # 能力文件夹
       └── spec.md           # 规范文件
   ```

2. 确保 spec.md 中有 Delta Header：

   ```markdown
   ## ADDED Requirements

   ### Requirement: 某个需求

   ...
   ```

**常见错误**：

```text
specs/
└── spec.md              # ❌ 错误：直接放在 specs/ 根目录
```

---

#### 6.2.2 错误 2：需求条目解析失败

**错误信息**：

```bash
✗ [ERROR] cap1/spec.md: Delta sections ## ADDED Requirements were found, but no requirement entries parsed. Ensure each section includes at least one "### Requirement:" block (REMOVED may use bullet list syntax).
```

**原因**：需求标题格式不正确。

**错误示例**：

```markdown
## ADDED Requirements

### REQ-001: GPU Discovery # ❌ 错误：使用了自定义编号

### GPU Discovery # ❌ 错误：缺少 "Requirement:" 前缀

### requirement: GPU Discovery # ❌ 错误："requirement" 应首字母大写
```

**正确格式**：

```markdown
## ADDED Requirements

### Requirement: GPU 自动发现 # ✓ 正确格式
```

---

#### 6.2.3 错误 3：缺少场景块

**错误信息**：

```bash
✗ [ERROR] cap1/spec.md: ADDED "test" must include at least one scenario
```

**原因**：每个需求必须至少有一个场景。

**错误示例**：

```markdown
### Requirement: GPU 自动发现

系统应自动发现 GPU 设备。

# ❌ 没有场景块
```

**正确格式**：

```markdown
### Requirement: GPU 自动发现

系统应自动发现 GPU 设备。

**Priority**: P0 (Critical)

**Rationale**: 核心功能需求。

#### Scenario: NVIDIA GPU 发现

Given 一个包含 NVIDIA GPU 节点的 Kubernetes 集群
When 发现代理部署到集群
Then 所有 NVIDIA GPU 被枚举并记录到 CMDB
```

### 6.3 调试技巧

#### 6.3.1 查看 Delta 解析结果

如果验证失败但不确定原因，可以查看解析后的结构：

```bash
# 查看解析后的 Delta 结构信息
openspec show <change-name> --json --deltas-only
```

这会输出 JSON 格式的解析结果，帮助你了解 OpenSpec 是如何解析你的文档的。

#### 6.3.2 查看变更状态

```bash
# 查看当前变更的状态与文档完成进度
openspec status --change <change-name>
```

> **提示**：自 v1.5.0 起，如果当前不存在任何变更，`openspec status` 命令会优雅地退出（提示无变更），而不再抛出致命错误。

输出示例：

```bash
Change: ai-infra-cmdb-core
Schema: spec-driven
Progress: 1/4 artifacts complete

[x] proposal
[ ] design
[ ] specs
[-] tasks (blocked by: design, specs)
```

#### 6.3.3 验证检查清单

在运行 `openspec validate` 之前，请确认：

- [ ] **proposal.md** 包含 `## Why` 章节
- [ ] **proposal.md** 包含 `## What Changes` 章节
- [ ] **specs/** 下有能力文件夹（不是直接的 spec.md）
- [ ] 每个 **spec.md** 包含 Delta Header（`## ADDED/MODIFIED/REMOVED Requirements`）
- [ ] 每个需求使用 `### Requirement: <标题>` 格式
- [ ] 每个需求至少有一个 `#### Scenario: <标题>` 块
- [ ] 每个 Scenario 使用 Gherkin 格式（Given/When/Then）

---

## 7. 常用命令参考

OpenSpec CLI 提供了一套完整的命令行工具，用于管理从项目初始化、变更提案创建、规范验证到最终归档的全生命周期。本节整理了日常开发中最常用的命令及其典型使用场景。

### 7.1 初始化与创建

| 命令                         | 说明                   | 示例                                |
| ---------------------------- | ---------------------- | ----------------------------------- |
| `openspec init`              | 初始化 OpenSpec 项目   | `openspec init --tools claude`      |
| `openspec new change <name>` | 仅创建变更目录结构     | `openspec new change add-user-auth` |
| `openspec update`            | 更新 AI 技能和命令文件 | `openspec update`                   |

### 7.2 查看与验证

| 命令                              | 说明             | 示例                                           |
| --------------------------------- | ---------------- | ---------------------------------------------- |
| `openspec view`                   | 打开终端交互界面 | `openspec view`                                |
| `openspec status --change <name>` | 查看变更状态     | `openspec status --change user-auth`           |
| `openspec validate <name>`        | 验证变更文档格式 | `openspec validate user-auth`                  |
| `openspec list --changes`         | 列出所有变更     | `openspec list --changes`                      |
| `openspec list --specs`           | 列出所有规范     | `openspec list --specs`                        |
| `openspec show <name>`            | 显示变更详情     | `openspec show user-auth --json --deltas-only` |

### 7.3 归档与管理

| 命令                      | 说明                                                                          | 示例                         |
| ------------------------- | ----------------------------------------------------------------------------- | ---------------------------- |
| `openspec archive <name>` | 归档已完成的变更（将 Delta 合并至 `specs/` 主目录并清理 `changes/` 临时目录） | `openspec archive user-auth` |

### 7.4 配置与调试

| 命令                      | 说明                       | 示例                      |
| ------------------------- | -------------------------- | ------------------------- |
| `openspec config list`    | 查看当前配置               | `openspec config list`    |
| `openspec config profile` | 设置工作流 Profile         | `openspec config profile` |
| `openspec templates`      | 查看内置文档模板的绝对路径 | `openspec templates`      |
| `openspec schemas`        | 列出可用 Schema            | `openspec schemas`        |
| `openspec --version`      | 查看版本号                 | `openspec --version`      |
| `openspec --help`         | 查看帮助信息               | `openspec --help`         |

### 7.5 全局选项

```bash
openspec [options] <command>

选项：
  -V, --version     显示版本号
  -h, --help        显示帮助信息
  --no-color        禁用彩色输出
```

> **注意**：`--json` 是各命令的独立选项，不是全局选项。例如 `openspec show <name> --json` 或 `openspec validate --json`。

### 7.6 命令速查

常用命令快速参考：

```bash
# 初始化项目
openspec init --tools none

# 创建变更目录（仅创建目录，不生成文档）
openspec new change <name>

# 列出所有变更 / 规范
openspec list --changes
openspec list --specs

# 验证变更
openspec validate <name>

# 查看状态
openspec status --change <name>

# 归档变更
openspec archive <name>

# 更新工具文件
openspec update
```

---

## 8. 最佳实践

基于多个项目的实际落地经验，本节提炼了在编写提案、设计规范场景以及与 AI 助手协同工作时的最佳实践策略，帮助团队规避常见陷阱，最大化释放规范驱动开发的效能。

### 8.1 提案编写最佳实践

编写提案的核心在于清晰传达业务意图与系统边界。一份优秀的提案能够让团队成员与 AI 迅速理解项目背景，并为后续的技术实现划定明确的验收范围。

#### 8.1.1 推荐做法

- **先写 Why 再写 What**：先说明为什么需要这个变更，再说明具体改什么
- **保持简洁**：proposal.md 应该是高层次的概述，详细内容放在 specs/ 中
- **明确范围**：清楚说明 In Scope 和 Out of Scope
- **提供背景**：让 AI 和团队成员都能理解上下文

#### 8.1.2 避免的做法

- 在 proposal.md 中写详细的 API 定义（应放在 specs/ 或 design.md）
- 使用模糊的描述如"优化性能"、"改进体验"（应具体说明目标和指标）
- 忽略 Alternatives Considered 章节（说明为什么选择当前方案很重要）

#### 8.1.3 示例对比

❌ **不好的 Why 章节**：

```markdown
## Why

我们需要添加用户认证功能。
```

✅ **好的 Why 章节**：

```markdown
## Why

### Background

当前系统没有用户认证功能，任何人都可以访问所有数据和功能。
这导致：

- 无法追踪操作日志的责任人
- 敏感数据缺乏保护
- 无法实现细粒度的权限控制

### Problem Statement

系统需要一个安全可靠的用户认证机制，支持：

- 用户名密码登录
- 第三方 OAuth 登录（GitHub、Google）
- 会话管理和安全退出

### Alternatives Considered

1. **自建认证系统**：完全控制，但开发维护成本高
2. **使用 Auth0**：功能完善，但费用较高
3. **使用 Keycloak**：开源免费，支持多种协议 ✓ 已选择此方案
```

### 8.2 规范编写最佳实践

规范编写旨在建立清晰的需求契约。合理的模块划分与适中的需求粒度不仅能提升文档的可读性，还能为 AI 提供精确的上下文。

#### 8.2.1 推荐做法

- **一个能力一个文件夹**：按功能领域划分能力
- **需求粒度适中**：每个需求应该是可测试的单一功能点
- **场景具体化**：使用具体的 Gherkin 场景描述行为
- **优先级标注**：为每个需求标注 P0/P1/P2 优先级
- **添加 Rationale**：说明为什么需要这个需求

#### 8.2.2 避免的做法

- 在一个 spec.md 中放多个不相关的能力
- 需求过于宽泛（如"系统应该快"）
- 场景太模糊（如"系统应该工作"）

### 8.3 场景编写最佳实践

场景描述是连接业务语言与技术验证的桥梁。采用标准的 Gherkin 语法能够消除歧义，确保每个场景都能转化为明确的可执行测试。

#### 8.3.1 Gherkin 格式要点

| 关键字  | 用途                       | 示例                          |
| ------- | -------------------------- | ----------------------------- |
| `Given` | 前置条件，描述系统初始状态 | `Given 用户已登录系统`        |
| `When`  | 触发动作                   | `When 用户点击"提交订单"按钮` |
| `Then`  | 预期结果                   | `Then 订单状态变为"待支付"`   |
| `And`   | 连接多个条件或结果         | `And 用户收到订单确认邮件`    |

#### 8.3.2 好的场景示例

```gherkin
Scenario: 使用信用卡支付订单

Given 用户已登录系统
And 购物车中有 2 件商品，总价 299 元
And 用户已绑定信用卡
When 用户选择"信用卡支付"并确认
Then 订单创建成功
And 从信用卡扣除 299 元
And 用户收到支付成功通知
And 库存减少 2 件
```

#### 8.3.3 不好的场景示例

```gherkin
Scenario: 支付

Given 系统
When 支付
Then 成功
```

**问题**：

- 太模糊，无法验证
- 缺少具体的前置条件
- 没有明确的预期结果

### 8.4 迭代开发最佳实践

规范驱动并非僵化的瀑布流，而是拥抱变化的增量过程。在迭代开发中，保持文档与代码的同步更新，是维持系统一致性的关键。

- **增量添加**：可以随时添加新的需求到变更中
- **频繁验证**：使用 `openspec validate` 确保格式正确
- **版本控制**：将 OpenSpec 文档纳入 Git 管理
- **及时归档**：完成开发后使用 `openspec archive` 归档变更
- **存量项目（Brownfield）优先从小处入手**：对于已有历史代码的项目，建议从一个小的、相对独立的功能开始创建第一个 Change，逐步建立规范体系，不要试图一次性为所有旧代码补规范

### 8.5 与 AI 协作最佳实践

充分发挥大模型潜力的关键在于合理利用工作流指令和上下文管理。通过结构化的交互模式，可以有效降低 AI 的幻觉并提升代码生成质量。

#### 8.5.1 OPSX 斜杠命令（Slash Commands，推荐）

OpenSpec 1.0+ 引入了全新的 OPSX 工作流，替换了旧版的阶段锁定模式。所有命令均通过 `openspec init` 安装到 AI 工具对应目录。

**默认 Core 配置（常用 4 个命令）**:

| 命令                          | 作用                                                                                                              |
| :---------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| `/opsx:propose <description>` | 一步创建变更并**智能生成**所有规划文档（AI 基于描述自动推断 kebab-case 目录名并填充 proposal/design/specs/tasks） |
| `/opsx:explore`               | 进入探索模式，思考问题、调查代码库，不写代码                                                                      |
| `/opsx:apply`                 | 按照 tasks.md 实现任务                                                                                            |
| `/opsx:archive`               | 完成并归档当前变更                                                                                                |

**扩展工作流命令（通过 `openspec config profile` 开启）**

| 命令                 | 作用                                 |
| :------------------- | :----------------------------------- |
| `/opsx:new`          | 仅初始化变更目录结构，不创建文档     |
| `/opsx:continue`     | 按依赖顺序创建下一个文档（逐步模式） |
| `/opsx:ff`           | 快进生成所有规划文档（一步到位）     |
| `/opsx:verify`       | 验证实现是否与规范一致               |
| `/opsx:sync`         | 将 Delta Spec 合并到主规范（不归档） |
| `/opsx:bulk-archive` | 批量归档多个已完成的变更             |
| `/opsx:onboard`      | 带教 15 分钟全流程引导，适合新手上手 |

> **迁移说明**：旧版命令（`/openspec:proposal`、`/openspec:apply`、`/openspec:archive`）已在 v1.0.0 移除。修复映射关系：
>
> - `/openspec:proposal` → `/opsx:propose`
> - `/openspec:apply` → `/opsx:apply`
> - `/openspec:archive` → `/opsx:archive`

**v1.5.0 新特性**：

- **Explore First（探索优先）**：通过 `/opsx:explore` 命令在不确定方案时先进入探索模式，系统性思考问题、调查代码库，明确后再提案，避免盲目开发。
- **Fluid Workflow（流式迭代）**：强化文档随时可编辑、无阶段锁定的迭代体验，支持在实现过程中自由调整规划文档，真正实现「流动而非僵化」。
- **Stores（跨仓库规划）**：支持跨多个仓库统一管理规范，适合微服务架构下的多项目协作场景。结合 `/opsx:sync` 命令，可将 Delta 规范同步到统一的主规范仓库。

#### 8.5.2 与 AI 协作的技巧

1. **先探索后提案**：不确定时先用 `/opsx:explore` 思考，明确后再 `/opsx:propose`
2. **支持流动迭代**：实现过程发现设计错误？直接编辑对应文档即可，无阶段锁定
3. **定期清理对话上下文**：开始实现任务前，建议清空当前对话上下文，确保高质量的指令注入效果
4. **增量迭代**：完成一个需求后验证，再进行下一个

### 8.6 团队协作最佳实践

将 OpenSpec 融入团队现有的研发流程中，需要建立配套的审查机制与文档维护习惯，从而确保规范体系在长期协作中不被破坏。

#### 8.6.1 代码审查清单

在 PR 审查时，检查 OpenSpec 文档：

- [ ] proposal.md 有清晰的 Why 和 What
- [ ] 每个 Requirement 都有至少一个 Scenario
- [ ] Scenario 使用标准的 Gherkin 格式
- [ ] 优先级标注合理
- [ ] 没有遗漏重要的边界场景

#### 8.6.2 文档维护

- **保持更新**：实现过程中如果发现规范需要调整，及时更新文档
- **同步修改**：如果需求变更，先更新 spec.md 再修改代码
- **归档记录**：归档的变更应保留历史记录，便于追溯

---

## 9. 附录

本附录提供了 OpenSpec 支持的第三方生态工具列表、系统高级配置说明以及常见问题的详细解答，供开发者在遇到特定需求或环境适配时参考。

### 9.1 支持的 AI 工具

OpenSpec 支持 20+ AI 编程助手，以下是常用工具：

| 工具                   | 类型         | 支持程度                                                |
| ---------------------- | ------------ | ------------------------------------------------------- |
| **Claude Code**        | CLI + IDE    | 完全支持                                                |
| **Qoder**              | IDE          | 完全支持                                                |
| **Cursor**             | IDE          | 完全支持                                                |
| **JetBrains Junie**    | IDE 插件     | 完全支持                                                |
| **Lingma IDE**         | IDE 插件     | 完全支持                                                |
| **ForgeCode**          | IDE 插件     | 完全支持                                                |
| **IBM Bob**            | IDE 插件     | 完全支持                                                |
| **GitHub Copilot**     | IDE 插件     | 完全支持                                                |
| **Cline**              | VS Code 插件 | 完全支持                                                |
| **Windsurf**           | IDE          | 完全支持                                                |
| **Amazon Q Developer** | IDE 插件     | 完全支持                                                |
| **Gemini CLI**         | CLI          | 完全支持                                                |
| **Continue**           | IDE 插件     | 完全支持                                                |
| **Aider**              | CLI          | 支持（命令行工具，不支持 `openspec init` 自动生成指令） |
| **Roo Code**           | VS Code 插件 | 完全支持                                                |

### 9.2 遥测设置

OpenSpec 收集匿名使用统计数据，用于改进产品。如需禁用：

```bash
# 方法一：设置环境变量
export OPENSPEC_TELEMETRY=0

# 方法二：使用通用遥测禁用标志
export DO_NOT_TRACK=1

# 方法三：在 shell 配置文件中永久设置
echo 'export OPENSPEC_TELEMETRY=0' >> ~/.zshrc  # Zsh
echo 'export OPENSPEC_TELEMETRY=0' >> ~/.bashrc # Bash
```

### 9.3 常见问题 (FAQ)

在使用 OpenSpec 的过程中，团队通常会在规范边界、AI 协作边界以及规范演进等方面遇到一些典型困惑，以下整理了最常见的实践问题与解答，帮助开发团队更准确地理解 Spec 驱动的核心理念。

#### 9.3.1 Q1：OpenSpec 与 Swagger/OpenAPI 有什么区别？

OpenSpec 与 OpenAPI 在软件开发生命周期中扮演着不同但互补的角色，前者侧重于业务行为约束，后者侧重于接口技术契约。

| 特性     | OpenSpec               | OpenAPI/Swagger      |
| -------- | ---------------------- | -------------------- |
| 主要用途 | 需求规范驱动开发       | API 接口文档         |
| 文档类型 | Markdown               | YAML/JSON            |
| 验证方式 | CLI 验证 + AI 理解     | 语法验证             |
| 适用阶段 | 开发前期（需求定义）   | 开发中期（接口定义） |
| 目标用户 | 产品经理 + 开发者 + AI | 开发者 + 前端        |

两者可以配合使用：先用 OpenSpec 定义需求和场景，再用 OpenAPI 定义接口细节。

#### 9.3.2 Q2：已有的项目如何引入 OpenSpec？

引入 OpenSpec 不需要推翻重来，可以通过渐进式的增量方式（Brownfield-first）平滑融入现有代码库。

1. 在项目根目录运行 `openspec init --tools none` 初始化配置。
2. 为下一个新功能或重构任务创建变更提案（Proposal）。
3. 逐步建立规范体系，按需覆盖核心功能，不需要一次性补充所有存量历史功能的规范。

#### 9.3.3 Q3：规范写完后，AI 不遵循怎么办？

AI 在执行过程中偏离规范通常是由于上下文未正确加载或约束条件不够明确，可以通过以下方式校准行为。

1. 运行 `openspec update` 刷新 Skills 和命令文件。
2. 重启 IDE 使斜杠命令生效。
3. 在 `openspec/config.yaml` 的 `rules:` 字段添加具体的强制性约束条件。
4. 使用 `/opsx:apply` 让 AI 从详细的任务清单（Tasks）开始逐步实现，而不是直接丢给 AI 宽泛的编写代码指令。

#### 9.3.4 Q4：多个变更可以同时进行吗？

OpenSpec 的变更目录设计天然支持并行工作流，但需要合理管理依赖关系。

可以同时进行多个变更。每个变更都是独立的文件夹，互不干扰。但为了降低合并冲突的风险，建议：

- 规划时尽量避免并行变更之间的业务或代码依赖。
- 采用小步快跑的策略，完成一个变更并归档（Archive）后再创建下一个。

#### 9.3.5 Q5：内部逻辑修改（如数据库状态变更）如何用外部可观察行为描述？

OpenSpec 强调“外部可观察行为”，但这不仅限于前端界面的变化，也包含系统间交互与持久化状态的改变。对于纯内部逻辑（例如某条件变化仅反映在数据库中），可通过以下方式处理以保持规范的一致性。

- **暴露测试边界**：将数据库或缓存的最终状态视为可验证的“可观察结果”。在 Spec 中，可以将这些持久化状态的变化作为场景的断言条件（例如：订单创建后，库存数据精确减少对应的数量）。
- **区分业务契约与实现细节**：如果内部逻辑的改变影响了下游系统的数据结构或业务规则，则属于契约变更，必须在 Spec 中明确；如果仅仅是代码重构（如更换算法而不改变结果），则完全不需要在 Spec 中体现，此类内容应归入 `design.md` 或 `tasks.md` 中。

#### 9.3.6 Q6：BDD 格式的 Spec（Given/When/Then）是由 AI 编写还是人工编写？

为了保证业务逻辑的准确性与规范的稳定性，团队应当采用**人工主导设计、AI 辅助生成**的协同模式。

- **人工主导核心逻辑**：核心业务场景（如主流程与关键异常路径）必须由架构师或研发人员主导设计，确保业务意图不发生偏移。
- **AI 辅助补全与格式化**：AI 非常适合将非结构化的自然语言需求转化为标准的 BDD（Given/When/Then）格式，或者在核心场景基础上自动推演补充边缘场景。
- **人工评审闭环**：所有 AI 生成或修改的 Spec 必须经过人工评审。完全依赖 AI 从零生成往往会导致场景不稳定、细节遗漏或偏离真实业务诉求。

#### 9.3.7 Q7：业务逻辑复杂化后（如单方法数百行），如何维护基线 Spec 的可读性？

复杂业务逻辑往往导致 Spec 难以阅读，此时需要通过架构拆分与表达方式优化来维持文档的清晰度与可维护性。

- **领域与模块拆分**：当单一业务场景过于庞大时，应遵循领域驱动设计（DDD）原则，将复杂的流程拆解为独立的子领域或模块，并为每个模块建立独立的子 Spec 文件，避免单文件无限膨胀。
- **提升抽象层级**：Spec 的核心在于描述“业务规则与输入输出契约”，而非代码的执行控制流。严禁在 Spec 中堆砌类似代码的条件分支，对于复杂的规则组合，推荐使用 Markdown 决策表（Decision Table）进行高密度、结构化的表达。
- **反向推动代码重构**：如果单方法长达数百行导致 Spec 难以对应，这通常是代码结构需要优化的信号。此时应将维护 Spec 的痛点转化为代码重构的动力，通过提取策略模式或领域服务，使代码重新与清晰的领域模型对齐。

### 9.4 参考链接

| 资源                 | 链接                                                           |
| -------------------- | -------------------------------------------------------------- |
| 官方仓库             | <https://github.com/Fission-AI/OpenSpec>                       |
| 快速入门             | <https://openspec.pro/getting-started/>                        |
| 官方文档             | <https://github.com/Fission-AI/OpenSpec/tree/main/docs>        |
| npm 包               | <https://www.npmjs.com/package/@fission-ai/openspec>           |
| 配套幻灯片（旧版）   | [openspec-user-manual-v1.pptx](./openspec-user-manual-v1.pptx) |
| 配套幻灯片（当前版） | [openspec-user-manual-v2.pptx](./openspec-user-manual-v2.pptx) |

---

_文档版本: 2.3_
_最后更新: 2026-07-08_
_基于 v1.5.0 更新：迁移至 Claude Code，新增 Explore First / Fluid Workflow / Stores 特性_
