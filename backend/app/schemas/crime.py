from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, UUID4, Field

class CrimeBase(BaseModel):
    fir_number: str
    title: str
    description: str
    status: str
    occurrence_date: datetime
    reported_date: Optional[datetime] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class CrimeCreate(CrimeBase):
    crime_type_id: UUID4
    station_id: UUID4
    district_id: UUID4

class CrimeUpdate(CrimeBase):
    fir_number: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    occurrence_date: Optional[datetime] = None

class CrimeInDBBase(CrimeBase):
    id: UUID4
    crime_type_id: UUID4
    station_id: UUID4
    district_id: UUID4
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Crime(CrimeInDBBase):
    pass
