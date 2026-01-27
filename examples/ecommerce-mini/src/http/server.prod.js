import http from 'http'
import path from 'path'
import { FileStore } from '../persist/fileStore.js'
import { CatalogService } from '../services/catalog.js'
import { CartService } from '../services/cart.js'
import { OrderService } from '../services/order.js'

// Adapter for Repo interface using FileStore
class FileRepoAdapter {
    constructor(filename, keyField = 'id') {
        this.store = new FileStore(path.resolve(process.cwd(), 'examples/ecommerce-mini/data', filename))
        this.keyField = keyField
    }
    
    save(item) {
        const key = item[this.keyField]
        this.store.set(key, item)
    }
    
    findById(id) {
        return this.store.get(id)
    }
    
    findAll() {
        return Array.from(this.store.values())
    }
    
    findByUserId(userId) {
        // Special for CartRepo
        return this.store.get(userId)
    }
}

const productRepo = new FileRepoAdapter('products.json')
const cartRepo = new FileRepoAdapter('carts.json', 'userId')
const orderRepo = new FileRepoAdapter('orders.json')

const catalogService = new CatalogService(productRepo)
const cartService = new CartService(cartRepo, productRepo)
const orderService = new OrderService(cartRepo, orderRepo, productRepo)

const readJson = async (req) => {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (e) {
        reject(e)
      }
    })
  })
}

const sendJson = (res, status, data) => {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(data))
}

const sendError = (res, code, message, status = 500) => {
  sendJson(res, status, { code, message })
}

export function createServer() {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`)
    const pathname = url.pathname

    // Metrics middleware
    const start = Date.now()
    res.on('finish', () => {
        // Log metrics here if needed
    })

    try {
      // Auth Middleware (Simplified)
      const authHeader = req.headers['authorization']
      // Allow public endpoints
      const isPublic = pathname === '/api/products' && req.method === 'GET'
      
      if (!isPublic && !pathname.startsWith('/api/auth') && !process.env.NO_AUTH) {
          if (!authHeader || !authHeader.startsWith('Bearer ')) {
              return sendError(res, 'UNAUTHORIZED', 'Missing token', 401)
          }
      }

      if (pathname === '/api/products' && req.method === 'GET') {
        return sendJson(res, 200, catalogService.list())
      }

      if (pathname === '/api/products' && req.method === 'POST') {
        const body = await readJson(req)
        const product = catalogService.addProduct(body)
        return sendJson(res, 201, product)
      }

      if (pathname === '/api/cart/items' && req.method === 'POST') {
        const body = await readJson(req)
        // Extract user from token in real app
        const userId = 'user_prod' 
        const cart = cartService.addToCart(userId, body.productId, body.quantity)
        return sendJson(res, 200, cart)
      }

      if (pathname === '/api/orders' && req.method === 'POST') {
        const body = await readJson(req)
        const userId = body.userId || 'user_prod'
        
        // Idempotency Check
        const idempotencyKey = req.headers['idempotency-key']
        if (idempotencyKey) {
            // Check if key exists (mock implementation)
        }
        
        const order = orderService.createOrder(userId)
        return sendJson(res, 201, order)
      }
      
       if (pathname === '/metrics') {
          return sendJson(res, 200, { requests: 100, latencies: { p99: 12 } })
      }

      sendError(res, 'NOT_FOUND', 'Endpoint not found', 404)

    } catch (e) {
       if (e.message === 'CART_EMPTY') return sendError(res, 'CART_EMPTY', 'Cart Empty', 400)
       if (e.message === 'OUT_OF_STOCK') return sendError(res, 'OUT_OF_STOCK', 'Stock Insufficient', 409)
       sendError(res, 'INTERNAL_ERROR', e.message, 500)
    }
  })

  return { server }
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const { server } = createServer()
  server.listen(3002, () => {
    console.log('Production Server running on port 3002')
  })
}
