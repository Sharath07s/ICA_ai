from sqlalchemy import Column, String, Text, DateTime, Boolean
from sqlalchemy import Uuid as UUID
from datetime import datetime
from app.models.base import BaseModel

class Alert(BaseModel):
    __tablename__ = "alerts"
    type = Column(String(255), index=True)
    severity = Column(String(50), index=True) # CRITICAL, HIGH, MEDIUM, LOW
    title = Column(String(500))
    description = Column(Text)
    district = Column(String(255), index=True)
    source = Column(String(100)) # POSTGRESQL, NEO4J, AI
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, index=True)
    resolved = Column(Boolean, default=False, index=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
