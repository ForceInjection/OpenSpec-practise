from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import List

from ..domain.models import Product, Order, Cart
from ..repo.memory import MemoryRepo
from ..services.catalog import CatalogService
from ..services.cart import CartService
from ..services.order import OrderService

app = FastAPI()

# DI Setup
product_repo = MemoryRepo[Product]()
cart_repo = MemoryRepo[Cart]()
order_repo = MemoryRepo[Order]()

catalog_svc = CatalogService(product_repo)
cart_svc = CartService(cart_repo, catalog_svc)
order_svc = OrderService(order_repo, cart_svc, catalog_svc)

# DTOs
class AddProductRequest(BaseModel):
    name: str
    priceCents: int
    stock: int

class AddToCartRequest(BaseModel):
    productId: str
    quantity: int

class CreateOrderRequest(BaseModel):
    userId: str

@app.get("/api/products", response_model=List[Product])
def list_products():
    return catalog_svc.list_products()

@app.post("/api/products", status_code=201, response_model=Product)
def add_product(req: AddProductRequest):
    return catalog_svc.add_product(req.name, req.priceCents, req.stock)

@app.post("/api/cart/items", response_model=Cart)
def add_to_cart(req: AddToCartRequest):
    # Mock user
    user_id = "user_dev"
    try:
        return cart_svc.add_to_cart(user_id, req.productId, req.quantity)
    except ValueError as e:
        if str(e) == "PRODUCT_NOT_FOUND":
            raise HTTPException(status_code=404, detail="Product not found")
        if str(e) == "MAX_QUANTITY_EXCEEDED":
            raise HTTPException(status_code=400, detail="Max quantity exceeded")
        raise e

@app.post("/api/orders", status_code=201, response_model=Order)
def create_order(req: CreateOrderRequest):
    try:
        return order_svc.create_order(req.userId)
    except ValueError as e:
        if str(e) == "CART_EMPTY":
            raise HTTPException(status_code=400, detail="Cart is empty")
        if str(e) == "OUT_OF_STOCK":
            raise HTTPException(status_code=409, detail="Out of stock")
        raise e
