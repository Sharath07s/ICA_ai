from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy import Uuid as UUID
from app.models.base import BaseModel

class Investigation(BaseModel):
    __tablename__ = "investigations"
    crime_id = Column(UUID(as_uuid=True), ForeignKey("crimes.id"))
    assigned_officer = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    priority = Column(String(50))
    summary = Column(Text)
    status = Column(String(100))
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    
    crime = relationship("Crime", back_populates="investigations")
    officer = relationship("User")
    notes = relationship("InvestigationNote", back_populates="investigation")

class InvestigationNote(BaseModel):
    __tablename__ = "investigation_notes"
    investigation_id = Column(UUID(as_uuid=True), ForeignKey("investigations.id"))
    note = Column(Text)
    
    investigation = relationship("Investigation", back_populates="notes")
