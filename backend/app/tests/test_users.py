from fastapi.testclient import TestClient
from app.models.user import User as UserModel

def test_read_user_me(auth_client: TestClient):
    response = auth_client.get("/api/v1/users/me")
    assert response.status_code == 200
    content = response.json()
    assert content["badge_number"] == "TEST1234"
    assert content["email"] == "test@example.com"

def test_read_users_admin_only(admin_client: TestClient):
    response = admin_client.get("/api/v1/users/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_user(admin_client: TestClient):
    data = {
        "badge_number": "NEW999",
        "email": "new@example.com",
        "password": "secretpassword",
        "first_name": "New",
        "last_name": "User"
    }
    response = admin_client.post("/api/v1/users/", json=data)
    assert response.status_code == 200
    content = response.json()
    assert content["badge_number"] == data["badge_number"]
    assert "id" in content

def test_deactivate_user(admin_client: TestClient):
    data = {
        "badge_number": "DEL123",
        "email": "del@example.com",
        "password": "secretpassword"
    }
    create_resp = admin_client.post("/api/v1/users/", json=data)
    user_id = create_resp.json()["id"]

    del_resp = admin_client.delete(f"/api/v1/users/{user_id}")
    assert del_resp.status_code == 200
    assert del_resp.json()["is_active"] == False
