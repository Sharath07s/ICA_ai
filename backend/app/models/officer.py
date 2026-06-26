from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy import Uuid as UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.base import BaseModel

class OfficerAssignment(BaseModel):
    __tablename__ = "officer_assignments"
    officer_id = Column(UUID, ForeignKey("users.id"), index=True, nullable=False)
    case_id = Column(UUID, ForeignKey("crimes.id"), index=True, nullable=True)
    alert_id = Column(UUID, ForeignKey("alerts.id"), index=True, nullable=True)
    assigned_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    officer = relationship("User", foreign_keys=[officer_id])
    crime = relationship("Crime", foreign_keys=[case_id])
    alert = relationship("Alert", foreign_keys=[alert_id])


class OfficerAction(BaseModel):
    __tablename__ = "officer_actions"
    officer_id = Column(UUID, ForeignKey("users.id"), index=True, nullable=False)
    case_id = Column(UUID, ForeignKey("crimes.id"), index=True, nullable=True)
    action_type = Column(String(100), index=True) # INTERVIEW, PATROL, EVIDENCE_LOG
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    officer = relationship("User", foreign_keys=[officer_id])
    crime = relationship("Crime", foreign_keys=[case_id])
