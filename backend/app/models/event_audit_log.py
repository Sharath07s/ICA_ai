from sqlalchemy import Column, String, DateTime, Float
import uuid
from datetime import datetime

from app.models.base import Base

class EventAuditLog(Base):
    __tablename__ = "event_audit_log"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id = Column(String(36), index=True)
    event_type = Column(String(50), index=True)
    source = Column(String(100))
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    status = Column(String(20), default="processed")
    processing_time_ms = Column(Float, default=0.0)
