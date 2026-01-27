export class ProductRepo {
  constructor() {
    this.products = new Map()
  }

  save(product) {
    this.products.set(product.id, product)
  }

  findAll() {
    return Array.from(this.products.values())
  }

  findById(id) {
    return this.products.get(id)
  }
}

export class CartRepo {
  constructor() {
    this.carts = new Map()
  }

  findByUserId(userId) {
    return this.carts.get(userId)
  }

  save(cart) {
    this.carts.set(cart.userId, cart)
  }
}

export class OrderRepo {
  constructor() {
    this.orders = new Map()
  }

  save(order) {
    this.orders.set(order.id, order)
  }

  findById(id) {
    return this.orders.get(id)
  }
}
