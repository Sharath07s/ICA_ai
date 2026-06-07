import pytest
from app.core.security import create_access_token, create_refresh_token, verify_password, get_password_hash
from jose import jwt
from app.core.config import settings

def test_password_hashing():
    password = "secure_password_123"
    hashed = get_password_hash(password)
    assert verify_password(password, hashed)
    assert not verify_password("wrong_password", hashed)

def test_create_access_token():
    subject = "user_uuid_123"
    token = create_access_token(subject)
    
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    assert payload.get("sub") == subject
    assert payload.get("type") == "access"

def test_create_refresh_token():
    subject = "user_uuid_123"
    token = create_refresh_token(subject)
    
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    assert payload.get("sub") == subject
    assert payload.get("type") == "refresh"
