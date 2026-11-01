# Payment Specification

## Purpose

支付能力，涵盖订单支付与状态流转。支付是完成交易的最后一步，将订单从待支付（PENDING_PAYMENT）状态转为已支付（PAID）状态，并保证已完成的订单不可重复支付。

## Requirements

### Requirement: 订单支付

系统 SHALL 支持订单支付，验证订单存在后更新订单状态。

**Priority**: P0 (Critical)

**Rationale**: 支付是完成交易的必要步骤，直接影响订单生命周期。

#### Scenario: 成功支付订单

- **GIVEN** 订单存在且状态为 PENDING_PAYMENT
- **WHEN** 发送 POST /api/payments/:orderId
- **THEN** 返回状态码 200
- **AND** 订单状态变为 PAID

#### Scenario: 支付不存在的订单

- **GIVEN** 订单 ID 不存在
- **WHEN** 发送 POST /api/payments/:orderId
- **THEN** 返回状态码 404
- **AND** 返回错误码 NOT_FOUND

---

### Requirement: 订单状态流转

订单状态 SHALL 遵循严格的生命周期：PENDING_PAYMENT -> PAID。

**Priority**: P0 (Critical)

**Rationale**: 状态机约束保证订单流转的正确性，防止非法状态变更。

#### Scenario: 有效状态转换

- **GIVEN** 订单状态为 PENDING_PAYMENT
- **WHEN** 执行支付操作
- **THEN** 订单状态变为 PAID

#### Scenario: 重复支付已完成的订单

- **GIVEN** 订单状态已为 PAID
- **WHEN** 再次执行支付操作
- **THEN** 返回幂等成功或提示已支付
- **AND** 不产生重复扣款
