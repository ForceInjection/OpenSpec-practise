## ADDED Requirements

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
