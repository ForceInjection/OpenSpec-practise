import uuid
from ..domain.models import Order, OrderItem
from ..repo.memory import MemoryRepo
from .cart import CartService
from .catalog import CatalogService

class OrderService:
    def __init__(self, repo: MemoryRepo[Order], cart_svc: CartService, catalog_svc: CatalogService):
        self.repo = repo
        self.cart_svc = cart_svc
        self.catalog = catalog_svc

    def create_order(self, user_id: str) -> Order:
        # 1. Get Cart
        cart = self.cart_svc.get_cart(user_id)
        if not cart.items:
            raise ValueError("CART_EMPTY")

        order_items = []
        total_cents = 0

        # 2. Validate and Calculate
        # Note: Ideally should lock resources. This is a simplified sequential check.
        for item in cart.items:
            product = self.catalog.get_product(item.product_id)
            if not product:
                raise ValueError(f"Product {item.product_id} not found")
            if product.stock < item.quantity:
                raise ValueError("OUT_OF_STOCK")
            
            total_cents += product.price_cents * item.quantity
            order_items.append(OrderItem(
                productId=item.product_id,
                priceCents=product.price_cents,
                quantity=item.quantity
            ))

        # 3. Deduct Stock
        for item in cart.items:
            product = self.catalog.get_product(item.product_id)
            product.stock -= item.quantity
            # Since objects are mutable references in memory repo, save is implicit but good practice
            self.catalog.repo.save(product.id, product)

        # 4. Create Order
        order = Order(
            id=f"order_{uuid.uuid4().hex[:8]}",
            status="PENDING_PAYMENT",
            totalCents=total_cents,
            items=order_items
        )
        self.repo.save(order.id, order)

        # 5. Clear Cart
        self.cart_svc.clear_cart(user_id)

        return order
