# OpenSpec Practise

🌐 [English Version](./README-en.md) | 🇨🇳 中文版

本项目起源于"AI 原力注入"社区关于 AI 编程的深度探讨。针对社区提出的"利用 OpenSpec 实现 Spec 驱动开发"这一构想，本项目通过一个完整的实战案例，演示了 OpenSpec 规范在 AI 辅助编程中的具体应用。

作为 OpenSpec 的学习与实践仓库，本项目提供了系统的文档分析、详细的使用手册及多语言示例，旨在帮助开发者深入理解并高效应用该规范。

---

**Star History**:

## ![Star History Chart](https://api.star-history.com/svg?repos=ForceInjection/OpenSpec-practise&type=date&legend=top-left)

---

## 项目结构

本项目主要由以下五个核心模块构成：

### 1. AI 工具配置

通过 `openspec init --tools claude` 生成的 AI 协作命令与技能，位于 `.claude/`。

- **`.claude/commands/opsx/`**: 斜杠命令定义（`/opsx:explore`、`/opsx:propose`、`/opsx:apply`、`/opsx:sync`、`/opsx:archive`）。
- **`.claude/skills/`**: 对应的 AI 技能文件（SKILL.md），定义每步操作的详细指令。

### 2. 文档

存放 OpenSpec 的理论分析与实践指南，帮助理解规范背后的思想与工作流。

- **[OpenSpec使用手册](docs/openspec-user-manual.md)**: OpenSpec 的完整使用手册，涵盖安装、初始化、文档规范、验证、最佳实践等内容。

  > "OpenSpec 是一个**规范驱动开发（Spec-Driven Development, SDD）框架**，专为 AI 编程助手设计。它通过在编写代码之前先定义规范，确保人与 AI 对需求达成一致。" —— _OpenSpec 使用手册_

  配套幻灯片：[旧版 PPT](docs/openspec-user-manual-v1.pptx) · [当前版 PPT](docs/openspec-user-manual-v2.pptx)

- **[OpenSpec 实战指南](docs/openspec-practical-guide.md)**: OpenSpec 的具体落地实践指南。

  > "OpenSpec 不仅仅是一套文档格式，更是一种 **Spec 驱动开发 (Spec-Driven Development)** 的工程实践。它主张'以规格为源'，确保代码与测试始终与设计保持一致。" —— _OpenSpec 实战指南_

- **[OpenSpec 实战指南：AI 辅助软件工程全流程深度复盘](docs/openspec-ai-workflow-analysis.md)**: 深度解析 OpenSpec 在 AI 编程工作流中的角色与价值。
  > "传统的开发模式是 **需求 -> 人 -> 代码**，而新的范式正在演变为 **意图 -> Spec (OpenSpec) -> AI -> 代码 & 验证**。" —— _OpenSpec AI 工作流程分析_

---

### 3. 示例代码

基于电商场景 (E-commerce) 的多语言最小化实现 (MVP)，展示 OpenSpec 规范如何驱动代码落地。

- **`ecommerce-mini` (Node.js)**
  - `src/domain`: 核心业务逻辑，纯净的领域层。
  - `src/http`: API 接口实现。
  - `src/services`: 业务服务层。
  - `src/repo`: 内存数据存储。
  - `src/persist`: 文件持久化存储。
  - `__tests__`: 配套的测试用例（单元测试、集成测试、性能测试）。

- **`ecommerce-mini-python` (Python)**
  - `src/domain`: Pydantic 定义的领域模型。
  - `src/services`: 业务服务层。
  - `src/api`: FastAPI 实现的接口服务。
  - `src/repo`: 内存数据存储。
  - `tests`: Pytest 测试套件。

### 4. OpenSpec 规范

SDD 工作流的完整规范文件，统一存放于 `openspec/`。

- **`openspec/config.yaml`**: 项目上下文配置（技术栈、约定规则、store/references 支持），自动注入每次 AI 规划请求。
- **`openspec/specs/`**: 归档后的主规范（cart-management、catalog-management、order-management、payment、domain-model、error-handling）。
- **`openspec/changes/archive/2025-01-27-v1-mvp/`**: MVP 版本的完整变更规范（已归档）。
  - `proposal.md`: 变更提案（Why / What Changes / Capabilities）。
  - `design.md`: 系统架构设计。
  - `tasks.md`: 实施任务清单。
  - `specs/domain-model/spec.md`: 核心领域模型规范。
  - `specs/catalog-management/spec.md`: 商品管理规范。
  - `specs/cart-management/spec.md`: 购物车管理规范。
  - `specs/order-management/spec.md`: 订单管理规范。
  - `specs/payment/spec.md`: 支付规范。
  - `specs/error-handling/spec.md`: 错误处理规范。

### 5. 测试数据

示例项目使用的测试数据文件。

- **`examples/ecommerce-mini/data/`**: Node.js 版本的测试数据。
  - `products.json`: 商品数据。
  - `carts.json`: 购物车数据。
  - `orders.json`: 订单数据。

---

## 核心特性

本项目基于 **OpenSpec v1.5.0**，演示了以下核心特性：

- **探索优先（Explore First）**: `/opsx:explore` 作为思考伙伴，在编写任何规范或代码之前先调查代码库、权衡选项、澄清需求——零成本的低风险探索。
- **规范驱动开发**: 先定义规范，再编写代码，确保 AI 与人对需求达成一致。
- **流式迭代（Fluid Workflow）**: Propose → Apply → Archive 各阶段不再锁死。可随时回溯修改规范，explore 可穿插在任意阶段。
- **双语言实现**: 使用相同的规范驱动 Node.js (零依赖) 和 Python (FastAPI + Pydantic) 两套实现。
- **完整测试覆盖**: 单元测试、集成测试、性能测试。
- **Stores (Beta)**: 支持跨仓库规划。将规划集中在一个独立的 store 仓库中，多个代码仓库通过 `references` 引用只读上下文。

---

## DDD 到 OpenSpec 映射

领域驱动设计（DDD）的战略洞察与 OpenSpec 的结构化规范相融合，构建了从领域模型到工程代码的高可靠衔接体系。下述 DDD 产出物向 OpenSpec 工作流转化的标准映射路径，均提炼自开源技能库项目 [domain-driven-design-skills](https://github.com/ForceInjection/domain-driven-design-skills)（详见 `ddd-openspec-mapping.md` 文档）。

### 1. 战略对齐与目录映射

在战略层面，通过将 DDD 的空间划分方法论引入 OpenSpec 的目录结构，可以实现设计与规格的天然对应。

DDD 的“限界上下文”对应 OpenSpec 中 `specs/` 目录下的子领域目录。这种对齐方式确保了每一个 DDD 识别出的业务边界在工程规格中都有明确的归属。同时，通过在 `openspec/config.yaml` 中声明这种映射关系，可以为 AI Agent 提供全局的架构上下文。

```yaml
# openspec/config.yaml 示例：领域与限界上下文的映射配置
context: |
  ## 项目领域映射
  本系统遵循 DDD 设计，核心限界上下文包括：
  - 用户管理上下文
  - 订单管理上下文
  - 支付上下文
```

### 2. 战术落地与结构映射

战术设计决定了代码实现的质量。OpenSpec 提供了一套结构化的表达方式，将 DDD 的构造块转化为可验证、可执行的任务序列。

下表展示了 OpenSpec 核心组件与 DDD 产出物的具体映射关系：

| OpenSpec 规范结构       | 对应的 DDD 产出物                                    | 描述与说明                                  |
| :---------------------- | :--------------------------------------------------- | :------------------------------------------ |
| **领域（Domain）**      | **限界上下文（Bounded Context）**                    | 一个领域目录对应一个限界上下文。            |
| **需求（Requirement）** | **领域服务（Domain Service）** / **命令（Command）** | 描述一个核心业务功能或操作。                |
| **场景（Scenario）**    | **聚合（Aggregate）行为**                            | 使用 Given/When/Then 格式精确描述聚合行为。 |
| **技术设计（Design）**  | **应用服务（Application Service）**                  | 协调多个领域服务，管理事务与安全。          |
| **实施任务（Tasks）**   | **战术设计待办列表**                                 | 将实体、值对象、仓储接口等具体实现任务化。  |

### 3. 工作流驱动的生命周期

OpenSpec v1.5.0 的工作流与 DDD 的迭代建模高度契合，特别强调探索优先和存量优先的重构能力。

- **探索（Explore）**：使用 `/opsx:explore` 以零成本调查代码库、对比方案、澄清需求。DDD 的「战略风暴」可在探索阶段自然展开。
- **提案（Propose）**：使用 `/opsx:propose` 初始化变更，通过 `openspec instructions` 动态获取模板和上下文，沉淀领域建模结论。
- **实施（Apply）**：利用 AI 依据规范进行代码实现与自动化验证，可随时回溯修改规范，不锁死阶段。
- **同步（Sync）**：归档前将增量 spec 变更合并至主规范目录。
- **归档（Archive）**：通过 `openspec archive` 将变更移至 `changes/archive/`，确保领域知识的单一事实来源。

---

## 快速开始

### Node.js 示例

进入 `examples/ecommerce-mini` 目录：

```bash
# 安装依赖 (虽然本项目无外部依赖，但建议保持此习惯)
npm install

# 运行测试 (使用 Node.js 内置测试运行器)
npm test

# 启动开发服务 (内存存储，默认监听 3000 端口)
npm start

# 启动生产服务 (文件持久化、鉴权，默认监听 3002 端口)
npm run start:prod
```

### Python 示例

进入 `examples/ecommerce-mini-python` 目录：

```bash
# 安装依赖
pip install -r requirements.txt

# 运行测试
pytest

# 启动服务 (默认监听 8000 端口)
python -m uvicorn src.api.server:app --reload
```

---

## 学习路径

推荐按以下顺序学习：

1. **入门**: 阅读 [OpenSpec使用手册](docs/openspec-user-manual.md)，了解 OpenSpec 的基本概念和使用方法。
2. **实践**: 阅读 [OpenSpec 实战指南](docs/openspec-practical-guide.md)，理解如何在实际项目中应用。
3. **深入**: 阅读 [OpenSpec 实战指南：AI 辅助软件工程全流程深度复盘](docs/openspec-ai-workflow-analysis.md)，了解 AI 协作的最佳实践。
4. **动手**: 运行 `examples/ecommerce-mini` 和 `examples/ecommerce-mini-python`，体验规范驱动开发。两个实现均为同一套 OpenSpec 规范的产物。
5. **实践 v1.5.0 工作流**: 查看 `openspec/changes/archive/2026-07-08-add-product-get-by-id/`，这是用 v1.5.0 完整工作流（Explore → Propose → Apply → Sync → Archive）新增的「按 ID 查询单个商品」功能。对比该 change 中的 proposal/design/specs/tasks 与最终代码改动（`server.js`、`server.py`），理解 SDD 从规范到实现的完整链路。
6. **研究**: 查看 `openspec/changes/archive/2025-01-27-v1-mvp/` 下的 MVP 规范文件，了解一个完整系统的规范如何从零构建。

---

## 配套 AI 技能

为了在实际开发中更高效地落地 OpenSpec 规范，本项目推荐搭配专用的 AI 助手技能进行协作。

- **[OpenSpec Assistant](https://github.com/ForceInjection/awesome-skills/tree/main/skills/openspec-assistant)**: 这是一个专为执行 OpenSpec 规范驱动开发 (SDD) 而设计的 AI 技能。它涵盖了意图对齐、规范生成、代码实现与自动化验证的完整生命周期。同时支持架构师 (编写与评审 Spec) 、开发者 (编写代码) 和 QA (编写测试) 等多角色协同工作，并原生支持本项目的 `/opsx` 指令体系。

---

## 相关链接

- [CHANGELOG](./CHANGELOG.md) — 本项目跟随 OpenSpec 版本的演进记录
- [OpenSpec 官方仓库](https://github.com/Fission-AI/OpenSpec)
- [OpenSpec 官方文档](https://github.com/Fission-AI/OpenSpec/tree/main/docs)
- [npm 包](https://www.npmjs.com/package/@fission-ai/openspec)
- [DDD 技能库在线项目](https://github.com/ForceInjection/domain-driven-design-skills)
