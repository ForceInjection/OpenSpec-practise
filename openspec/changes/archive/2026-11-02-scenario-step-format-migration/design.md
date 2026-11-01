## Context

见 `proposal.md` 的 Why。当前状态：

- v1.16.0 的步骤检查在主 spec 与 change delta 中识别 `- **WHEN**`/`- **THEN**` 列表格式；裸关键字行（`Given ...`、`When ...`）不被识别为步骤。
- 本仓库 6 个主 spec 的场景步骤是裸关键字格式，`--strict` 下 6/7 失败；`product-query`（列表格式）通过。
- 普通模式 `validate` 只告警不失败，但 CI 若采用 `--strict` 会直接红。
- 归档 change 的 delta 同为裸格式，但 `openspec validate --archived` 不受影响，6/6 通过。

## Goals / Non-Goals

**Goals:**

- 6 个主 spec 的全部场景步骤迁移为规范列表格式，`validate --specs --strict` 恢复 7/7。
- `config.yaml` 的 specs 规则明确列表格式，避免未来 delta 再生成裸格式。
- 场景名称、步骤语义、需求内容零变化——迁移前后行为契约完全一致。

**Non-Goals:**

- 不重写需求陈述、Priority、Rationale 或 Purpose。
- 不修改归档 change（教学材料保持原样）。
- 不实现 payment 等遗留缺口（另行 change）。
- 不改动双实现代码。

## Decisions

**D1: 直接迁移主 spec，change 声明 `skip_specs: true`**

格式迁移零行为变化，为约 20 个需求写 MODIFIED delta 需要整段复述全部场景，噪声远大于收益，且 MODIFIED delta 的场景级约束（不得丢场景、不得改场景名）会让机械格式修改变成高风险手工活。主 spec 是仓库文件，直接编辑后用 `validate --strict` 验证即可；`skip_specs` 如实声明"无 spec 级行为变化"。

- 备选：为每个需求写 MODIFIED delta——约 20 个需求的完整复述，纯格式差异全部进入 diff，违反"评审只看真正变化"的原则，弃用。

**D2: 目标格式为 `- **GIVEN**`/`- **WHEN**`/`- **THEN**`/`- **AND**`（大写粗体列表项）**

与 OpenSpec 官方模板（skill 文档中的 Main Spec Format Reference）和仓库中已通过检查的 `product-query` 一致；检查器的错误提示示例也是该格式。

- 备选：保留裸关键字仅加列表符（`- When ...`）——与官方模板不一致，未来检查收紧可能再次失败，弃用。

**D3: 场景名称与步骤文本逐字保留**

迁移只改行的形式（关键字 → 列表项），不改任何文字。场景名是 delta 合并与 `show --diff` 的锚点，改名会破坏历史 change 与主 spec 的对应关系。

**D4: `config.yaml` 的 `rules.specs` 同步明确格式**

现有规则只说 "Use Given/When/Then (Gherkin) format"，歧义正是裸格式的来源。明确为列表格式后，未来 propose 生成的 delta 天然符合检查，不再产生新欠账。

## Risks / Trade-offs

- [手工迁移约 40 个场景可能引入笔误] → 迁移后运行 `validate --specs --strict`（7/7）与 `validate --report findings`（清零）；用脚本校验迁移前后场景数与步骤数一致；Node/Python 测试全量回归确认代码未动。
- [归档 delta 与主 spec 格式不一致] → 归档是历史快照，本就不参与后续合并；文档中说明即可。
- [`- **AND**` 未在检查器覆盖范围内] → 检查只要求 WHEN/GIVEN 与 THEN 存在；AND 采用同风格保持可读性与一致性。

## Migration Plan

一次提交完成全部 6 个 spec + config.yaml 的格式迁移；无部署、无数据迁移、无回滚需求（git revert 即可恢复）。

## Open Questions

无。
