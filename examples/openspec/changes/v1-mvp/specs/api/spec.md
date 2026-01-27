# API Specification

## Purpose

定义对外 RESTful 接口契约。

## Endpoints

### GET /api/products

获取所有商品列表。

- **Response 200**: `Product[]`

### POST /api/products

上架商品（仅供测试数据初始化）。

### POST /api/cart/items

添加商品到购物车。

- **Body**: `{ productId: string, quantity: number }`
- **Response 200**: Updated `Cart`

### DELETE /api/cart/items/:id

移除条目。

### POST /api/orders

结算购物车生成订单。

- **Header**: `Idempotency-Key: <uuid>` (Optional)
- **Body**: `{ userId: string }` (MVP simplified)
- **Response 201**: `Order`
- **Response 400**: Cart empty
- **Response 409**: Stock insufficient

### GET /api/orders/:id

获取订单详情。

- **Response 200**: `Order`
- **Response 404**: Order not found

### POST /api/payments/:orderId

支付订单。

- **Response 200**: Payment success
- **Response 404**: Order not found

## Error Format

```json
{
  "code": "ERROR_CODE",
  "message": "Human readable message"
}
```
