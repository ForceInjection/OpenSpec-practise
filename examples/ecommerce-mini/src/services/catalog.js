export class CatalogService {
  constructor(productRepo) {
    this.repo = productRepo
  }

  list(name, sort) {
    let products = this.repo.findAll()

    // Optional name filter (case-insensitive substring match)
    if (name) {
      const keyword = name.toLowerCase()
      products = products.filter(p => p.name.toLowerCase().includes(keyword))
    }

    // Optional sort by price (whitelist: price_asc / price_desc)
    if (sort === 'price_asc') {
      products.sort((a, b) => a.priceCents - b.priceCents)
    } else if (sort === 'price_desc') {
      products.sort((a, b) => b.priceCents - a.priceCents)
    }

    return products
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
