# OpenSpec Practise

🌐 English Version | 🇨🇳 [中文版](./README.md)

This project originated from in-depth discussions on AI programming within the "AI Force Injection" community. In response to the community's vision of "leveraging OpenSpec for Spec-Driven Development," this project demonstrates the practical application of the OpenSpec specification in AI-assisted programming through a complete hands-on example.

As a learning and practice repository for OpenSpec, this project provides systematic documentation analysis, detailed user manuals, and multi-language examples, aimed at helping developers deeply understand and efficiently apply the specification.

---

**Star History**:

## ![Star History Chart](https://api.star-history.com/svg?repos=ForceInjection/OpenSpec-practise&type=date&legend=top-left)

---

## Project Structure

This project consists of five core modules:

### 1. AI Tool Configuration

AI collaboration commands and skills generated via `openspec init --tools claude`, located in `.claude/`.

- **`.claude/commands/opsx/`**: Slash command definitions (`/opsx:explore`, `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive`).
- **`.claude/skills/`**: Corresponding AI skill files (SKILL.md) with detailed step-by-step instructions.

### 2. Documentation

Contains theoretical analysis and practical guides for OpenSpec, helping to understand the ideas and workflows behind the specification.

- **[OpenSpec User Manual](docs-en/openspec-user-manual.md)**: The complete user manual for OpenSpec, covering installation, initialization, documentation standards, validation, best practices, and more.

  > "OpenSpec is a **Spec-Driven Development (SDD) framework** designed specifically for AI programming assistants. It ensures that humans and AI reach a shared understanding of requirements by defining specifications before writing code." — _OpenSpec User Manual_

  Companion slides: [Legacy PPT](docs/openspec-user-manual-v1.pptx) · [Current PPT](docs/openspec-user-manual-v2.pptx)

- **[OpenSpec Practical Guide](docs-en/openspec-practical-guide.md)**: A concrete implementation guide for putting OpenSpec into practice.

  > "OpenSpec is not just a documentation format — it is an engineering practice of **Spec-Driven Development**. It advocates 'specification as the source of truth,' ensuring that code and tests always remain consistent with the design." — _OpenSpec Practical Guide_

- **[OpenSpec Practical Guide: A Deep Retrospective on AI-Assisted Software Engineering End-to-End](docs-en/openspec-ai-workflow-analysis.md)**: An in-depth analysis of the role and value of OpenSpec in AI programming workflows.
  > "The traditional development model is **Requirements -> Human -> Code**, while the new paradigm is evolving into **Intent -> Spec (OpenSpec) -> AI -> Code & Verification**." — _OpenSpec AI Workflow Analysis_

---

### 3. Example Code

A minimal multi-language implementation (MVP) based on an e-commerce scenario, demonstrating how the OpenSpec specification drives code delivery.

- **`ecommerce-mini` (Node.js)**
  - `src/domain`: Core business logic, a clean domain layer.
  - `src/http`: API interface implementation.
  - `src/services`: Business service layer.
  - `src/repo`: In-memory data storage.
  - `src/persist`: File-based persistent storage.
  - `__tests__`: Accompanying test cases (unit tests, integration tests, performance tests).

- **`ecommerce-mini-python` (Python)**
  - `src/domain`: Domain models defined with Pydantic.
  - `src/services`: Business service layer.
  - `src/api`: API service implemented with FastAPI.
  - `src/repo`: In-memory data storage.
  - `tests`: Pytest test suite.

### 4. OpenSpec Specifications

Complete specification files demonstrating the SDD workflow, unified under `openspec/`.

- **`openspec/config.yaml`**: Project context configuration (tech stack, conventions, store/references support), automatically injected into each AI planning request.
- **`openspec/specs/`**: Archived master specifications (cart-management, catalog-management, order-management, payment, domain-model, error-handling).
- **`openspec/changes/archive/2025-01-27-v1-mvp/`**: Complete change specifications for the MVP version (archived).
  - `proposal.md`: Change proposal (Why / What Changes / Capabilities).
  - `design.md`: System architecture design.
  - `tasks.md`: Implementation task checklist.
  - `specs/domain-model/spec.md`: Core domain model specification.
  - `specs/catalog-management/spec.md`: Product catalog management specification.
  - `specs/cart-management/spec.md`: Shopping cart management specification.
  - `specs/order-management/spec.md`: Order management specification.
  - `specs/payment/spec.md`: Payment specification.
  - `specs/error-handling/spec.md`: Error handling specification.

### 5. Test Data

Test data files used by the example projects.

- **`examples/ecommerce-mini/data/`**: Test data for the Node.js version.
  - `products.json`: Product data.
  - `carts.json`: Cart data.
  - `orders.json`: Order data.

---

## Core Features

This project is based on **OpenSpec v1.5.0** and demonstrates the following core features:

- **Explore First**: `/opsx:explore` acts as a thinking partner — investigate the codebase, weigh options, and clarify requirements before writing any specs or code. Zero-cost, low-risk exploration.
- **Spec-Driven Development**: Define specifications first, then write code, ensuring AI and humans reach a shared understanding of requirements.
- **Fluid Workflow**: Propose → Apply → Archive phases are no longer locked. You can go back and revise specs at any time, and explore can be interleaved at any stage.
- **Dual-Language Implementation**: Using the same specification to drive both Node.js (zero dependencies) and Python (FastAPI + Pydantic) implementations.
- **Comprehensive Test Coverage**: Unit tests, integration tests, and performance tests.
- **Stores (Beta)**: Cross-repository planning support. Centralize planning in a standalone store repo, with multiple code repos referencing read-only context via `references`.

---

## DDD to OpenSpec Mapping

The strategic insights of Domain-Driven Design (DDD) combined with the structured specifications of OpenSpec build a highly reliable connection system from domain models to engineering code. The standard mapping paths for converting DDD deliverables into the OpenSpec workflow described below are distilled from the open-source skill repository project [domain-driven-design-skills](https://github.com/ForceInjection/domain-driven-design-skills) (see the `ddd-openspec-mapping.md` document for details).

### 1. Strategic Alignment and Directory Mapping

At the strategic level, by introducing DDD's spatial partitioning methodology into OpenSpec's directory structure, a natural correspondence between design and specification can be achieved.

The "Bounded Context" in DDD corresponds to the sub-domain directories under the `specs/` directory in OpenSpec. This alignment ensures that every business boundary identified by DDD has a clear attribution in the engineering specifications. Meanwhile, declaring this mapping relationship in `openspec/config.yaml` provides the AI Agent with a global architectural context.

```yaml
# openspec/config.yaml example: Domain and Bounded Context mapping configuration
context: |
  ## Project Domain Mapping
  This system follows DDD design, and core bounded contexts include:
  - User Management Context
  - Order Management Context
  - Payment Context
```

### 2. Tactical Implementation and Structure Mapping

Tactical design determines the quality of code implementation. OpenSpec provides a structured expression method to transform DDD building blocks into verifiable and executable task sequences.

The table below shows the specific mapping relationship between OpenSpec core components and DDD deliverables:

| OpenSpec Specification Structure | Corresponding DDD Deliverable    | Description and Explanation                                                                  |
| :------------------------------- | :------------------------------- | :------------------------------------------------------------------------------------------- |
| **Domain**                       | **Bounded Context**              | A domain directory corresponds to a bounded context.                                         |
| **Requirement**                  | **Domain Service** / **Command** | Describes a core business function or operation.                                             |
| **Scenario**                     | **Aggregate Behavior**           | Uses Given/When/Then format to precisely describe aggregate behavior.                        |
| **Design**                       | **Application Service**          | Coordinates multiple domain services, manages transactions and security.                     |
| **Tasks**                        | **Tactical Design Backlog**      | Tasks for concrete implementations like entities, value objects, repository interfaces, etc. |

### 3. Workflow-Driven Lifecycle

OpenSpec v1.5.0's workflow highly aligns with DDD's iterative modeling, with special emphasis on explore-first and brownfield-first refactoring capabilities.

- **Explore**: Use `/opsx:explore` to investigate the codebase, compare options, and clarify requirements at zero cost. DDD's strategic storming can unfold naturally during exploration.
- **Propose**: Use `/opsx:propose` to initialize changes, dynamically fetching templates and context via `openspec instructions` to consolidate domain modeling conclusions.
- **Apply**: Utilize AI to implement code and perform automated verification based on the specifications. Specifications can be revised at any time — phases are not locked.
- **Sync**: Merge incremental spec changes into the master specification directory before archiving.
- **Archive**: Move the change to `changes/archive/` via `openspec archive`, ensuring a single source of truth for domain knowledge.

---

## Quick Start

### Node.js Example

Navigate to the `examples/ecommerce-mini` directory:

```bash
# Install dependencies (no external dependencies in this project, but good practice)
npm install

# Run tests (using Node.js built-in test runner)
npm test

# Start development server (in-memory storage, listening on port 3000 by default)
npm start

# Start production server (file persistence, authentication, listening on port 3002 by default)
npm run start:prod
```

### Python Example

Navigate to the `examples/ecommerce-mini-python` directory:

```bash
# Install dependencies
pip install -r requirements.txt

# Run tests
pytest

# Start server (listening on port 8000 by default)
python -m uvicorn src.api.server:app --reload
```

---

## Learning Path

Recommended learning order:

1. **Getting Started**: Read the [OpenSpec User Manual](docs-en/openspec-user-manual.md) to understand the basic concepts and usage of OpenSpec.
2. **Practice**: Read the [OpenSpec Practical Guide](docs-en/openspec-practical-guide.md) to understand how to apply it in real projects.
3. **Deep Dive**: Read the [OpenSpec Practical Guide: A Deep Retrospective on AI-Assisted Software Engineering End-to-End](docs-en/openspec-ai-workflow-analysis.md) to learn best practices for AI collaboration.
4. **Hands-On**: Run `examples/ecommerce-mini` and `examples/ecommerce-mini-python` to experience spec-driven development firsthand. Both implementations are products of the same set of OpenSpec specifications.
5. **Practice v1.5.0 Workflow**: Browse `openspec/changes/archive/2026-07-08-add-product-get-by-id/`, a "query product by ID" feature added using the complete v1.5.0 workflow (Explore → Propose → Apply → Sync → Archive). Compare the proposal/design/specs/tasks in this change with the final code changes (`server.js`, `server.py`) to understand the complete SDD chain from specification to implementation.
6. **Practice v1.7.0 Workflow**: Read the [v1.7.0 Workflow Practice](docs-en/openspec-v1.7.0-workflow-practice.md), a "product search and price sort" feature added using the complete workflow (Explore → Propose → **Update** → Apply → Sync → Archive), demonstrating how `/opsx:update` revises planning artifacts mid-implementation while keeping them coherent. Artifacts in `openspec/changes/archive/2026-07-28-add-product-search/`.
7. **Research**: Browse the specification files under `openspec/changes/archive/2025-01-27-v1-mvp/` to learn how a complete system's specifications are built from scratch.

---

## Companion AI Skills

To more efficiently implement OpenSpec specifications in real-world development, this project recommends pairing with a dedicated AI assistant skill.

- **[OpenSpec Assistant](https://github.com/ForceInjection/awesome-skills/tree/main/skills/openspec-assistant)**: An AI skill designed specifically for executing OpenSpec Spec-Driven Development (SDD). It covers the complete lifecycle of intent alignment, specification generation, code implementation, and automated verification. It also supports multi-role collaboration among architects (writing and reviewing specs), developers (writing code), and QA engineers (writing tests), and natively supports the `/opsx` command system used in this project.

---

## Related Links

- [OpenSpec Official Repository](https://github.com/Fission-AI/OpenSpec)
- [OpenSpec Official Documentation](https://github.com/Fission-AI/OpenSpec/tree/main/docs)
- [npm Package](https://www.npmjs.com/package/@fission-ai/openspec)
- [DDD Skills Repository Online Project](https://github.com/ForceInjection/domain-driven-design-skills)
