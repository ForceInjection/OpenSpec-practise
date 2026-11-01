## Why

OpenSpec v1.16.0 为 `openspec validate` 新增 Scenario 步骤检查：场景缺少 WHEN/GIVEN 或 THEN 步骤时告警，`--strict` 下失败。本仓库 7 个主 spec 中 6 个自 v1-MVP 起使用裸关键字格式（`When 发送 POST ...`，无列表符、无粗体），新检查无法识别，`--strict` 下 6/7 失败；唯一通过的 `product-query` 使用的正是 OpenSpec 规范模板中的列表格式（`- **WHEN** ...`）。这是继 v1.13.0 findings 抓到 Purpose 占位符之后，又一次由工具守护暴露的历史欠账。

## What Changes

- **主 spec 格式迁移**：将 6 个主 spec（cart/catalog/domain-model/error-handling/order/payment）中全部场景步骤从裸关键字格式迁移为规范列表格式（`- **GIVEN**`、`- **WHEN**`、`- **THEN**`、`- **AND**`）。
- **纯格式变更**：场景名称、步骤内容、需求陈述、Priority/Rationale 一律不变，不改变任何行为契约。
- **config.yaml 规则更新**：`rules.specs` 的 Gherkin 要求明确为列表格式，使未来生成的 delta 直接符合检查。
- **无代码变更**：Node.js 与 Python 实现不受影响。

## Capabilities

### New Capabilities

无。不引入新的系统行为。

### Modified Capabilities

无。本 change 不改变任何需求的行为语义，仅调整场景步骤的书写格式，因此声明 `skip_specs: true`，直接迁移主 spec。

## Impact

- **`openspec/specs/*/spec.md`**：6 个文件的全部场景步骤格式。
- **`openspec/config.yaml`**：`rules.specs` 一条规则措辞。
- **校验结果**：`openspec validate --specs --strict` 从 1/7 通过恢复为 7/7 通过；普通 `validate` 的告警清零。
- **归档 change 不动**：`changes/archive/` 是教学材料，保持原样（`validate --archived` 不受此检查影响）。
- **Node.js / Python**：无代码变更，测试不受影响。
