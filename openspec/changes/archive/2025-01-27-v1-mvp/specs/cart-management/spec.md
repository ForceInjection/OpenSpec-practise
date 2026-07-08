# Cart Management Specification

## Overview

购物车管理能力，涵盖商品的添加、移除及数量限制规则。购物车是用户选购商品到下单结算之间的临时存储。

## ADDED Requirements

### Requirement: 购物车商品添加

系统 SHALL 支持将商品添加到用户购物车，并返回更新后的购物车状态。

**Priority**: P0 (Critical)

**Rationale**: 购物车是电商下单流程的核心环节，用户必须能够将商品加入购物车。

#### Scenario: 添加商品到购物车

Given 用户已登录且商品存在
When 发送 POST /api/cart/items 携带 { productId, quantity }
Then 返回状态码 200
And 返回更新后的购物车 Cart

#### Scenario: 添加已存在商品时数量累加

Given 购物车中已存在某商品，数量为 2
When 再次添加该商品，数量为 3
Then 该商品在购物车中的数量变为 5

#### Scenario: 添加不存在的商品

Given 商品 ID 在系统中不存在
When 尝试将该商品添加到购物车
Then 抛出 PRODUCT_NOT_FOUND 错误

---

### Requirement: 购物车商品移除

系统 SHALL 支持从购物车中移除指定商品条目。

**Priority**: P1 (High)

**Rationale**: 用户需要能够调整购物车内容，移除不需要的商品。

#### Scenario: 移除购物车商品

Given 购物车中存在商品条目
When 发送 DELETE /api/cart/items/:id
Then 该条目从购物车中移除

---

### Requirement: 购物车数量限制

单个商品在购物车中数量 MUST NOT 超过 99。

**Priority**: P2 (Medium)

**Rationale**: 防止恶意刷单和异常数据，保护系统稳定性。

#### Scenario: 添加商品数量在限制内

Given 购物车中某商品数量为 0
When 添加该商品数量为 99
Then 添加成功

#### Scenario: 添加商品数量超出限制

Given 购物车中某商品数量为 0
When 尝试添加该商品数量为 100
Then 抛出 MAX_QUANTITY_EXCEEDED 错误
And 购物车保持不变

#### Scenario: 累加后数量超出限制

Given 购物车中某商品数量为 50
When 尝试再添加该商品数量为 50
Then 抛出 MAX_QUANTITY_EXCEEDED 错误
And 购物车中该商品数量保持 50
