# Order Management Specification

## Purpose

订单管理能力，涵盖订单的创建、查询与总价计算。订单是交易的核心单据，订单创建过程协调购物车、库存扣减与价格计算。

## Requirements

### Requirement: 订单创建

系统 SHALL 支持从用户购物车结算生成订单，过程中处理库存扣减与购物车清空。

**Priority**: P0 (Critical)

**Rationale**: 订单创建是交易的核心流程，涉及多模块协调（Cart -> Catalog -> Order）。

#### Scenario: 成功创建订单

Given 用户购物车中有商品
And 商品库存充足
When 发送 POST /api/orders 携带 { userId }
Then 返回状态码 201
And 返回新创建的订单 Order
And 订单状态为 PENDING_PAYMENT
And 购物车被清空
And 库存被扣减

#### Scenario: 创建订单时购物车为空

Given 用户购物车为空
When 发送 POST /api/orders 携带 { userId }
Then 返回状态码 400
And 返回错误码 CART_EMPTY

#### Scenario: 创建订单时库存不足

Given 用户购物车中有商品
And 商品库存不足
When 发送 POST /api/orders 携带 { userId }
Then 返回状态码 409
And 返回错误码 OUT_OF_STOCK

#### Scenario: 幂等性创建订单

Given 用户携带 Idempotency-Key 请求头
When 重复发送相同的 POST /api/orders 请求
Then 返回相同的订单信息
And 不重复创建订单

---

### Requirement: 订单查询

系统 SHALL 支持根据 ID 查询订单详情。

**Priority**: P1 (High)

**Rationale**: 用户需要能够查看已创建订单的状态和详细信息。

#### Scenario: 查询存在的订单

Given 订单 ID 存在
When 发送 GET /api/orders/:id
Then 返回状态码 200
And 返回订单详情 Order

#### Scenario: 查询不存在的订单

Given 订单 ID 不存在
When 发送 GET /api/orders/:id
Then 返回状态码 404
And 返回错误码 NOT_FOUND

---

### Requirement: 订单总价计算

订单总价 MUST 等于所有条目 priceCents * quantity 之和。

**Priority**: P0 (Critical)

**Rationale**: 正确的价格计算是交易的基础，使用分（cents）为单位避免浮点精度问题。

#### Scenario: 计算单个商品订单总价

Given 订单包含 1 个条目
And 条目单价为 100 分，数量为 2
When 计算订单总价
Then 总价为 200 分

#### Scenario: 计算多个商品订单总价

Given 订单包含 2 个条目
And 条目 1 单价 100 分，数量 2
And 条目 2 单价 50 分，数量 1
When 计算订单总价
Then 总价为 250 分

### Requirement: 订单列表查询

系统 SHALL 提供按用户查询订单列表的接口。客户端通过 `userId` 查询参数指定用户；该用户没有订单时，返回空数组。

**Priority**: P1 (High)

**Rationale**: 用户下单后需要查看自己的订单历史，这是订单闭环「下单 → 查看 → 跟踪」的第一环。列表查询与按 ID 查详情互补，共同构成订单读取能力。

#### Scenario: 查询有订单的用户

Given 用户 user_a 已创建 2 个订单
When 发送 GET /api/orders?userId=user_a
Then 返回状态码 200
And 返回订单数组 Order[]，包含该用户的全部订单

#### Scenario: 查询无订单的用户

Given 用户 user_b 没有任何订单
When 发送 GET /api/orders?userId=user_b
Then 返回状态码 200
And 返回空数组 Order[]

#### Scenario: 未提供 userId

When 发送 GET /api/orders（不带 userId 参数）
Then 返回状态码 400
And 返回错误码 MISSING_USER_ID
