# Commands Exit, Skills Take the Stage: OpenSpec 2.1.0 Workflow Practice

OpenSpec has entered the 2.x era: v1.16.1 and v1.17.0 were transitions, and **v2.0.0 is the project's first breaking major release** — slash command files are gone entirely and skills now install to `.agents/skills/`; v2.1.0 adds global skill installation. The workflows themselves (Explore → Propose → Apply → Archive) have not changed. What changed is where skills live and how you invoke them.

This article records the full cross-major-version upgrade: previewing a 25-file migration with `--dry-run`, the symlink restructuring of `.claude/`, and `payment-implementation` — the first practice on the 2.x skill workflow, closing the last "complete spec, zero code" gap among the seven capabilities.

## 1. What Changed Across Four Releases

### 1.1 v1.16.1: Stricter Delta Validation

- **Unrecognized delta sections no longer pass silently** — a requirement filed under an unrecognized section such as `## DEPRECATED Requirements` now fails `validate` and is refused by `archive`; previously it produced a warning and the requirement was silently dropped. A continuation of v1.13's "eliminate silent failures" line.
- **Closed section headings** — `## Purpose ##` parses the same as its unclosed form.
- **Version-check fix with telemetry off** — `version --check` now only skips via `OPENSPEC_NO_UPDATE_CHECK`.

### 1.2 v1.17.0: The Migration Notice

- **One-run upgrades** — `openspec update` migrates a project from any release since 0.12 in a single run, without repeated `--force`; unmodified legacy files are cleaned up, edited ones are always kept.
- **The 2.0 notice** — command files go away in 2.0; the update output names the one command to switch early (`openspec config set delivery skills && openspec update`).

### 1.3 v2.0.0: Commands Exit, Skills Unify

- **Skills unify in `.agents/skills/`** — every tool shares the same skill files; tools that don't read that folder (Claude Code, Kiro) get **symlinks**.
- **`/opsx:*` slash commands removed** — every command already had a matching skill, so maintaining both was redundant. Invocation changes from `/opsx:propose` to the skill `openspec-propose` (`$openspec-propose` in Codex), or simply asking your agent in natural language.
- **Legacy cleanup** — `openspec update` removes old slash commands and duplicate skills; files you edited are kept and listed.
- **The `delivery` setting is obsolete** (existing configs keep working); Amazon Q support is removed.

### 1.4 v2.1.0: Global Skills

- **Global installation** — via Vercel's `skills` installer, install once and use in every project (requires Git and GitHub access).
- **The scope question** — interactively, `openspec update` asks whether a project's skills should stay in the repo or switch to global; nothing changes until you choose. **In CI or agent environments (`OPEN_SPEC_INTERACTIVE=0`) there is no question: skills refresh where they are.** The choice is recorded in `openspec/config.yaml`.
- **npm installs now require Node ≥ 22.20.0**; the standalone binary has no Node requirement.

## 2. Upgrade Steps and Migration Notes

```bash
npm install -g @fission-ai/openspec@2.1.0
openspec --version        # 2.1.0
openspec update --dry-run
```

The dry-run listed the change plan for **25 files** at once — the 2.0 migration in full:

```text
25 file(s) would change:
  add     .agents/skills/.openspec-target  (openspec)
  add     .agents/skills/openspec-apply-change/SKILL.md  (openspec)
  ... (7 skill files moving into .agents/skills/)
  delete  .claude/commands/opsx/apply.md  (claude)
  ... (6 command files deleted)
  add     .claude/skills/openspec-apply-change  (claude)
  delete  .claude/skills/openspec-apply-change/SKILL.md  (claude)
  ... (6 real skill files become links)
```

After `--force`, every `.claude/skills/openspec-*` entry became a relative symlink:

```text
.claude/skills/openspec-propose -> ../../.agents/skills/openspec-propose
```

Two details worth recording:

- **The scope question never appeared** — in a non-interactive environment (`OPEN_SPEC_INTERACTIVE=0`) there is no "project or global" prompt; skills refresh in place and stay in the repo, and `config.yaml` is unchanged. That suits this repository: a public teaching repo's skills should travel with the repo, so cloners get them out of the box.
- **The update output states the change explicitly** — `Removed: 6 command files (OpenSpec 2.0 installs skills only)`. The legacy cleanup is visible, not silent.

Post-upgrade regressions all passed: `validate --specs --strict` 7/7, findings clean, `validate --archived` 7/7, Node 18/18, Python 7/7. The local Node v26 ≥ 22.20, so the npm install is unaffected by the new floor.

## 3. The Practice Change: payment-implementation

### 3.1 Why Payment

In the v1.16.0 article's open observations, payment was "the largest spec-code gap": 2 requirements and 4 scenarios with zero implementation since the v1-MVP archive. There is a subtler point: the `PAID` status exists in both implementations' type definitions (a JSDoc union and a Pydantic `Literal`), yet no code ever moved an order into it — the types were promising a transition that did not exist. Implementing payment closes the order lifecycle's "create → pay" loop.

And since 2.x kept the workflows but changed every entry point, a real practice was the right way to verify the new flow.

### 3.2 Propose: Skills Instead of Slash Commands

Invoking the `openspec-propose` skill (replacing the old `/opsx:propose`) felt identical to 1.x: `openspec context --json` to confirm the root → `openspec new change` → artifacts generated in the dependency order from `status --json`. The change is only at the entry — the command files are gone, the skill remains, and a natural-language "propose payment-implementation" triggers the same flow.

The `payment` spec already defines all four scenarios, so the change declares `skip_specs: true` for pure implementation alignment. Five design decisions:

- **D1: the method lives in `OrderService`** — payment is one order-state transition with no separate payment entity; a PaymentService would be a stateless forwarder;
- **D2: repeat payment is an idempotent success** — the spec allows "idempotent success or an already-paid notice"; an idempotent 200 is simplest for clients and inherently satisfies "no double charge";
- **D3: the state machine is centralized in the service** — `payOrder`: a miss throws `NOT_FOUND`; only `PENDING_PAYMENT` writes `PAID`; an already-`PAID` order is returned as-is. With exactly two states, the service closes the machine on its own;
- **D4: 404 follows each implementation's existing error style** — Node `{code: "NOT_FOUND"}`, Python `{detail}`; not widening scope to unify;
- **D5: `skip_specs: true`** — the contract exists; no invented deltas for validation's sake.

### 3.3 Apply: ~20 Lines per Implementation

Node: `OrderService.payOrder(orderId)` + a `POST /api/payments/:orderId` route + a `NOT_FOUND` → 404 mapping in the catch block. Python: `pay_order(order_id)` (returns `None` on a miss; the route maps to 404) + `POST /api/payments/{id}`. Tests on both sides cover three paths: pay → `PAID`, idempotent repeat 200, missing order 404. The Python test uses a dedicated `user_payment` to isolate the module-level shared state.

### 3.4 Scenario-by-Scenario Cross-Check

| Spec scenario | Node | Python |
| --- | --- | --- |
| Pay existing order: 200 + `PAID` | `payOrder` writes `PAID` and saves | `pay_order` same |
| Pay missing order: 404 + `NOT_FOUND` | throws `NOT_FOUND` → 404 `{code}` | `None` → 404 `{detail}` |
| Valid transition: only PENDING_PAYMENT → PAID | only that branch writes status | same |
| Repeat payment: idempotent success, no double charge | `PAID` returned as-is with 200 | same |

### 3.5 Results

| Check | Result |
| --- | --- |
| `openspec validate payment-implementation --type change` | valid (INFO: skip_specs) |
| `openspec validate --specs --strict` | 7/7 |
| Node `npm test` | **22/22** (18 + 3 unit + 1 integration) |
| Python `pytest` | **8/8** |

## 4. Takeaways and Open Observations

### 4.1 "Commands Exit" Is Deduplication, Not a Feature Regression

The `/opsx:*` commands and the skills were the same instructions exposed twice. 2.0 cut the commands and kept the skills; the entry point moved from slashes to skill names or natural language — which is more natural for AI agents anyway. For this repository the direct consequence is documentation: the workflow tables in the READMEs and CLAUDE.md now describe skills instead of commands, while the `/opsx:` wording in historical articles stays as-is by convention (they record how things actually worked at the time).

### 4.2 dry-run Pays Off Most in Big Migrations

A 25-file migration plan in one listing, with `add`/`delete` and the owning tool in plain sight. For a cross-major-version upgrade, dry-run first is the line between "trusting the tool" and "inspecting the tool." The symlink layout also deserves attention: on Windows without developer mode / symlink privileges, `.claude/skills/` may not work after a clone — a CI setup can avoid this with `--scope project` and real directories.

### 4.3 All Seven Capabilities Are Now Closed

With payment implemented, the spec-code gaps of all seven main capabilities are closed: cart, catalog, order, payment, product-query, domain-model, and error-handling all have dual-implementation coverage. The only debt left on the books is the **error-response structure difference** — Node `{code, message}` versus Python `{detail}` — a natural candidate for the next cross-implementation change.

### 4.4 Open Observations

- **Error format unification**: the `error-handling` spec requires a unified structure and Python still uses `{detail}` everywhere — the only debt on the books.
- **Node prod route coverage**: `server.prod.js` still only has products/cart POST/orders POST/metrics; the payment route lands in dev only, per convention.
- **The dev server's fixed `user_dev`**: unchanged from earlier articles.
- **The global-skill trade-off**: this repo keeps skills in-project. For multiple OpenSpec projects on one machine, `openspec init --scope global` switches; a team repo should standardize CLI versions before switching.

---

_This article is based on the `payment-implementation` practice in the [OpenSpec Practise](https://github.com/ForceInjection/OpenSpec-practise) repository (2026-11-18); full artifacts live under `openspec/changes/archive/2026-11-18-payment-implementation/`._
