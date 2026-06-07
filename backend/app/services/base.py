from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository

RepoType = TypeVar("RepoType", bound=BaseRepository)
ModelType = TypeVar("ModelType")

class BaseService(Generic[RepoType, ModelType]):
    def __init__(self, repository: RepoType):
        self.repository = repository

    def get(self, db: Session, id: Any) -> Optional[ModelType]:
        return self.repository.get(db, id)

    def get_multi(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[ModelType]:
        return self.repository.get_multi(db, skip=skip, limit=limit)

    def create(self, db: Session, *, obj_in: Dict[str, Any]) -> ModelType:
        return self.repository.create(db, obj_in=obj_in)

    def update(self, db: Session, *, db_obj: ModelType, obj_in: Union[Dict[str, Any], Any]) -> ModelType:
        return self.repository.update(db, db_obj=db_obj, obj_in=obj_in)

    def delete(self, db: Session, *, id: Any) -> ModelType:
        return self.repository.delete(db, id=id)
