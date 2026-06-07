import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.base import Base
from app.models.user import User, Role, Permission
from app.models.crime import Crime, CrimeType

# Setup in-memory sqlite for testing models
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture()
def db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

def test_create_user(db):
    user = User(badge_number="12345", email="test@ksp.gov.in", first_name="Test", last_name="User")
    db.add(user)
    db.commit()
    
    assert user.id is not None
    assert user.badge_number == "12345"
    assert user.is_deleted is False
    assert user.created_at is not None

def test_soft_delete(db):
    user = User(badge_number="999", email="del@ksp.gov.in")
    db.add(user)
    db.commit()
    
    # Soft delete manually
    user.is_deleted = True
    db.commit()
    
    fetched = db.query(User).filter_by(badge_number="999").first()
    assert fetched.is_deleted is True
