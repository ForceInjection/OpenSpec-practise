# OpenSpec Practise

本项目起源于“AI 原力注入”社区关于 AI 编程的深度探讨。针对社区提出的“利用 OpenSpec 实现 Spec 驱动开发”这一构想，本项目通过一个完整的实战案例，演示了 OpenSpec 规范在 AI 辅助编程中的具体应用。

作为 OpenSpec 的学习与实践仓库，本项目提供了系统的文档分析及多语言示例，旨在帮助开发者深入理解并高效应用该规范。

## 项目结构

本项目主要由以下三个核心模块构成：

### 1. 文档

存放 OpenSpec 的理论分析与实践指南，帮助理解规范背后的思想与工作流。

- **[openspec-practical-guide.md](docs/openspec-practical-guide.md)**: OpenSpec 的具体落地实践指南。

  > "OpenSpec 不仅仅是一套文档格式，更是一种 **Spec 驱动开发 (Spec-Driven Development)** 的工程实践。它主张“以规格为源”，确保代码与测试始终与设计保持一致。" —— _OpenSpec 实战指南_

- **[openspec-ai-workflow-analysis.md](docs/openspec-ai-workflow-analysis.md)**: 深度解析 OpenSpec 在 AI 编程工作流中的角色与价值。
  > "传统的开发模式是 **需求 -> 人 -> 代码**，而新的范式正在演变为 **意图 -> Spec (OpenSpec) -> AI -> 代码 & 验证**。" —— _OpenSpec AI 工作流程分析_

---

### 2. 示例代码

基于电商场景 (E-commerce) 的多语言最小化实现 (MVP)，展示 OpenSpec 规范如何驱动代码落地。

- **`ecommerce-mini` (Node.js)**
  - `src/domain`: 核心业务逻辑，纯净的领域层。
  - `src/http`: API 接口实现。
  - `__tests__`: 配套的测试用例。

- **`ecommerce-mini-python` (Python)**
  - `src/domain`: Pydantic 定义的领域模型。
  - `src/api`: FastAPI 实现的接口服务。
  - `tests`: Pytest 测试套件。

### 3. OpenSpec 规范

记录项目的规范定义、设计演进与变更历史。

- **`changes/v1-mvp`**: MVP 版本的完整规范定义。
  - `specs/api`: 接口定义。
  - `specs/domain`: 领域模型定义。
  - `design.md` & `proposal.md`: 设计决策与提案文档。

---

## 快速开始

### Node.js 示例

进入 `examples/ecommerce-mini` 目录：

```bash
# 安装依赖 (虽然本项目无外部依赖，但建议保持此习惯)
npm install

# 运行测试 (使用 Node.js 内置测试运行器)
npm test

# 启动服务 (默认监听 3000 端口)
npm start
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
