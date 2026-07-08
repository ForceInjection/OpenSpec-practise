## Context

当前 `GET /api/products` 返回所有商品列表，但缺少按 ID 查询单个商品的能力。服务层 (`CatalogService.getProduct`) 和仓储层 (`findById`) 在两个实现中均已就绪，本变更仅需在 HTTP 层暴露路由。

## Goals / Non-Goals

**Goals:**
- Node.js 和 Python 两个实现同时新增 `GET /api/products/:id` 端点
- 遵循现有路由的错误处理模式（Node.js 用 `sendError`，Python 用 `HTTPException`）
- 两个实现共享相同的 API 契约

**Non-Goals:**
- 不修改服务层或领域层逻辑
- 不添加新的依赖
- 不引入认证/授权（沿用现有 dev mock 模式）

## Decisions

### Decision 1: 沿用现有路由模式

Node.js 已有 `GET /api/orders/:id` 作为参考实现，新路由沿用相同的路径解析和错误处理模式。Python 端遵循 FastAPI 标准的路径参数 + `HTTPException` 模式。

**Rationale**: 保持代码风格一致，降低认知负担。

**Alternatives Considered**:
1. **在每个服务中添加独立的 `getProductById` 用例**: 过度工程，当前 service 层的 `getProduct` 已完全满足需求。
2. **使用查询参数代替路径参数**: 不符合 RESTful 惯例。

### Decision 2: 404 响应格式统一

Node.js 和 Python 的 404 响应均返回 `{"code": "NOT_FOUND", "message": "Product not found"}`，与现有 Node.js 错误处理风格一致。Python 通过 `HTTPException(detail=...)` 实现等价效果。

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| 两个实现的 404 响应格式略有差异（Node.js 用 `code`/`message` 对象，Python 用 FastAPI 默认 `detail` 字段） | MVP 可接受；两个实现共享相同的 HTTP 状态码语义，契约测试以状态码为主要验证目标 |
