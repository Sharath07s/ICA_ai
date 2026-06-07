from sqlalchemy import Column, String, Text, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy import Uuid as UUID
from pgvector.sqlalchemy import Vector
from app.models.base import BaseModel
from datetime import datetime

class DocumentChunk(BaseModel):
    __tablename__ = "document_chunks"

    source_id = Column(String(255), index=True) # E.g., FIR number or Filename
    content = Column(Text, nullable=False)
    metadata_json = Column(JSON, default={})
    
    # 384 dimensions for all-MiniLM-L6-v2 model
    embedding = Column(Vector(384))
    
    created_at = Column(DateTime, default=datetime.utcnow)
