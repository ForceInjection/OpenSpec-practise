import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import { createServer } from '../src/http/server.js'

describe('性能基线测试', () => {
  let base = ''
  let stop = () => {}

  before(async () => {
    const { server } = createServer()
    await new Promise(resolve => server.listen(0, resolve))
    const address = server.address()
    base = `http://127.0.0.1:${address.port}`
    stop = () => server.close()
  })
  after(() => stop())

  it('下单接口 P99 < 100ms', async () => {
    const USER_ID = 'user_dev'
    const REQUESTS = 50

    // Setup a product with enough stock for every successful order.
    const productRes = await fetch(`${base}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Perf Item', priceCents: 100, stock: 1000 }),
    })
    assert.strictEqual(productRes.status, 201)
    const product = await productRes.json()

    const latencies = []

    for (let i = 0; i < REQUESTS; i++) {
      // The dev cart endpoint uses the fixed user_dev identity, so ordering
      // must use the same user or the request returns CART_EMPTY (400).
      const cartRes = await fetch(`${base}/api/cart/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      })
      assert.strictEqual(cartRes.status, 200)
      const cart = await cartRes.json()
      assert.strictEqual(cart.userId, USER_ID)

      // Measure the complete successful order response, including reading the
      // JSON body, instead of recording only time-to-response-headers.
      const start = performance.now()
      const orderRes = await fetch(`${base}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USER_ID }),
      })
      const order = await orderRes.json()
      const latency = performance.now() - start

      assert.strictEqual(orderRes.status, 201)
      assert.strictEqual(order.status, 'PENDING_PAYMENT')
      assert.strictEqual(order.totalCents, 100)
      latencies.push(latency)
    }

    latencies.sort((a, b) => a - b)
    const p99Index = Math.ceil(latencies.length * 0.99) - 1
    const p99 = latencies[p99Index]

    console.log(`P99 Latency: ${p99.toFixed(2)}ms`)
    assert.ok(p99 < 100, `P99 latency ${p99}ms exceeds SLO 100ms`)
  })
})
