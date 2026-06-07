from sqlalchemy import Column, String, Integer, Numeric, Date, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy import Uuid as UUID
from app.models.base import BaseModel

class Report(BaseModel):
    __tablename__ = "reports"
    title = Column(String(255))
    report_type = Column(String(100))
    generated_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    file_url = Column(Text)
    generated_at = Column(DateTime(timezone=True))
    
    generator = relationship("User")

class AIConversation(BaseModel):
    __tablename__ = "ai_conversations"
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    session_name = Column(String(255))
    started_at = Column(DateTime(timezone=True))
    ended_at = Column(DateTime(timezone=True))
    
    user = relationship("User")
    messages = relationship("AIMessage", back_populates="conversation")

class AIMessage(BaseModel):
    __tablename__ = "ai_messages"
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("ai_conversations.id"))
    sender = Column(String(50))
    message = Column(Text)
    
    conversation = relationship("AIConversation", back_populates="messages")

class AIQueryLog(BaseModel):
    __tablename__ = "ai_query_logs"
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
    query = Column(Text)
    generated_sql = Column(Text)
    execution_time_ms = Column(Integer)
    confidence_score = Column(Numeric)
    
    user = relationship("User")

class CrimePrediction(BaseModel):
    __tablename__ = "crime_predictions"
    district_id = Column(UUID(as_uuid=True), ForeignKey("districts.id"))
    crime_type_id = Column(UUID(as_uuid=True), ForeignKey("crime_types.id"))
    prediction_date = Column(Date)
    predicted_count = Column(Integer)
    confidence_score = Column(Numeric)
    model_version = Column(String(100))
    
    district = relationship("District")
    crime_type = relationship("CrimeType")

class HotspotAnalysis(BaseModel):
    __tablename__ = "hotspot_analysis"
    district_id = Column(UUID(as_uuid=True), ForeignKey("districts.id"))
    crime_type_id = Column(UUID(as_uuid=True), ForeignKey("crime_types.id"))
    hotspot_level = Column(String(50))
    center_latitude = Column(Numeric)
    center_longitude = Column(Numeric)
    confidence_score = Column(Numeric)
    
    district = relationship("District")
    crime_type = relationship("CrimeType")

class AuditLog(BaseModel):
    __tablename__ = "audit_logs"
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
    action = Column(String(255))
    module = Column(String(255))
    resource_id = Column(UUID(as_uuid=True))
    metadata_json = Column(JSON)
    ip_address = Column(String(100))
    
    user = relationship("User")

class Notification(BaseModel):
    __tablename__ = "notifications"
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    title = Column(String(255))
    message = Column(Text)
    type = Column(String(100))
    is_read = Column(Boolean, default=False)
    
    user = relationship("User")
