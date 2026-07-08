# Domain Model Specification

## Overview

核心业务实体定义，不依赖任何外部框架。本规范定义商品、用户、购物车、订单等领域模型的结构与约束，作为所有上层能力的数据基础。

## Requirements

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

**Rationale**: 用户是订单和购物车的所有者，是身份识别的基础。

#### Scenario: 创建有效用户

Given 需要创建新用户
When 提供用户信息 { id, email, name }
Then 用户实体创建成功
And id 格式为 user_xxxx

---

### Requirement: 购物车实体定义

系统 SHALL 定义购物车实体，关联用户和购物车条目列表。

**Priority**: P0 (Critical)

**Rationale**: 购物车是用户选择商品的临时存储，是下单流程的前置依赖。

#### Scenario: 创建购物车

Given 用户需要购物
When 创建购物车
Then 购物车包含 userId 和 items 数组
And 每个条目包含 { id, productId, quantity }

---

### Requirement: 订单实体定义

系统 SHALL 定义订单实体，包含唯一标识、用户关联、状态、总价和订单条目。

**Priority**: P0 (Critical)

**Rationale**: 订单是交易的核心单据，承载了交易的完整信息。

#### Scenario: 创建有效订单

Given 需要创建订单
When 提供订单信息 { id, userId, status, totalCents, items }
Then 订单实体创建成功
And id 格式为 order_xxxx
And status 为 PENDING_PAYMENT 或 PAID
And totalCents >= 0

---

### Requirement: 订单条目实体定义

系统 SHALL 定义订单条目实体，记录下单时的商品快照信息。

**Priority**: P1 (High)

**Rationale**: 订单条目保存下单时刻的价格快照，确保历史订单数据不受商品价格变动影响。

#### Scenario: 创建订单条目

Given 需要记录订单商品信息
When 提供条目信息 { productId, priceCents, quantity }
Then 条目记录商品 ID、下单时单价和购买数量
