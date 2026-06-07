import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.base import Base
from app.models.user import User
from app.repositories.base import BaseRepository

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class UserRepository(BaseRepository[User]):
    pass

@pytest.fixture()
def db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

def test_repo_create(db):
    repo = UserRepository(User)
    user_data = {"badge_number": "R123", "email": "repo@ksp.gov.in"}
    user = repo.create(db, obj_in=user_data)
    
    assert user.id is not None
    assert user.badge_number == "R123"

def test_repo_soft_delete(db):
    repo = UserRepository(User)
    user = repo.create(db, obj_in={"badge_number": "D123", "email": "del2@ksp.gov.in"})
    
    repo.delete(db, id=user.id)
    
    # get should not return soft-deleted
    fetched = repo.get(db, id=user.id)
    assert fetched is None
    
    # but it is in db
    raw = db.query(User).get(user.id)
    assert raw is not None
    assert raw.is_deleted is True
