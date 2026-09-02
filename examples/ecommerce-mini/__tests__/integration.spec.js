import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import { createServer } from '../src/http/server.js'

let base = ''
let stop = () => {}

describe('集成测试 (E2E)', () => {
  before(async () => {
    const { server } = createServer()
    await new Promise(resolve => server.listen(0, resolve))
    const address = server.address()
    const port = address && typeof address === 'object' ? address.port : 0
    base = `http://127.0.0.1:${port}`
    stop = () => server.close()
  })
  after(() => stop())

  it('完整购物流程', async () => {
    // 1. 上架商品
    const res1 = await fetch(`${base}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Integration Item', priceCents: 500, stock: 10 }),
    })
    assert.strictEqual(res1.status, 201)
    const product = await res1.json()

    // 2. 加购
    const res2 = await fetch(`${base}/api/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, quantity: 2 }),
    })
    assert.strictEqual(res2.status, 200)

    // 3. 下单
    const res3 = await fetch(`${base}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user_dev' }),
    })
    assert.strictEqual(res3.status, 201)
    const order = await res3.json()
    assert.strictEqual(order.totalCents, 1000)
    assert.strictEqual(order.status, 'PENDING_PAYMENT')
  })

  it('查询购物车与移除商品', async () => {
    // 1. 上架两个商品
    const mk = async (name, price) => {
      const r = await fetch(`${base}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, priceCents: price, stock: 10 }),
      })
      assert.strictEqual(r.status, 201)
      return r.json()
    }
    const a = await mk('Cart A', 100)
    const b = await mk('Cart B', 200)

    // 2. 查询空购物车（上一个测试下单后购物车已被清空）
    const emptyRes = await fetch(`${base}/api/cart/items`)
    assert.strictEqual(emptyRes.status, 200)
    const emptyCart = await emptyRes.json()
    assert.strictEqual(emptyCart.userId, 'user_dev')
    assert.deepStrictEqual(emptyCart.items, [])

    // 3. 加购两个商品
    for (const p of [a, b]) {
      const r = await fetch(`${base}/api/cart/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: p.id, quantity: 1 }),
      })
      assert.strictEqual(r.status, 200)
    }

    // 4. 查询返回两个条目
    const listRes = await fetch(`${base}/api/cart/items`)
    const listCart = await listRes.json()
    assert.strictEqual(listCart.items.length, 2)

    // 5. 移除商品 a：仅目标条目被移除
    const delRes = await fetch(`${base}/api/cart/items/${a.id}`, { method: 'DELETE' })
    assert.strictEqual(delRes.status, 200)
    const after = await delRes.json()
    assert.strictEqual(after.items.length, 1)
    assert.strictEqual(after.items[0].productId, b.id)

    // 6. 移除不存在于购物车的商品 → 404
    const missRes = await fetch(`${base}/api/cart/items/${a.id}`, { method: 'DELETE' })
    assert.strictEqual(missRes.status, 404)
    const err = await missRes.json()
    assert.strictEqual(err.code, 'CART_ITEM_NOT_FOUND')
  })
})
