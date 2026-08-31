from fastapi.testclient import TestClient
from main import app
import pytest

client = TestClient(app)

def test_generate_backstory_no_data():
    response = client.post("/generate-backstory", json={})
    # Should fail pydantic validation (422) since name, race, etc. are missing
    assert response.status_code == 422

def test_auth_register_dummy():
    response = client.post("/auth/register", json={"email": "test@test.com", "password": "password123"})
    assert response.status_code == 200
    assert response.json()["api_key"] == "test@test.com#DummyKey"
