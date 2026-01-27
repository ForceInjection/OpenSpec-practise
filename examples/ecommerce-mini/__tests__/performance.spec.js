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
    // Setup data
    const res = await fetch(`${base}/api/products`, {
        method: 'POST',
        body: JSON.stringify({ name: 'Perf Item', priceCents: 100, stock: 1000 })
    })
    const product = await res.json()

    const latencies = []
    const REQUESTS = 50

    for (let i = 0; i < REQUESTS; i++) {
        // Add to cart first
        await fetch(`${base}/api/cart/items`, {
            method: 'POST',
            body: JSON.stringify({ productId: product.id, quantity: 1 })
        })

        const start = performance.now()
        await fetch(`${base}/api/orders`, {
            method: 'POST',
            body: JSON.stringify({ userId: `user_${i}` })
        })
        latencies.push(performance.now() - start)
    }

    latencies.sort((a, b) => a - b)
    const p99Index = Math.floor(latencies.length * 0.99)
    const p99 = latencies[p99Index]

    console.log(`P99 Latency: ${p99.toFixed(2)}ms`)
    assert.ok(p99 < 100, `P99 latency ${p99}ms exceeds SLO 100ms`)
  })
})
