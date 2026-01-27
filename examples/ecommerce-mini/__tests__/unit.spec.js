import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert'
import { ProductRepo, CartRepo, OrderRepo } from '../src/repo/memoryRepo.js'
import { CatalogService } from '../src/services/catalog.js'
import { CartService } from '../src/services/cart.js'
import { OrderService } from '../src/services/order.js'

describe('领域与服务单元测试', () => {
  let productRepo
  let cartRepo
  let orderRepo
  let catalog
  let cart
  let orders

  beforeEach(() => {
    productRepo = new ProductRepo()
    cartRepo = new CartRepo()
    orderRepo = new OrderRepo()
    catalog = new CatalogService(productRepo)
    cart = new CartService(cartRepo, productRepo)
    orders = new OrderService(cartRepo, orderRepo, productRepo)
  })

  it('商品上架与列表', () => {
    const p = catalog.addProduct({ name: 'T-Shirt', priceCents: 1999, stock: 10 })
    assert.ok(p.id)
    assert.strictEqual(catalog.list().length, 1)
  })

  it('购物车添加逻辑', () => {
    const p = catalog.addProduct({ name: 'Hat', priceCents: 100, stock: 10 })
    cart.addToCart('u1', p.id, 2)
    const c = cart.getCart('u1')
    assert.strictEqual(c.items.length, 1)
    assert.strictEqual(c.items[0].quantity, 2)
  })

  it('下单扣减库存', () => {
    const p = catalog.addProduct({ name: 'Hat', priceCents: 100, stock: 10 })
    cart.addToCart('u1', p.id, 2)
    const order = orders.createOrder('u1')
    
    assert.ok(order.id)
    assert.strictEqual(order.totalCents, 200)
    assert.strictEqual(catalog.getProduct(p.id).stock, 8)
  })
  
  it('库存不足抛错', () => {
    const p = catalog.addProduct({ name: 'Rare', priceCents: 100, stock: 1 })
    cart.addToCart('u1', p.id, 2)
    assert.throws(() => orders.createOrder('u1'), /OUT_OF_STOCK/)
  })
})
