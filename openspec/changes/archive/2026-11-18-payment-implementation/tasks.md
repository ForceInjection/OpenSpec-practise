# Tasks

## 1. Node.js 服务层与路由

- [x] 1.1 在 `examples/ecommerce-mini/src/services/order.js` 新增 `payOrder(orderId)`：未命中抛 `Error('NOT_FOUND')`；`PENDING_PAYMENT` → 置 `PAID` 并保存返回；已 `PAID` 原样返回（幂等）。验证：`__tests__/unit.spec.js` 支付用例通过
- [x] 1.2 在 `src/services/order.js` 顶部无用例改动的前提下，在 `__tests__/unit.spec.js` 新增 3 个用例：支付成功状态流转、支付不存在订单抛 `NOT_FOUND`、重复支付幂等返回。验证：`npm test` 该组通过
- [x] 1.3 在 `src/http/server.js` 新增 `POST /api/payments/:orderId` 路由：调用 `payOrder`，200 返回订单；错误映射补 `NOT_FOUND` → 404。`__tests__/integration.spec.js` 新增支付 E2E（创建订单 → 支付 → PAID → 重复支付幂等 200）。验证：`npm test` 全绿 22/22

## 2. Python 服务层、路由与测试

- [x] 2.1 在 `examples/ecommerce-mini-python/src/services/order.py` 新增 `pay_order(order_id)`：未命中返回 `None`；`PENDING_PAYMENT` → `PAID` 并保存；已 `PAID` 原样返回。`src/api/server.py` 新增 `POST /api/payments/{id}` 路由与 404 映射。验证：路由可调用
- [x] 2.2 在 `tests/test_smoke.py` 新增 `test_pay_order`（独立 `user_payment`）：支付成功断言 `PAID`、不存在订单 404、重复支付幂等 200。验证：`.venv/bin/python -m pytest tests -q` 显示 8 passed

## 3. 一致性与规范校验

- [x] 3.1 对照 spec 4 场景逐条核对双实现：200+PAID、404 NOT_FOUND、状态机单向、幂等重复支付；断言字段一致（`id`/`userId`/`status`/`totalCents`）。验证：比对两侧测试断言与 `openspec/specs/payment/spec.md` 场景
- [x] 3.2 全量回归与校验：Node `npm test` 22/22、Python `pytest` 8/8；`openspec validate payment-implementation --type change` 通过；`openspec validate --specs --strict` 7/7。验证：全部命令通过

## 4. 版本升级与双语文档

- [x] 4.1 更新 `CHANGELOG.md`：新增 v2.1.0 段落（覆盖 v1.16.1–v2.1.0 四个版本），重点记录 2.0 的 skills 迁移与 `/opsx` 命令移除、2.1 的全局技能选项，及本次升级实测（dry-run 25 文件预览、符号链接布局）。验证：版本、日期与实际 CLI 输出一致
- [x] 4.2 新增 `docs/openspec-v2.1.0-workflow-practice.md` 及 `docs-en/` 英文镜像：覆盖 2.x 迁移要点、技能调用方式的变化（`/opsx:propose` → `openspec-propose` 技能）、payment 实践与验证结果。验证：中英结构对应，命令可复现
- [x] 4.3 更新 `README.md`、`README-en.md`、`CLAUDE.md`：版本号升至 v2.1.0、npm Node 门槛 22.20、`.agents/skills/` 新布局与技能调用方式、核心特性补充支付闭环、已知分歧移除 payment 条目。验证：全文无 `/opsx:` 作为现行调用方式的表述，测试计数更新

## Workflow follow-up

- 代码与文档评审通过后，运行 `openspec archive payment-implementation` 归档该 change。
- 归档后运行 `openspec validate --archived` 与 `openspec list --archived`，确认 8 个归档 change 全部通过。
