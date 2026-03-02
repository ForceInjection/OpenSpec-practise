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
      - [5.1.1 为什么需要这两个章节？](#511-为什么需要这两个章节)
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
      - [6.2.1 错误 1：缺少必需章节](#621-错误-1缺少必需章节)
      - [6.2.2 错误 2：未找到任何 Delta](#622-错误-2未找到任何-delta)
      - [6.2.3 错误 3：需求条目解析失败](#623-错误-3需求条目解析失败)
      - [6.2.4 错误 4：缺少场景块](#624-错误-4缺少场景块)
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
      - [8.5.1 Slash Commands](#851-slash-commands)
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

| 理念 | 含义 |
| ------ | ------ |
| **流动而非僵化** | 文档可以随时更新，没有严格的阶段门槛 |
| **迭代而非瀑布** | 支持增量添加需求，逐步完善 |
| **简单而非复杂** | 只需要 Markdown 文件，无复杂工具链 |
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
   - 支持 20+ AI 编程助手（Claude Code、Cursor、GitHub Copilot 等）

---

## 2. 安装

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

安装成功后，你将看到类似输出：

```bash
OpenSpec v0.x.x
Spec-Driven Development for AI Coding Assistants
```

---

## 3. 项目初始化

### 3.1 初始化命令

在项目根目录执行初始化命令：

```bash
cd your-project
openspec init
```

执行后，OpenSpec 会创建必要的目录结构和配置文件。

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

> **Qoder 用户提示**：如果你使用的是 Qoder IDE，请选择 **Claude Code**。这是因为 Qoder 基于 Claude 架构构建，与 Claude Code 使用相同的配置。

### 3.3 非交互模式

如果需要在脚本或 CI/CD 环境中使用，可以跳过交互式配置：

```bash
# 跳过所有工具配置
openspec init --tools none

# 配置所有支持的 AI 工具
openspec init --tools all

# 只配置特定工具（逗号分隔）
openspec init --tools claude,cursor
```

### 3.4 初始化后的目录结构

```text
your-project/
├── .openspec/                    # OpenSpec 内部配置目录（自动生成）
├── openspec/                     # OpenSpec 工作目录
│   ├── agent-instructions.md     # AI 代理指导文件（告诉 AI 如何使用 OpenSpec）
│   ├── project-context.md        # 项目上下文（项目背景、技术栈等）
│   ├── changes/                  # 变更提案目录（每个功能/变更一个文件夹）
│   └── specs/                    # 主规范目录（已归档的规范）
└── ... (项目其他文件)
```

### 3.5 各文件说明

| 文件/目录 | 用途 | 是否必需 |
| ----------- | ------ | ---------- |
| `agent-instructions.md` | 指导 AI 如何遵循 OpenSpec 工作流 | 推荐保留 |
| `project-context.md` | 项目背景、技术栈、约束条件 | 推荐填写 |
| `changes/` | 存放活跃的变更提案 | 必需 |
| `specs/` | 存放已归档的规范 | 可选 |

---

## 4. 创建变更提案

在 OpenSpec 中，所有的功能开发、Bug 修复、架构变更都以"变更提案（Change）"为单位进行管理。

### 4.1 创建新变更

```bash
openspec new change <change-name>
```

**命名建议**：使用 kebab-case（短横线分隔），名称应简洁明了地描述变更内容。

```bash
# 好的命名示例
openspec new change user-authentication
openspec new change add-payment-module
openspec new change fix-login-timeout

# 不好的命名示例
openspec new change feature1          # 太模糊
openspec new change addUserAuth       # 应使用 kebab-case
```

### 4.2 示例：创建 AI Infrastructure CMDB 核心变更

```bash
openspec new change ai-infra-cmdb-core
```

输出示例：

```bash
✓ Created change directory: openspec/changes/ai-infra-cmdb-core
✓ Created proposal.md
✓ Created design.md
✓ Created tasks.md
✓ Created specs/ directory
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
    └── schemas/       # 模式定义（可选，存放 .proto 文件等）
        └── *.proto
```

### 4.4 各文件作用

| 文件 | 作用 | 是否必需 | 格式要求 |
| ------ | ------ | ---------- | ---------- |
| `proposal.md` | 说明"为什么做"和"做什么" | **必需** | 必须包含 `## Why` 和 `## What Changes` |
| `specs/<capability>/spec.md` | 详细的需求和验收场景 | **必需** | 必须使用 Delta Header + Requirement + Scenario 格式 |
| `design.md` | 技术实现方案 | 推荐 | 无严格格式要求 |
| `tasks.md` | 实现任务清单 | 推荐 | 无严格格式要求 |
| `schemas/*.proto` | 数据结构定义 | 可选 | Protocol Buffers 格式 |

### 4.5 变更的生命周期

```text
创建 (new) → 编写规范 → 验证 (validate) → 实现 → 归档 (archive)
```

1. **创建**：`openspec new change <name>`
2. **编写规范**：编辑 proposal.md 和 specs/
3. **验证**：`openspec validate <name>`
4. **实现**：按照 tasks.md 执行开发
5. **归档**：`openspec archive <name>`

---

## 5. 文档结构规范

本节详细介绍 proposal.md 和 spec.md 的格式要求。**请务必遵循这些格式，否则 `openspec validate` 会失败。**

> **模板文件**：所有模板文件位于 `docs/templates/` 目录下，可直接复制使用。

### 5.1 proposal.md - 提案文档

**核心要求：** proposal.md 必须包含 `## Why` 和 `## What Changes` 两个章节，否则验证会失败。

#### 5.1.1 为什么需要这两个章节？

OpenSpec 的设计理念是"先想清楚为什么做，再决定做什么"：

- `## Why` - 说明变更的背景、问题和动机
- `## What Changes` - 说明具体要添加、修改或删除什么

#### 5.1.2 完整格式模板

> 模板文件：[proposal-template.md](docs/templates/proposal-template.md)

必需章节结构：

```text
proposal.md 结构：
├── ## Summary（摘要，可选）
├── ## Why 【必需】
│   ├── ### Background（背景）
│   ├── ### Problem Statement（问题描述）
│   └── ### Alternatives Considered（备选方案）
├── ## What Changes 【必需】
│   ├── ### New Resources Added（新增资源）
│   └── ### New Capabilities（新增能力）
├── ## Success Criteria（成功标准，可选）
├── ## Scope（范围，可选）
├── ## Timeline（时间线，可选）
└── ## References（参考链接，可选）
```

**注意**：章节标题必须完全匹配 `## Why` 和 `## What Changes`（区分大小写）。

---

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

---

### 5.3 spec.md - 能力规范格式

**核心要求：** 必须使用 Delta Header + Requirement + Scenario 格式。

#### 5.3.1 格式要点速查表

| 元素 | 格式 | 示例 |
| ------ | ------ | ------ |
| Delta Header | `## ADDED/MODIFIED/REMOVED Requirements` | `## ADDED Requirements` |
| 需求标题 | `### Requirement: <标题>` | `### Requirement: GPU 自动发现` |
| 场景标题 | `#### Scenario: <标题>` | `#### Scenario: NVIDIA GPU 发现` |
| 场景内容 | Gherkin 格式 | `Given/When/Then` |

#### 5.3.2 完整格式模板

> 模板文件：[spec-template.md](docs/templates/spec-template.md)

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

> 示例文件：[spec-example.md](docs/templates/spec-example.md)

```markdown
## ADDED Requirements

### Requirement: GPU 自动发现

系统应通过 DaemonSet 部署的代理自动发现集群节点上的 GPU/NPU 设备。

**Priority**: P0 (Critical)

**Rationale**: 自动发现是 CMDB 的核心能力，没有它就无法管理 AI 基础设施资源。

#### Scenario: NVIDIA GPU 发现

Given 一个包含 NVIDIA GPU 节点的 Kubernetes 集群
When 发现代理以 DaemonSet 方式部署到集群
Then 所有 NVIDIA GPU 通过 NVML/DCGM 被枚举
And 每个 GPU 的型号、显存、驱动版本被记录到 CMDB
```

#### 5.3.4 常见错误示例

❌ **错误示例**：

```markdown
## ADDED Requirements

### REQ-001: GPU Discovery    # 错误：使用了自定义编号

System SHALL discover GPUs.

#### Scenario: Discovery    # 错误：场景标题太模糊
```

✅ **正确写法**：

```markdown
## ADDED Requirements

### Requirement: GPU 自动发现    # 正确：使用标准格式

系统应自动发现集群中的 GPU 设备。

**Priority**: P0 (Critical)

**Rationale**: 核心功能需求。

#### Scenario: NVIDIA GPU 发现    # 正确：场景标题具体

Given 一个包含 NVIDIA GPU 节点的 Kubernetes 集群
When 发现代理部署到集群
Then 所有 NVIDIA GPU 被枚举并记录到 CMDB
```

---

### 5.4 design.md - 技术设计

技术设计文档没有严格的格式要求，但建议包含以下章节。

> 模板文件：[design-template.md](docs/templates/design-template.md)

建议章节结构：

- Architecture Overview（架构概述）
- Core Components（核心组件）
- Data Model（数据模型）
- API Design（API 设计）
- Integration Patterns（集成模式）
- Technology Stack（技术栈）
- Security（安全设计）
- Deployment（部署方案）

---

### 5.5 tasks.md - 任务清单

任务清单建议按里程碑组织，使用 GitHub 风格的 Markdown 任务列表。

> 模板文件：[tasks-template.md](docs/templates/tasks-template.md)

建议章节结构：

- Milestone（里程碑）
- Definition of Done（完成定义）
- Progress Tracking（进度跟踪）

### 5.6 格式速查

**proposal.md 必需章节**：

```text
├── ## Why 【必需】
│   ├── ### Background
│   ├── ### Problem Statement
│   └── ### Alternatives Considered
└── ## What Changes 【必需】
    ├── ### New Resources Added
    └── ### New Capabilities
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

| 模板 | 路径 | 用途 |
| ------ | ------ | ------ |
| proposal.md 模板 | [docs/templates/proposal-template.md](docs/templates/proposal-template.md) | 提案文档模板 |
| spec.md 模板 | [docs/templates/spec-template.md](docs/templates/spec-template.md) | 能力规范模板 |
| design.md 模板 | [docs/templates/design-template.md](docs/templates/design-template.md) | 技术设计模板 |
| tasks.md 模板 | [docs/templates/tasks-template.md](docs/templates/tasks-template.md) | 任务清单模板 |
| spec.md 示例 | [docs/templates/spec-example.md](docs/templates/spec-example.md) | 能力规范示例 |

---

## 6. 验证与常见错误

### 6.1 验证命令

完成文档编写后，使用验证命令检查格式是否正确：

```bash
openspec validate <change-name>
```

验证成功时显示：

```bash
✓ Change '<change-name>' is valid
```

验证失败时会显示具体错误信息。

### 6.2 常见错误及解决方案

#### 6.2.1 错误 1：缺少必需章节

**错误信息**：

```bash
✗ [ERROR] Change must have a Why section. Missing required sections.
Expected headers: "## Why" and "## What Changes"
```

**原因**：proposal.md 中缺少 `## Why` 或 `## What Changes` 章节。

**解决方案**：确保 proposal.md 包含这两个章节，可参考 [proposal-template.md](docs/templates/proposal-template.md)。

---

#### 6.2.2 错误 2：未找到任何 Delta

**错误信息**：

```bash
✗ [ERROR] file: Change must have at least one delta. No deltas found.
Ensure your change has a specs/ directory with capability folders
```

**原因**：specs/ 目录结构不正确。

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

#### 6.2.3 错误 3：需求条目解析失败

**错误信息**：

```bash
✗ [ERROR] Delta sections ## ADDED Requirements were found, 
but no requirement entries parsed. Ensure each section includes 
at least one "### Requirement:" block
```

**原因**：需求标题格式不正确。

**错误示例**：

```markdown
## ADDED Requirements

### REQ-001: GPU Discovery      # ❌ 错误：使用了自定义编号
### GPU Discovery               # ❌ 错误：缺少 "Requirement:" 前缀
### requirement: GPU Discovery  # ❌ 错误："requirement" 应首字母大写
```

**正确格式**：

```markdown
## ADDED Requirements

### Requirement: GPU 自动发现    # ✓ 正确格式
```

---

#### 6.2.4 错误 4：缺少场景块

**错误信息**：

```bash
✗ [ERROR] Each requirement MUST include at least one #### Scenario: block
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
openspec change show <change-id> --json --deltas-only
```

这会输出 JSON 格式的解析结果，帮助你了解 OpenSpec 是如何解析你的文档的。

#### 6.3.2 查看变更状态

```bash
openspec status --change <change-name>
```

输出示例：

```bash
Change: ai-infra-cmdb-core
Status: active
Artifacts:
  ✓ proposal.md - Valid
  ✓ design.md - Present
  ✓ tasks.md - Present
  ✓ specs/accelerator-management/spec.md - Valid (2 requirements, 3 scenarios)
  ✓ specs/training-job-lifecycle/spec.md - Valid (2 requirements, 4 scenarios)
  ✗ specs/inference-service/spec.md - Invalid (missing scenarios)
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

### 7.1 初始化与创建

| 命令 | 说明 | 示例 |
| ------ | ------ | ------ |
| `openspec init` | 初始化 OpenSpec 项目 | `openspec init --tools none` |
| `openspec new change <name>` | 创建新变更提案 | `openspec new change user-auth` |

### 7.2 查看与验证

| 命令 | 说明 | 示例 |
| ------ | ------ | ------ |
| `openspec view` | 打开交互式 Web 仪表盘 | `openspec view` |
| `openspec status --change <name>` | 查看变更状态 | `openspec status --change user-auth` |
| `openspec validate <name>` | 验证变更文档格式 | `openspec validate user-auth` |
| `openspec list --changes` | 列出所有变更 | `openspec list --changes` |
| `openspec list --specs` | 列出所有规范 | `openspec list --specs` |
| `openspec show <name>` | 显示变更详情 | `openspec show user-auth` |

### 7.3 归档与管理

| 命令 | 说明 | 示例 |
| ------ | ------ | ------ |
| `openspec archive <name>` | 归档已完成的变更 | `openspec archive user-auth` |
| `openspec update` | 更新 AI 指导文件 | `openspec update` |

### 7.4 配置与调试

| 命令 | 说明 | 示例 |
| ------ | ------ | ------ |
| `openspec config` | 查看和修改配置 | `openspec config` |
| `openspec change show <id>` | 查看变更解析结果 | `openspec change show user-auth --json --deltas-only` |
| `openspec --version` | 查看版本号 | `openspec --version` |
| `openspec --help` | 查看帮助信息 | `openspec --help` |

### 7.5 全局选项

```bash
openspec [options] <command>

选项：
  -v, --version     显示版本号
  -h, --help        显示帮助信息
  --no-color        禁用彩色输出
  --json            以 JSON 格式输出
```

### 7.6 命令速查

常用命令快速参考：

```bash
# 初始化项目
openspec init --tools none

# 创建变更
openspec new change <name>

# 验证变更
openspec validate <name>

# 查看状态
openspec status --change <name>

# 归档变更
openspec archive <name>
```

---

## 8. 最佳实践

### 8.1 提案编写最佳实践

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

#### 8.3.1 Gherkin 格式要点

| 关键字 | 用途 | 示例 |
| -------- | ------ | ------ |
| `Given` | 前置条件，描述系统初始状态 | `Given 用户已登录系统` |
| `When` | 触发动作 | `When 用户点击"提交订单"按钮` |
| `Then` | 预期结果 | `Then 订单状态变为"待支付"` |
| `And` | 连接多个条件或结果 | `And 用户收到订单确认邮件` |

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

- **增量添加**：可以随时添加新的需求到变更中
- **频繁验证**：使用 `openspec validate` 确保格式正确
- **版本控制**：将 OpenSpec 文档纳入 Git 管理
- **及时归档**：完成开发后使用 `openspec archive` 归档变更

### 8.5 与 AI 协作最佳实践

#### 8.5.1 Slash Commands

OpenSpec 提供了专门的 slash commands：

| 命令 | 用途 |
| ------ | ------ |
| `/opsx:new` | 创建新的变更提案 |
| `/opsx:continue` | 继续未完成的变更 |
| `/opsx:apply` | 应用变更规范到代码实现 |

#### 8.5.2 与 AI 协作的技巧

1. **先让 AI 阅读规范**：在实现前，让 AI 先阅读 proposal.md 和 specs/
2. **使用具体引用**：让 AI 关注特定章节，如"请根据 specs/auth/spec.md 实现登录功能"
3. **增量迭代**：完成一个需求后验证，再进行下一个
4. **保持上下文清洁**：定期归档已完成的变更

### 8.6 团队协作最佳实践

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

### 9.1 支持的 AI 工具

OpenSpec 支持 20+ AI 编程助手，以下是常用工具：

| 工具 | 类型 | 支持程度 |
| ------ | ------ | ---------- |
| **Claude Code** | CLI + IDE | 完全支持 |
| **Qoder** | IDE | 完全支持（选择 Claude Code 配置） |
| **Cursor** | IDE | 完全支持 |
| **GitHub Copilot** | IDE 插件 | 完全支持 |
| **Cline** | VS Code 插件 | 完全支持 |
| **Windsurf** | IDE | 完全支持 |
| **Amazon Q Developer** | IDE 插件 | 完全支持 |
| **Gemini CLI** | CLI | 完全支持 |
| **Continue** | IDE 插件 | 完全支持 |
| **Aider** | CLI | 完全支持 |
| **Roo Code** | VS Code 插件 | 完全支持 |

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

#### 9.3.1 Q1：OpenSpec 与 Swagger/OpenAPI 有什么区别？

| 特性 | OpenSpec | OpenAPI/Swagger |
| ------ | ---------- | ----------------- |
| 主要用途 | 需求规范驱动开发 | API 接口文档 |
| 文档类型 | Markdown | YAML/JSON |
| 验证方式 | CLI 验证 + AI 理解 | 语法验证 |
| 适用阶段 | 开发前期（需求定义） | 开发中期（接口定义） |
| 目标用户 | 产品经理 + 开发者 + AI | 开发者 + 前端 |

两者可以配合使用：先用 OpenSpec 定义需求和场景，再用 OpenAPI 定义接口细节。

#### 9.3.2 Q2：已有的项目如何引入 OpenSpec？

1. 在项目根目录运行 `openspec init --tools none`
2. 为下一个功能创建变更提案
3. 逐步建立规范体系，不需要一次性覆盖所有功能

#### 9.3.3 Q3：规范写完后，AI 不遵循怎么办？

1. 确保 `agent-instructions.md` 文件存在
2. 在对话开始时明确指出：`请遵循 openspec/changes/<name>/ 目录下的规范文档`
3. 使用 OpenSpec 提供的 slash commands

#### 9.3.4 Q4：多个变更可以同时进行吗？

可以。每个变更都是独立的文件夹，可以并行开发。但建议：

- 变更之间避免依赖关系
- 完成一个变更后再创建下一个

### 9.4 参考链接

| 资源 | 链接 |
| ------ | ------ |
| 官方仓库 | <https://github.com/Fission-AI/OpenSpec> |
| 快速入门 | <https://openspec.pro/getting-started/> |
| 官方文档 | <https://github.com/Fission-AI/OpenSpec/tree/main/docs> |
| npm 包 | <https://www.npmjs.com/package/@fission-ai/openspec> |

---

*文档版本: 1.4*
*最后更新: 2026-02-23*
*基于 AI Infrastructure CMDB 项目实践经验编写*
