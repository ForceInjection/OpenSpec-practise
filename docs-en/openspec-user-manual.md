# OpenSpec User Manual

Based on practical project experience.

## Table of Contents

- [OpenSpec User Manual](#openspec-user-manual)
  - [Table of Contents](#table-of-contents)
  - [1. Introduction](#1-introduction)
    - [1.1 What is Spec-Driven Development?](#11-what-is-spec-driven-development)
    - [1.2 Core Philosophy](#12-core-philosophy)
    - [1.3 Core Value](#13-core-value)
  - [2. Installation](#2-installation)
    - [2.1 Prerequisites](#21-prerequisites)
    - [2.2 Installation Commands](#22-installation-commands)
    - [2.3 Verify Installation](#23-verify-installation)
    - [2.4 Configure Shell Auto-Completion (Optional)](#24-configure-shell-auto-completion-optional)
  - [3. Project Initialization](#3-project-initialization)
    - [3.1 Init Command](#31-init-command)
    - [3.2 Interactive Configuration](#32-interactive-configuration)
    - [3.3 Non-Interactive Mode](#33-non-interactive-mode)
    - [3.4 Directory Structure After Init](#34-directory-structure-after-init)
    - [3.5 File Descriptions](#35-file-descriptions)
  - [4. Creating Change Proposals](#4-creating-change-proposals)
    - [4.1 Creating a New Change](#41-creating-a-new-change)
    - [4.2 Example: Creating the AI Infrastructure CMDB Core Change](#42-example-creating-the-ai-infrastructure-cmdb-core-change)
    - [4.3 Change Directory Structure Explained](#43-change-directory-structure-explained)
    - [4.4 File Roles](#44-file-roles)
    - [4.5 Change Lifecycle](#45-change-lifecycle)
  - [5. Document Structure Specification](#5-document-structure-specification)
    - [5.1 proposal.md - Proposal Document](#51-proposalmd---proposal-document)
      - [5.1.1 Why Are These Sections Required?](#511-why-are-these-sections-required)
      - [5.1.2 Full Format Template](#512-full-format-template)
    - [5.2 specs/ Directory - Capability Specs](#52-specs-directory---capability-specs)
      - [Directory Structure Example](#directory-structure-example)
    - [5.3 spec.md - Capability Spec Format](#53-specmd---capability-spec-format)
      - [5.3.1 Format Quick Reference](#531-format-quick-reference)
      - [5.3.2 Full Format Template](#532-full-format-template)
      - [5.3.3 Correct Example](#533-correct-example)
      - [5.3.4 Common Error Examples](#534-common-error-examples)
    - [5.4 design.md - Technical Design](#54-designmd---technical-design)
    - [5.5 tasks.md - Task List](#55-tasksmd---task-list)
    - [5.6 Format Quick Reference](#56-format-quick-reference)
    - [5.7 Template File Summary](#57-template-file-summary)
  - [6. Validation and Common Errors](#6-validation-and-common-errors)
    - [6.1 Validation Command](#61-validation-command)
    - [6.2 Common Errors and Solutions](#62-common-errors-and-solutions)
      - [6.2.1 Error 1: No Deltas Found](#621-error-1-no-deltas-found)
      - [6.2.2 Error 2: Requirement Entry Parsing Failed](#622-error-2-requirement-entry-parsing-failed)
      - [6.2.3 Error 3: Missing Scenario Block](#623-error-3-missing-scenario-block)
    - [6.3 Debugging Tips](#63-debugging-tips)
      - [6.3.1 View Delta Parsing Results](#631-view-delta-parsing-results)
      - [6.3.2 View Change Status](#632-view-change-status)
      - [6.3.3 Validation Checklist](#633-validation-checklist)
  - [7. Command Reference](#7-command-reference)
    - [7.1 Init and Create](#71-init-and-create)
    - [7.2 View and Validate](#72-view-and-validate)
    - [7.3 Archive and Manage](#73-archive-and-manage)
    - [7.4 Config and Debug](#74-config-and-debug)
    - [7.5 Global Options](#75-global-options)
    - [7.6 Command Quick Reference](#76-command-quick-reference)
  - [8. Best Practices](#8-best-practices)
    - [8.1 Proposal Writing Best Practices](#81-proposal-writing-best-practices)
      - [8.1.1 Recommended Practices](#811-recommended-practices)
      - [8.1.2 Practices to Avoid](#812-practices-to-avoid)
      - [8.1.3 Example Comparison](#813-example-comparison)
    - [8.2 Spec Writing Best Practices](#82-spec-writing-best-practices)
      - [8.2.1 Recommended Practices](#821-recommended-practices)
      - [8.2.2 Practices to Avoid](#822-practices-to-avoid)
    - [8.3 Scenario Writing Best Practices](#83-scenario-writing-best-practices)
      - [8.3.1 Gherkin Format Key Points](#831-gherkin-format-key-points)
      - [8.3.2 Good Scenario Example](#832-good-scenario-example)
      - [8.3.3 Poor Scenario Example](#833-poor-scenario-example)
    - [8.4 Iterative Development Best Practices](#84-iterative-development-best-practices)
    - [8.5 AI Collaboration Best Practices](#85-ai-collaboration-best-practices)
      - [8.5.1 OPSX Slash Commands (Recommended)](#851-opsx-slash-commands-recommended)
      - [8.5.2 Tips for Collaborating with AI](#852-tips-for-collaborating-with-ai)
    - [8.6 Team Collaboration Best Practices](#86-team-collaboration-best-practices)
      - [8.6.1 Code Review Checklist](#861-code-review-checklist)
      - [8.6.2 Documentation Maintenance](#862-documentation-maintenance)
  - [9. Appendix](#9-appendix)
    - [9.1 Supported AI Tools](#91-supported-ai-tools)
    - [9.2 Telemetry Settings](#92-telemetry-settings)
    - [9.3 FAQ](#93-faq)
      - [9.3.1 Q1: What is the difference between OpenSpec and Swagger/OpenAPI?](#931-q1-what-is-the-difference-between-openspec-and-swaggeropenapi)
      - [9.3.2 Q2: How do I introduce OpenSpec into an existing project?](#932-q2-how-do-i-introduce-openspec-into-an-existing-project)
      - [9.3.3 Q3: What if the AI doesn't follow the spec after I write it?](#933-q3-what-if-the-ai-doesnt-follow-the-spec-after-i-write-it)
      - [9.3.4 Q4: Can multiple changes proceed simultaneously?](#934-q4-can-multiple-changes-proceed-simultaneously)
      - [9.3.5 Q5: How to describe internal logic changes (e.g., database state changes) using externally observable behavior?](#935-q5-how-to-describe-internal-logic-changes-eg-database-state-changes-using-externally-observable-behavior)
      - [9.3.6 Q6: Are BDD format Specs (Given/When/Then) written by AI or humans?](#936-q6-are-bdd-format-specs-givenwhenthen-written-by-ai-or-humans)
      - [9.3.7 Q7: How to maintain the readability of baseline Specs when business logic becomes complex (e.g., hundreds of lines in a single method)?](#937-q7-how-to-maintain-the-readability-of-baseline-specs-when-business-logic-becomes-complex-eg-hundreds-of-lines-in-a-single-method)
    - [9.4 Reference Links](#94-reference-links)

---

## 1. Introduction

OpenSpec is a **Spec-Driven Development (SDD) framework** designed specifically for AI coding assistants. It ensures that humans and AI reach agreement on requirements by defining specs before writing code.

### 1.1 What is Spec-Driven Development?

The traditional development workflow is: Requirements → Code directly → Test → Deliver.

The Spec-Driven Development workflow is: **Requirements → Write Specs → Validate Specs → Implement**.

The advantages of this approach are:

- Humans and AI first agree on "what to build", avoiding rework
- Spec documents serve as contracts, reducing communication overhead
- Specs can be version-controlled for traceability

### 1.2 Core Philosophy

| Philosophy                          | Meaning                                                                                 |
| ----------------------------------- | --------------------------------------------------------------------------------------- |
| **Fluid, not rigid**                | Documents can be updated at any time; no strict phase gates                             |
| **Iterative, not waterfall**        | Supports incrementally adding requirements and progressively refining them              |
| **Simple, not complex**             | Only Markdown files required; no complex toolchain                                      |
| **Works for both new and existing** | Suitable for existing codebases (Brownfield) as well as brand-new projects (Greenfield) |

> **Terminology**:
>
> - **Brownfield**: An existing project with legacy code. OpenSpec can be introduced gradually without refactoring existing code.
> - **Greenfield**: A brand-new project starting from scratch. OpenSpec can establish the spec framework from the very beginning.

### 1.3 Core Value

1. **Align before building**
   - Humans and AI agree on the spec before writing any code
   - Avoids rework caused by AI misunderstanding requirements

2. **Explore First (v1.5.0)**
   - Investigate the codebase and think through problems before committing to a change
   - Use `/opsx:explore` as the recommended starting point

3. **Stay organized**
   - Each change has its own folder
   - Contains proposal, specs, design, and tasks

4. **Fluid Workflow (v1.5.0)**
   - Iterate freely: update any document at any time, no rigid phase gates
   - Sync, merge, and archive through a natural, continuous flow
   - Supports cross-repository planning (Stores)

5. **Tool compatibility**
   - Supports 20+ AI coding assistants (Claude Code, Cursor, Junie, Lingma IDE, etc.)

---

## 2. Installation

### 2.1 Prerequisites

- **Node.js**: 20.19.0 or higher
- **Package manager**: npm, pnpm, yarn, or bun (choose one)

> **Check your Node.js version**:
>
> ```bash
> node --version
> ```
>
> If your version is too old, it is recommended to use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm) to manage Node.js versions.

### 2.2 Installation Commands

Install using npm:

```bash
npm install -g @fission-ai/openspec@latest
```

Using other package managers:

```bash
# pnpm (recommended, faster)
pnpm add -g @fission-ai/openspec@latest

# yarn
yarn global add @fission-ai/openspec@latest

# bun
bun install -g @fission-ai/openspec@latest
```

### 2.3 Verify Installation

```bash
# Check version number
openspec --version

# View help information
openspec --help
```

After successful installation, you will see output similar to (or manually run `openspec --version` to check the version number):

```bash
1.5.0
```

### 2.4 Configure Shell Auto-Completion (Optional)

Since v1.5.0, to avoid encoding issues in certain terminals (such as PowerShell), Shell auto-completion has been changed to **opt-in**.

If you want to use `openspec` command completion in your terminal, you can run the following command to generate and install the completion script (supports bash, zsh, fish, etc.):

```bash
# View completion command help
openspec completion --help
```

---

## 3. Project Initialization

### 3.1 Init Command

`openspec init` is the entry command for OpenSpec. When run in the project root directory, it will:

1. Guide you to select the AI tools to integrate (or skip interaction with the `--tools` parameter)
2. Create the `openspec/` working directory (containing `config.yaml`, `changes/`, `specs/`)
3. Generate slash commands and Skills files in the directories corresponding to the selected AI tools

```bash
cd your-project
openspec init
```

### 3.2 Interactive Configuration

`openspec init` is interactive by default and will ask which AI tools you want to configure:

```bash
? Which AI tools do you want to configure? (Press <space> to select)
❯◉ Claude Code
 ◯ Cursor
 ◯ GitHub Copilot
 ◯ Cline
 ◯ Windsurf
 ...
```

Use the space bar to select and Enter to confirm.

> **Claude Code users**: If you're using Claude Code, select **Claude Code**. OpenSpec v1.5.0 provides native support for Claude Code, automatically generating the corresponding commands and Skills files in `.claude/commands/opsx/` and `.claude/skills/`.

### 3.3 Non-Interactive Mode

For use in scripts or CI/CD environments, you can skip the interactive configuration:

```bash
# Skip all tool configuration
openspec init --tools none

# Configure all supported AI tools
openspec init --tools all

# Configure only specific tools (comma-separated)
openspec init --tools claude,cursor

# Configure Claude Code
openspec init --tools claude
```

**Common tool identifier list**:

| Tool Name          | `--tools` value  |
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

> **Full list**: Run `openspec init --help` to see all tool identifiers supported by the current version.

### 3.4 Directory Structure After Init

```text
your-project/
├── openspec/                     # OpenSpec working directory
│   ├── config.yaml               # Project config (tech stack, conventions, etc., injected into AI requests)
│   ├── changes/                  # Change proposal directory (one folder per feature/change)
│   └── specs/                    # Main spec directory (archived specs)
├── .claude/                      # Claude Code-specific directory (example)
│   ├── commands/opsx/            # /opsx slash commands (invoked directly from IDE)
│   │   ├── propose.md
│   │   ├── explore.md
│   │   ├── apply.md
│   │   └── archive.md
│   └── skills/                   # Agent Skills (auto-detected and loaded by AI)
│       ├── openspec-propose/SKILL.md
│       ├── openspec-explore/SKILL.md
│       ├── openspec-apply-change/SKILL.md
│       └── openspec-archive-change/SKILL.md
└── ... (other project files)
```

> **Note**: `openspec init` generates commands and Skills files in the corresponding directories based on the AI tools you selected. For example, selecting Claude Code generates `.claude/commands/opsx/` and `.claude/skills/`.

### 3.5 File Descriptions

| File/Directory | Purpose                                                                   | Required    |
| -------------- | ------------------------------------------------------------------------- | ----------- |
| `config.yaml`  | Project background, tech stack, constraints, per-document rule injections | Recommended |
| `changes/`     | Stores active change proposals                                            | Required    |
| `specs/`       | Stores archived specs                                                     | Optional    |

> **Difference from older versions**: Since v1.0.0, `openspec/AGENTS.md` and `openspec/project.md` have been removed. Project context is now written uniformly into the `context:` field of `openspec/config.yaml`, which is injected into every AI planning request — more reliable than the old approach.

**config.yaml structure example**:

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

> **Stores (v1.5.0)**: OpenSpec now supports cross-repository planning through Stores. This allows you to coordinate specs and changes across multiple repositories (e.g., microservices, shared libraries) from a single planning context.

---

## 4. Creating Change Proposals

In OpenSpec, all feature development, bug fixes, and architectural changes are managed as individual "Changes".

### 4.1 Creating a New Change

**Option 1: Use a slash command (recommended, one step)**:

```text
/opsx:propose <description>
```

This command will:

1. Infer a kebab-case change name (e.g., `add-user-auth`)
2. Create `openspec/changes/<name>/`
3. Generate all documents — `proposal.md`, `design.md`, `specs/`, `tasks.md` — in sequence

**Option 2: Create the change directory only (used under the extended workflow profile)**:

Slash command:

```text
/opsx:new <change-name>
```

Equivalent CLI command:

```bash
openspec new change <change-name>
```

Only initializes the change directory structure without creating any documents; suitable for use with `/opsx:continue` to manually generate documents step by step.

**Naming convention**: Use kebab-case (hyphen-separated). The name should clearly and concisely describe the change.

```text
# Good naming examples
add-user-authentication
add-payment-module
fix-login-timeout

# Poor naming examples
feature1           # Too vague
addUserAuth        # Should use kebab-case
```

### 4.2 Example: Creating the AI Infrastructure CMDB Core Change

```text
/opsx:propose "Implement AI Infrastructure CMDB core functionality"
```

The AI will automatically create the change and generate all planning documents:

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

### 4.3 Change Directory Structure Explained

```text
openspec/changes/<change-name>/
├── .openspec.yaml     # Change metadata (ID, status, creation time, etc., managed automatically by CLI)
├── proposal.md        # Proposal document [REQUIRED] describes Why and What
├── design.md          # Technical design document (architecture, data model, API design, etc.)
├── tasks.md           # Implementation task list (to-dos organized by milestone)
└── specs/             # Spec directory (stores capability spec files)
    ├── <capability-1>/
    │   └── spec.md    # Capability spec (using Requirement + Scenario format)
    ├── <capability-2>/
    │   └── spec.md
```

### 4.4 File Roles

| File                         | Role                                           | Required     | Format Requirements                                                                                                                   |
| ---------------------------- | ---------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `proposal.md`                | Explains "why" and "what"                      | **Required** | Must contain `## Why` and `## What Changes` (enforced by validator); recommended to include `## Capabilities` (needed by AI workflow) |
| `specs/<capability>/spec.md` | Detailed requirements and acceptance scenarios | **Required** | Must use Delta Header + Requirement + Scenario format                                                                                 |
| `design.md`                  | Technical implementation plan                  | Recommended  | No strict format requirements                                                                                                         |
| `tasks.md`                   | Implementation task list                       | Recommended  | No strict format requirements                                                                                                         |

### 4.5 Change Lifecycle

```text
Propose (slash command) → Write Specs → Validate → Implement (apply) → Archive
```

1. **Propose**: `/opsx:propose <description>` (generates all planning documents in one step)
2. **Write specs**: Edit proposal.md and specs/
3. **Validate**: `openspec validate <name>`
4. **Implement**: `/opsx:apply` — execute development following tasks.md
5. **Archive**: `/opsx:archive` — merges the change's spec Deltas back into the `openspec/specs/` main spec directory, cleans up the temporary directory under `openspec/changes/`, and marks the feature spec as officially "live"

---

## 5. Document Structure Specification

This section details the format requirements for proposal.md and spec.md. **Please follow these formats strictly, or `openspec validate` will fail.**

> **Template files**: OpenSpec ships with built-in templates for all documents. You can view template paths with the `openspec templates` command, or use `/opsx:propose` / `/opsx:new` slash commands to automatically generate complete documents.

### 5.1 proposal.md - Proposal Document

**Core requirements:** proposal.md must contain `## Why` and `## What Changes` — two sections enforced by the validator. It is also recommended to include a `## Capabilities` section as the key input for AI to automatically generate `specs/<name>/spec.md` files.

#### 5.1.1 Why Are These Sections Required?

OpenSpec's design philosophy is "first think clearly about why, then decide what, then clarify which capabilities are affected":

- `## Why` — explains the background, problem, and motivation for the change (**enforced by validator**)
- `## What Changes` — explains what is being added, modified, or removed (**enforced by validator**)
- `## Capabilities` — lists New / Modified Capabilities, driving the generation of `specs/<name>/spec.md` files (**recommended, needed by AI workflow**)

#### 5.1.2 Full Format Template

> Built-in template paths can be viewed with `openspec templates`; the `/opsx:propose` slash command automatically generates a fully populated proposal.

Required section structure:

```text
proposal.md structure:
├── ## Why [REQUIRED - enforced by validator]
│   ├── ### Background
│   ├── ### Problem Statement
│   └── ### Alternatives Considered
├── ## What Changes [REQUIRED - enforced by validator]
│   ├── ### New Resources Added
│   └── ### New Capabilities (natural-language summary of feature points)
├── ## Capabilities [RECOMMENDED - needed by AI workflow, drives spec file generation]
│   ├── ### New Capabilities (kebab-case identifier list, each maps to a specs/<name>/ directory)
│   └── ### Modified Capabilities (requirement changes to existing capabilities)
├── ## Impact
├── ## Scope (optional)
│   ├── ### In Scope
│   └── ### Out of Scope
├── ## Goals (success criteria, optional)
└── ## References (optional)
```

**Note**: Section headings must exactly match `## Why` and `## What Changes` (case-sensitive).

### 5.2 specs/ Directory - Capability Specs

**Core requirement:** specs/ must use capability folders — one folder per capability.

#### Directory Structure Example

```text
specs/
├── accelerator-management/     # Capability 1: Accelerator management
│   └── spec.md
├── training-job-lifecycle/     # Capability 2: Training job lifecycle
│   └── spec.md
├── inference-service/          # Capability 3: Inference service
│   └── spec.md
└── relationship-management/    # Capability 4: Relationship management
    └── spec.md
```

**Important rules**:

- Do not place spec.md files directly in the specs/ root directory
- Use kebab-case for each capability folder name
- Folder names should reflect the capability domain

### 5.3 spec.md - Capability Spec Format

**Core requirement:** Must use Delta Header + Requirement + Scenario format.

#### 5.3.1 Format Quick Reference

| Element             | Format                                   | Example                               |
| ------------------- | ---------------------------------------- | ------------------------------------- |
| Delta Header        | `## ADDED/MODIFIED/REMOVED Requirements` | `## ADDED Requirements`               |
| Requirement heading | `### Requirement: <title>`               | `### Requirement: GPU Auto-Discovery` |
| Scenario heading    | `#### Scenario: <title>`                 | `#### Scenario: NVIDIA GPU Discovery` |
| Scenario content    | Gherkin format                           | `Given/When/Then`                     |

**Delta Header selection guide**:

| Delta Header               | When to use                                           |
| -------------------------- | ----------------------------------------------------- |
| `## ADDED Requirements`    | New capabilities or requirements added in this change |
| `## MODIFIED Requirements` | Modifications to an existing Requirement in the spec  |
| `## REMOVED Requirements`  | Requirements explicitly deprecated or deleted         |

#### 5.3.2 Full Format Template

> Built-in template paths can be viewed with `openspec templates`.

Required format structure:

```text
spec.md structure:
├── # Capability Name
├── ## Overview (recommended)
│   - Brief description of the capability
│   - Problem it solves
└── ## ADDED/MODIFIED/REMOVED Requirements [REQUIRED]
    ├── ### Requirement: <title>
    │   ├── **Priority**: P0/P1/P2
    │   ├── **Rationale**: ...
    │   └── #### Scenario: <title>
    │       └── Given/When/Then
```

#### 5.3.3 Correct Example

> The example below shows the core Requirement + Scenario structure. For a complete example (including the `## Overview` section), see `openspec/changes/archive/2025-01-27-v1-mvp/specs/domain-model/spec.md` (e-commerce domain model spec):

```markdown
## ADDED Requirements

### Requirement: Product Entity Definition

The system SHALL define a product entity containing a unique identifier, name, price, and stock level.

**Priority**: P0 (Critical)

**Rationale**: Products are the core entity of an e-commerce system and the foundation for all transactions.

#### Scenario: Create a Valid Product

Given a new product needs to be created
When product information is provided { id, name, priceCents, stock }
Then the product entity is created successfully
And id format is prod_xxxx
And priceCents >= 0
And stock >= 0
```

#### 5.3.4 Common Error Examples

❌ **Error example**:

```markdown
## ADDED Requirements

### REQ-001: GPU Discovery # Error: uses a custom numbering scheme

System SHALL discover GPUs.

#### Scenario: Discovery # Error: scenario title is too vague
```

✅ **Correct version**:

```markdown
## ADDED Requirements

### Requirement: GPU Auto-Discovery # Correct: uses standard format

The system should automatically discover GPU devices in the cluster.

**Priority**: P0 (Critical)

**Rationale**: Core functional requirement.

#### Scenario: NVIDIA GPU Discovery # Correct: scenario title is specific

Given a Kubernetes cluster with NVIDIA GPU nodes
When the discovery agent is deployed to the cluster
Then all NVIDIA GPUs are enumerated and recorded in the CMDB
```

### 5.4 design.md - Technical Design

The technical design document has no strict format requirements, but it is recommended to include the following sections.

> Built-in template paths can be viewed with `openspec templates`.

**Recommended section structure**:

| Section Name          | Recommended Content                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| Architecture Overview | Overall system architecture diagram (Mermaid or ASCII recommended) and layer relationship description   |
| Core Components       | List of core modules, each module's responsibilities, boundaries, and internal implementation notes     |
| Data Model            | Field definitions, types, constraints, and inter-entity relationships for key entities                  |
| API Design            | Interface routes, request/response formats, and error code specifications                               |
| Integration Patterns  | Integration approaches with external systems/modules, including events, queues, synchronous calls, etc. |
| Technology Stack      | Selected technologies and libraries, rationale, and comparison with alternatives                        |
| Security              | Authentication, authorization, data encryption, input validation, and other security design points      |
| Deployment            | Environment requirements, deployment steps, and rollback plan                                           |

### 5.5 tasks.md - Task List

The task list is used to break down the design into executable implementation steps. It is recommended to organize by milestone using GitHub-style Markdown task lists so that items can be checked off directly in the IDE.

> Built-in template paths can be viewed with `openspec templates`.

**Recommended section structure**:

- **Milestone**: Group implementation steps by milestone (e.g., M1 Foundation Layer, M2 API Layer, M3 Testing). Keep each task small enough to complete within 2 hours.
- **Definition of Done**: List the completion criteria for the milestone, such as code passing CI, test coverage meeting targets, `spec validate` passing, etc.
- **Progress Tracking**: Use `- [x]` / `- [ ]` to mark completion, making it easy to view progress at a glance in the IDE.

**Example**:

```markdown
## Milestone 1 - Domain Model

### Definition of Done

- All P0 Requirements implemented
- `openspec validate v1-mvp` passes
- Unit tests cover all domain entities

### Tasks

- [x] Define Product entity type (id, name, priceCents, stock)
- [x] Define Cart / CartItem entity types
- [ ] Define Order / OrderItem entity types
- [ ] Implement orchestration validation logic for domain entities

## Milestone 2 - Service Layer

### Definition of Done

- All service methods have corresponding integration tests

### Tasks

- [ ] Implement CatalogService.getProduct / listProducts
- [ ] Implement CartService.addItem / removeItem
- [ ] Implement OrderService.checkout
```

### 5.6 Format Quick Reference

**proposal.md required sections**:

```text
├── ## Why [REQUIRED - enforced by validator]
│   ├── ### Background
│   ├── ### Problem Statement
│   └── ### Alternatives Considered
├── ## What Changes [REQUIRED - enforced by validator]
│   ├── ### New Resources Added
│   └── ### New Capabilities
└── ## Capabilities [RECOMMENDED - needed by AI workflow, drives spec file generation]
    ├── ### New Capabilities
    └── ### Modified Capabilities
```

**specs/\[capability\]/spec.md required format**:

```text
├── # Capability Name
├── ## Overview (recommended)
└── ## ADDED/MODIFIED/REMOVED Requirements [REQUIRED]
    ├── ### Requirement: <title>
    │   ├── **Priority**: P0/P1/P2
    │   ├── **Rationale**: ...
    │   └── #### Scenario: <title>
    │       └── Given/When/Then
```

### 5.7 Template File Summary

| Template             | Corresponding built-in file (view full path with `openspec templates`) | Purpose                    |
| -------------------- | ---------------------------------------------------------------------- | -------------------------- |
| proposal.md template | `schemas/spec-driven/templates/proposal.md`                            | Proposal document template |
| spec.md template     | `schemas/spec-driven/templates/spec.md`                                | Capability spec template   |
| design.md template   | `schemas/spec-driven/templates/design.md`                              | Technical design template  |
| tasks.md template    | `schemas/spec-driven/templates/tasks.md`                               | Task list template         |

---

## 6. Validation and Common Errors

### 6.1 Validation Command

After writing documents, use the validation command to check whether the format is correct:

```bash
openspec validate <change-name>
```

On success:

```bash
Change '<change-name>' is valid
```

On failure, specific error messages will be displayed.

### 6.2 Common Errors and Solutions

#### 6.2.1 Error 1: No Deltas Found

**Error message**:

```bash
✗ [ERROR] file: Change must have at least one delta. No deltas found.
Ensure your change has a specs/ directory with capability folders
```

**Cause**: The specs/ directory structure is incorrect.

**Solution**:

1. Ensure there is a capability folder under specs/:

   ```text
   specs/
   └── your-capability/      # Capability folder
       └── spec.md           # Spec file
   ```

2. Ensure spec.md contains a Delta Header:

   ```markdown
   ## ADDED Requirements

   ### Requirement: Some Requirement

   ...
   ```

**Common mistake**:

```text
specs/
└── spec.md              # ❌ Error: placed directly in the specs/ root
```

---

#### 6.2.2 Error 2: Requirement Entry Parsing Failed

**Error message**:

```bash
✗ [ERROR] cap1/spec.md: Delta sections ## ADDED Requirements were found, but no requirement entries parsed. Ensure each section includes at least one "### Requirement:" block (REMOVED may use bullet list syntax).
```

**Cause**: The requirement heading format is incorrect.

**Error examples**:

```markdown
## ADDED Requirements

### REQ-001: GPU Discovery # ❌ Error: uses a custom numbering scheme

### GPU Discovery # ❌ Error: missing "Requirement:" prefix

### requirement: GPU Discovery # ❌ Error: "requirement" should be capitalized
```

**Correct format**:

```markdown
## ADDED Requirements

### Requirement: GPU Auto-Discovery # ✓ Correct format
```

---

#### 6.2.3 Error 3: Missing Scenario Block

**Error message**:

```bash
✗ [ERROR] cap1/spec.md: ADDED "test" must include at least one scenario
```

**Cause**: Every requirement must have at least one scenario.

**Error example**:

```markdown
### Requirement: GPU Auto-Discovery

The system should automatically discover GPU devices.

# ❌ No scenario block
```

**Correct format**:

```markdown
### Requirement: GPU Auto-Discovery

The system should automatically discover GPU devices.

**Priority**: P0 (Critical)

**Rationale**: Core functional requirement.

#### Scenario: NVIDIA GPU Discovery

Given a Kubernetes cluster with NVIDIA GPU nodes
When the discovery agent is deployed to the cluster
Then all NVIDIA GPUs are enumerated and recorded in the CMDB
```

### 6.3 Debugging Tips

#### 6.3.1 View Delta Parsing Results

If validation fails but you are unsure why, you can view the parsed structure:

```bash
openspec show <change-name> --json --deltas-only
```

This outputs the parsed result in JSON format, helping you understand how OpenSpec is interpreting your documents.

#### 6.3.2 View Change Status

```bash
openspec status --change <change-name>
```

> **Tip**: Since v1.5.0, if no changes currently exist, the `openspec status` command will exit gracefully (with a "no changes" message) instead of throwing a fatal error.

Example output:

```bash
Change: ai-infra-cmdb-core
Schema: spec-driven
Progress: 1/4 artifacts complete

[x] proposal
[ ] design
[ ] specs
[-] tasks (blocked by: design, specs)
```

#### 6.3.3 Validation Checklist

Before running `openspec validate`, confirm:

- [ ] **proposal.md** contains a `## Why` section
- [ ] **proposal.md** contains a `## What Changes` section
- [ ] **specs/** contains capability folders (not spec.md files directly)
- [ ] Each **spec.md** contains a Delta Header (`## ADDED/MODIFIED/REMOVED Requirements`)
- [ ] Each requirement uses the `### Requirement: <title>` format
- [ ] Each requirement has at least one `#### Scenario: <title>` block
- [ ] Each Scenario uses Gherkin format (Given/When/Then)

---

## 7. Command Reference

### 7.1 Init and Create

| Command                      | Description                       | Example                             |
| ---------------------------- | --------------------------------- | ----------------------------------- |
| `openspec init`              | Initialize an OpenSpec project    | `openspec init --tools claude`      |
| `openspec new change <name>` | Create only the change directory  | `openspec new change add-user-auth` |
| `openspec update`            | Update AI skill and command files | `openspec update`                   |

### 7.2 View and Validate

| Command                           | Description                     | Example                                        |
| --------------------------------- | ------------------------------- | ---------------------------------------------- |
| `openspec view`                   | Open the terminal UI            | `openspec view`                                |
| `openspec status --change <name>` | View change status              | `openspec status --change user-auth`           |
| `openspec validate <name>`        | Validate change document format | `openspec validate user-auth`                  |
| `openspec list --changes`         | List all changes                | `openspec list --changes`                      |
| `openspec list --specs`           | List all specs                  | `openspec list --specs`                        |
| `openspec show <name>`            | Show change details             | `openspec show user-auth --json --deltas-only` |

### 7.3 Archive and Manage

| Command                   | Description                                                                                                                        | Example                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `openspec archive <name>` | Archive a completed change (merges Deltas into the `specs/` main directory and cleans up the temporary directory under `changes/`) | `openspec archive user-auth` |

### 7.4 Config and Debug

| Command                   | Description                               | Example                   |
| ------------------------- | ----------------------------------------- | ------------------------- |
| `openspec config list`    | View current configuration                | `openspec config list`    |
| `openspec config profile` | Set the workflow profile                  | `openspec config profile` |
| `openspec templates`      | View absolute paths to built-in templates | `openspec templates`      |
| `openspec schemas`        | List available schemas                    | `openspec schemas`        |
| `openspec --version`      | View version number                       | `openspec --version`      |
| `openspec --help`         | View help information                     | `openspec --help`         |

### 7.5 Global Options

```bash
openspec [options] <command>

Options:
  -V, --version     Show version number
  -h, --help        Show help information
  --no-color        Disable colored output
```

> **Note**: `--json` is a per-command option, not a global option. For example: `openspec show <name> --json` or `openspec validate --json`.

### 7.6 Command Quick Reference

Quick reference for common commands:

```bash
# Initialize project
openspec init --tools none

# Create change directory (directory only, no documents generated)
openspec new change <name>

# List all changes / specs
openspec list --changes
openspec list --specs

# Validate a change
openspec validate <name>

# View status
openspec status --change <name>

# Archive a change
openspec archive <name>

# Update tool files
openspec update
```

---

## 8. Best Practices

### 8.1 Proposal Writing Best Practices

#### 8.1.1 Recommended Practices

- **Write Why before What**: First explain why this change is needed, then describe what will change specifically
- **Keep it concise**: proposal.md should be a high-level overview; detailed content goes in specs/
- **Define scope clearly**: Clearly state what is In Scope and Out of Scope
- **Provide context**: Help both AI and team members understand the background

#### 8.1.2 Practices to Avoid

- Writing detailed API definitions in proposal.md (those belong in specs/ or design.md)
- Using vague descriptions like "optimize performance" or "improve experience" (specify goals and metrics instead)
- Skipping the Alternatives Considered section (explaining why the current approach was chosen is important)

#### 8.1.3 Example Comparison

❌ **Poor Why section**:

```markdown
## Why

We need to add user authentication functionality.
```

✅ **Good Why section**:

```markdown
## Why

### Background

The current system has no user authentication, allowing anyone to access all data and functionality.
This results in:

- No accountability for operation logs
- Sensitive data left unprotected
- No way to implement fine-grained access control

### Problem Statement

The system needs a secure and reliable user authentication mechanism supporting:

- Username/password login
- Third-party OAuth login (GitHub, Google)
- Session management and secure logout

### Alternatives Considered

1. **Build a custom auth system**: Full control, but high development and maintenance cost
2. **Use Auth0**: Feature-rich, but relatively expensive
3. **Use Keycloak**: Open-source and free, supports multiple protocols ✓ Selected
```

### 8.2 Spec Writing Best Practices

#### 8.2.1 Recommended Practices

- **One capability per folder**: Organize capabilities by functional domain
- **Appropriate requirement granularity**: Each requirement should be a single, testable unit of functionality
- **Specific scenarios**: Use concrete Gherkin scenarios to describe behavior
- **Priority labels**: Annotate each requirement with a P0/P1/P2 priority
- **Add Rationale**: Explain why the requirement is needed

#### 8.2.2 Practices to Avoid

- Placing multiple unrelated capabilities in a single spec.md
- Requirements that are too broad (e.g., "the system should be fast")
- Scenarios that are too vague (e.g., "the system should work")

### 8.3 Scenario Writing Best Practices

#### 8.3.1 Gherkin Format Key Points

| Keyword | Purpose                                 | Example                                              |
| ------- | --------------------------------------- | ---------------------------------------------------- |
| `Given` | Precondition; describes initial state   | `Given the user is logged into the system`           |
| `When`  | Triggering action                       | `When the user clicks the "Submit Order" button`     |
| `Then`  | Expected result                         | `Then the order status changes to "Pending Payment"` |
| `And`   | Connects multiple conditions or results | `And the user receives an order confirmation email`  |

#### 8.3.2 Good Scenario Example

```gherkin
Scenario: Pay for an order with a credit card

Given the user is logged into the system
And the cart contains 2 items totaling $29.99
And the user has a credit card on file
When the user selects "Credit Card Payment" and confirms
Then the order is created successfully
And $29.99 is charged to the credit card
And the user receives a payment success notification
And inventory is reduced by 2
```

#### 8.3.3 Poor Scenario Example

```gherkin
Scenario: Payment

Given the system
When payment
Then success
```

**Problems**:

- Too vague to validate
- Missing specific preconditions
- No clear expected result

### 8.4 Iterative Development Best Practices

- **Add incrementally**: New requirements can be added to a change at any time
- **Validate frequently**: Use `openspec validate` to ensure format correctness
- **Version control**: Include OpenSpec documents in Git
- **Archive promptly**: Use `openspec archive` to archive a change after development is complete
- **Brownfield projects — start small**: For projects with existing legacy code, start by creating the first Change for a small, relatively independent feature. Build the spec system gradually; do not attempt to retroactively spec all legacy code at once

### 8.5 AI Collaboration Best Practices

#### 8.5.1 OPSX Slash Commands (Recommended)

OpenSpec 1.0+ introduced the new OPSX workflow, replacing the old phase-locked mode. All commands are installed into the corresponding AI tool directory via `openspec init`.

**Default Core configuration (4 commonly used commands)**:

| Command                       | Purpose                                                                                                                                                                |
| :---------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/opsx:propose <description>` | Creates a change in one step and **intelligently generates** all planning documents (AI infers the kebab-case directory name and fills in proposal/design/specs/tasks) |
| `/opsx:explore`               | Explore First: investigate problems and codebase before writing code. The recommended starting point for any change using the Explore First workflow.                  |
| `/opsx:apply`                 | Implement tasks following tasks.md                                                                                                                                     |
| `/opsx:archive`               | Complete and archive the current change                                                                                                                                |

**Extended workflow commands (enabled via `openspec config profile`)**:

| Command              | Purpose                                                                    |
| :------------------- | :------------------------------------------------------------------------- |
| `/opsx:new`          | Initialize change directory structure only, without creating documents     |
| `/opsx:continue`     | Create the next document in dependency order (step-by-step mode)           |
| `/opsx:ff`           | Fast-forward to generate all planning documents in one step                |
| `/opsx:verify`       | Verify that the implementation is consistent with the spec                 |
| `/opsx:sync`         | Merge Delta Specs into the main spec without archiving                     |
| `/opsx:bulk-archive` | Batch-archive multiple completed changes                                   |
| `/opsx:onboard`      | Guided 15-minute full-workflow walkthrough, ideal for onboarding new users |

> **Migration note**: Legacy commands (`/openspec:proposal`, `/openspec:apply`, `/openspec:archive`) were removed in v1.0.0. Mapping:
>
> - `/openspec:proposal` → `/opsx:propose`
> - `/openspec:apply` → `/opsx:apply`
> - `/openspec:archive` → `/opsx:archive`

**v1.5.0 New Features**:

- **Explore First**: Use the `/opsx:explore` command to enter exploration mode when you're uncertain, systematically think through problems, investigate the codebase, and clarify before proposing — avoiding blind development.
- **Fluid Workflow**: Enhanced iterative experience with editable documents at any time, no phase locks. Supports freely adjusting planning documents during implementation, truly achieving "fluid not rigid."
- **Stores (Cross-Repository Planning)**: Supports unified specification management across multiple repositories, ideal for multi-project collaboration scenarios in microservice architectures. Combined with the `/opsx:sync` command, delta specs can be synchronized to a unified main specification repository.

#### 8.5.2 Tips for Collaborating with AI

1. **Explore before proposing**: When unsure, use `/opsx:explore` to think things through, then use `/opsx:propose` once clear
2. **Embrace fluid iteration**: Discovered a design error during implementation? Simply edit the relevant document — no phase locks
3. **Periodically clear conversation context**: Before starting implementation tasks, it is recommended to clear the current conversation context to ensure high-quality instruction injection
4. **Iterate incrementally**: Validate after completing each requirement, then proceed to the next

### 8.6 Team Collaboration Best Practices

#### 8.6.1 Code Review Checklist

When reviewing a PR, check the OpenSpec documents:

- [ ] proposal.md has a clear Why and What
- [ ] Each Requirement has at least one Scenario
- [ ] Scenarios use standard Gherkin format
- [ ] Priority labels are reasonable
- [ ] No important edge case scenarios are missing

#### 8.6.2 Documentation Maintenance

- **Keep it up to date**: If you discover that the spec needs adjustment during implementation, update the document promptly
- **Change in sync**: If requirements change, update spec.md before modifying the code
- **Archive history**: Archived changes should retain a historical record for traceability

---

## 9. Appendix

### 9.1 Supported AI Tools

OpenSpec supports 20+ AI coding assistants. The most common ones are:

| Tool                   | Type           | Support Level                                                                |
| ---------------------- | -------------- | ---------------------------------------------------------------------------- |
| **Claude Code**        | CLI + IDE      | Full support                                                                 |
| **Qoder**              | IDE            | Full support                                                                 |
| **Cursor**             | IDE            | Full support                                                                 |
| **JetBrains Junie**    | IDE plugin     | Full support                                                                 |
| **Lingma IDE**         | IDE plugin     | Full support                                                                 |
| **ForgeCode**          | IDE plugin     | Full support                                                                 |
| **IBM Bob**            | IDE plugin     | Full support                                                                 |
| **GitHub Copilot**     | IDE plugin     | Full support                                                                 |
| **Cline**              | VS Code plugin | Full support                                                                 |
| **Windsurf**           | IDE            | Full support                                                                 |
| **Amazon Q Developer** | IDE plugin     | Full support                                                                 |
| **Gemini CLI**         | CLI            | Full support                                                                 |
| **Continue**           | IDE plugin     | Full support                                                                 |
| **Aider**              | CLI            | Supported (command-line tool; `openspec init` auto-generation not supported) |
| **Roo Code**           | VS Code plugin | Full support                                                                 |

### 9.2 Telemetry Settings

OpenSpec collects anonymous usage statistics to improve the product. To disable:

```bash
# Option 1: Set environment variable
export OPENSPEC_TELEMETRY=0

# Option 2: Use the universal telemetry opt-out flag
export DO_NOT_TRACK=1

# Option 3: Set permanently in your shell config file
echo 'export OPENSPEC_TELEMETRY=0' >> ~/.zshrc  # Zsh
echo 'export OPENSPEC_TELEMETRY=0' >> ~/.bashrc # Bash
```

### 9.3 FAQ

#### 9.3.1 Q1: What is the difference between OpenSpec and Swagger/OpenAPI?

| Feature          | OpenSpec                                    | OpenAPI/Swagger                        |
| ---------------- | ------------------------------------------- | -------------------------------------- |
| Primary purpose  | Spec-driven requirements development        | API interface documentation            |
| Document type    | Markdown                                    | YAML/JSON                              |
| Validation       | CLI validation + AI understanding           | Syntax validation                      |
| Applicable phase | Early development (requirements definition) | Mid-development (interface definition) |
| Target users     | Product managers + developers + AI          | Developers + frontend                  |

The two can be used together: use OpenSpec to define requirements and scenarios first, then use OpenAPI to define interface details.

#### 9.3.2 Q2: How do I introduce OpenSpec into an existing project?

1. Run `openspec init --tools none` in the project root
2. Create a change proposal for the next feature
3. Build the spec system incrementally; there is no need to cover all existing functionality at once

#### 9.3.3 Q3: What if the AI doesn't follow the spec after I write it?

1. Run `openspec update` to refresh Skills and command files
2. Restart the IDE to make slash commands take effect
3. Add specific constraints to the `rules:` field in `openspec/config.yaml`
4. Use `/opsx:apply` to have the AI start from the task list rather than asking it to write code directly

#### 9.3.4 Q4: Can multiple changes proceed simultaneously?

OpenSpec's change directory design naturally supports parallel workflows, but dependencies need to be managed reasonably.

Yes, multiple changes can proceed simultaneously. Each change is an independent folder and they do not interfere with each other. However, to reduce the risk of merge conflicts, it is recommended to:

- Avoid business or code dependencies between parallel changes during planning.
- Adopt a small-steps strategy, complete one change and archive it (`Archive`) before creating the next one.

#### 9.3.5 Q5: How to describe internal logic changes (e.g., database state changes) using externally observable behavior?

OpenSpec emphasizes "externally observable behavior", but this is not limited to front-end UI changes; it also includes inter-system interactions and changes in persisted state. For purely internal logic (e.g., a condition change that only reflects in the database), you can handle it in the following ways to maintain Spec consistency.

- **Expose Testing Boundaries**: Treat the final state of the database or cache as a verifiable "observable result". In the Spec, these changes in persisted state can be used as assertion conditions in scenarios (e.g., after an order is created, inventory data is accurately reduced by the corresponding amount).
- **Distinguish Business Contracts from Implementation Details**: If changes in internal logic affect the data structures or business rules of downstream systems, it is a contract change and must be explicitly stated in the Spec. If it is merely code refactoring (like swapping an algorithm without changing the result), it does not need to be reflected in the Spec at all; such content should be placed in `design.md` or `tasks.md`.

#### 9.3.6 Q6: Are BDD format Specs (Given/When/Then) written by AI or humans?

To ensure the accuracy of business logic and the stability of specifications, teams should adopt a collaborative model of **human-led design and AI-assisted generation**.

- **Human-led Core Logic**: Core business scenarios (such as main flows and key exception paths) must be designed by architects or developers to ensure business intent does not deviate.
- **AI-assisted Completion and Formatting**: AI is highly suitable for converting unstructured natural language requirements into standard BDD (Given/When/Then) format, or automatically deducing and supplementing edge scenarios based on core scenarios.
- **Human Review Closed Loop**: All Specs generated or modified by AI must undergo human review. Relying entirely on AI to generate from scratch often leads to unstable scenarios, missing details, or deviations from real business needs.

#### 9.3.7 Q7: How to maintain the readability of baseline Specs when business logic becomes complex (e.g., hundreds of lines in a single method)?

Complex business logic often makes Specs difficult to read. In such cases, architectural splitting and expression optimization are required to maintain document clarity and maintainability.

- **Domain and Module Splitting**: When a single business scenario becomes too large, follow Domain-Driven Design (DDD) principles to break down complex processes into independent sub-domains or modules, and create independent sub-Spec files for each module to prevent single files from expanding infinitely.
- **Elevate Abstraction Level**: The core of a Spec is to describe "business rules and input/output contracts", not the execution control flow of the code. Strictly avoid piling up code-like conditional branches in the Spec. For complex rule combinations, using Markdown Decision Tables is recommended for high-density, structured expression.
- **Reverse Drive Code Refactoring**: If a single method is hundreds of lines long making it hard for the Spec to correspond, this is usually a signal that the code structure needs optimization. At this point, the pain point of maintaining the Spec should be turned into motivation for code refactoring. By extracting the Strategy pattern or Domain Services, the code can be realigned with a clear domain model.

### 9.4 Reference Links

| Resource                       | Link                                                                 |
| ------------------------------ | -------------------------------------------------------------------- |
| Official repository            | <https://github.com/Fission-AI/OpenSpec>                             |
| Getting started                | <https://openspec.pro/getting-started/>                              |
| Official documentation         | <https://github.com/Fission-AI/OpenSpec/tree/main/docs>              |
| npm package                    | <https://www.npmjs.com/package/@fission-ai/openspec>                 |
| Companion slides (old version) | [openspec-user-manual-v1.pptx](../docs/openspec-user-manual-v1.pptx) |
| Companion slides (current)     | [openspec-user-manual-v2.pptx](../docs/openspec-user-manual-v2.pptx) |

---

_Document version: 3.0_
_Last updated: 2026-07-08_
_Includes OpenSpec v1.5.0 updates: Explore First, Fluid Workflow, Stores (cross-repo planning)._
