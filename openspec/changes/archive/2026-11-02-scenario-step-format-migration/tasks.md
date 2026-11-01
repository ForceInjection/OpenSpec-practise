# Tasks

## 1. 主 spec 格式迁移

- [x] 1.1 用迁移脚本将 `openspec/specs/cart-management/spec.md`、`catalog-management/spec.md`、`domain-model/spec.md` 的场景步骤行转换为 `- **GIVEN**`/`- **WHEN**`/`- **THEN**`/`- **AND**` 列表格式。验证：脚本报告三个文件的场景数与步骤数迁移前后一致
- [x] 1.2 同样迁移 `openspec/specs/error-handling/spec.md`、`order-management/spec.md`、`payment/spec.md`。验证：脚本报告三个文件的场景数与步骤数迁移前后一致
- [x] 1.3 更新 `openspec/config.yaml` 的 `rules.specs`：将 Gherkin 要求明确为 `- **GIVEN**/**WHEN**/**THEN**/**AND**` 列表格式。验证：`openspec context --json` 正常读取，`validate --specs` 无新告警

## 2. 校验与回归

- [x] 2.1 运行 `openspec validate --specs --strict`，确认 7/7 通过、无步骤缺失告警；`openspec validate --specs --report findings` 无 findings；`openspec validate --archived` 保持 6/6。验证：三条命令输出符合预期
- [x] 2.2 抽查迁移保真：随机选取 3 个场景，逐行对比迁移前后关键字文本一致、场景名称未变。验证：`git diff` 中无场景标题行变更、无文字内容变更（仅行首格式）
- [x] 2.3 运行 Node `npm test`（18/18）与 Python `pytest`（7/7）。验证：全绿，确认代码未受影响

## 3. 版本升级与双语文档

- [x] 3.1 更新 `CHANGELOG.md`：新增 v1.16.0 段落（覆盖 v1.15.0 + v1.16.0），记录 `update --dry-run` 实测输出、Node 22.12 门槛、步骤检查实测结果与本次格式迁移实践。验证：版本、日期、命令输出与实际一致
- [x] 3.2 新增 `docs/openspec-v1.16.0-workflow-practice.md` 及 `docs-en/` 英文镜像：覆盖两个版本要点、新检查与历史格式欠账、`skip_specs` 格式迁移的决策、验证结果与遗留观察。验证：中英结构对应，命令可复现
- [x] 3.3 更新 `README.md`、`README-en.md`、`CLAUDE.md`：版本号升至 v1.16.0、学习路径新增第 10 步、CLAUDE.md 记录 CLI 的 Node ≥ 22.12 门槛与场景列表格式约定。验证：全文不再以 v1.14.3 作为当前版本

## Workflow follow-up

- 代码与文档评审通过后，运行 `openspec archive scenario-step-format-migration` 归档该 change。
- 归档后运行 `openspec validate --archived` 与 `openspec list --archived`，确认 7 个归档 change 全部通过。
