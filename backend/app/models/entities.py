from sqlalchemy import Column, String, Integer, Numeric, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy import Uuid as UUID
from app.models.base import BaseModel

class Suspect(BaseModel):
    __tablename__ = "suspects"
    full_name = Column(String(255), index=True)
    alias_name = Column(String(255))
    gender = Column(String(20))
    age = Column(Integer)
    dob = Column(Date)
    identification_number = Column(String(100), unique=True)
    risk_score = Column(Numeric)
    profile_photo_url = Column(Text)
    
    crimes = relationship("SuspectCrime", back_populates="suspect")

class SuspectCrime(BaseModel):
    __tablename__ = "suspect_crimes"
    suspect_id = Column(UUID(as_uuid=True), ForeignKey("suspects.id"))
    crime_id = Column(UUID(as_uuid=True), ForeignKey("crimes.id"))
    role = Column(String(100))
    
    suspect = relationship("Suspect", back_populates="crimes")
    crime = relationship("Crime", back_populates="suspects")

class Victim(BaseModel):
    __tablename__ = "victims"
    full_name = Column(String(255))
    gender = Column(String(20))
    age = Column(Integer)
    contact_number = Column(String(20))
    address = Column(Text)
    
    crimes = relationship("VictimCrime", back_populates="victim")

class VictimCrime(BaseModel):
    __tablename__ = "victim_crimes"
    victim_id = Column(UUID(as_uuid=True), ForeignKey("victims.id"))
    crime_id = Column(UUID(as_uuid=True), ForeignKey("crimes.id"))
    
    victim = relationship("Victim", back_populates="crimes")
    crime = relationship("Crime", back_populates="victims")

class Vehicle(BaseModel):
    __tablename__ = "vehicles"
    registration_number = Column(String(50), unique=True, index=True)
    vehicle_type = Column(String(100))
    manufacturer = Column(String(100))
    model = Column(String(100))
    owner_name = Column(String(255))
    
    crimes = relationship("CrimeVehicle", back_populates="vehicle")

class CrimeVehicle(BaseModel):
    __tablename__ = "crime_vehicles"
    crime_id = Column(UUID(as_uuid=True), ForeignKey("crimes.id"))
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id"))
    
    crime = relationship("Crime", back_populates="vehicles")
    vehicle = relationship("Vehicle", back_populates="crimes")

class Evidence(BaseModel):
    __tablename__ = "evidence"
    crime_id = Column(UUID(as_uuid=True), ForeignKey("crimes.id"))
    evidence_type = Column(String(100))
    file_name = Column(Text)
    file_url = Column(Text)
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    
    crime = relationship("Crime", back_populates="evidence")
    uploader = relationship("User")
