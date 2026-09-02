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

  it('购物车移除商品', () => {
    const p1 = catalog.addProduct({ name: 'A', priceCents: 100, stock: 10 })
    const p2 = catalog.addProduct({ name: 'B', priceCents: 200, stock: 10 })
    cart.addToCart('u1', p1.id, 2)
    cart.addToCart('u1', p2.id, 1)

    const c = cart.removeItem('u1', p1.id)
    assert.strictEqual(c.items.length, 1)
    assert.strictEqual(c.items[0].productId, p2.id)
    assert.strictEqual(cart.getCart('u1').items.length, 1)
  })

  it('移除不存在的商品条目抛错且购物车不变', () => {
    const p = catalog.addProduct({ name: 'A', priceCents: 100, stock: 10 })
    cart.addToCart('u1', p.id, 1)
    assert.throws(() => cart.removeItem('u1', 'non-existent'), /CART_ITEM_NOT_FOUND/)
    assert.strictEqual(cart.getCart('u1').items.length, 1)
  })

  it('移除空购物车商品抛错', () => {
    assert.throws(() => cart.removeItem('u2', 'anything'), /CART_ITEM_NOT_FOUND/)
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

  it('按ID查询单个商品', () => {
    const p = catalog.addProduct({ name: 'Single', priceCents: 999, stock: 5 })
    const found = catalog.getProduct(p.id)
    assert.ok(found)
    assert.strictEqual(found.name, 'Single')
  })

  it('查询不存在的商品返回undefined', () => {
    const found = catalog.getProduct('non-existent')
    assert.strictEqual(found, undefined)
  })

  it('按名称模糊搜索', () => {
    catalog.addProduct({ name: 'iPhone 15', priceCents: 5999, stock: 10 })
    catalog.addProduct({ name: 'iPad Pro', priceCents: 7999, stock: 5 })
    catalog.addProduct({ name: 'MacBook', priceCents: 9999, stock: 3 })

    const hits = catalog.list('ipad')
    assert.strictEqual(hits.length, 1)
    assert.strictEqual(hits[0].name, 'iPad Pro')

    const all = catalog.list()
    assert.strictEqual(all.length, 3)

    const none = catalog.list('nonexistent')
    assert.strictEqual(none.length, 0)
  })

  it('按价格排序', () => {
    catalog.addProduct({ name: 'A', priceCents: 300, stock: 1 })
    catalog.addProduct({ name: 'B', priceCents: 100, stock: 1 })
    catalog.addProduct({ name: 'C', priceCents: 200, stock: 1 })

    const asc = catalog.list(undefined, 'price_asc')
    assert.deepStrictEqual(asc.map(p => p.priceCents), [100, 200, 300])

    const desc = catalog.list(undefined, 'price_desc')
    assert.deepStrictEqual(desc.map(p => p.priceCents), [300, 200, 100])

    // Invalid sort value falls back to natural order
    const invalid = catalog.list(undefined, 'invalid')
    assert.strictEqual(invalid.length, 3)

    // Search + sort combination: only "A" contains 'a'
    const combo = catalog.list('a', 'price_desc')
    assert.deepStrictEqual(combo.map(p => p.priceCents), [300])
  })
})
