# 让 delta 评审聚焦真正的变化：OpenSpec v1.11.0 工作流实践

OpenSpec v1.10.0 与 v1.11.0 相继发布（2026-08），两个版本均为增量迭代、无 breaking change。v1.11.0 的核心变化是 **`openspec show --diff`**——它回应了 SDD 实践中最实际的痛点：MODIFIED 需求必须复述全部保留的 Scenario，导致评审 delta 时看到的几乎都是与主 spec 相同的文本。本文通过真实案例「购物车查询与商品移除」（cart-query-and-remove），演示升级到 v1.11.0 后的完整工作流（Explore → Propose → Apply → Archive），并记录两个版本中影响实践的变化。

## 一、背景：v1.9.0 时代遗留的三个摩擦点

升级前（v1.9.0），我们的工作流有三个不顺手的地方，恰好被 v1.10/v1.11 逐一回应：

```text
摩擦 1：MODIFIED 评审冗长
  一个被修改的需求要复述全部保留场景 → review 时 >90% 是没变的文本
  变化行淹没在复述里

摩擦 2：explore 边界模糊
  "创建提案文件"是思考还是实施？explore 中写文件之前无明确确认点
  回答澄清问题时，可能被误读为同意写入

摩擦 3：状态检查只针对单 change
  多个 active changes 时需逐个跑 status，看板/CI 集成不便
```

## 二、v1.10.0 与 v1.11.0 的变化要点（实践视角）

### v1.10.0：小迭代

- **tasks 模板要求验证标准**——生成的每个任务必须写明"如何知道完成"（测试/命令/可观察结果），"Implement the thing" 不再合格。影响后续所有 practice 的 tasks 写作
- `openspec init --language` 支持非英语 artifacts（我们已手工维护中文 spec，SHALL/MUST 保持英文即可通过校验，无需此功能）
- 一批修复（stores 指令路径、custom profile 选 archive 不选 sync 的死角等）

### v1.11.0：评审体验的升级

- **`openspec show <change> --diff`**（核心）：按 Requirement 输出 colorized unified diff；**ADDED 给全文、MODIFIED 只显示真正变化的行**、REMOVED 显示 Reason/Migration、RENAMED 显示 FROM/TO；支持 `--json --diff` 供流水线使用
- **`openspec status --all`**：一条命令覆盖所有 active changes；JSON envelope 排序稳定，单个 change 加载失败只贡献一条诊断而不中断扫描
- **explore 写入前确认**：explore 模式在首个写操作前必须点名将创建/编辑的 artifacts 并单独征求明确同意；回答澄清问题 ≠ 同意写入
- **validate 捕获未写的 Purpose 占位符**（默认 warning，`--strict` 失败）——衔接 v1.9.0 的 Overview→Purpose 迁移
- **explore 图表纯 ASCII 化**：模板示例弃用 Unicode 框线，保证跨终端对齐
- **archive 内建 spec 合并**：CLI 已无独立 `sync` 命令（`openspec sync` 不存在），`openspec archive` 一条命令完成「合并 delta → 更新主 spec → 归档」，并打印合并统计（+1 added / ~1 modified）；agent 驱动的 `/opsx:sync` 仍保留用于"只同步、不归档"的场景

## 三、实践案例：cart-query-and-remove

### 3.1 Explore：spec 与代码的倒挂盘点

探索阶段先盘点双实现（Node.js + Python）的 spec-code 差距，发现购物车能力存在**双向缺口**：

| 能力 | spec 声明 | Node.js | Python |
| ---- | --------- | ------- | ------ |
| 添加商品 | 有（3 场景） | ✅ | ✅ |
| **移除商品** | **有（1 场景）** | ❌ 无代码 | ❌ 无代码 |
| **查询购物车** | **无此需求** | 服务层有、无路由 | 服务层有、无路由 |

「移除」是 spec 说要做而代码没有（欠实现），「查询」是代码已有而 spec 与 HTTP 层都没有（倒挂）。选定该 change：补齐「加购 → 查看 → 移除 → 下单」闭环，且同一 change 内同时产生 **ADDED 与 MODIFIED 两种 delta**——正好完整演示 `show --diff` 的两种渲染。

### 3.2 Propose：四个 artifacts

```text
openspec new change "cart-query-and-remove"
```

按 schema 驱动生成 4 个 artifacts：

- **proposal.md** — 声明 Modified Capability: `cart-management`（ADDED「购物车查询」+ MODIFIED「购物车商品移除」）；API 契约：`GET /api/cart/items` 与 `DELETE /api/cart/items/{productId}`（移除不存在条目 → `CART_ITEM_NOT_FOUND` 404）
- **specs/cart-management/spec.md** — delta spec：MODIFIED 移除需求（补「移除不存在的商品」「多条目仅移除目标商品」场景）、ADDED 查询需求（空车/含商品两场景）
- **design.md** — 4 个决策：按 `productId` 而非条目内部 id 移除、缺失条目显式 404 而非幂等成功、接口统一返回 Cart 全量、双实现错误通道同构（Node `Error(code)` / Python `ValueError(code)`）
- **tasks.md** — 4 组 6 任务，每条按 v1.10.0 模板写明验证标准

**validate 拦下一个编辑陷阱**：MODIFIED 中把场景「移除购物车商品」改名成「移除购物车中的商品」，校验器直接报错——MODIFIED 会替换整个 Requirement 块，archive 拒绝静默丢弃主 spec 仍在的场景名。**场景级没有 RENAMED 机制**（RENAMED 只用于 Requirement 级），解法是保留场景名、只改内容：

```text
✗ [ERROR] MODIFIED "购物车商品移除" omits scenario(s) the current spec still has:
  "移除购物车商品". Copy them into the MODIFIED block ...
→ 恢复原场景名后 validate 通过
```

### 3.3 评审：show --diff 的两种渲染

delta 写好后，评审只用一个命令：

```text
openspec show cart-query-and-remove --diff
```

关键体验：**ADDED「购物车查询」显示完整文本**（新内容没有"基线"可比）；**MODIFIED「购物车商品移除」只渲染真正变化的行**——旧的 15 行需求被整体替换为 30 行，diff 却只显示：描述与 Rationale 的措辞变化、场景 When/Then 的细化、2 个新增场景。评审面从"通读 45 行复述"收敛为"只看 15 行变化"。

### 3.4 Apply：双实现落地

服务层实现保持两语言同构：

```javascript
// Node.js - cart.js
removeItem(userId, productId) {
  const cart = this.getCart(userId)
  const index = cart.items.findIndex(i => i.productId === productId)
  if (index === -1) throw new Error('CART_ITEM_NOT_FOUND')
  cart.items.splice(index, 1)
  this.cartRepo.save(cart)
  return cart
}
```

```python
# Python - cart.py
def remove_item(self, user_id: str, product_id: str) -> Cart:
    cart = self.get_cart(user_id)
    item = next((i for i in cart.items if i.product_id == product_id), None)
    if not item:
        raise ValueError("CART_ITEM_NOT_FOUND")
    cart.items.remove(item)
    self.repo.save(user_id, cart)
    return cart
```

HTTP 层：Node dev server 沿用固定用户 `user_dev` 的 mock 模式；Python 端沿用请求携带 `userId` 的惯例（GET/DELETE 走 query 参数）。路由错误映射补 `CART_ITEM_NOT_FOUND` → 404。`server.prod.js` 是独立维护的精简路由表，沿用前两次实践的范围约定不扩展。

测试：Node 单测 +3（成功移除/不存在抛错/多条目隔离）、集成 E2E +1（空车查询 → 加购 → 查询 → 移除 → 重复移除 404）；Python smoke +1（同序列 + 独立 userId 隔离）。结果 Node 14/14、Python 5/5 全绿。

### 3.5 Archive：一条命令完成 sync + 归档

v1.11.0 的 `openspec archive` 内建了 spec 合并（CLI 中已无独立 `sync` 命令）：

```text
$ openspec archive cart-query-and-remove --yes
Specs to update:
  cart-management: update
Applying changes to openspec/specs/cart-management/spec.md:
  + 1 added
  ~ 1 modified
Totals: + 1, ~ 1, - 0, → 0
Specs updated successfully.
Change 'cart-query-and-remove' archived as '2026-09-02-cart-query-and-remove'.
```

合并保真度经抽查确认：MODIFIED 只替换目标 Requirement 块、ADDED 追加、**未提及的需求（如「购物车数量限制」）原样保留且位置不变**。全量 `openspec validate`：7 个 specs 全部通过，无遗留 active changes。

## 四、实践总结

### 4.1 show --diff 改变了评审节奏

以前评审 delta = 打开文件通读复述文本；现在 = `show --diff` 一次调用看到全部真正变化。MODIFIED 场景越多、需求越大，收益越明显——这正是 MODIFIED 必须"复述全部保留场景"这一设计代价的补偿机制。

### 4.2 v1.11.0 对实践流程的净影响

1. **评审前置化**：`show --diff` 让"写 delta → 立即评审"成为零摩擦动作，propose 阶段即可发现语义偏差
2. **写入边界显式化**：explore 的"先点名、再确认、单独立场"把 AI 的写权限收敛到用户明确授权，澄清问答不再产生歧义
3. **归档简化**：sync 与 archive 合并为一条命令，合并统计（+1/~1）自动打印，减少了 agent-driven 手动合并的心智负担

### 4.3 与 v1.9.0 迁移的衔接

v1.9.0 的 `## Purpose` 迁移后，v1.11.0 的 validate 会警告未填写的 Purpose 占位符（默认 warning），形成一个完整的"格式迁移 → 内容守护"闭环。

---

_本文基于 [OpenSpec Practise](https://github.com/ForceInjection/OpenSpec-practise) 仓库的 `cart-query-and-remove` 实践（2026-09-02），完整产物见 `openspec/changes/archive/2026-09-02-cart-query-and-remove/`。_
