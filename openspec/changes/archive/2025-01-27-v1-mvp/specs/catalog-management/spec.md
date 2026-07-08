# Catalog Management Specification

## Overview

商品目录管理能力，涵盖商品的查询、上架与库存管理。商品是电商系统的核心资源，所有交易流程均以商品数据为基础。

## ADDED Requirements

### Requirement: 商品列表查询

系统 SHALL 提供商品列表查询接口，返回所有可用商品。

**Priority**: P0 (Critical)

**Rationale**: 商品浏览是电商系统的核心入口功能，用户必须能够查看可购买的商品。

#### Scenario: 获取所有商品

Given 系统中存在商品数据
When 用户请求 GET /api/products
Then 返回状态码 200
And 返回商品数组 Product[]

---

### Requirement: 商品上架

系统 SHALL 支持商品上架功能，接收商品信息并创建新商品记录。

**Priority**: P2 (Low)

**Rationale**: 便于测试数据初始化和演示，生产环境可替换为后台管理系统。

#### Scenario: 上架新商品

Given 管理员需要添加新商品
When 发送 POST /api/products 携带商品信息 { name, priceCents, stock }
Then 返回状态码 201
And 返回创建成功的商品对象 Product

#### Scenario: 自动生成商品 ID

Given 上架请求未提供商品 ID
When 系统处理商品创建
Then 系统 SHALL 自动生成格式为 prod_xxxx 的唯一标识

---

### Requirement: 库存扣减

库存扣减后 MUST NOT 为负数。系统 SHALL 提供原子性库存扣减操作。

**Priority**: P0 (Critical)

**Rationale**: 库存为负会导致超卖，影响业务准确性和用户体验。

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
