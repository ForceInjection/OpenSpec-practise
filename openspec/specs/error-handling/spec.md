# Error Handling Specification

## Overview

统一错误处理能力，定义系统的标准错误响应格式和错误码体系。确保所有业务异常均以一致的结构返回给客户端，便于前端处理和调试。

## Requirements

### Requirement: 统一错误响应格式

系统 SHALL 对所有业务错误返回统一的 JSON 响应结构。

**Priority**: P1 (High)

**Rationale**: 统一的错误格式便于前端统一处理异常，降低客户端适配复杂度。

#### Scenario: 返回标准错误格式

Given 发生业务错误
When 系统返回错误响应
Then 响应体包含 code 和 message 字段
And 格式为 { "code": "ERROR_CODE", "message": "Human readable message" }

---

### Requirement: 标准错误码定义

系统 SHALL 使用预定义的错误码标识不同类型的业务异常。

**Priority**: P1 (High)

**Rationale**: 标准化的错误码体系使客户端能够精确识别和处理不同的错误场景。

#### Scenario: 库存不足错误

Given 下单时商品库存不足
When 系统返回错误
Then 错误码为 OUT_OF_STOCK
And HTTP 状态码为 409

#### Scenario: 购物车为空错误

Given 用户尝试从空购物车下单
When 系统返回错误
Then 错误码为 CART_EMPTY
And HTTP 状态码为 400

#### Scenario: 资源未找到错误

Given 请求的资源（商品、订单等）不存在
When 系统返回错误
Then 错误码为 NOT_FOUND
And HTTP 状态码为 404

#### Scenario: 未授权访问错误

Given 用户未提供有效的认证凭据
When 系统返回错误
Then 错误码为 UNAUTHORIZED
And HTTP 状态码为 401

#### Scenario: 数量超限错误

Given 购物车商品数量超过上限
When 系统返回错误
Then 错误码为 MAX_QUANTITY_EXCEEDED
And HTTP 状态码为 400
