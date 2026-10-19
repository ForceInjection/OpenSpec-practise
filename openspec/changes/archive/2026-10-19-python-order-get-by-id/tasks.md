# Tasks

## 1. Python 服务层与 HTTP 端点

- [x] 1.1 在 `examples/ecommerce-mini-python/src/services/order.py` 新增 `get_order(order_id)`，通过 `self.repo.find_by_id(order_id)` 返回订单或 `None`。验证：`tests/test_smoke.py` 的订单详情测试能取回已创建订单
- [x] 1.2 在 `examples/ecommerce-mini-python/src/api/server.py` 新增 `GET /api/orders/{id}` 路由，使用 `response_model=Order`；未命中时抛 `HTTPException(404, detail="Order not found")`。验证：请求不存在订单 ID 返回 404
- [x] 1.3 在 `examples/ecommerce-mini-python/tests/test_smoke.py` 新增 `test_order_get_by_id`：用独立 `user_order_detail` 创建商品/购物车/订单，断言 `GET /api/orders/{id}` 返回 200 且字段为 camelCase（`userId`/`totalCents`），再断言不存在 ID 返回 404。验证：`.venv/bin/python -m pytest tests -q` 显示 7 passed

## 2. 双实现一致性与规范校验

- [x] 2.1 对照 Node.js `GET /api/orders/:id` 确认行为一致：订单存在返回 200 + Order，不存在返回 404；字段名保持 `id`/`userId`/`status`/`totalCents`/`items`。验证：Python 测试断言与 Node `src/http/server.js` 路由逐项比对
- [x] 2.2 运行全量回归：Node `npm test` 保持 18/18，Python `pytest` 7/7。验证：两条命令均全绿
- [x] 2.3 运行 `openspec validate python-order-get-by-id --type change` 与 `openspec validate --specs --report findings`。验证：change 校验通过，7 个主 spec 无 findings

## 3. 版本升级与双语文档

- [x] 3.1 更新 `CHANGELOG.md`：新增 v1.14.3 段落，汇总 1.13.1–1.14.3 的变化，并记录本次 `python-order-get-by-id` 实践；同时记录本仓库升级动作（CLI 1.14.3、`openspec update --force`、6 个可选工作流）。验证：CHANGELOG 中的版本、日期、命令与实际 CLI 输出一致
- [x] 3.2 新增 `docs/openspec-v1.14.3-workflow-practice.md` 及 `docs-en/openspec-v1.14.3-workflow-practice.md` 英文镜像：覆盖 1.13.1–1.14.3 要点、`skip_specs` 实践、验证命令与遗留观察。验证：中英文章结构对应，命令可复现
- [x] 3.3 更新 `README.md`、`README-en.md`、`CLAUDE.md` 中的 OpenSpec 版本号与工作流说明（默认 core profile 与可选 expanded profile）。验证：全文搜索不再出现 `v1.13.0` 作为当前版本，`openspec update --force` 的输出与文档描述一致

## Workflow follow-up

- 代码与文档评审通过后，运行 `openspec archive python-order-get-by-id` 归档该 change。
- 归档后运行 `openspec validate --archived` 与 `openspec list --archived`，确认 6 个归档 change 全部通过。
