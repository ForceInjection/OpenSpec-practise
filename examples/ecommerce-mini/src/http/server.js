import http from 'http'
import { ProductRepo, CartRepo, OrderRepo } from '../repo/memoryRepo.js'
import { CatalogService } from '../services/catalog.js'
import { CartService } from '../services/cart.js'
import { OrderService } from '../services/order.js'

const productRepo = new ProductRepo()
const cartRepo = new CartRepo()
const orderRepo = new OrderRepo()

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

    try {
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
        // Mock user ID for dev
        const userId = 'user_dev'
        const cart = cartService.addToCart(userId, body.productId, body.quantity)
        return sendJson(res, 200, cart)
      }

      if (pathname === '/api/orders' && req.method === 'POST') {
        const body = await readJson(req)
        // Mock user ID for dev if not provided
        const userId = body.userId || 'user_dev'
        const order = orderService.createOrder(userId)
        return sendJson(res, 201, order)
      }
      
      if (pathname.startsWith('/api/orders/') && req.method === 'GET') {
          const id = pathname.split('/').pop()
          const order = orderRepo.findById(id)
          if (!order) return sendError(res, 'NOT_FOUND', 'Order not found', 404)
          return sendJson(res, 200, order)
      }

      sendError(res, 'NOT_FOUND', 'Endpoint not found', 404)

    } catch (e) {
      if (e.message === 'CART_EMPTY')
        return sendError(res, 'CART_EMPTY', '购物车为空', 400)
      if (e.message === 'OUT_OF_STOCK')
        return sendError(res, 'OUT_OF_STOCK', '库存不足', 409)
      if (e.message === 'PRODUCT_NOT_FOUND')
        return sendError(res, 'PRODUCT_NOT_FOUND', '商品不存在', 404)
        
      console.error(e)
      sendError(res, 'INTERNAL_ERROR', e.message, 500)
    }
  })

  return { server, services: { catalogService, cartService, orderService } }
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const { server } = createServer()
  server.listen(3000, () => {
    console.log('Server running on port 3000')
  })
}
