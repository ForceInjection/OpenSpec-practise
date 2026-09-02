# Focusing Delta Review on What Actually Changed: OpenSpec v1.11.0 Workflow Practice

OpenSpec v1.10.0 and v1.11.0 shipped in quick succession (August 2026) — both incremental, no breaking changes. The centerpiece of v1.11.0 is **`openspec show --diff`**, which answers the most practical pain point in SDD practice: a MODIFIED requirement must restate every scenario it keeps, so reviewing a delta means reading mostly text identical to the main spec. This article walks the full post-upgrade workflow (Explore → Propose → Apply → Archive) through a real change — "cart query and item removal" (`cart-query-and-remove`) — and records the changes in both releases that affect how we practice.

## 1. Context: Three Friction Points Left by the v1.9.0 Era

Before this upgrade (v1.9.0), three rough edges in our workflow were each addressed by v1.10/v1.11:

```text
Friction 1: MODIFIED reviews are verbose
  A modified requirement restates every kept scenario -> >90% of a review
  is unchanged text. Real changes drown in restatement.

Friction 2: explore's write boundary is fuzzy
  Is "create the proposal file" thinking or implementing? No explicit
  confirmation point before explore writes. Answering a clarifying
  question can read as consent to write.

Friction 3: status checks are per-change
  With several active changes you run status one by one — awkward for
  dashboards and CI.
```

## 2. What Changed in v1.10.0 and v1.11.0 (Practice Perspective)

### v1.10.0: A Small Iteration

- **Task templates now demand verification criteria** — every generated task must state how you know it's done (a test, command, observable result, or delivered artifact). "Implement the thing" no longer passes. This affects how all future practice tasks are written.
- `openspec init --language` supports non-English artifacts (we already maintain Chinese specs by hand; keeping `SHALL`/`MUST` in English is enough to validate, so we don't need it).
- A batch of fixes (stores spec-instruction path, custom profiles selecting archive without sync, etc.).

### v1.11.0: A Review-Experience Upgrade

- **`openspec show <change> --diff`** (centerpiece): renders a colorized unified diff per requirement — **ADDED shows full text, MODIFIED shows only the lines that actually change**, REMOVED shows Reason/Migration, RENAMED shows FROM/TO; `--json --diff` brings the same detail to pipelines.
- **`openspec status --all`**: one command covers every active change; the JSON envelope is sorted and stable, and a change that fails to load contributes a diagnostic in place instead of stopping the sweep.
- **Explore asks before it writes**: explore mode must name the artifacts or files it proposes to create or edit and wait for a clear yes in a separate message before the first write-capable action. Answering its own clarifying questions no longer reads as consent.
- **`openspec validate` catches an unwritten Purpose** (warning by default, fails under `--strict`) — a natural follow-up to v1.9.0's Overview→Purpose migration.
- **Explore diagrams are plain ASCII**: template examples dropped Unicode box-drawing glyphs so alignment survives across terminals, fonts, and locales.
- **Archive now embeds spec merging**: the CLI no longer has a standalone `sync` command (`openspec sync` does not exist); `openspec archive` merges deltas → updates main specs → archives in one step and prints merge stats (+1 added / ~1 modified). The agent-driven `/opsx:sync` remains for "sync only, don't archive".

## 3. The Practice Change: cart-query-and-remove

### 3.1 Explore: Taking Stock of Spec–Code Inversion

Exploring the dual implementations (Node.js + Python) against the specs surfaced a two-way gap in cart capabilities:

| Capability        | Spec declares | Node.js | Python |
| ----------------- | ------------- | ------- | ------ |
| Add item          | Yes (3 scenarios) | ✅ | ✅ |
| **Remove item**   | **Yes (1 scenario)** | ❌ no code | ❌ no code |
| **View cart**     | **No requirement** | service only, no route | service only, no route |

"Remove" is under-implemented (the spec says it, code doesn't have it); "query" is inverted (code exists, but neither spec nor HTTP layer exposes it). This change closes the loop — add → view → remove → order — and naturally produces **both ADDED and MODIFIED deltas**, exercising both renderings of `show --diff`.

### 3.2 Propose: Four Artifacts

```text
openspec new change "cart-query-and-remove"
```

Schema-driven generation produced four artifacts:

- **proposal.md** — declares Modified Capability: `cart-management` (ADDED "购物车查询" + MODIFIED "购物车商品移除"); API contract: `GET /api/cart/items` and `DELETE /api/cart/items/{productId}` (removing a missing item → `CART_ITEM_NOT_FOUND` 404)
- **specs/cart-management/spec.md** — the delta spec: MODIFIED the removal requirement (added "remove non-existent item" and "multi-item cart removes only the target" scenarios), ADDED the query requirement (empty cart / populated cart)
- **design.md** — four decisions: remove by `productId` rather than the internal item id; explicit 404 for a missing item instead of idempotent success; both endpoints return the full Cart; isomorphic error channels (Node `Error(code)` / Python `ValueError(code)`)
- **tasks.md** — 4 groups, 6 tasks, each stating its verification per the v1.10.0 template

**Validate caught an editing trap**: renaming the scenario "移除购物车商品" to "移除购物车中的商品" inside MODIFIED failed validation — a MODIFIED block replaces the whole requirement, and archive refuses to silently drop a scenario the main spec still has. **There is no scenario-level RENAMED mechanism** (RENAMED exists only at the requirement level); the fix is to keep the scenario name and change only its content:

```text
✗ [ERROR] MODIFIED "购物车商品移除" omits scenario(s) the current spec still has:
  "移除购物车商品". Copy them into the MODIFIED block ...
-> restoring the original scenario name passes validation
```

### 3.3 Review: The Two Renderings of show --diff

Reviewing the delta takes a single command:

```text
openspec show cart-query-and-remove --diff
```

The key experience: **ADDED "购物车查询" renders as full text** (a new requirement has no baseline to diff against); **MODIFIED "购物车商品移除" renders only the lines that actually changed** — the old 15-line requirement was replaced wholesale by 30 lines, yet the diff shows just: the reworded description and Rationale, the refined When/Then clauses, and the 2 new scenarios. The review surface shrinks from "reading 45 lines of restatement" to "looking at 15 lines of change."

### 3.4 Apply: Dual-Language Implementation

Service-layer implementations stay isomorphic:

```javascript
// Node.js - cart.js
removeItem(userId, productId) {
  const cart = this.getCart(userId)
  const index = cart.items.findIndex(i => i.productId === productId)
  if (index === -1) throw new Error('CART_ITEM_NOT_FOUND')
  cart.items.splice(index, 1)
  this.cartRepo.save(cart)
  return cart
}
```

```python
# Python - cart.py
def remove_item(self, user_id: str, product_id: str) -> Cart:
    cart = self.get_cart(user_id)
    item = next((i for i in cart.items if i.product_id == product_id), None)
    if not item:
        raise ValueError("CART_ITEM_NOT_FOUND")
    cart.items.remove(item)
    self.repo.save(user_id, cart)
    return cart
```

HTTP layer: the Node dev server keeps its fixed-`user_dev` mock pattern; Python follows its request-carried `userId` convention (query parameter on GET/DELETE). Route error mapping gains `CART_ITEM_NOT_FOUND` → 404. As in the two previous practices, the separately maintained reduced route table in `server.prod.js` stays out of scope.

Tests: Node unit +3 (successful removal / missing item throws / multi-item isolation), integration E2E +1 (empty-cart query → add → query → remove → repeat remove 404); Python smoke +1 (same sequence with an isolated userId). Results: Node 14/14, Python 5/5 green.

### 3.5 Archive: Sync + Archive in One Command

v1.11.0's `openspec archive` embeds the spec merge (no standalone `sync` command in the CLI):

```text
$ openspec archive cart-query-and-remove --yes
Specs to update:
  cart-management: update
Applying changes to openspec/specs/cart-management/spec.md:
  + 1 added
  ~ 1 modified
Totals: + 1, ~ 1, - 0, → 0
Specs updated successfully.
Change 'cart-query-and-remove' archived as '2026-09-02-cart-query-and-remove'.
```

Merge fidelity spot-checked: MODIFIED replaces only the target requirement block, ADDED appends, and **untouched requirements (e.g. "购物车数量限制") keep their original content and position**. Full `openspec validate`: all 7 specs pass, no active changes left behind.

## 4. Takeaways

### 4.1 show --diff changes the review cadence

Reviewing a delta used to mean opening the file and reading restated text; now a single `show --diff` call exposes every real change. The more scenarios a MODIFIED requirement keeps, the bigger the win — this is the compensating mechanism for the design cost of "restate everything you keep."

### 4.2 v1.11.0's Net Effect on the Practice Workflow

1. **Reviews move earlier**: `show --diff` turns "write delta → review immediately" into a zero-friction move; semantic drift can be caught as early as the propose phase.
2. **The write boundary is explicit**: explore's "name it, ask plainly, wait for a separate answer" narrows AI write permission to explicit user consent — clarifying Q&A no longer implies consent.
3. **Archiving is simpler**: sync and archive merge into one command that prints merge stats (+1/~1), reducing the mental load of agent-driven manual merging.

### 4.3 Continuity with the v1.9.0 Migration

After v1.9.0's `## Purpose` migration, v1.11.0's validate warns on unwritten Purpose placeholders (default warning) — completing a "format migration → content guard" loop.

---

_This article is based on the `cart-query-and-remove` practice in the [OpenSpec Practise](https://github.com/ForceInjection/OpenSpec-practise) repository (2026-09-02); full artifacts live under `openspec/changes/archive/2026-09-02-cart-query-and-remove/`._
