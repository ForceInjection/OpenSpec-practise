# OpenSpec Practical Guide

## 1. Introduction

OpenSpec is a Spec-centric engineering methodology and toolchain designed to improve the determinism and verifiability of complex systems throughout the full cycle from design to delivery, through unified structured documents and automated workflows. This guide uses a complete small e-commerce website case study to demonstrate the full process — from architecture design, system design, and module design, to interface design, unit testing, integration testing (covering interface-layer acceptance), and performance testing — in order to facilitate adoption in real-world projects.

> **Further Reading**: For a deep retrospective on the AI collaboration workflow for this case (prompt design and interaction records) and cross-language replication validation in Python, see [OpenSpec Practical Guide: Deep Retrospective on AI-Assisted Software Engineering](./openspec-ai-workflow-analysis.md).
>
> **CLI Reference Manual**: For the complete command reference for the OpenSpec CLI (init, validate, archive, etc.), see [OpenSpec User Manual](./openspec-user-manual.md).
>
> **Training Materials**: This project includes companion presentation slides [OpenSpec User Manual](../docs/openspec-user-manual.pptx), suitable for team training and technical sharing.

---

## 2. Methodology and Core OpenSpec Concepts

OpenSpec is not merely a document format — it is an engineering practice of **Spec-Driven Development**. It advocates "spec as the source of truth", ensuring that code and tests always remain consistent with the design, solving the persistent problem in traditional development where "documentation lags behind the code".

### 2.1 Core Philosophy

> **Terminology Note**: In this document "spec" and "Spec" are used interchangeably, both referring to the document structure defined by OpenSpec; "specification" and "spec" may also be used interchangeably without distinction.

OpenSpec's design follows four core principles:

- **Fluid not rigid**: No forced checkpoints — create documents as needed.
- **Iterative not waterfall**: Learn while building, correct the spec at any time.
- **Easy not complex**: Lightweight startup, no cumbersome processes.
- **Brownfield-first**: Not only for new projects — can also be smoothly integrated into existing codebases via the Delta mechanism.

### 2.2 Directory Structure and Single Source of Truth

OpenSpec divides project state into two core areas, ensuring separation between "current state" and "the change process":

- **Project Configuration (`openspec/config.yaml`)**
  A project-level configuration file that declares the Schema type (`spec-driven`), project context (tech stack, architectural constraints, etc.), and rules for each document type. This configuration is injected into every AI planning request.

- **Source of Truth (`openspec/specs/`)**
  This is the description of the system's **current** actual behavior. All released features must have a corresponding spec definition here. The directory structure is organized by Capability, e.g., `catalog-management/spec.md`, `payment/spec.md`.

- **Proposed Changes (`openspec/changes/`)**
  This is for **in-progress** changes. Each change is an independent folder (e.g., `openspec/changes/add-login/`) containing complete context:
  - **Metadata (`.openspec.yaml`)**: The change's Schema type and creation time, managed automatically by the CLI.
  - **Proposal (`proposal.md`)**: **Why & What**. Describes the background, intent, scope, and capability list.
  - **Design (`design.md`)**: **How**. Technical solution, architecture diagrams, and data flow.
  - **Specs (Deltas)**: **Changes**. Draft spec modifications organized by Capability, one folder per capability.
  - **Tasks (`tasks.md`)**: **Steps**. Specific implementation steps and acceptance criteria.

When a change is developed and archived, its Delta Spec is merged into the main Spec, forming the new source of truth.

### 2.3 Workflow and CLI Tools

OpenSpec provides two primary workflow modes: CLI and Slash Commands (AI collaboration).

#### 2.3.1 Command-Line Tool (CLI)

The CLI (`openspec`) is suited for management operations by human developers:

- **Initialize (`init`)**: Generate the standard directory structure in one step, configure the `.openspec` environment.
- **Browse and view (`list` / `view`)**: Quickly retrieve existing changes and specs.
- **Validate (`validate`)**: Check the validity of document structure.
- **Archive (`archive`)**: Move completed changes to the archive area.

#### 2.3.2 AI Collaboration Commands (Slash Commands)

OpenSpec 1.0+ introduced the OPSX workflow, implementing a **dynamic command system** — AI no longer receives static instructions but actively queries the CLI to understand the current project state and document dependencies.

In supported AI editors (such as Cursor, Claude Code, Qoder, Junie, Lingma IDE, ForgeCode, and 20+ other tools), it is recommended to drive development using Slash Commands:

**Default Core Configuration**:

| Command                       | Purpose                                                                                           |
| :---------------------------- | :------------------------------------------------------------------------------------------------ |
| `/opsx:propose <description>` | Create a change and generate all planning documents in one step (proposal/design/specs/tasks)     |
| `/opsx:explore`               | Enter exploration mode — think through problems and investigate the codebase without writing code |
| `/opsx:apply`                 | Implement tasks according to tasks.md, dynamically reading the current change context             |
| `/opsx:archive`               | Complete and archive the current change, prompt whether to sync Delta Spec to the main spec       |

**Extended Workflow Commands** (enabled via `openspec config profile`)

| Command              | Purpose                                                               |
| :------------------- | :-------------------------------------------------------------------- |
| `/opsx:new`          | Initialize the change directory structure only (no documents created) |
| `/opsx:continue`     | Create the next document in dependency order (step-by-step mode)      |
| `/opsx:ff`           | Fast-forward to generate all planning documents at once               |
| `/opsx:verify`       | Verify that the implementation is consistent with the spec            |
| `/opsx:sync`         | Merge Delta Spec into the main spec (without archiving)               |
| `/opsx:bulk-archive` | Bulk-archive multiple completed changes                               |
| `/opsx:onboard`      | 15-minute full-process guided walkthrough                             |

The key difference between the OPSX workflow and the old version is: **actions, not phases**. You can edit any document at any time — there is no phase locking.

**v1.5.0 New Features**:

- **Explore First**: `/opsx:explore` is the recommended starting point. When uncertain, enter exploration mode to investigate the codebase, compare options, and clarify requirements — a zero-cost thinking phase that prevents blind development. See Chapter 6 of this guide for a real exploration process walkthrough.
- **Fluid Workflow**: Reinforces the "fluid not rigid" core philosophy. All planning documents can be freely adjusted during implementation — no phase locks. Discovered a design issue? Simply edit the relevant document; the AI automatically detects the change.
- **Stores (Cross-Repository Planning, Beta)**: When a project spans multiple code repositories (e.g., microservices, separate frontend/backend), centralized specification management is available through a standalone store repository. Each code repository declares read-only dependencies via `references`. See the [OpenSpec User Manual §3.5](./openspec-user-manual.md#35-file-descriptions).

### 2.4 Validation and Observability

- **Structured Validation**
  OpenSpec uses structured schemas (e.g., Zod) internally to validate Spec documents, ensuring that documents are not merely text but structured data conforming to a defined schema. This makes automatic Test Case Generation possible. Users only need to run `openspec validate` to trigger this validation, with no need to write schemas manually.

- **Telemetry**
  Built-in optional anonymous telemetry based on PostHog, used to collect command execution data (e.g., `command_executed`) to help teams analyze tool usage frequency and process bottlenecks. By design, it strictly follows privacy principles — no parameters, IP addresses, or business content are collected — and it can be completely disabled via the `OPENSPEC_TELEMETRY=0` environment variable.

---

## 3. Iteration Process Overview

OpenSpec's iteration process is centered on "spec-first", but does not mandate a cumbersome approval process.

### 3.1 Goals and Scope (Proposal)

Before any code begins, first use `proposal.md` to define **Why** and **What**.

- **Business Goal**: For example, "build a minimal viable e-commerce checkout flow".
- **Non-functional Targets (SLO)**:
  - p99 latency < 100ms
  - Support 50 RPS concurrency
  - In-memory data storage (Demo phase)

### 3.2 Spec Initialization

Use the CLI to quickly initialize the project structure (if you are using the `examples/ecommerce-mini` source code directly, this step is already complete and can be skipped):

```bash
openspec init --tools none
```

If you are using the companion source code, run the following command to confirm that the spec documents are complete and valid (v1-mvp has been archived to `changes/archive/`, shown here for historical reference):

```bash
openspec validate v1-mvp
```

Create a new changeset (e.g., `v1-mvp`) under `openspec/changes/`, containing the following files:

#### 3.2.1 `proposal.md` (Macro Intent)

This is the starting point of the project, clearly defining "why we are doing this" and "what the criteria for success are".

```markdown
# Proposal: Ecommerce Mini MVP

## Why

### Background

This project originated from in-depth community discussions about AI-assisted programming, and requires a complete hands-on case to demonstrate the specific application of OpenSpec specifications in AI-assisted programming.

### Problem Statement

A standardized way is needed to ensure that humans and AI reach consensus on requirements while keeping code and documentation in sync.

### Alternatives Considered

1. **Write code directly**: Fast but lacks documentation support.
2. **Traditional requirements documents**: Separated from code, easily becomes outdated.
3. **OpenSpec spec-driven**: Define the spec first, then write the code, maintaining consistency ✓ This approach was chosen.

## What Changes

### New Resources Added

- **Domain Models**: Core entities such as Product, User, Cart, Order.
- **API Interfaces**: RESTful interfaces for products, cart, orders, payments, etc.

### New Capabilities

- Product list query and listing.
- Cart management (add, remove).
- Order checkout and inventory deduction.

## Capabilities

### New Capabilities

- `catalog-management`: Product list query, product listing, and inventory deduction management
- `cart-management`: Cart item addition, removal, and quantity limits
- `order-management`: Order creation, order query, and total price calculation
- `payment`: Order payment and status transitions
- `domain-model`: Core business entity definitions
- `error-handling`: Unified error response format and standard error code system

### Modified Capabilities

(None — this is a brand-new MVP project)

## Impact

- **Affected Code**: `ecommerce-mini/src/` (Node.js), `ecommerce-mini-python/src/` (Python)
- **New APIs**: 8 REST endpoints (GET /api/products, POST /api/products, POST /api/cart/items, DELETE /api/cart/items/:id, POST /api/orders, GET /api/orders/:id, POST /api/payments/:orderId, GET /metrics)
- **Dependencies**: Node.js has zero npm dependencies; Python depends on FastAPI + Pydantic

## Scope

### In Scope

- Product list query and listing.
- Cart management (add, remove).
- Order checkout and inventory deduction.
- Payment simulation.
- In-memory storage and file persistence.

### Out of Scope

- Complex search and recommendations.
- Real payment gateway integration.
- Admin management interface.

## Goals (SLO)

- **Latency**: Core interface p99 < 100ms.
- **Concurrency**: Support 50 RPS.
- **Quality**: Core logic test coverage > 80%.
```

#### 3.2.2 Other Core Files

- `design.md`: System design draft (architecture diagrams, data flow).
- `specs/`: Specific interface definitions and data models.
- `tasks.md`: Decomposed development tasks.

### 3.3 Architecture and System Design

Based on the Proposal, determine the following in `design.md`:

- **Boundaries**: Clarify the responsibilities of modules such as Catalog, Cart, Order, and User.
- **Data Flow**: Map the critical path of "user -> add to cart -> place order -> pay".
- **Interface**: Define the URL structure and verbs for the RESTful API.

### 3.4 Spec-Driven Implementation

This is the core of OpenSpec — **code is a mapping of the spec**.

- Domain Layer (`domain/`): Directly maps the data models in the Spec.
- Interface Layer (`http/`): Directly maps the API definitions in the Spec.
- Test Layer (`__tests__/`): Directly maps the acceptance criteria (Scenarios) in the Spec.

### 3.5 Validation and Measurement

- **Automated Testing**: Run unit tests and integration tests to ensure the implementation conforms to the Spec.
- **Baseline Measurement**: Run performance benchmark tests (`performance.spec.js`) during the development phase to ensure SLOs are met.
- **Spec Validation**: Use the `openspec validate` command to verify that the spec document format is correct.

```bash
# Validate the change spec (v1-mvp has been archived, shown for historical reference)
openspec validate v1-mvp

# Successful validation output (example)
Change 'v1-mvp' is valid
```

> **Note**: The validate command checks Proposal section completeness, directory structure, Delta Header format, and Scenario coverage. For detailed validation rules and troubleshooting, see [OpenSpec User Manual - 6. Validation and Common Errors](./openspec-user-manual.md#6-validation-and-common-errors).

### 3.6 Archiving and Knowledge Consolidation

When `v1-mvp` development is complete and has passed acceptance, run `/opsx:archive` (recommended) or the CLI command `openspec archive`. This merges the Specs from the changeset into the main spec directory (`openspec/specs/`), making them the latest source of truth for the system.

---

## 4. Case Background: Small E-Commerce Website

### 4.1 Core Domains and Contexts

This case builds a micro e-commerce system called `ecommerce-mini`, containing five core contexts:

- **Catalog**: Manages product information and inventory.
- **User**: Identity recognition and authentication.
- **Cart**: Temporary storage of items to be purchased.
- **Order**: The core transaction document and status transitions.
- **Payment**: Simulated funds settlement.

### 4.2 Simplifying Assumptions

To focus on the OpenSpec process, the following engineering trade-offs were made:

- **Data Storage**: Uses only in-memory Maps or local files, with no dependency on external databases.
- **Monolithic Architecture**: All modules run in the same Node.js process and communicate via module imports.
- **Environment Dependencies**: Only Node.js (v20+) is required, zero npm dependencies (except for production-grade extensions).

### 4.3 Non-Functional Goals

- **Latency**: Core APIs (GET /products, POST /orders) p99 < 100ms.
- **Reliability**: Order data is not lost after service restarts (requires persistence extension).
- **Quality**: Core business logic coverage > 80%.

---

## 5. Architecture Design

### 5.1 Layered Architecture

This project uses a classic four-layer architecture to ensure separation of concerns:

| Layer                 | Directory (`src/`)  | Responsibilities                                                                    | Dependency Direction  |
| :-------------------- | :------------------ | :---------------------------------------------------------------------------------- | :-------------------- |
| **Interface Layer**   | `http/`             | Handle HTTP requests, parameter parsing, authentication, response formatting        | -> Application        |
| **Application Layer** | `services/`         | Use case orchestration, e.g., "place order" involves deducting stock, clearing cart | -> Domain, Repo       |
| **Domain Layer**      | `domain/`           | Pure business entities (`types.js`) and logic, no external dependencies             | None                  |
| **Infrastructure**    | `repo/`, `persist/` | Data persistence implementation (Memory/File)                                       | Implementation Detail |

### 5.2 Boundaries and Dependency Rules

- **Strictly unidirectional dependency**: HTTP -> Service -> Domain.
- **Dependency inversion**: The Service layer defines Repository interfaces; the Infrastructure layer implements them (simplified to direct calls in this example).
- **Data isolation**: Modules do not directly access each other's databases — they must call through Service interfaces.

### 5.3 Data Flow Overview

Using the "place order" scenario as an example:

1. **User** initiates a `POST /api/orders` request.
2. **HTTP Layer** parses the Token and verifies user identity.
3. **Order Service** receives the request:
   - Calls **Cart Service** to retrieve the current cart items.
   - Calls **Catalog Service** to deduct inventory (transaction consistency boundary).
   - Calculates the total price and generates the order entity.
4. **Order Repo** saves the order data.
5. **HTTP Layer** returns `201 Created` with the order details.

---

## 6. System Design

### 6.1 Interface Protocol

Standard RESTful JSON style is used.

- **URL Convention**: Resource names in plural form, e.g., `/api/products`.
- **Status Codes**:
  - `200 OK`: Query/modification successful.
  - `201 Created`: Resource creation successful.
  - `400 Bad Request`: Business validation failed (e.g., cart is empty).
  - `401 Unauthorized`: Not logged in.
  - `409 Conflict`: Resource conflict (e.g., insufficient stock).

### 6.2 Data Models

In OpenSpec, we first define the models in `changes/archive/2025-01-27-v1-mvp/specs/domain-model/spec.md`. Spec files must use the Delta Header + Requirement + Scenario format:

**Spec Definition (`changes/archive/2025-01-27-v1-mvp/specs/domain-model/spec.md`)**:

```markdown
# Domain Model Specification

## Overview

Core business entity definitions, with no dependency on any external framework.

## ADDED Requirements

### Requirement: Product Entity Definition

The system SHALL define a product entity containing a unique identifier, name, price, and stock.

**Priority**: P0 (Critical)

**Rationale**: Products are the core entity of an e-commerce system and the foundation of all transactions.

#### Scenario: Create a Valid Product

Given a new product needs to be created
When product information is provided: { id, name, priceCents, stock }
Then the product entity is created successfully
And the id format is prod_xxxx
And priceCents >= 0
And stock >= 0

---

### Requirement: Non-negative Stock Validation

Stock MUST NOT become negative after deduction.

**Priority**: P0 (Critical)

**Rationale**: Negative stock leads to overselling and affects business accuracy.

#### Scenario: Deduct Stock When Insufficient

Given a product has a stock of 5
When an attempt is made to deduct 6 units of stock
Then an OUT_OF_STOCK error is thrown
And the stock remains unchanged
```

**Code Implementation (`src/domain/types.js` / JSDoc)**:

Since this project uses plain JS, we implement the Spec mapping via JSDoc:

```javascript
/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {number} priceCents
 * @property {number} stock
 */
```

### 6.3 Error Handling

Unified error response structure for easy front-end processing:

```json
{
  "code": "OUT_OF_STOCK",
  "message": "Product [prod_123] is out of stock"
}
```

---

## 7. Module Detailed Design

### 7.1 Catalog (Product Domain)

- **Capabilities**:
  - `listProducts()`: Full query (no pagination in Demo).
  - `getProduct(id)`: Detail query.
  - `deductStock(id, qty)`: Atomic stock deduction, must handle concurrent contention (simplified to a single-threaded lock in Demo).

### 7.2 Cart (Cart Domain)

- **Capabilities**:
  - `addToCart(userId, item)`: Incremental update.
  - `clearCart(userId)`: Clear after order placement.
- **Storage**: Key is `userId`, Value is a `Cart` object.

### 7.3 Order (Order Domain)

- **Capabilities**:
  - `createOrder(userId)`: Core complex logic, coordinates Cart and Catalog.
  - `payOrder(orderId)`: Status transition `PENDING` -> `PAID`.

---

## 8. Interface Design

A key advantage of OpenSpec is using **Markdown** to write highly readable spec documents while maintaining structure. In v1.2.0, specs are organized by Capability, one folder per capability. The following are real excerpts from `openspec/changes/archive/2025-01-27-v1-mvp/specs/catalog-management/spec.md` and `openspec/changes/archive/2025-01-27-v1-mvp/specs/order-management/spec.md`:

```markdown
# Catalog Management Specification

## Overview

Product catalog management capability, covering product queries, listing, and inventory management.

## ADDED Requirements

### Requirement: Product List Query

The system SHALL provide a product list query interface that returns all available products.

**Priority**: P0 (Critical)

**Rationale**: Product browsing is the core entry function of an e-commerce system; users must be able to view purchasable products.

#### Scenario: Get All Products

Given product data exists in the system
When the user requests GET /api/products
Then a status code of 200 is returned
And a product array Product[] is returned
```

```markdown
# Order Management Specification

## Overview

Order management capability, covering order creation, query, and total price calculation.

## ADDED Requirements

### Requirement: Order Creation

The system SHALL support settling a user's shopping cart to create an order, handling inventory deduction and cart clearing in the process.

**Priority**: P0 (Critical)

**Rationale**: Order creation is the core transaction process, involving coordination of multiple modules (Cart -> Catalog -> Order).

#### Scenario: Successfully Create an Order

Given the user has items in their shopping cart
And the product inventory is sufficient
When a POST /api/orders request is sent with { userId }
Then a status code of 201 is returned
And the newly created Order is returned
And the order status is PENDING_PAYMENT
And the shopping cart is cleared
And the inventory is deducted

#### Scenario: Insufficient Inventory When Creating an Order

Given the user has items in their shopping cart
And the product inventory is insufficient
When a POST /api/orders request is sent with { userId }
Then a status code of 409 is returned
And the error code OUT_OF_STOCK is returned
```

> **Note**:
>
> - You must use `## ADDED/MODIFIED/REMOVED Requirements` as the Delta Header.
> - Each requirement uses the `### Requirement: <title>` format, and the description must contain `SHALL` or `MUST`.
> - Each requirement must include `**Priority**` and `**Rationale**` fields.
> - Each requirement must contain at least one `#### Scenario:` block in Gherkin format (Given/When/Then).
> - The `Product[]` and `Order` references here refer to data models defined in `domain-model/spec.md`, maintaining definition consistency.
>
>   **Format Check**: After writing, be sure to run `openspec validate <change-name>` to verify the format, and avoid blocking subsequent processes due to missing section headings or Scenarios. The command used in this case study was `openspec validate v1-mvp` (v1-mvp has been archived to `changes/archive/`).

## 9. Spec-Driven Implementation

This is the core of OpenSpec — **code is a mapping of the spec**. When writing code, developers (or AI) should always have the Spec file open as a reference.

### 9.1 Traceability Matrix

Establish a Spec ↔ Code ↔ Test mapping to ensure every Spec item has code coverage:

| Spec Definition (Requirements)     | Code Implementation                                   | Verification Method    |
| :--------------------------------- | :---------------------------------------------------- | :--------------------- |
| `POST /api/orders`                 | `src/http/server.js` (Route Handler)                  | Integration Test       |
| `Response 409: Stock insufficient` | `catch (e) { if (e.message === 'OUT_OF_STOCK') ... }` | Unit Test (Error Case) |
| `Order.totalCents` (Model)         | `src/domain/types.js` (Interface)                     | JSDoc / Code Review    |
| `p99 < 100ms` (SLO)                | `performance.spec.js` (Performance Test)              | CI Pipeline            |

**Practical Tip**: Reference the corresponding Spec section in code comments, e.g., `// Corresponds to Spec: POST /api/orders`.

### 9.2 Directory Structure Mapping

```text
OpenSpec-practise/
├── docs/                            <-- Documentation directory
│   ├── openspec-user-manual.md          <-- OpenSpec User Manual
│   ├── openspec-practical-guide.md  <-- Practical Guide (this document)
│   └── openspec-ai-workflow-analysis.md  <-- AI Collaboration Workflow Analysis
├── openspec/                        <-- OpenSpec spec directory
│   ├── config.yaml                  <-- Project configuration (tech stack, rules, etc.)
│   ├── specs/                       <-- Main spec (source of truth after archiving)
│   │   ├── catalog-management/spec.md
│   │   ├── cart-management/spec.md
│   │   ├── order-management/spec.md
│   │   ├── payment/spec.md
│   │   ├── domain-model/spec.md
│   │   ├── error-handling/spec.md
│   │   └── product-query/spec.md    <-- v1.5.0 added: query product by ID
│   └── changes/                     <-- Change directory
│       └── archive/                 <-- Archived changes
│           ├── 2025-01-27-v1-mvp/   <-- MVP change spec (archived)
│           │   ├── .openspec.yaml   <-- Change metadata
│           │   ├── proposal.md      <-- Corresponding proposal document
│           │   ├── design.md        <-- Corresponding design document
│           │   ├── tasks.md         <-- Corresponding task list
│           │   └── specs/           <-- Delta specs (organized by capability)
│           │       ├── catalog-management/spec.md
│           │       ├── cart-management/spec.md
│           │       ├── order-management/spec.md
│           │       ├── payment/spec.md
│           │       ├── domain-model/spec.md
│           │       └── error-handling/spec.md
│           └── 2026-07-08-add-product-get-by-id/  <-- v1.5.0 workflow practice
├── examples/
│   ├── ecommerce-mini/              <-- Node.js Implementation
│   │   └── src/
│   │       ├── domain/types.js      <-- Corresponds to Data Models in the Spec
│   │       ├── services/            <-- Corresponds to Business Rules in the Spec
│   │       ├── http/server.js       <-- Corresponds to API Definitions in the Spec
│   │       └── persist/             <-- Corresponds to Storage Strategy in the Design
│   └── ecommerce-mini-python/       <-- Python Implementation
```

### 9.3 Code Implementation Example

**Controller Layer (`src/http/server.js`)**:

```javascript
// Corresponds to Spec: POST /api/orders
if (pathname === "/api/orders" && req.method === "POST") {
  const body = await readJson(req);
  try {
    // Orchestrate business logic (Orchestration)
    // 1. Check cart (Rule: Cart Not Empty)
    // 2. Check inventory (Rule: Stock Check)
    // 3. Create order
    const order = orderService.createOrder(body.userId);
    return sendJson(res, 201, order);
  } catch (e) {
    if (e.message === "CART_EMPTY")
      return sendError(res, "CART_EMPTY", "Cart is empty", 400);
    if (e.message === "OUT_OF_STOCK")
      return sendError(res, "OUT_OF_STOCK", "Insufficient stock", 409);
    throw e;
  }
}
```

---

## 10. Validation and Evaluation: Ensuring Implementation Conforms to Spec

After writing code, how can you effectively evaluate consistency between the implementation and the Spec? This section introduces the validation methods and tools recommended by OpenSpec.

### 10.1 Traceability Matrix

The traceability matrix was already presented in [9.1 Traceability Matrix](#91-traceability-matrix). It is recommended to maintain it concurrently during the code-writing phase, ensuring every Spec item has a corresponding code implementation and test verification.

### 10.2 From Scenario to Test Case

OpenSpec's Gherkin-format scenarios are naturally suited for conversion into test cases:

**Scenario in the Spec** (`specs/order-management/spec.md`):

```gherkin
#### Scenario: Successfully Create an Order

Given the user has items in their shopping cart
And the product inventory is sufficient
When a POST /api/orders request is sent with { userId }
Then a status code of 201 is returned
And the newly created Order is returned
And the shopping cart is cleared
And the inventory is deducted
```

**Corresponding Integration Test** (`__tests__/integration.spec.js`):

> The following example assumes the test environment service is running at `http://localhost:3000` (the `base` variable points to that address).

```javascript
it('complete shopping flow', async () => {
  // 1. List product → Given product inventory is sufficient
  const res1 = await fetch(`${base}/api/products`, {...})
  assert.strictEqual(res1.status, 201)

  // 2. Add to cart → Given user has items in their shopping cart
  const res2 = await fetch(`${base}/api/cart/items`, {...})
  assert.strictEqual(res2.status, 200)

  // 3. Place order → When POST /api/orders is sent
  const res3 = await fetch(`${base}/api/orders`, {...})
  assert.strictEqual(res3.status, 201)  // Then status code 201 is returned
  const order = await res3.json()
  assert.strictEqual(order.totalCents, 1000)  // Then the newly created order is returned
  assert.strictEqual(order.status, 'PENDING_PAYMENT')
})
```

### 10.3 Relationship with TDD

OpenSpec **does not replace TDD — it works in concert with TDD**:

```text
Traditional TDD: Requirements → Write tests → Write code → Refactor
OpenSpec + TDD: Requirements → Write Spec → Validate Spec → Write tests (based on Scenarios) → Write code → Refactor
```

**Key Differences**:

- **Spec before tests**: The Spec is the shared understanding between humans and AI; tests are the technical implementation of the Spec
- **Direct Scenario mapping**: Each Gherkin Scenario can correspond to one test case
- **AI-readable**: Spec uses natural language + structured format; AI can directly participate in generating tests
- **Scenario as AI Prompt**: Each Gherkin Scenario can be used directly as a prompt for AI to generate test code, greatly improving efficiency in AI collaboration scenarios — simply paste a Scenario to AI to get a complete test case skeleton

> Encountering format errors? See [OpenSpec User Manual - 6. Validation and Common Errors](./openspec-user-manual.md#6-validation-and-common-errors) for troubleshooting.

### 10.4 Code Review Checklist

When reviewing a PR, check for consistency between implementation and Spec:

- [ ] Every Requirement has a corresponding code implementation
- [ ] Every Scenario has a corresponding test case
- [ ] Edge cases (e.g., insufficient stock, order not found) are covered
- [ ] SLO metrics (e.g., p99 latency) are validated with performance tests
- [ ] Code comments reference the corresponding Spec section

---

## 11. Test Design: Verifying the Spec

Tests are not an afterthought — they are the executable version of the spec.

### 11.1 Unit Tests (`src/domain/logic.spec.js`)

Targeting pure function logic, such as amount calculation and state machine transitions.

- _Spec_: "Order total equals the sum of unit price times quantity for all items"
- _Test_: Uses the Node.js native test runner

```javascript
import { test } from "node:test";
import assert from "node:assert";
import { calculateTotal } from "./logic.js";

test("calculateTotal sums up item prices", () => {
  const items = [
    { priceCents: 100, quantity: 2 },
    { priceCents: 50, quantity: 1 },
  ];
  const total = calculateTotal(items);
  assert.strictEqual(total, 250);
});
```

### 11.2 Integration Tests (`__tests__/integration.spec.js`)

Simulates real user paths, verifying inter-module collaboration.

- Flow: Register -> Login -> Browse -> Add to cart -> Place order -> Pay.
- How to run: `node --test examples/ecommerce-mini/__tests__/integration.spec.js`

### 11.3 Performance Baseline (`performance.spec.js`)

Defines and validates SLOs.

- _Spec_: "Order placement interface p99 < 100ms"
- _Test_: Script sends concurrent requests and calculates latency distribution; if p99 > 100ms, the test fails.

---

## 12. Example Code Operations Manual

### 12.1 Preparing the Environment

- **Node.js**: Version v20.0.0 or higher is required (`node:test` and `fetch` are used).
- **Git**: For version control.
- **Editor**: VS Code is recommended.

This project has no `package.json` dependencies (aside from development tools), which not only showcases native capabilities but also lowers the barrier to running the project.

### 12.2 Running the Development Server

The development version uses in-memory storage; data is reset on restart.

```bash
# Start the server
node examples/ecommerce-mini/src/http/server.js

# Run the test suite in another terminal
node --test examples/ecommerce-mini/__tests__/
```

### 12.3 Running the Production Server

The production version has file persistence, authentication, and idempotency checking enabled.

```bash
# Start the production server (Port 3002)
node examples/ecommerce-mini/src/http/server.prod.js
```

---

## 13. Production-Grade Extension Practices

To demonstrate how OpenSpec handles complexity, three advanced features are introduced in `server.prod.js`.

### 13.1 Persistent Storage (`src/persist/fileStore.js`)

**Spec Change**: The system needs to retain user data even after a restart.

**Implementation**:

- Implement the `FileStore` class, using `fs.writeFileSync` for atomic JSON file writes.
- Load data from disk into an in-memory Map on startup.

### 13.2 Authentication and Security

**Spec Change**: All non-public interfaces must carry a Bearer Token.

**Implementation**:

- Add a `Bearer Token` format validation middleware.
- Intercept requests to non-public interfaces (public interfaces such as `GET /api/products` are exempt) that lack an Authorization header, returning `401 Unauthorized`.
- Complete Token issuance logic (e.g., HMAC-SHA256 / JWT) can be extended here.

### 13.3 Idempotency

**Spec Change**: For duplicate payment requests for the same order, the system should return the same result without charging again.

**Implementation**:

- The client sends an `Idempotency-Key` in the header.
- The server parses this request header (entry point is already reserved); the extension point is in the `idempotencyKey` judgment block inside the `POST /api/orders` handler in `server.prod.js`, where developers can integrate Redis or an in-memory cache for deduplication.

### 13.4 Observability

**Spec Change**: The system needs to expose a `/metrics` endpoint for monitoring collection.

**Implementation**:

- Record the request count and latency for each route.
- Expose metrics in JSON format: `{ "requests": 100, "latencies": { "p99": 12 } }` (latency in ms).

---

## 14. Conclusion

Through the `ecommerce-mini` case, we have demonstrated how OpenSpec spans the full lifecycle from "Proposal" to "Production".

- **Documentation as design**: Structured Specs clarify thinking.
- **Code as mapping**: Clear layered architecture makes implementation mechanical and straightforward.
- **Tests as acceptance**: Automated scripts provide confidence for refactoring.

We hope this practical guide helps you better apply the OpenSpec methodology in real-world projects.
