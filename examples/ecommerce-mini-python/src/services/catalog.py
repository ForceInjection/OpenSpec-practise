import uuid
from typing import Optional
from ..domain.models import Product
from ..repo.memory import MemoryRepo

class CatalogService:
    def __init__(self, repo: MemoryRepo[Product]):
        self.repo = repo

    def list_products(self, name: Optional[str] = None, sort: Optional[str] = None):
        products = self.repo.find_all()

        # Optional name filter (case-insensitive substring match)
        if name:
            keyword = name.lower()
            products = [p for p in products if keyword in p.name.lower()]

        # Optional sort by price (whitelist: price_asc / price_desc)
        if sort == "price_asc":
            products.sort(key=lambda p: p.price_cents)
        elif sort == "price_desc":
            products.sort(key=lambda p: p.price_cents, reverse=True)

        return products

    def get_product(self, id: str):
        return self.repo.find_by_id(id)

    def add_product(self, name: str, price_cents: int, stock: int) -> Product:
        pid = f"prod_{uuid.uuid4().hex[:8]}"
        product = Product(
            id=pid,
            name=name,
            priceCents=price_cents,
            stock=stock
        )
        self.repo.save(pid, product)
        return product
