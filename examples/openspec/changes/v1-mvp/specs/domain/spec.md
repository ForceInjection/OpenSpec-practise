# Domain Specification

## Purpose

定义核心业务实体与规则，不依赖任何外部框架。

## Models

### Product

```typescript
interface Product {
  id: string;        // prod_xxxx
  name: string;
  priceCents: number;// Integer, min 0
  stock: number;     // Integer, min 0
}
```

### User

```typescript
interface User {
  id: string;        // user_xxxx
  email: string;
  name: string;
}
```

### Cart

```typescript
interface Cart {
  userId: string;
  items: CartItem[];
}

interface CartItem {
  id: string;        // cartitem_xxxx
  productId: string;
  quantity: number;
}
```

### Order

```typescript
interface Order {
  id: string; // order_xxxx
  status: "PENDING_PAYMENT" | "PAID";
  totalCents: number;
  items: OrderItem[];
  // userId and createdAt are implicit in context or managed by system
}
```

## Rules

### Rule: Stock Non-Negative

库存扣减后不能为负数。

- **GIVEN** Product stock is 5
- **WHEN** Deduct 6
- **THEN** Throw `OUT_OF_STOCK` error

### Rule: Order Total Calculation

订单总价等于所有条目 `price * quantity` 之和。

- **GIVEN** 2 items of 100 cents
- **THEN** Total is 200 cents

### Rule: Cart Max Quantity

单个商品在购物车中数量不能超过 99（防恶意刷单）。
