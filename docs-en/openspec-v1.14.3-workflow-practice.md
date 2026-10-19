# From Security Hardening to Linked Specs: OpenSpec v1.14.3 Workflow Practice

OpenSpec shipped six releases between v1.13.1 and v1.14.3 in about a month, none with breaking changes. Unlike v1.13.0's theme of "eliminating silent failures," this stretch is about **tightening boundaries**: configuration injection, path escapes, symlinks, and unknown metadata are closed off one by one, while validation and archiving become more predictable.

This article walks the post-upgrade workflow through a real, small practice — "Python order detail lookup" (`python-order-get-by-id`) — and records the compatibility checks actually performed during the upgrade. The change is also the first use of `skip_specs: true` in this repository, a mechanism worth explaining on its own.

## 1. What Changed Across Six Releases (Practice Perspective)

### 1.1 v1.13.1: Security Hardening and Profile-Aware Skills

This is the most security-heavy release of the six:

- **Configuration injection protection** — values in `config.yaml` can no longer inject content into agent instructions; crafted repository files can no longer hang `openspec update` / `openspec archive`; a repository's `.npmrc` cannot redirect the update check. This directly affects the security model of "clone an unfamiliar repository and let an AI run."
- **Profile-aware skills** — generated skills/commands name only the workflows the current profile installs, and match natural phrasing such as "openspec propose" or "do an openspec apply."
- **Project check** — workflows confirm the project has run `openspec init` before writing anything, and never create an `openspec/` directory as a side effect.
- **Next step in `status`** — the final line names the exact command that moves the change forward, so resuming a change no longer requires memorizing the workflow.
- **Archive hardening** — rejects requirement names that differ only in case, unpaired `FROM:`/`TO:` lines in RENAMED, and delta files that would never be read; bulk archive checks every target before writing any main spec.
- **Task progress** — tasks under `+`, `1.`, and `1)` list markers now count; unknown markers such as `[~]` count as unfinished, so open work is no longer hidden.

### 1.2 v1.13.2: Verify and Windows Archive

- **An honest `/opsx:verify`** — skipped checks are no longer reported as passing; a REMOVED requirement passes once the behavior is gone, and renamed requirements are checked against their original behavior.
- **Windows archive** — no leftover `.openspec-archive.lock`; archive completes instead of rolling back when Windows blocks directory renaming.
- **CRLF preservation** — rewriting a spec, `.bashrc`, `.zshrc`, or `CLAUDE.md` keeps existing line endings, so Windows users no longer get whole-file diffs.
- **Per-task-group tests and docs** — each task group owns its tests and documentation updates instead of deferring them to the final group; onboarding asks you to approve the task breakdown first.
- **Scenario-loss messages** — when a `MODIFIED` block drops scenarios, the error also says what the block adds.

### 1.3 v1.14.0: Ten Tools and Archived-Change Browsing

- **Ten new tools** — Amp, AtomCode, Code Studio, DeepSeek Harness, EasyCode, GigaCode, Grok Build, GSD, Veai, and Warp.
- **`openspec list --archived` / `--all`** — browse archived changes directly, with JSON output and sorting; `openspec view` also gains an archived section.
- **Workflow status in `openspec view`** — each active change's schema and artifact states (done, ready, blocked, skipped) are visible at a glance.
- **`openspec version`** — shows the installed version and install type; `--check` and `--json` make update information machine-readable.
- **Unknown `.openspec.yaml` keys** — `status`, `validate`, and `archive` name ignored keys such as `skip_design`; `validate --strict` fails on them.
- **`show --json`** — requirements and scenarios include their `name`, so JSON consumers no longer parse Markdown.
- **`project.md` migration** — `openspec init` guides a move from a legacy `project.md` to `config.yaml`.

### 1.4 v1.14.1: Faster Startup and Incremental Writes

- **Faster startup** — each command loads only the code it needs; `openspec --version` / `--help` load 24 modules instead of 485.
- **Incremental spec writing** — agents write each capability's spec file as it is drafted, so an interrupted long run keeps what it wrote; `/opsx:continue` fills in missing specs.
- **500-character requirement warning** — requirements over 500 characters produce a warning and fail `validate --strict`, including new requirements in a change.
- **`openspec view` no longer lists archived changes** — archive browsing belongs to `openspec list --archived`.
- **Review before archive** — when every tracked task is checked, apply says the tasks are complete and asks you to review before archiving, instead of declaring the change ready.

### 1.5 v1.14.2: Extension Metadata and Archive Warnings

- **`x-` extension keys** — top-level keys starting with `x-` in `.openspec.yaml` are yours (for example `x-tracker` or `x-jiraKey`); OpenSpec ignores them and `--strict` passes, while other unknown keys are still reported.
- **Archive text-drop warnings** — text in a delta that archive would not carry into the main spec (extra `##` sections, prose before the first requirement) now warns and fails under `--strict`.
- **Verify checks REMOVED requirements** — it reads the original text from the main spec before searching the code; when the text cannot be recovered, it reports "not verified" instead of passing.
- **Symlinked directories** — `openspec/`, `openspec/changes`, and `openspec/specs` may be symlinks.
- **Brace depth limit** — artifact patterns nested more than 16 levels deep are rejected.

### 1.6 v1.14.3: Linked Specs and Glob Boundaries

- **Linked spec files** — a capability's `spec.md` may be a symlink to a file elsewhere in the project; links resolving outside the project are still refused.
- **Glob paths stay inside the change** — propose, ff, continue, and explore check the chosen path before writing; a path that escapes the change directory directly or through a symlink is refused.
- **No more `braces` dependency** — installing OpenSpec no longer pulls in the unpatched `braces` package, so `npm audit` stops reporting GHSA-vfj7-8cjw-p6xm.
- **`validate --all` in CI** — the spinner no longer loops forever when the terminal reports zero columns; `OPEN_SPEC_INTERACTIVE=0` and `CI` turn it off.
- **Very wide brace patterns** — patterns expanding beyond 1,024 paths are rejected instead of risking memory exhaustion in `openspec status`.

## 2. Upgrade Steps and Compatibility Checks

The repository followed the same upgrade path recorded in previous CHANGELOG entries:

```bash
npm install -g @fission-ai/openspec@1.14.3
openspec --version       # 1.14.3
openspec update --force  # refresh commands and skills under .claude/
```

`openspec update --force` refreshed 12 files (6 commands + 6 skills) with +353/−97 lines. The command ended with an important note:

```text
Note: 6 more workflows are available (new, continue, ff, bulk-archive, verify, onboard).
Add them with `openspec config profile`.
```

This confirms that the default `core` profile still contains six commands: `propose`, `explore`, `apply`, `update`, `sync`, and `archive`. `new`, `continue`, `ff`, `bulk-archive`, `verify`, and `onboard` are optional workflows that require `openspec config profile` followed by `openspec update`. This upgrade did not change the repository's default command surface, so `.claude/commands/opsx/` still contains the same six files.

Post-upgrade compatibility checks:

```text
$ openspec validate --specs --report findings
Scope: specs (7 items)
No item findings.
Totals: 7 passed, 0 failed (7 items)

$ openspec validate --archived
✓ change/2025-01-27-v1-mvp
✓ change/2026-07-08-add-product-get-by-id
✓ change/2026-07-28-add-product-search
✓ change/2026-09-02-cart-query-and-remove
✓ change/2026-09-10-order-list-query
Totals: 5 passed, 0 failed (5 items)
```

Two strict-validation changes that commonly bite during upgrades do not affect this repository:

- **500-character requirements**: every requirement in the seven main specs is shorter than 500 characters, so the v1.14.1 warning does not fire.
- **Unknown `.openspec.yaml` keys**: the five archived changes carry only `schema` and `created`, both recognized keys, so `--strict` is unaffected.

Node 18/18 and Python 6/6 remained green after the upgrade.

## 3. The Practice Change: python-order-get-by-id

### 3.1 Explore: Finding the Gap from the Spec Inventory

Following the template introduced in v1.13, the first step is the capability inventory:

```text
$ openspec list --specs
Specs:
  cart-management        requirements 4
  catalog-management     requirements 4
  domain-model           requirements 5
  error-handling         requirements 2
  order-management       requirements 4
  payment                requirements 2
  product-query          requirements 1
```

The "订单查询" requirement in `order-management` already defines the 200 and 404 scenarios, but comparing the route tables of both implementations shows that Node's `server.js` has `GET /api/orders/:id`, while Python's `server.py` has no matching route. The v1.13.0 practice article had already named this gap in its "Open Observations" section, making it a good small practice.

Why pick it:

- The behavior contract already exists, so no new spec design is needed;
- The change is confined to three Python files and fits in one session;
- It closes a documented dual-implementation divergence instead of creating a new TODO.

### 3.2 Propose: The First Use of skip_specs

Following the v1.14 template, `openspec context --json` runs first to confirm the authoritative root, then the change is created:

```bash
openspec new change python-order-get-by-id \
  --goal "Close the Python implementation gap for GET /api/orders/{id}"
```

The key decision is **not writing a delta spec**. `order-management` already fully describes the "order query" behavior; this change is implementation alignment only. `openspec validate` rejects a zero-delta change unless `.openspec.yaml` declares:

```yaml
schema: spec-driven
created: 2026-10-19
goal: Close the Python implementation gap for GET /api/orders/{id}
skip_specs: true
```

`skip_specs` is not a shortcut for skipping spec thinking. It applies to pure refactors, tooling, documentation, or — as here — **cases where the behavior contract is unchanged and only the implementation is being completed**. proposal, design, and tasks are still generated as usual; the `specs` artifact shows as `skipped` in `openspec status`:

```text
proposal: done
specs: skipped
design: done
tasks: done
```

Inventing a MODIFIED requirement just to pass validation would pollute the main spec's single source of truth.

### 3.3 Apply: Service Method, Route, and Test

Three Python files changed:

- `src/services/order.py`: added `get_order(order_id)`, delegating to `MemoryRepo.find_by_id`;
- `src/api/server.py`: added `GET /api/orders/{id}` with `response_model=Order`; a miss raises `HTTPException(404, detail="Order not found")`;
- `tests/test_smoke.py`: added `test_order_get_by_id`, covering both the existing and missing paths.

The test uses a dedicated `user_order_detail` instead of reusing another test's user ID. Python's `MemoryRepo` is a module-level singleton in `server.py`, so tests share one in-memory state; a dedicated user ID avoids order-dependent coupling. The assertions check camelCase fields (`userId`, `totalCents`, `items[].productId`, `items[].priceCents`) to ensure Python's Pydantic aliases match Node's order JSON.

Node needed no changes: `GET /api/orders/:id` already existed. One known difference remains — Node returns `{code, message}`, while Python returns FastAPI's `{detail}`. That is global debt at the `error-handling` spec level, and this change deliberately did not widen its scope to fix it.

Results:

```text
Node:   18 passed
Python: 7 passed
```

### 3.4 Validate: skip_specs Is Visible

```text
$ openspec validate python-order-get-by-id --type change
Change 'python-order-get-by-id' is valid
ℹ [INFO] file: skip_specs is set in .openspec.yaml: change declares no spec-level
  behavior changes, zero deltas accepted
```

This INFO matters: the tool does not silently pass `skip_specs`; it explicitly tells the reader that the change declares no spec-level behavior changes. The main specs are still checked in findings mode:

```text
$ openspec validate --specs --report findings
Scope: specs (7 items)
No item findings.
Totals: 7 passed, 0 failed (7 items)
```

### 3.5 Archive: Archiving Without Delta Merges

```text
$openspec archive python-order-get-by-id
```

There were no deltas to merge, so the archive step only moved the change directory and performed cleanup. Afterwards:

```text
$ openspec validate --archived
Totals: 6 passed, 0 failed (6 items)

$ openspec list --archived
Archived Changes:
  2026-10-19-python-order-get-by-id     ✓ Complete    2026/10/19
  2026-09-10-order-list-query           ✓ Complete    2026/9/10
  ...
```

### 3.6 Practice Results

| Check                                                    | Result                          |
| -------------------------------------------------------- | ------------------------------- |
| `openspec validate python-order-get-by-id --type change` | valid (INFO: skip_specs)        |
| `openspec validate --specs --report findings`            | 7/7, no findings                |
| `openspec validate --archived`                           | 6/6                             |
| Node `npm test`                                          | 18/18                           |
| Python `pytest`                                          | 7/7                             |
| New Python endpoint                                      | `GET /api/orders/{id}`, 200/404 |

## 4. Takeaways and Open Observations

### 4.1 The Value of This Release Range Is "Error Out on Boundary Violations"

The changes from v1.13.1 to v1.14.3 look scattered, but they share one principle: **the tool must not silently accept out-of-bounds input**. Configuration values cannot inject instructions, globs cannot escape the change directory, symlinks cannot point outside the project, unknown metadata cannot be silently ignored, and archive cannot silently drop text. For SDD, the spec is the single source of truth; any path that "reports success while producing the wrong result" is more dangerous than a crash.

### 4.2 The Boundary of skip_specs

This practice used `skip_specs: true` for the first time. It fits changes where the behavior contract is unchanged and only the implementation is being completed; it does not fit cases where the requirements themselves are still moving. Even when using it, keep the full proposal/design/tasks and state "no new or modified capabilities" with a reason in the proposal's Capabilities section — so readers know the omission is deliberate, not forgotten.

### 4.3 Profiles Are an Explicit Choice

The default `core` profile keeps six commands, reducing day-to-day cognitive load; expanded workflows such as `verify`, `continue`, and `ff` require an explicit opt-in. This repository stays on core for now because the existing practice already covers the Explore → Propose → Apply → Archive main line. If we later need to verify "does the implementation really satisfy the artifacts," enabling `verify` is worth evaluating separately.

### 4.4 Open Observations

- **Payment remains the largest spec-code gap**: two requirements, complete scenarios, zero implementation — a good candidate for a standalone medium-sized practice.
- **Error response formats are still not unified**: Node's `{code, message}` and Python's `{detail}` remain different. The `error-handling` spec requires a unified structure, so a separate cross-implementation change is warranted.
- **Node prod route coverage is incomplete**: `server.prod.js` only has products/cart POST/orders POST/metrics and lacks query endpoints. The dev/prod behavior difference needs to stay documented.
- **The dev server's fixed `user_dev`**: this mock identity model has interfered with integration tests twice. If a future practice involves order ownership or payment, consider making the dev identity parameterizable.

---

_This article is based on the `python-order-get-by-id` practice in the [OpenSpec Practise](https://github.com/ForceInjection/OpenSpec-practise) repository (2026-10-19); full artifacts live under `openspec/changes/archive/2026-10-19-python-order-get-by-id/`._
