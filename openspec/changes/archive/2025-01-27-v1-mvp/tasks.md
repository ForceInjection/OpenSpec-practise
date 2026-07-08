# Implementation Tasks

## 1. Domain Model & Core Logic

- [x] 1.1 Define domain types: Product, User, Cart, CartItem, Order, OrderItem (Node.js & Python)
- [x] 1.2 Implement calculateTotal utility function (Node.js & Python)
- [x] 1.3 Implement CatalogService: list, getProduct, addProduct, deductStock (Node.js & Python)
- [x] 1.4 Implement CartService: getCart, addToCart, clearCart with quantity limit (Node.js & Python)
- [x] 1.5 Implement OrderService: createOrder with cart -> stock -> order orchestration (Node.js & Python)

## 2. Repository Layer

- [x] 2.1 Implement in-memory MemoryRepo for Product, Cart, Order (Node.js & Python)
- [x] 2.2 Implement FileStore for file-based JSON persistence (Node.js)

## 3. HTTP Layer

- [x] 3.1 Setup HTTP server with JSON body parser (Node.js: native http, Python: FastAPI)
- [x] 3.2 Implement route: GET /api/products (Node.js & Python)
- [x] 3.3 Implement route: POST /api/products (Node.js & Python)
- [x] 3.4 Implement route: POST /api/cart/items (Node.js & Python)
- [x] 3.5 Implement route: DELETE /api/cart/items/:id (Node.js & Python)
- [x] 3.6 Implement route: POST /api/orders (Node.js & Python)
- [x] 3.7 Implement route: GET /api/orders/:id (Node.js & Python)
- [x] 3.8 Implement route: POST /api/payments/:orderId (Node.js & Python)
- [x] 3.9 Implement unified error response handler with { code, message } format (Node.js & Python)

## 4. Verification

- [x] 4.1 Unit tests for domain logic: calculateTotal, stock deduction (Node.js)
- [x] 4.2 Integration smoke test: full purchase flow (add product -> add to cart -> create order) (Node.js & Python)
- [x] 4.3 Performance baseline test: p99 latency check against SLO (Node.js)

## 5. Production Extensions

- [x] 5.1 File persistence adapter wrapping FileStore for products, carts, orders (Node.js)
- [x] 5.2 JWT authentication middleware with HMAC-SHA256 signing (Node.js)
- [x] 5.3 Idempotency check for order creation via Idempotency-Key header (Node.js)
- [x] 5.4 Metrics endpoint: GET /metrics returning request count and p99 latency (Node.js)
