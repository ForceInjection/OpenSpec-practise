export class CartService {
  constructor(cartRepo, productRepo) {
    this.cartRepo = cartRepo
    this.productRepo = productRepo
  }

  getCart(userId) {
    let cart = this.cartRepo.findByUserId(userId)
    if (!cart) {
      cart = { userId, items: [] }
      this.cartRepo.save(cart)
    }
    return cart
  }

  addToCart(userId, productId, quantity) {
    const product = this.productRepo.findById(productId)
    if (!product) throw new Error('PRODUCT_NOT_FOUND')
    
    const cart = this.getCart(userId)
    const existing = cart.items.find(i => i.productId === productId)
    
    if (existing) {
      if (existing.quantity + quantity > 99) throw new Error('MAX_QUANTITY_EXCEEDED')
      existing.quantity += quantity
    } else {
      if (quantity > 99) throw new Error('MAX_QUANTITY_EXCEEDED')
      cart.items.push({
        id: `item_${Math.random().toString(36).substr(2, 9)}`,
        productId,
        quantity
      })
    }
    
    this.cartRepo.save(cart)
    return cart
  }

  clearCart(userId) {
    const cart = { userId, items: [] }
    this.cartRepo.save(cart)
  }
}
