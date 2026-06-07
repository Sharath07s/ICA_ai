from typing import Optional
from pydantic import BaseModel, Field

class IntentResponse(BaseModel):
    """Structured intent extracted from the user query."""
    intent: str = Field(..., description="The main intent of the query. Valid values: 'crime_search', 'suspect_search', 'vehicle_search', 'station_search', 'trends', 'hotspots', 'general'")
    crime_type: Optional[str] = Field(None, description="The type of crime mentioned (e.g., 'theft', 'fraud', 'assault'). None if not specified.")
    district: Optional[str] = Field(None, description="The district or location mentioned (e.g., 'Mysuru', 'Bengaluru'). None if not specified.")
    time_frame: Optional[str] = Field(None, description="Any time frame mentioned (e.g., 'last month', '2025').")
    
class IntentRequest(BaseModel):
    query: str
