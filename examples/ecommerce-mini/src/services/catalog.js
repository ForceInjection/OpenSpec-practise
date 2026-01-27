export class CatalogService {
  constructor(productRepo) {
    this.repo = productRepo
  }

  list() {
    return this.repo.findAll()
  }

  getProduct(id) {
    return this.repo.findById(id)
  }

  addProduct(product) {
    if (!product.id) product.id = `prod_${Math.random().toString(36).substr(2, 9)}`
    this.repo.save(product)
    return product
  }

  // Atomic deduction simulation
  deductStock(id, quantity) {
    const product = this.repo.findById(id)
    if (!product) throw new Error('PRODUCT_NOT_FOUND')
    if (product.stock < quantity) throw new Error('OUT_OF_STOCK')
    
    product.stock -= quantity
    this.repo.save(product)
  }
}
