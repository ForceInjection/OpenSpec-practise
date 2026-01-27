import uuid
from typing import List
from ..domain.models import Cart, CartItem
from ..repo.memory import MemoryRepo
from .catalog import CatalogService

class CartService:
    def __init__(self, repo: MemoryRepo[Cart], catalog: CatalogService):
        self.repo = repo
        self.catalog = catalog

    def get_cart(self, user_id: str) -> Cart:
        cart = self.repo.find_by_id(user_id)
        if not cart:
            cart = Cart(userId=user_id, items=[])
            self.repo.save(user_id, cart)
        return cart

    def add_to_cart(self, user_id: str, product_id: str, quantity: int) -> Cart:
        product = self.catalog.get_product(product_id)
        if not product:
            raise ValueError("PRODUCT_NOT_FOUND")

        cart = self.get_cart(user_id)
        
        existing = next((i for i in cart.items if i.product_id == product_id), None)
        if existing:
            if existing.quantity + quantity > 99:
                raise ValueError("MAX_QUANTITY_EXCEEDED")
            existing.quantity += quantity
        else:
            if quantity > 99:
                raise ValueError("MAX_QUANTITY_EXCEEDED")
            item = CartItem(
                id=f"item_{uuid.uuid4().hex[:8]}",
                productId=product_id,
                quantity=quantity
            )
            cart.items.append(item)
            
        self.repo.save(user_id, cart)
        return cart
        
    def clear_cart(self, user_id: str):
        cart = Cart(userId=user_id, items=[])
        self.repo.save(user_id, cart)
