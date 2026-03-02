# API Specification

## Overview

定义对外 RESTful 接口契约，涵盖商品、购物车、订单、支付等核心功能。

## ADDED Requirements

### Requirement: 商品列表查询

系统 SHALL 提供商品列表查询接口，返回所有可用商品。

**Priority**: P0 (Critical)

**Rationale**: 商品浏览是电商系统的核心入口功能。

#### Scenario: 获取所有商品

Given 系统中存在商品数据
When 用户请求 GET /api/products
Then 返回状态码 200
And 返回商品数组 Product[]

---

### Requirement: 商品上架

系统 SHALL 支持商品上架功能，用于测试数据初始化。

**Priority**: P2 (Low)

**Rationale**: 便于测试和演示，生产环境可移除。

#### Scenario: 上架新商品

Given 管理员需要添加新商品
When 发送 POST /api/products 携带商品信息
Then 商品创建成功

---

### Requirement: 购物车商品添加

系统 SHALL 支持将商品添加到购物车。

**Priority**: P0 (Critical)

**Rationale**: 购物车是电商下单流程的核心环节。

#### Scenario: 添加商品到购物车

Given 用户已登录且有可用商品
When 发送 POST /api/cart/items 携带 { productId, quantity }
Then 返回状态码 200
And 返回更新后的购物车 Cart

---

### Requirement: 购物车商品移除

系统 SHALL 支持从购物车中移除商品。

**Priority**: P1 (High)

**Rationale**: 用户需要能够调整购物车内容。

#### Scenario: 移除购物车商品

Given 购物车中存在商品条目
When 发送 DELETE /api/cart/items/:id
Then 该条目从购物车中移除

---

### Requirement: 订单创建

系统 SHALL 支持结算购物车生成订单，处理库存扣减。

**Priority**: P0 (Critical)

**Rationale**: 订单创建是交易的核心流程。

#### Scenario: 成功创建订单

Given 用户购物车中有商品
And 商品库存充足
When 发送 POST /api/orders 携带 { userId }
Then 返回状态码 201
And 返回新创建的订单 Order
And 购物车被清空
And 库存被扣减

#### Scenario: 创建订单时购物车为空

Given 用户购物车为空
When 发送 POST /api/orders 携带 { userId }
Then 返回状态码 400
And 返回错误信息 "Cart empty"

#### Scenario: 创建订单时库存不足

Given 用户购物车中有商品
And 商品库存不足
When 发送 POST /api/orders 携带 { userId }
Then 返回状态码 409
And 返回错误信息 "Stock insufficient"

#### Scenario: 幂等性创建订单

Given 用户携带 Idempotency-Key 请求头
When 重复发送相同的 POST /api/orders 请求
Then 返回相同的订单信息
And 不重复创建订单

---

### Requirement: 订单查询

系统 SHALL 支持根据 ID 查询订单详情。

**Priority**: P1 (High)

**Rationale**: 用户需要能够查看订单状态。

#### Scenario: 查询存在的订单

Given 订单 ID 存在
When 发送 GET /api/orders/:id
Then 返回状态码 200
And 返回订单详情 Order

#### Scenario: 查询不存在的订单

Given 订单 ID 不存在
When 发送 GET /api/orders/:id
Then 返回状态码 404
And 返回错误信息 "Order not found"

---

### Requirement: 订单支付

系统 SHALL 支持订单支付，更新订单状态。

**Priority**: P0 (Critical)

**Rationale**: 支付是完成交易的必要步骤。

#### Scenario: 成功支付订单

Given 订单存在且状态为 PENDING_PAYMENT
When 发送 POST /api/payments/:orderId
Then 返回状态码 200
And 订单状态变为 PAID

#### Scenario: 支付不存在的订单

Given 订单 ID 不存在
When 发送 POST /api/payments/:orderId
Then 返回状态码 404
And 返回错误信息 "Order not found"

---

### Requirement: 错误响应格式

系统 SHALL 统一错误响应格式。

**Priority**: P1 (High)

**Rationale**: 统一的错误格式便于前端处理和调试。

#### Scenario: 返回标准错误格式

Given 发生业务错误
When 系统返回错误响应
Then 响应体包含 code 和 message 字段
And 格式为 { "code": "ERROR_CODE", "message": "Human readable message" }
