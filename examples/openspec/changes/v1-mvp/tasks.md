# Implementation Tasks

## Phase 1: Domain & Core Logic

- [x] Define Types (`src/domain/types.ts`)
- [x] Implement Catalog Service (In-memory data)
- [x] Implement Cart Service logic
- [x] Implement Order Service (Calculation & Validation)

## Phase 2: HTTP Layer

- [x] Setup Node.js HTTP Server (`src/http/server.js`)
- [x] Implement Body Parser helper
- [x] Implement Route: `GET /products`
- [x] Implement Route: `POST /cart/items`
- [x] Implement Route: `POST /orders`

## Phase 3: Verification

- [x] Unit Tests for Domain logic
- [x] Smoke Test Script (`smoke-test.js`)
- [x] Performance Baseline Script (`perf-baseline.js`)

## Phase 4: Production Extensions (v2)

- [x] File Persistence (`src/persist/fileStore.js`)
- [x] Authentication Middleware (`src/http/server.prod.js`)
- [x] Idempotency Check
- [x] Metrics Endpoint
