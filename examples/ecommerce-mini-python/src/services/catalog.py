import uuid
from ..domain.models import Product
from ..repo.memory import MemoryRepo

class CatalogService:
    def __init__(self, repo: MemoryRepo[Product]):
        self.repo = repo

    def list_products(self):
        return self.repo.find_all()

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
