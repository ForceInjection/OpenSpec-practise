# OpenSpec Practise

本项目起源于"AI 原力注入"社区关于 AI 编程的深度探讨。针对社区提出的"利用 OpenSpec 实现 Spec 驱动开发"这一构想，本项目通过一个完整的实战案例，演示了 OpenSpec 规范在 AI 辅助编程中的具体应用。

作为 OpenSpec 的学习与实践仓库，本项目提供了系统的文档分析、详细的使用手册及多语言示例，旨在帮助开发者深入理解并高效应用该规范。

## 项目结构

本项目主要由以下四个核心模块构成：

### 1. 文档

存放 OpenSpec 的理论分析与实践指南，帮助理解规范背后的思想与工作流。

- **[OpenSpec使用手册](docs/OpenSpec使用手册.md)**: OpenSpec 的完整使用手册，涵盖安装、初始化、文档规范、验证、最佳实践等内容。

  > "OpenSpec 是一个**规范驱动开发（Spec-Driven Development, SDD）框架**，专为 AI 编程助手设计。它通过在编写代码之前先定义规范，确保人与 AI 对需求达成一致。" —— _OpenSpec 使用手册_

- **[OpenSpec 实战指南](docs/openspec-practical-guide.md)**: OpenSpec 的具体落地实践指南。

  > "OpenSpec 不仅仅是一套文档格式，更是一种 **Spec 驱动开发 (Spec-Driven Development)** 的工程实践。它主张'以规格为源'，确保代码与测试始终与设计保持一致。" —— _OpenSpec 实战指南_

- **[OpenSpec 实战指南：AI 辅助软件工程全流程深度复盘](docs/openspec-ai-workflow-analysis.md)**: 深度解析 OpenSpec 在 AI 编程工作流中的角色与价值。
  > "传统的开发模式是 **需求 -> 人 -> 代码**，而新的范式正在演变为 **意图 -> Spec (OpenSpec) -> AI -> 代码 & 验证**。" —— _OpenSpec AI 工作流程分析_

---

### 2. 示例代码

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

### 3. OpenSpec 规范

记录项目的规范定义、设计演进与变更历史。

- **`openspec/changes/v1-mvp`**: MVP 版本的完整规范定义。
  - `proposal.md`: 变更提案，定义目标与范围。
  - `design.md`: 系统架构设计，包括分层架构与数据流。
  - `tasks.md`: 实施任务清单。
  - `specs/api/spec.md`: RESTful API 接口规范。
  - `specs/domain/spec.md`: 领域模型与业务规则规范。

### 4. 测试数据

示例项目使用的测试数据文件。

- **`ecommerce-mini/data/`**: Node.js 版本的测试数据。
  - `products.json`: 商品数据。
  - `carts.json`: 购物车数据。
  - `orders.json`: 订单数据。

---

## 核心特性

本项目演示了以下 OpenSpec 核心特性：

- **规范驱动开发**: 先定义规范，再编写代码，确保 AI 与人对需求达成一致。
- **多语言实现**: 使用相同的规范驱动 Node.js 和 Python 两套实现。
- **完整测试覆盖**: 单元测试、集成测试、性能测试。
- **生产级扩展**: 持久化存储、鉴权、幂等性、可观测性。

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

1. **入门**: 阅读 [OpenSpec使用手册](docs/OpenSpec使用手册.md)，了解 OpenSpec 的基本概念和使用方法。
2. **实践**: 阅读 [OpenSpec 实战指南](docs/openspec-practical-guide.md)，理解如何在实际项目中应用。
3. **深入**: 阅读 OpenSpec 实战指南：AI 辅助软件工程全流程深度复盘](docs/openspec-ai-workflow-analysis.md)，了解 AI 协作的最佳实践。
4. **动手**: 运行 `examples/ecommerce-mini` 和 `examples/ecommerce-mini-python`，体验规范驱动开发。
5. **研究**: 查看 `examples/openspec/changes/v1-mvp/` 下的规范文件，学习如何编写规范。

---

## 相关链接

- [OpenSpec 官方仓库](https://github.com/Fission-AI/OpenSpec)
- [OpenSpec 官方文档](https://github.com/Fission-AI/OpenSpec/tree/main/docs)
- [npm 包](https://www.npmjs.com/package/@fission-ai/openspec)
