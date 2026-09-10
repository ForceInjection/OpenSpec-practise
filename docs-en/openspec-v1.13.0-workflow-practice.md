# Closing Off Silent Failures: OpenSpec v1.13.0 Workflow Practice

OpenSpec v1.12.0 and v1.13.0 shipped in quick succession (September 2026), neither with breaking changes. The theme of v1.13.0 fits in one sentence: **archive and the delta parser no longer quietly rewrite or drop what you wrote**. This article walks the post-upgrade workflow (Explore → Propose → Apply → Archive) through a real change — "order list query" (`order-list-query`) — and records the changes in both releases that matter in practice, including `validate --report findings` catching 3 real issues in this repository on its very first run.

## 1. What Changed (Practice Perspective)

### v1.12.0: Findings Reports and Code-Grounded Planning

- **`openspec validate --report findings`** — a focused report showing only errors, warnings, and informational findings while preserving totals and exit codes; a natural CI hook.
- **Code-grounded planning** — propose/explore templates now require inspecting relevant code, tests, and docs before drafting artifacts; "don't ask the user for facts already in the codebase."
- Fixes: Node 20 compatibility (chalk pinned back), npm Git installs, dependency security patches.

### v1.13.0: Delta Parser and Archive Robustness

- **Archive no longer edits fenced code** — blank-line tidying is now fence-aware, so YAML/Python samples survive repeated archives untouched.
- **REMOVED/RENAMED written with `*` or `+` bullets now take effect** — previously only `-` was recognized: validate passed, archive reported success, and the requirement stayed exactly as it was.
- **Every delta section applies** — a file with two `## ADDED Requirements` sections used to have one silently dropped before archiving (documenting OpenSpec's own syntax inside a fenced example triggers this naturally).
- **Apply flags a change with no delta specs** — naming both ways out (write the specs, or declare `skip_specs: true`), aligning with validate's zero-delta rejection.
- **Explore lists the spec inventory** — the new template explicitly requires `openspec list --specs`: plain `openspec list` shows only in-flight changes, never the project's durable capabilities.
- **Propose loads project context first** — `openspec context --json` resolves the authoritative root before reading the `context` field from `config.yaml`; without an OpenSpec root it stops and asks instead of silently initializing.
- **Update repairs damaged command files** — it previously judged a tool current from skill files alone.

## 2. The Practice Change: order-list-query

### 2.1 Explore: First Run of the New Template

Following the v1.13 explore template, the inventory step is now `openspec list --specs` (7 capabilities with requirement counts), cross-checked against the route tables of both implementations. Four gaps remained: order list query (small-medium), cart clear endpoint (tiny), payment implementation (large), product deletion (medium-large, stock references).

We picked **order list query**: `GET /api/orders?userId=` returning a user's order history — the natural next gap in the order loop; the repo layer already had traversal; a pure ADDED requirement.

Reading the code during explore surfaced a dual-implementation divergence: **the Python `Order` model has no `user_id` field**, while Node's order objects have always carried `userId`. Filtering by user therefore first required completing the model — a finding that directly shaped the design.

### 2.2 Propose: Context Loading in the New Flow

Per the new propose template's step 2, `openspec context --json` runs first (returning the authoritative root path), and only then is the `context` field of `config.yaml` read as a planning constraint. Four artifacts:

- **proposal.md** — Modified Capability: `order-management`, ADDED "订单列表查询"
- **specs/order-management/spec.md** — 3 scenarios: a user with orders gets all of them / a user with none gets an empty array / a missing `userId` returns 400 + `MISSING_USER_ID`
- **design.md** — 5 decisions, the core three: filtering lives in the service layer (Node's `OrderRepo` gains `findAll()`, aligning with `ProductRepo`); an explicit 400 for a missing parameter instead of returning everyone's orders (admin semantics leak other users' data); Python's `Order` model gains `user_id` (alias `userId`), aligning the order JSON across implementations — a purely additive field
- **tasks.md** — 4 groups, 7 tasks, each with its verification

### 2.3 Apply: Falling into the Same Pit a Second Time

Both implementations landed in ~20 lines each. The Node integration test failed on first run: the order assertion expected 201, got 400 (CART_EMPTY) — **the exact pit PR #11 fixed in the performance test**: the dev cart endpoint is pinned to `user_dev`, but the test ordered as a different user. Fixed with relative assertions from `user_dev`'s perspective (record the pre-existing order count, assert +2); multi-user isolation assertions moved to the Python side — Python's cart requests carry `userId`, so multi-user E2E is natural there.

The repeat itself is worth recording: **the dev server's mock identity model (fixed `user_dev`) is in structural tension with tests that want multiple users**. Unit tests cover isolation (direct service calls), integration covers a single-user loop, and Python covers multi-user — a reasonable division under the current architecture.

Results: Node 18/18, Python 6/6 green.

### 2.4 validate --report findings: 3 Real Issues on First Run

During wrap-up we ran the new report mode against the main specs:

```text
$ openspec validate --report findings --specs
spec/cart-management
  [WARNING] overview: Purpose section is too brief (less than 50 characters)
spec/payment
  [WARNING] overview: Purpose section is too brief (less than 50 characters)
spec/product-query
  [WARNING] overview: Purpose section is still a placeholder rather than
  a Purpose anyone wrote ...
Totals: 7 passed, 0 failed (7 items)
```

All three warnings were real: cart/payment Purposes were indeed under 50 characters, and **product-query's Purpose was still the `TBD - created by archiving change ...` placeholder the CLI wrote during the v1.5.0 practice archive**, never filled in. After fixing each one, findings came back empty. This neatly validated the evolution loop across v1.9.0 (Purpose format) → v1.11.0 (placeholder warning) → v1.12.0 (findings report): guards added version by version surface real, accumulated debt version by version.

### 2.5 Archive

A single `openspec archive` merged the delta (+1 added) and archived the change to `openspec/changes/archive/2026-09-10-order-list-query/`. Post-archive validation: no active changes, all 7 specs pass, findings empty.

## 3. Takeaways

### 3.1 v1.13.0's Value Is Eliminating Silent Failures

The three parser failure modes (`*`/`+` bullets ignored, duplicate delta sections half-applied, fenced blank lines rewritten) shared one property: **the toolchain reported success while the result was wrong**. That is more dangerous than a crash — it corrupts the "single source of truth" itself. v1.13.0 turns all of them into "either takes effect, or errors out."

### 3.2 The Compounding Return of Tooling Guards

From v1.9.0 through v1.13.0, five upgrades kept reinforcing the same thing: spec content quality. Purpose migration → placeholder warning → findings report — each guard has paid off in a later practice. The value of an SDD toolchain is not just "faster generation" but "drift is discovered earlier."

### 3.3 Open Observations

- The dev server's fixed `user_dev` mock identity has now interfered with integration tests twice; if a future practice is user-scoped (order ownership, payment), it's worth making the dev identity parameterizable.
- The payment capability remains the largest "complete spec, zero code" gap — a good candidate for a standalone medium-sized practice.
- Confirmed while reviewing this change: Python has never implemented `GET /api/orders/{id}` — the spec's "订单查询" requirement (2 scenarios) is currently implemented in Node only — a good candidate for a small follow-up practice.

---

_This article is based on the `order-list-query` practice in the [OpenSpec Practise](https://github.com/ForceInjection/OpenSpec-practise) repository (2026-09-10); full artifacts live under `openspec/changes/archive/2026-09-10-order-list-query/`._
