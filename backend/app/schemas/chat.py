from pydantic import BaseModel, UUID4
from typing import Optional, List

class ChatQuery(BaseModel):
    query: str
    session_id: Optional[UUID4] = None

class ChatResponse(BaseModel):
    session_id: UUID4
    response: str
    confidence_score: float
    reasoning_summary: Optional[str] = None
    data_sources: List[str] = []
