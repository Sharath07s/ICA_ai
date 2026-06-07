from pydantic import BaseModel, UUID4
from typing import Optional, List, Dict, Any

class ChatQuery(BaseModel):
    query: str
    session_id: Optional[UUID4] = None

class ChatResponse(BaseModel):
    message: str
    provider: str
    timestamp: str
    status: str
    intent: Optional[str] = None
    structured_data: Optional[List[Dict[str, Any]]] = None
    record_count: Optional[int] = None
