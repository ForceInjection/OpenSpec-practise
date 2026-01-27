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
})
