# Refining Requirements with /opsx:update: OpenSpec v1.7.0 Full Workflow Practice

OpenSpec v1.6.0 introduced the **`/opsx:update`** skill — revising a change's planning artifacts mid-implementation while keeping proposal/specs/design/tasks coherent. v1.7.0 brought it into the core profile workflow and comprehensively polished the templates. This article walks through a real case — "product search and price sort" — demonstrating the full end-to-end workflow (Explore → Propose → **Update** → Apply → Sync → Archive).

> **Prerequisite**: `/opsx:update` is part of the core profile. After running `openspec update`, if you see "missing 1 core workflow: update", run `openspec config profile core` to enable it.

## 1. Background: The Gap in the v1.5.0 Era

In the v1.5.0 workflow (see [The Three Major Changes](./openspec-v1.5.0-upgrade.md)), Fluid Workflow allows editing documents at any time, but the AI needs to be explicitly told "now we're revising the plan", and coherence across artifacts cannot be guaranteed automatically — editing one document may leave others out of sync.

`/opsx:update`, introduced in v1.6.0 and made part of the default workflow in v1.7.0, fills this gap. Its job is to **revise a change's existing planning artifacts and keep them coherent with one another**, and it explicitly never edits code. This changes the way you work: **requirements can evolve before and during implementation without worrying about planning documents falling out of sync**.

```text
v1.5.0:  explore → propose → apply → sync → archive
                                          ↑
                     manual document editing, no coherence guarantee

v1.6.0+: explore → propose → update → apply → sync → archive
                           ↑
              standardized revision flow, artifacts stay coherent
```

---

## 2. Case Study: add-product-search

### 2.1 Explore: Choosing the Candidate Requirement

In the e-commerce example system (Node.js + Python dual implementation), the product list endpoint `GET /api/products` only returned the full list. After exploration, the candidate requirements were:

| Candidate          | Trade-off                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Delete product     | ❌ Touches stock references, too large a change                                                                                |
| Pagination         | ❌ Requires designing pagination parameters, overly complex                                                                    |
| **Search by name** | ✅ Small but valuable (~10 lines of code), and it modifies an existing spec (MODIFIED) — exactly what triggers the update flow |

### 2.2 Propose: Generating Planning Artifacts

Created the change and generated 4 artifacts:

- **proposal.md** — Declares Modified Capability: `catalog-management`
- **specs/catalog-management/spec.md** — MODIFIED "Product List Query" requirement (3 Scenarios)
- **design.md** — Filtering lives in the service layer, case-insensitive substring matching
- **tasks.md** — 4 groups, 8 checkboxes

### 2.3 Update: New Requirement Before Implementation

Before apply, the user raised a new requirement: **search results should support sorting by price**. This is exactly what `/opsx:update` is for.

**Key judgment: ADDED vs MODIFIED**: Price sorting is a new concern that doesn't change the existing search behavior — so `## ADDED Requirements` is used rather than MODIFIED. This avoids the common archive pitfall: using MODIFIED with partial content loses existing details in the main spec at archive time.

Coherent revision of all 4 artifacts:

| Artifact          | Revision                                                                                                                     |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| proposal.md       | What Changes + Impact add the `sort` parameter                                                                               |
| specs/.../spec.md | **ADDED** "Product List Price Sort" requirement (4 Scenarios: ascending/descending/search+sort combo/invalid value fallback) |
| design.md         | New Decision 3 (sort parameter whitelist validation) + Decision 4 (sorting in the service layer)                             |
| tasks.md          | Task signatures updated to `list(name, sort)`, tests cover sort scenarios                                                    |

**Whitelist design**: `sort` accepts only `price_asc`/`price_desc`; invalid values are silently ignored (natural order preserved). Silent ignore rather than a 400 error preserves backward compatibility — old clients passing unknown parameters aren't broken.

### 2.4 Apply: Dual-Implementation Delivery

Implemented per tasks; the service layer handles filtering and sorting, the HTTP layer only passes parameters through:

```javascript
// Node.js - catalog.js
list(name, sort) {
  let products = this.repo.findAll()
  if (name) {
    const keyword = name.toLowerCase()
    products = products.filter(p => p.name.toLowerCase().includes(keyword))
  }
  if (sort === 'price_asc') {
    products.sort((a, b) => a.priceCents - b.priceCents)
  } else if (sort === 'price_desc') {
    products.sort((a, b) => b.priceCents - a.priceCents)
  }
  return products
}
```

```python
# Python - catalog.py
def list_products(self, name: Optional[str] = None, sort: Optional[str] = None):
    products = self.repo.find_all()
    if name:
        keyword = name.lower()
        products = [p for p in products if keyword in p.name.lower()]
    if sort == "price_asc":
        products.sort(key=lambda p: p.price_cents)
    elif sort == "price_desc":
        products.sort(key=lambda p: p.price_cents, reverse=True)
    return products
```

**Two test logic bugs found and fixed along the way:**

1. **Node.js combo assertion misjudgment**: in `list('a', 'price_desc')`, 'a' is a fuzzy substring match, and only "A" contains 'a' (B and C don't) — the assertion was corrected to `[300]`
2. **Python shared app instance**: TestClient reuses the same app, so products from earlier tests accumulate — switched to relative assertions (`>= 3` + set containment) instead of hardcoded counts

Test results: Node.js 10/10, Python 4/4 all passing.

### 2.5 Sync: Intelligent Merge into the Main Spec

The delta spec and main spec are merged following the **intelligent merge** principle:

- **MODIFIED "Product List Query"**: description updated, original "Get All Products" Scenario preserved, "Search by Name" and "No Results" Scenarios added
- **ADDED "Product List Price Sort"**: appended as a new Requirement

After the merge, the main spec contains no delta headers (`## ADDED/MODIFIED`) — clean structure: 4 Requirements, 11 Scenarios.

### 2.6 Archive: Verified, Then Archived

Before archiving, consistency was verified (search Scenario present, sort Requirement present, no delta headers), then:

```text
openspec/changes/archive/2026-07-28-add-product-search/
```

---

## 3. Practice Summary

### 3.1 The Value of /opsx:update

Compared to manual editing in v1.5.0, the update flow brings three changes:

1. **Coherence guarantee**: after revising one artifact, other artifacts are automatically checked for needed synchronization ("edit direction is arbitrary — editing a later artifact may require revising an earlier one")
2. **ADDED/MODIFIED decision made explicit**: new concerns use ADDED, behavior changes use MODIFIED — this judgment directly affects archive quality
3. **Doesn't advance the build frontier**: update only edits existing files, never creates new artifacts (that's continue's job) — clear division of responsibilities

### 3.2 The Value of Version Evolution

From v1.5.0 to v1.7.0, OpenSpec filled the weakest link in its workflow. v1.5.0 solved "AI dynamically understands the project" (Schema-driven), while v1.6.0 introduced the update skill — brought into the default workflow in v1.7.0 — solving "planning documents keep evolving". Together, they make Spec-Driven Development truly fit **iterative development** — requirements aren't fixed once, they grow together with the implementation.

---

_Based on the `add-product-search` practice in the [OpenSpec Practise](https://github.com/ForceInjection/OpenSpec-practise) repository (2026-07-28). Full artifacts in `openspec/changes/archive/2026-07-28-add-product-search/`._
