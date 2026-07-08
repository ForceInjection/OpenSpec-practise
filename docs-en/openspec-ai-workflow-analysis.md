# OpenSpec in Practice: A Deep Retrospective on AI-Assisted Full-Cycle Software Engineering

## 1. Introduction: A New Paradigm for Software Engineering

As AI-Assisted Programming becomes increasingly prevalent, the core challenge developers face has shifted from "how to write code" to "how to collaborate with AI to achieve deterministic outcomes." The traditional development model is **Requirements -> Human -> Code**, while the new paradigm is evolving into **Intent -> Spec (OpenSpec) -> AI -> Code & Verification**.

This article uses the construction of a **small e-commerce system** — from scratch to production-grade evolution — as a case study for an in-depth retrospective of the full AI-collaborative development workflow based on OpenSpec. We will demonstrate how OpenSpec serves as a "universal language between humans and machines," running through every stage of architectural design, system implementation, test verification, and iterative evolution, ensuring that AI-generated code is controllable, trustworthy, and maintainable.

---

## 2. Full Iteration Workflow Retrospective (Node.js Edition)

### 2.1 Phase 1: Intent Alignment and Spec Generation (Intent to Spec)

**User Input**:

> `/opsx:propose` "Build a small e-commerce website MVP with core capabilities for products, cart, orders, and payments."

**AI Thinking and Actions**:

At this stage, the AI does not rush to write concrete code. Instead, it first performs **domain modeling** and **spec definition**. This is the core of the OpenSpec methodology — think it through first, then act.

1. **Architectural Design**: The AI analyzes the core contexts of the e-commerce system: Catalog, User, Cart, Order, Payment;
2. **Boundary Definition**: Establishes a layered architecture, separating the HTTP interface layer, application service layer, and infrastructure layer (Repository);
3. **Spec Output**: Under `openspec/changes/archive/2025-01-27-v1-mvp/` (archived), generates `proposal.md`, `design.md`, `specs/`, and `tasks.md`, clearly defining domain boundaries, SLO metrics, and API contracts, including:
   - **Proposal**: The goal is to build a highly testable, low-latency e-commerce demo.
   - **Design**: Data flow between modules (User -> Cart -> Order).
   - **Spec**: HTTP interface route definitions (e.g., `POST /api/orders`), error code conventions (`OUT_OF_STOCK`), and non-functional metrics (p99 < 100ms).
4. **Companion Article**: Based on these spec documents, a companion practical guide article was written: [openspec-practical-guide.md](./openspec-practical-guide.md).

**Value Analysis**:

- **Eliminating Ambiguity**: Transforms a vague "e-commerce website" into concrete API definitions and SLO metrics.
- **Structured Constraints**: Forces the AI to think about module boundaries before writing code, avoiding the generation of "big ball of mud" code.

### 2.2 Phase 2: Spec-Driven Implementation Generation (Spec to Code)

**User Input**:

> `/opsx:apply` "Please implement the code according to the spec."

**AI Actions**:

Based on the confirmed Spec, the AI generated the complete code structure under `examples/ecommerce-mini`.

1. **Domain Layer**: Defines pure type definitions (JSDoc) [types.js](../examples/ecommerce-mini/src/domain/types.js), with no external dependencies.
2. **Infrastructure Layer (Infra)**: Implements an in-memory [memoryRepo.js](../examples/ecommerce-mini/src/repo/memoryRepo.js), conforming to the interface segregation principle.
3. **Service Layer**: Implements core logic such as [order.js](../examples/ecommerce-mini/src/services/order.js), responsible for orchestrating domain objects.
4. **Interface Layer**: Implements [server.js](../examples/ecommerce-mini/src/http/server.js), handling HTTP protocol parsing and error mapping.

**Value Analysis**:

- **Consistency**: The code strictly follows the interface definitions and error code conventions in the Spec.
- **Modularity**: The AI-generated code naturally has a well-layered structure, because this was determined during the Spec design phase.

### 2.3 Phase 3: Automated Verification Loop

**User Input**: (AI proactive action) Verify that the generated code meets expectations.

**AI Actions**:

The AI not only generates functional code, but also generates companion test scripts to verify that the code behavior meets expectations.

1. **Integration Tests (E2E)**: [integration.spec.js](../examples/ecommerce-mini/__tests__/integration.spec.js) simulates the full-chain user flow from "listing a product" to "successful order placement (PENDING_PAYMENT)", verifying business logic closure.
2. **Performance Baseline**: [performance.spec.js](../examples/ecommerce-mini/__tests__/performance.spec.js) measures interface p50/p99 latency, ensuring the performance metrics in the Spec are met (output p99 < 100ms).
3. **Unit Tests**: [unit.spec.js](../examples/ecommerce-mini/__tests__/unit.spec.js) covers edge cases such as inventory deduction.

**Value Analysis**:

- **Deterministic Delivery**: Delivers not just code, but also evidence that "the code works."
- **Fast Feedback**: Quickly uncovers logic bugs (e.g., concurrent inventory deduction issues) via scripts.

### 2.4 Phase 4: Production-Grade Evolution

**User Input**:

> `/opsx:propose` "Extend this example to a production-grade implementation (persistence, authentication, idempotency, and observability)..."

**AI Actions**:

This is the most impressive part of AI-collaborative development — **incremental evolution**. The AI did not tear everything down and rewrite; instead, it extended the existing Spec architecture.

1. **Persistence Extension**: Introduces [fileStore.js](../examples/ecommerce-mini/src/persist/fileStore.js) to replace the in-memory Repo, while keeping the interface contract unchanged.
2. **Authentication and Security**: Adds a `Bearer Token` authentication middleware in [server.prod.js](../examples/ecommerce-mini/src/http/server.prod.js) (simplified implementation; full HMAC signing logic can be extended here).
3. **Idempotency Design**: Reserves an `Idempotency-Key` request header parsing entry point in the interface layer (stub; full deduplication logic can be connected to Redis or an in-memory cache).
4. **Observability**: Integrates Metrics instrumentation, and validates metric collection in test scripts.

**Value Analysis**:

- **Architectural Resilience**: A good initial Spec design means that when introducing complex features (such as authentication) later, the business logic layer (Services) requires almost no changes.
- **Test-Driven**: New production-grade test scripts serve as acceptance criteria for new features.

---

## 3. Core Insights: The Role of OpenSpec in AI Programming

Through the case study above, we can summarize three key roles OpenSpec plays in AI software engineering:

### 3.1 Context Anchor

In long conversations or cross-session development, AI tends to lose context. The OpenSpec documentation system acts as an **external memory**:

- **`openspec/config.yaml`** (since v1.0.0): Project-level persistent context — technology stack, architectural constraints, rules, and other information are automatically injected into every AI planning request, so the AI doesn't need to re-enter the project background each time. For example, this project's `config.yaml` declares:

  ```yaml
  context: |
    Project: ecommerce-mini - A minimal e-commerce system demonstrating OpenSpec Spec-Driven Development.
    Architecture: Layered (HTTP -> Service -> Domain -> Repository), single-process monolith.
    Storage: In-memory Map (dev), file-based JSON persistence (prod, Node.js only).
  rules:
    specs:
      - Use Given/When/Then (Gherkin) format for all Scenarios
      - Every Requirement must include Priority (P0/P1/P2) and Rationale
  ```

  When the AI executes `/opsx:apply`, this information is automatically injected, ensuring the generated code conforms to the preset constraints.

- **Change Documents (Proposal/Design/Spec)**: The intent, technical approach, and behavioral definitions for individual changes. When the user requests "add persistence," the AI doesn't need to re-analyze "what is an order" — it directly references the existing Spec to extend.

### 3.2 Contract Guardian

AI-generated code often has randomness. The interface contracts (Schema) defined by OpenSpec constrain the AI's output space. In the case study, regardless of how the backend implementation changes (in-memory vs. file), the JSON structure of the HTTP interface remains consistent, ensuring client compatibility.

### 3.3 Collaboration Middleware

- **Human -> AI**: Humans express intent through Spec ("I want an e-commerce system, p99 < 100ms").
- **AI -> Human**: AI generates Spec for human review ("Is this interface design acceptable?").
- **AI -> Code**: AI generates code and tests based on Spec.
- **Tests -> Verification**: Test results inversely verify whether the Spec has been achieved.

---

## 4. Cross-Language Practice: Python Replication

One of OpenSpec's core values is **Language Agnostic**. To verify this, we documented a complete experiment: using the exact same Spec files as the Node.js version to drive AI in generating a brand-new Python implementation from scratch (based on FastAPI + Pydantic).

### 4.1 Environment and Goals

- **Goal**: Replicate the core functionality of `ecommerce-mini`.
- **Input**: Only the Markdown definitions under the `openspec/` directory.
- **Tech Stack**: Python 3.10+, FastAPI, Pydantic, Pytest.
- **Constraint**: Must strictly pass the existing test case logic.

### 4.2 Step 1: Domain Model Generation

**Interaction Intent**: Generate Python data classes based on `domain-model/spec.md`, ensuring type definitions are consistent with the Spec.

**User Prompt**:

> Please read [domain-model/spec.md](../openspec/changes/archive/2025-01-27-v1-mvp/specs/domain-model/spec.md). (Note: v1-mvp has been archived to `changes/archive/`)
> Based on this Spec, please define Domain Models using Python's Pydantic library.
> Requirements:
>
> 1. File path: [src/domain/models.py](../examples/ecommerce-mini-python/src/domain/models.py)
> 2. Strictly follow the field types and constraints in the Spec (e.g., non-negative).
> 3. No business logic — only define data structures.

**AI Response (code snippet)**:

```python
# src/domain/models.py
from pydantic import BaseModel, Field
from typing import List, Literal

class Product(BaseModel):
    id: str
    name: str
    # Corresponds to Spec: Requirement "Product entity definition"
    # Use Field(..., ge=0) to enforce non-negative constraint
    price_cents: int = Field(..., ge=0, alias="priceCents")
    stock: int = Field(..., ge=0)

class CartItem(BaseModel):
    id: str
    product_id: str = Field(..., alias="productId")
    # Corresponds to Spec: Requirement "Cart quantity limit" - quantity <= 99
    quantity: int = Field(..., gt=0, le=99)

class OrderItem(BaseModel):
    product_id: str = Field(..., alias="productId")
    # Corresponds to Spec: Requirement "Order item definition" - records unit price and quantity at time of order
    price_cents: int = Field(..., alias="priceCents")
    quantity: int

class Order(BaseModel):
    id: str
    # Corresponds to Spec: Requirement "Order entity definition" - status can only be PENDING_PAYMENT or PAID
    status: Literal["PENDING_PAYMENT", "PAID"]
    total_cents: int = Field(..., ge=0, alias="totalCents")
    items: List[OrderItem]
```

_Note: `alias` is used to decouple Python naming conventions (snake_case) from the API contract (camelCase), ensuring internal/external consistency._

### 4.3 Step 2: Business Logic Implementation

**Interaction Intent**: Implement core business rules, such as inventory deduction and order creation.

**User Prompt**:

> Based on [src/domain/models.py](../examples/ecommerce-mini-python/src/domain/models.py) and [design.md](../openspec/changes/archive/2025-01-27-v1-mvp/design.md), please implement the Service layer. (Note: v1-mvp has been archived)
> Include three services:
>
> 1. `CatalogService`: Handles inventory deduction (atomicity simulation).
> 2. `CartService`: Handles cart item add/remove.
> 3. `OrderService`: Orchestrates the order placement flow (check cart -> deduct stock -> create order -> clear cart).
>    A simple `MemoryRepo` should be implemented for data storage.

**AI Response (code snippet)**:

```python
# src/services/order.py
class OrderService:
    def create_order(self, user_id: str) -> Order:
        # 1. Get cart
        cart = self.cart_svc.get_cart(user_id)
        if not cart.items:
            raise ValueError("CART_EMPTY")

        order_items = []
        total_cents = 0

        # 2. Validate and deduct stock (Stock Check Rule)
        for item in cart.items:
            product = self.catalog.get_product(item.product_id)
            if product.stock < item.quantity:
                raise ValueError("OUT_OF_STOCK")

            # Execute deduction
            self.catalog.deduct_stock(product.id, item.quantity)

            # Build order item
            order_items.append(OrderItem(
                productId=product.id,
                priceCents=product.price_cents,
                quantity=item.quantity
            ))
            total_cents += product.price_cents * item.quantity

        # 3. Create order and clear cart
        order = Order(
            id=f"order_{uuid.uuid4().hex[:8]}",
            status="PENDING_PAYMENT",
            totalCents=total_cents,
            items=order_items
        )
        self.repo.save(order.id, order)
        self.cart_svc.clear_cart(user_id)
        return order
```

### 4.4 Step 3: Interface Implementation

**Interaction Intent**: Expose business logic as a RESTful API and handle error code mapping.

**User Prompt**:

> Based on `src/services/` and capability specs such as `specs/catalog-management/spec.md` and `specs/order-management/spec.md`, please implement the web interface using FastAPI.
> Requirements:
>
> 1. Map all routes defined in the Spec.
> 2. Handle error code mapping (e.g., return 409 for insufficient stock).
> 3. Initialize test data on startup.

**AI Response (code snippet)**:

```python
# src/api/server.py
@app.post("/api/orders", status_code=201)
def create_order(req: CreateOrderRequest):
    try:
        order = order_svc.create_order(req.userId)
        return order
    except ValueError as e:
        # Spec requirement: distinguish error types via exception message string
        if str(e) == "OUT_OF_STOCK":
            # Spec requirement: return 409 Conflict for insufficient stock
            raise HTTPException(status_code=409, detail="Out of stock")
        # Spec requirement: return 400 Bad Request for empty cart
        raise HTTPException(status_code=400, detail=str(e))
```

_Note: String comparison is used here for example brevity; in production it is recommended to define custom exception classes such as `OutOfStockError` for clearer error semantics and maintainability._

### 4.5 Step 4: Verification and Testing

**Interaction Intent**: Write automated tests to verify that the implementation matches the behavior defined by the Spec.

**User Prompt**:

> Please write [tests/test_smoke.py](../examples/ecommerce-mini-python/tests/test_smoke.py), simulating user behavior using `pytest`.
> Test scenarios:
>
> 1. Normal order flow: add to cart -> place order -> verify inventory.
> 2. Error scenario: place order when stock is insufficient, expecting a 409 response.

**AI Response (code snippet)**:

```python
# tests/test_smoke.py
def test_out_of_stock():
    user_id = "user_2"
    # Add product with stock of 5
    res = client.post("/api/products", json={
        "name": "Limited Item",
        "priceCents": 200,
        "stock": 5
    })
    pid = res.json()["id"]

    # Attempt to purchase 6 (only 5 in stock)
    client.post("/api/cart/items", json={
        "userId": user_id,
        "productId": pid,
        "quantity": 6
    })

    # Verify that 409 is returned
    # This proves the system correctly enforces business rule boundaries
    resp = client.post("/api/orders", json={"userId": user_id})
    assert resp.status_code == 409
    assert "out of stock" in resp.json()["detail"].lower()
```

**Execution Result**:

```bash
$ pytest examples/ecommerce-mini-python/tests/test_smoke.py
...
examples/ecommerce-mini-python/tests/test_smoke.py ..           [100%]
==================== 2 passed in 0.35s ====================
```

This confirms that the Python implementation fully conforms to the behavioral expectations defined by the Spec.

---

## 5. Conclusion

This case study demonstrates that AI development based on OpenSpec is not simply "prompt engineering" — it is a rigorous **engineering methodology**. Through:

1. **Externalizing** the user's vague intent;
2. **Structuring** the system's design specifications;
3. **Automating** the generation and verification of code and tests;

it achieves a smooth evolution from "toy demo" to "production-grade system." In future software development, mastering this **Spec-Driven AI Collaboration** pattern will be a core competency for every engineer.

---

## Appendix: Project Asset Index

> **Quick Navigation**: Want to know CLI command details? -> [OpenSpec User Manual](./openspec-user-manual.md) | Want to see how specs become code? -> [Practical Guide](./openspec-practical-guide.md) | Want to review the AI collaboration process? -> This document

- OpenSpec CLI Reference: [OpenSpec User Manual](./openspec-user-manual.md) (init, validate, archive, and other command details)
- Original Spec Guide: [openspec-practical-guide.md](./openspec-practical-guide.md)
- OpenSpec Project Config: `openspec/config.yaml` (tech stack, architectural constraints, and rules, auto-injected into every AI planning request)
- OpenSpec Spec Files: `openspec/changes/archive/2025-01-27-v1-mvp/` (archived)
  - `proposal.md`: Change proposal
  - `design.md`: Architectural design
  - `specs/catalog-management/spec.md`: Catalog management spec
  - `specs/cart-management/spec.md`: Cart management spec
  - `specs/order-management/spec.md`: Order management spec
  - `specs/payment/spec.md`: Payment spec
  - `specs/domain-model/spec.md`: Domain model spec
  - `specs/error-handling/spec.md`: Error handling spec
- Node.js base implementation: `examples/ecommerce-mini/src/{domain,repo,services,http}`
- Python replication: `examples/ecommerce-mini-python/src/{domain,services,api}`
- Verification scripts: `examples/ecommerce-mini/__tests__/` and `examples/ecommerce-mini-python/tests/`
- Presentation slides: [OpenSpec User Manual](../docs/openspec-user-manual.pptx) (suitable for training and sharing)
