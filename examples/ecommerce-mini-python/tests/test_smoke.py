import pytest
from fastapi.testclient import TestClient
from src.api.server import app

client = TestClient(app)

def test_smoke_flow():
    # 1. Add Product
    res = client.post("/api/products", json={
        "name": "Smoke Item",
        "priceCents": 500,
        "stock": 10
    })
    assert res.status_code == 201
    product = res.json()
    pid = product["id"]

    # 2. Add to Cart
    res = client.post("/api/cart/items", json={
        "userId": "user_dev",
        "productId": pid,
        "quantity": 2
    })
    assert res.status_code == 200
    cart = res.json()
    assert len(cart["items"]) == 1

    # 3. Create Order
    res = client.post("/api/orders", json={
        "userId": "user_dev"
    })
    assert res.status_code == 201
    order = res.json()
    assert order["totalCents"] == 1000
    assert order["status"] == "PENDING_PAYMENT"

    # 4. Verify Stock Deducted
    # Note: In real integration test we might check GET /products or GET /products/:id
    # Here we just rely on previous steps success


def test_out_of_stock():
    user_id = "user_2"
    # Add product with stock of 5
    res = client.post("/api/products", json={
        "name": "Limited Item",
        "priceCents": 200,
        "stock": 5
    })
    assert res.status_code == 201
    product = res.json()
    pid = product["id"]

    # Try to add 6 units (exceeds stock of 5)
    client.post("/api/cart/items", json={
        "userId": user_id,
        "productId": pid,
        "quantity": 6
    })

    # Verify 409 is returned
    resp = client.post("/api/orders", json={"userId": user_id})
    assert resp.status_code == 409
    assert "out of stock" in resp.json()["detail"].lower()


def test_get_product_by_id():
    # Add product
    res = client.post("/api/products", json={
        "name": "Test Product",
        "priceCents": 300,
        "stock": 5
    })
    assert res.status_code == 201
    pid = res.json()["id"]

    # Query existing product
    res = client.get(f"/api/products/{pid}")
    assert res.status_code == 200
    assert res.json()["name"] == "Test Product"
    assert res.json()["priceCents"] == 300

    # Query non-existent product
    res = client.get("/api/products/non-existent")
    assert res.status_code == 404
    assert "Product not found" in res.json()["detail"]
