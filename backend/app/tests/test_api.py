from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/api/v1/openapi.json")
    # FastAPI autogenerates OpenAPI. If it returns 200, swagger docs exist and routing works.
    assert response.status_code == 200
    assert "openapi" in response.json()
    assert "paths" in response.json()
