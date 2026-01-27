export class OrderService {
  constructor(cartRepo, orderRepo, productRepo) {
    this.cartRepo = cartRepo
    this.orderRepo = orderRepo
    this.productRepo = productRepo
  }

  createOrder(userId) {
    const cart = this.cartRepo.findByUserId(userId)
    if (!cart || cart.items.length === 0) {
      throw new Error('CART_EMPTY')
    }

    // 1. Validate stock and calculate total
    let totalCents = 0
    const orderItems = []

    for (const item of cart.items) {
      const product = this.productRepo.findById(item.productId)
      if (!product) throw new Error(`Product ${item.productId} not found`)
      if (product.stock < item.quantity) throw new Error('OUT_OF_STOCK')
      
      totalCents += product.priceCents * item.quantity
      orderItems.push({
        productId: item.productId,
        priceCents: product.priceCents,
        quantity: item.quantity
      })
    }

    // 2. Deduct stock (Simulated Transaction)
    for (const item of cart.items) {
      const product = this.productRepo.findById(item.productId)
      product.stock -= item.quantity
      this.productRepo.save(product)
    }

    // 3. Create Order
    const order = {
      id: `order_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      status: 'PENDING_PAYMENT',
      totalCents,
      items: orderItems
    }
    this.orderRepo.save(order)

    // 4. Clear Cart
    this.cartRepo.save({ userId, items: [] })

    return order
  }
}
