# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**OpenSpec Practise** is a learning/demonstration repository for Spec-Driven Development (SDD) using **OpenSpec v1.14.3**. A minimal e-commerce system is implemented twice — Node.js (v20+, zero npm dependencies, native `http`) and Python (FastAPI + Pydantic) — from the same OpenSpec specifications. The point is to demonstrate the full chain: intent → spec → code, with humans and AI sharing one source of truth.

Main specs cover 7 capabilities: `cart-management`, `catalog-management`, `domain-model`, `error-handling`, `order-management`, `payment`, and `product-query`. All changes are archived under `openspec/changes/archive/`; there is currently no active change.

## Repository Layout

```text
openspec/                      # Root OpenSpec project (NOT under examples/)
  config.yaml                  # Project context + schema rules injected into planning
  specs/                       # Main specs — the single source of truth
  changes/                     # Active changes (currently empty)
  changes/archive/             # Archived changes: YYYY-MM-DD-<name>/
.claude/
  commands/opsx/               # /opsx:explore|propose|update|apply|sync|archive
  skills/                      # openspec-* skills backing those commands
examples/
  ecommerce-mini/              # Node.js implementation
  ecommerce-mini-python/       # Python implementation
docs/                          # Chinese documentation (manuals, guides, practice write-ups)
docs-en/                       # English mirrors of docs/
README.md / README-en.md       # Bilingual project overview
CHANGELOG.md                   # Per-OpenSpec-version upgrade and practice history
```

## Common Commands

### Node.js (`examples/ecommerce-mini/`)

```bash
npm test                                              # all 18 tests (unit + integration + performance)
node --test __tests__/unit.spec.js                    # one suite
node --test --test-name-pattern="订单列表" __tests__/unit.spec.js   # one test by name
node --test src/domain/logic.spec.js                  # standalone domain test (NOT part of npm test)
npm start                                             # dev server, port 3000, in-memory
node examples/ecommerce-mini/src/http/server.prod.js  # prod server, port 3002 — run from REPO ROOT
```

Prod server notes:

- **Run it from the repository root.** `FileStore` resolves `examples/ecommerce-mini/data/...` against `process.cwd()`; launching via `npm run start:prod` from the package directory resolves to a non-existent nested path, so the first write fails with ENOENT (HTTP 500).
- The "auth" only checks that `Authorization` starts with `Bearer`; any token is accepted. `NO_AUTH=1` bypasses the check.
- Prod implements a subset of routes: `GET/POST /api/products`, `POST /api/cart/items`, `POST /api/orders`, and `/metrics`. It has no product-by-id/search, no cart GET/DELETE, and no order list/get-by-id.

### Python (`examples/ecommerce-mini-python/`)

```bash
.venv/bin/python -m pytest tests -q                              # all 7 tests
.venv/bin/python -m pytest tests/test_smoke.py::test_smoke_flow  # one test
.venv/bin/python -m pytest tests -k cart                         # tests matching a keyword
.venv/bin/python -m uvicorn src.api.server:app --reload          # dev server, port 8000
```

For a fresh environment: `pip install -r requirements.txt`. A local `.venv` (Python 3.13) exists but is gitignored.

### OpenSpec CLI

```bash
openspec context --json                                  # authoritative root; run before planning
openspec list                                            # active changes only
openspec list --specs                                    # capability inventory + requirement counts
openspec list --archived                                 # archived changes (--all includes both)
openspec status --change <name> --json                   # artifact status and paths
openspec instructions <artifact-id> --change <name> --json
openspec instructions apply --change <name> --json
openspec show <name> --diff                              # review only the lines that changed
openspec validate --specs --report findings              # focused warnings/errors
openspec archive <name>                                  # merge delta specs + archive in one step
openspec update --force                                  # refresh .claude commands/skills after CLI upgrade
openspec version --check                                 # installed version vs latest
```

## SDD Workflow (OpenSpec v1.14.3)

Slash commands live in `.claude/commands/opsx/` and are backed by matching skills. The default `core` profile installs the six commands below; `new`, `continue`, `ff`, `bulk-archive`, `verify`, and `onboard` are optional workflows enabled via `openspec config profile` followed by `openspec update`:

| Command                | Purpose                                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------------------- |
| `/opsx:explore`        | Thinking partner: investigate code/specs and clarify requirements before any artifact exists.      |
| `/opsx:propose <name>` | Create a change and generate `proposal.md`, `design.md`, `specs/`, and `tasks.md`.                 |
| `/opsx:update`         | Revise existing planning artifacts and keep them coherent. Never edits code.                       |
| `/opsx:apply`          | Implement tasks, marking `- [ ]` → `- [x]`.                                                        |
| `/opsx:sync`           | Merge delta specs into main specs without archiving (optional standalone operation).               |
| `/opsx:archive`        | Validate/complete, merge delta specs, and move the change to `changes/archive/YYYY-MM-DD-<name>/`. |

Important workflow semantics:

- Since v1.11.0, `openspec archive` performs the spec merge itself; `/opsx:sync` is only needed to publish spec changes while keeping a change active.
- `openspec list` does not list capabilities; use `openspec list --specs`.
- Delta specs mirror main capability paths under `specs/<capability>/spec.md` and use `## ADDED Requirements`, `## MODIFIED Requirements`, `## REMOVED Requirements`, or `## RENAMED Requirements`.
- A MODIFIED requirement must restate the full requirement and every surviving scenario; validation rejects a delta that drops a scenario. Scenario-level renames are not supported.
- A change with no spec-level behavior change (pure implementation alignment, refactor, tooling, docs) must set `skip_specs: true` in `.openspec.yaml`; validation then accepts zero deltas and the `specs` artifact shows as `skipped`.

### Spec conventions

From `openspec/config.yaml`:

- Scenarios use Given/When/Then (Gherkin); normative requirement language uses SHALL or MUST.
- Every requirement includes `**Priority**: P0/P1/P2` and a `**Rationale**:`.
- Proposals name affected implementations (Node.js / Python / both) and map capabilities to spec folder names.
- Designs include architecture diagrams (Mermaid or ASCII) and decisions with alternatives.
- Tasks are dependency-ordered checkboxes that state which implementation(s) they apply to.

Specs are written in Chinese, but the normative SHALL/MUST keywords stay English so strict validation works.

## Architecture

Both implementations use the same four-layer architecture with dependencies pointing inward:

```text
HTTP ──► Service ──► Domain
            │
            └──► Repository ──► store (in-memory Map / JSON file)
```

| Layer      | Node.js                                              | Python                                 | Responsibility                           |
| ---------- | ---------------------------------------------------- | -------------------------------------- | ---------------------------------------- |
| HTTP       | `src/http/server.js`, `server.prod.js`               | `src/api/server.py`                    | Routing, JSON parse/format, error→status |
| Service    | `src/services/{catalog,cart,order}.js`               | `src/services/{catalog,cart,order}.py` | Use-case orchestration                   |
| Domain     | `src/domain/types.js` (JSDoc), `logic.js`            | `src/domain/models.py` (Pydantic)      | Entity shapes and pure logic             |
| Repository | `src/repo/memoryRepo.js`, `src/persist/fileStore.js` | `src/repo/memory.py` (`MemoryRepo[T]`) | Data access                              |

Key invariants:

- All prices are integer **cents** (`priceCents` / `price_cents`) — never floats.
- Order creation is the central orchestration in both languages: validate non-empty cart → check stock and compute total → deduct stock → save order → clear cart. There is no real transaction; atomicity relies on the single-process model.
- Node domain types are JSDoc-only (no runtime validation). Python Pydantic models validate and alias camelCase JSON to snake_case fields (`priceCents` ↔ `price_cents`, `userId` ↔ `user_id`).
- Python's FastAPI app wires module-level `MemoryRepo` singletons in `server.py`, so state persists across requests and tests. Node's `createServer()` creates fresh repositories per call, which is how integration tests get isolation.
- Error response format differs: Node returns the spec's `{code, message}`; Python raises `HTTPException`, producing FastAPI's `{detail: ...}` (Python tests assert `detail`).

### Known implementation divergences

Verify before assuming parity:

- The `payment` capability is fully specified but has no implementation in either language.
- The Node dev server fixes cart operations to `user_dev` and defaults order creation to `user_dev`; integration tests must use that identity or make relative assertions. Python cart endpoints default to `user_dev` but accept an explicit user ID.
- The Node prod server lags the dev server in route coverage (see the commands section above).

## Repository Conventions

- `docs/` is Chinese and `docs-en/` is its English mirror; `README.md` / `README-en.md` are likewise paired. Keep both sides in sync when changing user-facing documentation.
- `CHANGELOG.md` records each OpenSpec upgrade and the accompanying practice change. After upgrading the CLI, run `openspec update --force`, then update CHANGELOG/README/docs.
- Commits follow Conventional Commits (`feat:`, `fix:`, `docs:`).
- Archived changes are teaching material; don't delete or rewrite them when adding new changes.
