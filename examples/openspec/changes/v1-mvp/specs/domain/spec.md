# Domain Specification

## Overview

定义核心业务实体与规则，不依赖任何外部框架。本规范涵盖商品、用户、购物车、订单等核心领域模型。

## ADDED Requirements

### Requirement: 商品实体定义

系统 SHALL 定义商品实体，包含唯一标识、名称、价格和库存。

**Priority**: P0 (Critical)

**Rationale**: 商品是电商系统的核心实体，是所有交易的基础。

#### Scenario: 创建有效商品

Given 需要创建新商品
When 提供商品信息 { id, name, priceCents, stock }
Then 商品实体创建成功
And id 格式为 prod_xxxx
And priceCents >= 0
And stock >= 0

---

### Requirement: 用户实体定义

系统 SHALL 定义用户实体，包含唯一标识、邮箱和名称。

**Priority**: P1 (High)

**Rationale**: 用户是订单和购物车的所有者。

#### Scenario: 创建有效用户

Given 需要创建新用户
When 提供用户信息 { id, email, name }
Then 用户实体创建成功
And id 格式为 user_xxxx

---

### Requirement: 购物车实体定义

系统 SHALL 定义购物车实体，关联用户和购物车条目。

**Priority**: P0 (Critical)

**Rationale**: 购物车是用户选择商品的临时存储。

#### Scenario: 创建购物车

Given 用户需要购物
When 创建购物车
Then 购物车包含 userId 和 items 数组
And 每个条目包含 { id, productId, quantity }

---

### Requirement: 购物车数量限制

单个商品在购物车中数量 MUST NOT 超过 99。

**Priority**: P2 (Medium)

**Rationale**: 防止恶意刷单和异常数据。

#### Scenario: 添加商品数量在限制内

Given 购物车中某商品数量为 0
When 添加该商品数量为 99
Then 添加成功

#### Scenario: 添加商品数量超出限制

Given 购物车中某商品数量为 0
When 尝试添加该商品数量为 100
Then 返回错误
And 提示数量超出限制

---

### Requirement: 订单实体定义

系统 SHALL 定义订单实体，包含唯一标识、状态、总价和订单条目。

**Priority**: P0 (Critical)

**Rationale**: 订单是交易的核心单据。

#### Scenario: 创建有效订单

Given 需要创建订单
When 提供订单信息 { id, status, totalCents, items }
Then 订单实体创建成功
And id 格式为 order_xxxx
And status 为 PENDING_PAYMENT 或 PAID
And totalCents >= 0

---

### Requirement: 库存非负校验

库存扣减后 MUST NOT 为负数。

**Priority**: P0 (Critical)

**Rationale**: 库存为负会导致超卖，影响业务准确性。

#### Scenario: 库存充足时扣减

Given 商品库存为 5
When 扣减 3 个库存
Then 库存变为 2
And 操作成功

#### Scenario: 库存不足时扣减

Given 商品库存为 5
When 尝试扣减 6 个库存
Then 抛出 OUT_OF_STOCK 错误
And 库存保持不变

---

### Requirement: 订单总价计算

订单总价 MUST 等于所有条目 price * quantity 之和。

**Priority**: P0 (Critical)

**Rationale**: 正确的价格计算是交易的基础。

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
