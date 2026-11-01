# 当校验器认不得你的 Gherkin：OpenSpec v1.16.0 工作流实践

OpenSpec v1.15.0（2026-10-24）与 v1.16.0（2026-10-30）相继发布。前者主打安装与升级体验，后者带来本仓库经历的**第一个 BREAKING 变更**（npm 安装的 Node 版本门槛）和一条新的 spec 校验。而这条新校验一升级就让我们付出了代价：**6/7 个主 spec 在 `--strict` 下失败**——它们自 v1-MVP 以来的 Gherkin 写法，新检查器认不出来。

本文记录这次升级的完整过程：`update --dry-run` 的首次实战、步骤检查暴露的历史格式欠账、一次意外触发的 config.yaml 守护，以及用 `skip_specs` 完成 195 个场景步骤的格式迁移。

## 一、两个版本的变化要点

### 1.1 v1.15.0：独立安装与 dry-run

- **无 Node 一键安装** — `curl -fsSL https://raw.githubusercontent.com/Fission-AI/OpenSpec/main/scripts/binary/install.sh | sh`，每个 release 都附带 macOS、Linux（glibc/musl）、Windows 的 x64/arm64 二进制与 SHA256SUMS。npm 等既有渠道不受影响。
- **`openspec update --dry-run`** — 报告一次更新会新增、修改、删除哪些文件，不写任何东西；`--json` 输出机器可读。对每次升级都要刷新 `.claude/` 的工作流来说，这是从"盲刷"到"先看 diff"的转变。
- **提速与修复** — `status`、`instructions`、`validate` 等 `--json` 命令不再加载 spinner；`new change` 的进度行显示实际使用的 schema；`/opsx:verify` 按精确名称匹配 REMOVED 需求，同名的近似需求不再被误当。

### 1.2 v1.16.0：Node 门槛与新校验

- **BREAKING: npm 安装要求 Node ≥ 22.12.0** — Node 20 已于 2026-04-30 EOL。独立二进制不使用 Node，Homebrew 安装自带 Node，均不受影响；无法升级 Node 时可切换独立安装。
- **Scenario 步骤检查** — `openspec validate` 在主 spec 与 change delta 中检查每个场景：缺 WHEN/GIVEN 步骤或缺 THEN 步骤即告警，`--strict` 下失败。错误提示给出的示例格式是 `- **WHEN** ...`/`- **THEN** ...`。
- **无效 config.yaml 不再静默** — 此前 `openspec/config.yaml` 读不了或非法 YAML 时 `validate` 照样通过（规则全被忽略），现在退出码 1。
- **其他** — `openspec.dev` 安装入口；找不到 OpenSpec root 且注册过 store 时给出 `--store` 建议（只建议不代选）；行内三反引号代码不再产生幻影围栏吞掉后续需求；`###Requirement:` 这类无空格标题现在按归档的读法报告。

## 二、升级操作与兼容性检查

```bash
npm install -g @fission-ai/openspec@1.16.0
openspec --version        # 1.16.0
openspec version --check  # OpenSpec is up to date.
```

### 2.1 dry-run 首秀

过去五次升级都是直接 `update --force`，这次第一次可以先看后动：

```text
$ openspec update --dry-run
6 file(s) would change:
  update  .claude/skills/openspec-apply-change/SKILL.md  (claude)
  update  .claude/skills/openspec-archive-change/SKILL.md  (claude)
  ...（共 6 个 skill 文件）

$ openspec update --dry-run --json
{ "changes": 6, "notes": 0, "failures": 0 }
```

`--force` 之后的实际 diff 证实了预览：6 个 skill 文件各变一行（`generatedBy: "1.14.3"` → `"1.16.0"`），6 个 command 文件零变化。对这种"升级但模板没变"的版本，dry-run 让确认成本几乎降为零。

### 2.2 BREAKING 的实际影响

本机 Node v26.13.0 ≥ 22.12.0，npm 安装不受影响。需要区分两个门槛：

- **CLI 的 Node ≥ 22.12.0** — 只约束 `npm install -g @fission-ai/openspec`；
- **示例代码的 Node v20+** — `examples/ecommerce-mini/` 是零依赖纯原生实现，v20+ 照常运行，与 CLI 无关。

给读者的建议：CI 里若以 npm 方式安装 CLI，检查 Node 版本；或直接换独立二进制，绕开 Node 版本问题。

### 2.3 步骤检查：6/7 strict 失败

升级后第一次 `validate --specs --strict` 的结果出乎意料：

```text
✗ spec/cart-management
  ⚠ Requirement "购物车商品添加": scenario "添加商品到购物车" is missing a
    WHEN/GIVEN step and a THEN step...
✗ spec/catalog-management
  ...（共 6 个 spec 失败）
✓ spec/product-query
Totals: 1 passed, 6 failed (7 items)
```

通过与失败的唯一区别是**格式**。`product-query` 的场景写作列表项：

```markdown
#### Scenario: 查询存在的商品
- **WHEN** 客户端发送 `GET /api/products/{id}`，且该 ID 对应的商品存在
- **THEN** 系统返回 200 状态码及该商品的完整 JSON 对象
```

其余 6 个 spec 自 v1-MVP 起写作裸关键字行：

```markdown
#### Scenario: 成功支付订单
Given 订单存在且状态为 PENDING_PAYMENT
When 发送 POST /api/payments/:orderId
Then 返回状态码 200
```

两种写法对人类读者完全等价，但检查器只识别列表格式——错误提示的示例（`- **WHEN** ...`）与 OpenSpec 官方模板（skill 文档的 Main Spec Format Reference）一致。这和 v1.13.0 的经历如出一辙：**findings 抓 Purpose 占位符，步骤检查抓场景格式，工具守护每收紧一层，历史欠账就浮出一层**。当时 product-query 是问题（Purpose 是归档占位符），这次它反而是唯一及格的范本。

### 2.4 意外实测的 config.yaml 守护

更新 `config.yaml` 的 specs 规则时，第一版规则文本里含有一个 `: ` 序列（`keywords: "- **GIVEN**"...`），YAML 解析直接失败。随即：

```text
$ openspec validate --archived
Error: Could not parse .../openspec/config.yaml (Unexpected scalar at node end
at line 26, column 128...)
```

这正是 v1.16 新守护的现场演示：**旧版会静默通过并忽略全部规则，新版立即退出报错**。修复方式是去掉冒号与嵌套引号，规则照常注入。

## 三、实践案例：scenario-step-format-migration

### 3.1 为什么直接迁移主 spec，而不写 delta

直觉上"改 spec 就该走 change delta"，但这个场景不适合：

- 涉及约 20 个需求、48 个场景；MODIFIED delta 必须整段复述需求与全部场景，diff 里将满是纯格式变化——违反"评审只看真正变化"的原则；
- v1.11.0 实践已踩过 MODIFIED 的场景级约束（不得丢场景、不得改场景名），机械格式修改在 delta 通道里是高风险手工活；
- 迁移零行为变化，`skip_specs: true` 如实声明这一点，proposal/design/tasks 照常留档。

### 3.2 脚本化迁移与保真验证

格式迁移的正确做法是脚本而非手工。迁移脚本内置两条断言：

- 每个文件迁移前后 `#### Scenario:` 计数一致；
- 步骤行计数一致（`Given`/`When`/`Then`/`And`/`But` → `- **GIVEN**`/`- **WHEN**`/`- **THEN**`/`- **AND**`/`- **BUT**`）。

```text
openspec/specs/cart-management/spec.md:   11 scenarios, 41 steps migrated
openspec/specs/catalog-management/spec.md: 11 scenarios, 43 steps migrated
openspec/specs/domain-model/spec.md:       5 scenarios, 23 steps migrated
openspec/specs/error-handling/spec.md:     6 scenarios, 24 steps migrated
openspec/specs/order-management/spec.md:  11 scenarios, 49 steps migrated
openspec/specs/payment/spec.md:            4 scenarios, 15 steps migrated
total: 195 step lines migrated, all scenario counts preserved
```

迁移后用 `git diff` 做了机器复核：diff 中没有场景标题行变更，除旧步骤行与新列表行外无任何其他增删——**场景名称与步骤文本逐字保留**。脚本第一版还暴露了一个经典错误：整段文本做 `findall` 时正则忘了 `re.M`，`^` 只匹配文件开头，断言立即中止而不是静默输出错误结果——校验先行再一次证明价值。

### 3.3 config.yaml 规则同步

欠账的根源之一是规则歧义：`config.yaml` 只写 "Use Given/When/Then (Gherkin) format"，裸关键字与列表格式都算 Gherkin。现明确为列表格式，未来 propose 生成的 delta 天然符合检查，不再产生新欠账。

### 3.4 验证结果

| 检查项 | 迁移前 | 迁移后 |
| --- | --- | --- |
| `validate --specs`（普通） | 7 passed + 大量步骤告警 | 7 passed，无告警 |
| `validate --specs --strict` | 1/7 | **7/7** |
| `validate --specs --report findings` | — | 无 findings |
| `validate --archived` | 6/6 | 6/6（归档 delta 不受此检查影响） |
| Node `npm test` | 18/18 | 18/18 |
| Python `pytest` | 7/7 | 7/7 |

注意归档 change 的 delta 仍是裸格式，但 `validate --archived` 不受影响，按仓库惯例归档是教学材料、保持原样。

## 四、总结与遗留观察

### 4.1 校验器认不得"等价写法"是常态

裸关键字 Gherkin 与列表格式对人是等价的，对工具不是。SDD 的单一事实来源要同时服务人与 AI/工具，格式本身就是契约的一部分——当官方模板定义了规范格式，偏离它就是欠账，只是账单什么时候寄到不确定。这次是升级当天到期。

### 4.2 dry-run 改变升级仪式

`update --dry-run --json` 让"升级后模板变了多少"从盲刷后看 diff 变为事前预览。版本跨度小（如本次 6 文件 × 1 行）时确认成本趋近于零；跨度大（如上次 +353/−97）时可以先把预览写进 CHANGELOG。

### 4.3 BREAKING 门槛要区分对象

Node ≥ 22.12 只约束 CLI 的 npm 安装路径。项目代码的运行门槛（示例的 Node v20+）与工具链门槛是两回事，文档里混写会让读者误判升级成本。独立二进制是绕开 Node 门槛的官方出口。

### 4.4 遗留观察

- **payment 仍是最大 spec-code 缺口**：4 个场景、零实现，现在是下一次实践的首选。
- **错误响应格式未统一**：Node `{code, message}` 与 Python `{detail}` 的差异仍在。
- **Node prod 路由覆盖不足**、**dev 固定 `user_dev`**：延续 v1.14.3 文章的观察，未变。
- **裸格式 delta 的存量**：归档 change 里的 delta 全是裸格式，若未来某个版本让 `validate --archived` 也跑步骤检查，会需要一次性决策（迁移或豁免）。

---

_本文基于 [OpenSpec Practise](https://github.com/ForceInjection/OpenSpec-practise) 仓库的 `scenario-step-format-migration` 实践（2026-11-02），完整产物见 `openspec/changes/archive/2026-11-02-scenario-step-format-migration/`。_
