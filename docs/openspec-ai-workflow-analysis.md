# OpenSpec 实战指南：AI 辅助软件工程全流程深度复盘

## 1. 引言：软件工程的新范式

在 AI 辅助编程（AI-Assisted Programming）日益普及的今天，开发者面临的核心挑战已从“如何写代码”转变为“如何与 AI 协作以获得确定性的结果”。传统的开发模式是 **需求 -> 人 -> 代码**，而新的范式正在演变为 **意图 -> Spec (OpenSpec) -> AI -> 代码 & 验证**。

本文以一个 **小型电商系统** 的从零构建到生产级演进为例，深度复盘基于 OpenSpec 的 AI 协同开发全流程。我们将展示 OpenSpec 如何作为“人机通用语言”，贯穿架构设计、系统实现、测试验证与迭代演进的每一个环节，确保 AI 生成的代码可控、可信、可维护。

---

## 2. 完整迭代流程复盘（Node.js 版）

### 2.1 阶段一：意图对齐与规格生成 (Intent to Spec)

**用户输入**:

> “基于 OpenSpec 方法论，写一篇实战指南，结合一个小型电商网站案例，给出完整的迭代流程（架构、设计、测试等）并生成代码。”

**AI 思考与动作**:

在此阶段，AI 不急于编写具体代码，而是首先进行 **领域建模** 与 **规格定义**。这是 OpenSpec 方法论的核心——先想清楚，再动手。

1. **架构设计**: AI 分析出电商系统的核心上下文：商品 (Catalog)、用户 (User)、购物车 (Cart)、订单 (Order)、支付 (Payment)；
2. **边界划分**: 确定分层架构，将 HTTP 接口层、应用服务层与基础设施层（Repository）分离；
3. **规格产出**: 生成了 [openspec-practical-guide.md](./openspec-practical-guide.md)，其中详细定义了：
   - **Proposal**: 目标是构建一个高可测、低延迟的电商 Demo。
   - **Design**: 模块间的数据流向（用户 -> 购物车 -> 订单）。
   - **Spec**: HTTP 接口的路由定义（如 `POST /api/orders`）、错误码规范（`OUT_OF_STOCK`）及非功能指标（p99 < 100ms）。

**价值分析**:

- **消除歧义**: 将模糊的“电商网站”转化为具体的 API 定义和 SLO 指标。
- **结构化约束**: 强迫 AI 在写代码前思考模块边界，避免生成“大泥球”代码。

### 2.2 阶段二：规范驱动的实现生成 (Spec to Code)

**用户输入**: (隐含在初始指令中) “请生成文档和实例代码”。

**AI 动作**:

基于已确定的 Spec，AI 生成了 `examples/ecommerce-mini` 下的完整代码结构。

1. **领域层 (Domain)**: 定义纯粹的类型定义 (JSDoc) [types.js](../examples/ecommerce-mini/src/domain/types.js)，无任何外部依赖。
2. **基础设施层 (Infra)**: 实现了内存版的 [memoryRepo.js](../examples/ecommerce-mini/src/repo/memoryRepo.js)，符合接口隔离原则。
3. **服务层 (Service)**: 实现了 [order.js](../examples/ecommerce-mini/src/services/order.js) 等核心逻辑，负责编排领域对象。
4. **接口层 (Interface)**: 实现了 [server.js](../examples/ecommerce-mini/src/http/server.js)，处理 HTTP 协议解析与错误映射。

**价值分析**:

- **一致性**: 代码严格遵循 Spec 中的接口定义与错误码约定。
- **模块化**: AI 生成的代码天然具备良好的分层结构，因为这是 Spec 设计阶段就确定的。

### 2.3 阶段三：自动化验证闭环

**用户输入**: (AI 主动动作) 验证生成的代码是否符合预期。

**AI 动作**:

AI 不仅仅生成功能代码，还生成了配套的测试脚本来“自证清白”。

1. **冒烟测试**: [integration.spec.js](../examples/ecommerce-mini/__tests__/integration.spec.js) 模拟了用户从“上架商品”到“支付成功”的全链路操作，验证业务逻辑闭环。
2. **性能基线**: [performance.spec.js](../examples/ecommerce-mini/__tests__/performance.spec.js) 测量了接口的 p50/p99 延迟，确保满足 Spec 中的性能指标（输出 p99 < 100ms）。
3. **单元测试**: [unit.spec.js](../examples/ecommerce-mini/__tests__/unit.spec.js) 覆盖了库存扣减等边界情况。

**价值分析**:

- **确定性交付**: 不止交付代码，还交付了“代码可工作”的证据。
- **快速反馈**: 通过脚本快速发现逻辑漏洞（如库存并发扣减问题）。

### 2.4 阶段四：生产级演进

**用户输入**:

> “将此示例拓展为生产级实现（持久化、鉴权、幂等与观测）...”

**AI 动作**:

这是 AI 协同开发中最精彩的部分——**增量演进**。AI 并没有推翻重写，而是基于现有的 Spec 架构进行扩展。

1. **持久化扩展**: 引入 [fileStore.js](../examples/ecommerce-mini/src/persist/fileStore.js) 替换内存 Repo，接口契约保持不变。
2. **鉴权与安全**: 在 [server.prod.js](../examples/ecommerce-mini/src/http/server.prod.js) 中增加了 `HMAC` 签名校验与 `Bearer Token` 逻辑。
3. **幂等性设计**: 实现了 `Idempotency-Key` 中间件，并在测试中验证了重复提交订单的场景（返回相同 Order ID）。
4. **可观测性**: 集成了 Metrics 埋点，并在测试脚本中验证了指标收集。

**价值分析**:

- **架构韧性**: 良好的初始 Spec 设计使得后续引入复杂特性（如鉴权）时，业务逻辑层（Services）几乎无需改动。
- **测试驱动**: 新的生产级测试脚本成为了新特性的验收标准。

---

## 3. 核心洞察：OpenSpec 在 AI 编程中的角色

通过上述案例，我们可以总结出 OpenSpec 在 AI 软件工程中的三个关键角色：

### 3.1 上下文锚点

在长对话或跨会话开发中，AI 容易丢失上下文。OpenSpec 的文档（Proposal/Design/Spec）充当了 **外部存储器**。当用户要求“添加持久化”时，AI 不需要重新分析“什么是订单”，而是直接引用已有的 Spec 进行扩展。

### 3.2 契约守护者

AI 生成代码往往具有随机性。OpenSpec 定义的接口契约（Schema）约束了 AI 的输出空间。在案例中，无论后端实现如何变化（内存 vs 文件），HTTP 接口的 JSON 结构始终保持一致，保证了客户端的兼容性。

### 3.3 协作中间件

- **人 -> AI**: 人通过 Spec 表达意图（“我要一个电商系统，p99 < 100ms”）。
- **AI -> 人**: AI 生成 Spec 供人评审（“这样的接口设计可以吗？”）。
- **AI -> 代码**: AI 基于 Spec 生成代码与测试。
- **测试 -> 验证**: 测试结果反向验证 Spec 的达成情况。

---

## 4. 跨语言实战：Python 复刻

OpenSpec 的核心价值之一是 **语言无关性 (Language Agnostic)**。为了验证这一点，我们记录了一次完整的实验：使用与 Node.js 版本完全相同的 Spec 文件，驱动 AI 从零生成一套全新的 Python 实现（基于 FastAPI + Pydantic）。

### 4.1 环境与目标

- **目标**: 复刻 `ecommerce-mini` 的核心功能。
- **输入**: 仅提供 `openspec/` 目录下的 Markdown 定义。
- **技术栈**: Python 3.10+, FastAPI, Pydantic, Pytest。
- **约束**: 必须严格通过现有的测试用例逻辑。

### 4.2 步骤一：领域模型生成

**交互意图**: 基于 `domain/spec.md` 生成 Python 数据类，确保类型定义与 Spec 一致。

**User Prompt**:

> 请读取 [domain/spec.md](../examples/ecommerce-mini/openspec/changes/v1-mvp/specs/domain/spec.md)。
> 请基于此 Spec，使用 Python 的 Pydantic 库定义 Domain Models。
> 要求：
>
> 1. 文件路径：[src/domain/models.py](../examples/ecommerce-mini-python/src/domain/models.py)
> 2. 严格遵循 Spec 中的字段类型和约束（如 non-negative）。
> 3. 不包含任何业务逻辑，仅定义数据结构。

**AI Response (代码片段)**:

```python
# src/domain/models.py
from pydantic import BaseModel, Field, EmailStr
from typing import List, Literal

class Product(BaseModel):
    id: str
    name: str
    # 对应 Spec: priceCents (Integer, min 0)
    # 使用 Field(..., ge=0) 确保非负约束
    price_cents: int = Field(..., ge=0, alias="priceCents")
    stock: int = Field(..., ge=0)

class CartItem(BaseModel):
    id: str
    product_id: str = Field(..., alias="productId")
    # 对应 Spec Rule: Cart Max Quantity <= 99
    quantity: int = Field(..., gt=0, le=99)

class Order(BaseModel):
    id: str
    # 对应 Spec: status 只能是 PENDING_PAYMENT 或 PAID
    status: Literal["PENDING_PAYMENT", "PAID"]
    total_cents: int = Field(..., ge=0, alias="totalCents")
    items: List[OrderItem]
```

### 4.3 步骤二：业务逻辑实现

**交互意图**: 实现核心业务规则，如库存扣减和订单创建。

**User Prompt**:

> 请基于 [src/domain/models.py](../examples/ecommerce-mini-python/src/domain/models.py) 和 [design.md](../examples/openspec/changes/v1-mvp/design.md)，实现 Service 层。
> 包含三个服务：
>
> 1. `CatalogService`: 处理库存扣减（原子性模拟）。
> 2. `CartService`: 处理购物车增删。
> 3. `OrderService`: 编排下单流程（检查购物车 -> 扣库存 -> 生成订单 -> 清空购物车）。
>    需实现一个简单的 `MemoryRepo` 用于数据存储。

**AI Response (代码片段)**:

```python
# src/services/order.py
class OrderService:
    def create_order(self, user_id: str) -> Order:
        # 1. 获取购物车
        cart = self.cart_svc.get_cart(user_id)
        if not cart.items:
            raise ValueError("Cart is empty")

        order_items = []
        total_cents = 0

        # 2. 验证并扣减库存 (Stock Check Rule)
        for item in cart.items:
            product = self.catalog.get_product(item.product_id)
            if product.stock < item.quantity:
                raise OutOfStockError(f"Product {product.name} out of stock")

            # 执行扣减
            self.catalog.deduct_stock(product.id, item.quantity)

            # 构建订单项
            order_items.append(OrderItem(
                productId=product.id,
                priceCents=product.price_cents,
                quantity=item.quantity
            ))
            total_cents += product.price_cents * item.quantity

        # 3. 生成订单与清空购物车
        order = Order(
            id=f"order_{uuid.uuid4().hex[:8]}",
            status="PENDING_PAYMENT",
            totalCents=total_cents,
            items=order_items
        )
        db.save_order(order)
        self.cart_svc.clear_cart(user_id)
        return order
```

### 4.4 步骤三：接口实现

**交互意图**: 将业务逻辑暴露为 RESTful API，并处理错误码映射。

**User Prompt**:

> 请基于 `src/services/` 和 `api/spec.md`，使用 FastAPI 实现 Web 接口。
> 要求：
>
> 1. 映射所有 Spec 定义的路由。
> 2. 处理错误码映射（如库存不足返回 409）。
> 3. 在启动时初始化测试数据。

**AI Response (代码片段)**:

```python
# src/api/server.py
@app.post("/api/orders", status_code=201)
def create_order(req: CreateOrderRequest):
    try:
        order = order_svc.create_order(req.userId)
        return order
    except OutOfStockError as e:
        # Spec 要求: 库存不足返回 409 Conflict
        # 即使底层抛出的是异常，接口层也必须转换为符合 Spec 的状态码
        raise HTTPException(status_code=409, detail=str(e))
    except ValueError as e:
        # Spec 要求: 购物车为空返回 400 Bad Request
        raise HTTPException(status_code=400, detail=str(e))
```

### 4.5 步骤四：验证与测试

**交互意图**: 编写自动化测试，验证实现是否符合 Spec 定义的行为。

**User Prompt**:

> 请编写 [tests/test_smoke.py](../examples/ecommerce-mini-python/tests/test_smoke.py)，使用 `pytest` 模拟用户行为。
> 测试场景：
>
> 1. 正常下单流程：加购 -> 下单 -> 验库存。
> 2. 异常场景：库存不足时下单，预期返回 409。

**AI Response (代码片段)**:

```python
# tests/test_smoke.py
def test_out_of_stock():
    user_id = "user_2"
    # 尝试购买 6 个 (库存仅 5 个)
    client.post("/api/cart/items", json={
        "userId": user_id,
        "productId": "p1",
        "quantity": 6
    })

    # 验证是否返回 409
    # 这证明了系统正确处理了业务规则边界
    resp = client.post("/api/orders", json={"userId": user_id})
    assert resp.status_code == 409
    assert "out of stock" in resp.json()["detail"]
```

**执行结果**:

```bash
$ pytest examples/ecommerce-mini-python/tests/test_smoke.py
...
examples/ecommerce-mini-python/tests/test_smoke.py ..           [100%]
==================== 2 passed in 0.27s ====================
```

这证实了 Python 实现完全符合 Spec 的行为预期。

---

## 5. 结论

本案例展示了基于 OpenSpec 的 AI 开发并非简单的“提示词工程”，而是一套严谨的 **工程方法论**。它通过：

1. **显式化** 用户的模糊意图；
2. **结构化** 系统的设计规格；
3. **自动化** 代码与测试的生成验证；

最终实现了从“玩具 Demo”到“生产级系统”的平滑演进。在未来的软件开发中，掌握这种 **Spec-Driven AI Collaboration** 模式，将是每一位工程师的核心竞争力。

---

## 附录：项目资产清单

- 原始 Spec 指南: [openspec-practical-guide.md](./openspec-practical-guide.md)
- Node.js 基础实现: `examples/ecommerce-mini/src/{domain,repo,services,http}`
- Python 复刻实现: `examples/ecommerce-mini-python/src/{domain,services,api}`
- 验证脚本: `examples/ecommerce-mini*/*.js` 及 `pytest` 脚本
