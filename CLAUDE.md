# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **OpenSpec Practise** — a learning and demonstration repository for **Spec-Driven Development (SDD)** using the OpenSpec framework (v1.5.0). It contains a minimal e-commerce system implemented in both Node.js and Python, all driven by OpenSpec specifications. The core idea: define specifications first (proposal → design → specs → tasks), then write code, ensuring humans and AI share the same understanding of requirements.

## Repository Architecture

```text
docs/                          # Chinese documentation (manuals, guides, analysis)
docs-en/                       # English documentation (same content, translated)
openspec/                      # Root OpenSpec configuration for this project
  config.yaml                  #   Project context, rules, schema definition
.claude/                       # Claude Code native AI commands and skills (v1.5.0)
  commands/opsx/               #   /opsx:propose, /opsx:apply, /opsx:archive, /opsx:explore, /opsx:sync
  skills/                      #   Corresponding skill definitions (SKILL.md)
examples/
  ecommerce-mini/              # Node.js implementation (v20+, zero npm deps, native http)
    src/domain/                #   Entity type definitions (JSDoc) + pure domain logic
    src/services/              #   Use-case orchestration (CartService, CatalogService, OrderService)
    src/http/                  #   HTTP layer — server.js (dev), server.prod.js (prod with JWT + file persistence)
    src/repo/                  #   In-memory Map-based repositories
    src/persist/               #   File-based JSON persistence (FileStore)
    __tests__/                 #   unit.spec.js (service-level), integration.spec.js (E2E), performance.spec.js
    data/                      #   Seed data: products.json, carts.json, orders.json
  ecommerce-mini-python/       # Python implementation (FastAPI + Pydantic)
    src/domain/models.py       #   Pydantic models (Product, Cart, Order, CartItem, OrderItem)
    src/services/              #   Business logic (cart.py, catalog.py, order.py)
    src/api/server.py          #   FastAPI app with all endpoints
    src/repo/memory.py         #   Generic MemoryRepo[T]
    tests/test_smoke.py        #   Pytest smoke/integration tests via TestClient
  openspec/                    # Root: specifications driving both implementations
    config.yaml                #   Project context, rules, store/references support (v1.5.0)
    specs/                     #   Master specs: cart/catalog/order/payment/domain-model/error-handling
    changes/                   #   Active changes
    changes/archive/           #   Archived: 2025-01-27-v1-mvp (proposal/design/specs/tasks)
```

## Layered Architecture

Both implementations follow the same four-layer architecture with strict dependency direction:

```text
HTTP Layer ──► Service Layer ──► Domain Layer
                    │
                    └──► Repository Layer ──► Data Store (Map / File)
```

| Layer      | Node.js dir                 | Python dir      | Responsibility                                                                                       |
| ---------- | --------------------------- | --------------- | ---------------------------------------------------------------------------------------------------- |
| HTTP       | `src/http/`                 | `src/api/`      | Route handling, JSON parse/format, error→HTTP status mapping                                         |
| Service    | `src/services/`             | `src/services/` | Use-case orchestration (createOrder: validate cart → check stock → deduct → save order → clear cart) |
| Domain     | `src/domain/`               | `src/domain/`   | Pure entities/types with no dependencies (JSDoc typedefs / Pydantic models)                          |
| Repository | `src/repo/`, `src/persist/` | `src/repo/`     | Data access; `Map` in dev, `FileStore` in prod (Node.js only)                                        |

Key design decisions:

- All prices in **integer cents** (`priceCents`) to avoid floating-point issues.
- Node.js uses native `http` module (zero dependencies); Python uses FastAPI for type safety and auto-docs.
- MVP uses in-memory storage with single-threaded atomicity; prod extends with file persistence.

## Common Commands

### Node.js (`examples/ecommerce-mini/`)

```bash
npm test              # Run all tests (node:test runner — unit + integration + performance)
npm start             # Dev server on port 3000 (in-memory storage, mock auth)
npm run start:prod    # Prod server on port 3002 (file persistence + JWT auth)
```

### Python (`examples/ecommerce-mini-python/`)

```bash
pip install -r requirements.txt   # Install FastAPI, Pydantic, pytest, httpx, uvicorn
pytest                            # Run test suite (smoke + out-of-stock)
python -m uvicorn src.api.server:app --reload   # Dev server on port 8000
```

## OpenSpec SDD Workflow (v1.5.0)

The SDD workflow uses these slash commands (available in `.claude/commands/opsx/`):

1. **Explore** (`/opsx:explore`): Think through ideas, investigate the codebase, weigh options — before any artifact exists. A no-stakes thinking partner.
2. **Propose** (`/opsx:propose <name>`): Create the change via `openspec new change` + `openspec instructions` CLI pattern. Generates proposal.md, design.md, tasks.md with schema-driven instructions.
3. **Apply** (`/opsx:apply`): Implement tasks using `openspec instructions apply --json` for dynamic context. Works through task checklist, marking `- [ ]` → `- [x]`.
4. **Sync** (`/opsx:sync`): 🆕 Synchronize delta specs back to main specs before archiving.
5. **Archive** (`/opsx:archive`): Archive completed changes to `openspec/changes/archive/YYYY-MM-DD-<name>/`.

### v1.5.0 Key Changes

- **Stores (beta)**: Standalone planning repos for cross-repo features. Managed via `openspec store setup/register/list/doctor/remove`. Config supports `store:` and `references:` fields.
- **Fluid workflow**: Actions on a change can be invoked anytime — not phase-locked. Explore can hand off to propose, apply can suggest artifact updates, etc.
- **Schema-driven artifacts**: Artifacts are defined by `schema.yaml`, not hardcoded. CLI provides instructions per artifact type via `openspec instructions <artifact-id>`.

Specs use **Given/When/Then** (Gherkin) format for scenarios. Every requirement includes a **Priority** (P0/P1/P2) and **Rationale**. Normative language uses SHALL or MUST.

The AI tooling is generated by `openspec init --tools claude` and updated via `openspec update`.
