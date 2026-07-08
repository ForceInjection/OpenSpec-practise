# Payment Specification

## Overview

支付能力，涵盖订单支付与状态流转。支付是完成交易的最后一步，将订单从待支付状态转为已支付状态。

## ADDED Requirements

### Requirement: 订单支付

系统 SHALL 支持订单支付，验证订单存在后更新订单状态。

**Priority**: P0 (Critical)

**Rationale**: 支付是完成交易的必要步骤，直接影响订单生命周期。

#### Scenario: 成功支付订单

Given 订单存在且状态为 PENDING_PAYMENT
When 发送 POST /api/payments/:orderId
Then 返回状态码 200
And 订单状态变为 PAID

#### Scenario: 支付不存在的订单

Given 订单 ID 不存在
When 发送 POST /api/payments/:orderId
Then 返回状态码 404
And 返回错误码 NOT_FOUND

---

### Requirement: 订单状态流转

订单状态 SHALL 遵循严格的生命周期：PENDING_PAYMENT -> PAID。

**Priority**: P0 (Critical)

**Rationale**: 状态机约束保证订单流转的正确性，防止非法状态变更。

#### Scenario: 有效状态转换

Given 订单状态为 PENDING_PAYMENT
When 执行支付操作
Then 订单状态变为 PAID

#### Scenario: 重复支付已完成的订单

Given 订单状态已为 PAID
When 再次执行支付操作
Then 返回幂等成功或提示已支付
And 不产生重复扣款
