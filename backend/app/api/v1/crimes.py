from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.schemas.crime import Crime, CrimeCreate, CrimeUpdate
from app.models.crime import Crime as CrimeModel
from app.repositories.base import BaseRepository

router = APIRouter()

# Instantiate generic repository
crime_repo = BaseRepository(CrimeModel)

@router.get("/", response_model=List[Crime])
def read_crimes(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve crimes.
    """
    crimes = crime_repo.get_multi(db, skip=skip, limit=limit)
    return crimes

@router.post("/", response_model=Crime)
def create_crime(
    *,
    db: Session = Depends(deps.get_db),
    crime_in: CrimeCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new crime record.
    """
    crime = crime_repo.create(db, obj_in=crime_in.dict())
    return crime

from uuid import UUID

@router.get("/{id}", response_model=Crime)
def read_crime(
    *,
    db: Session = Depends(deps.get_db),
    id: UUID,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get crime by ID.
    """
    crime = crime_repo.get(db, id=id)
    if not crime:
        raise HTTPException(status_code=404, detail="Crime not found")
    return crime
