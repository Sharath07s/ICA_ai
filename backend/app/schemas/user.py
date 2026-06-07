from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    badge_number: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = True
    role_id: Optional[UUID] = None
    station_id: Optional[UUID] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    badge_number: Optional[str] = None
    password: Optional[str] = None

class User(UserBase):
    id: UUID

    class Config:
        from_attributes = True
