from typing import Optional
from datetime import date
from uuid import UUID
from pydantic import BaseModel
from decimal import Decimal

class SuspectBase(BaseModel):
    full_name: str
    alias_name: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[int] = None
    dob: Optional[date] = None
    identification_number: Optional[str] = None
    risk_score: Optional[Decimal] = None
    profile_photo_url: Optional[str] = None

class SuspectCreate(SuspectBase):
    pass

class SuspectUpdate(SuspectBase):
    full_name: Optional[str] = None

class Suspect(SuspectBase):
    id: UUID

    class Config:
        from_attributes = True
