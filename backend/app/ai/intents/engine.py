from typing import Dict, Any
import logging
from langchain_core.prompts import PromptTemplate
from app.ai.provider import FallbackManager
from app.schemas.intent import IntentResponse

logger = logging.getLogger(__name__)

INTENT_EXTRACTION_PROMPT = """
You are a highly intelligent police AI assistant. Your job is to extract the intent and entities from the user's query.
The query may be in English or Kannada. Extract the information accurately.

Analyze the query:
"{query}"

Determine the intent from this list:
- 'crime_search': Looking for crime incidents, cases, FIRs.
- 'suspect_search': Looking for people, criminals, repeat offenders.
- 'vehicle_search': Looking for vehicles (stolen, involved in crimes).
- 'station_search': Looking for police stations.
- 'trends': Looking for statistical trends, increase/decrease in crimes.
- 'hotspots': Looking for geographic areas with high crime rates.
- 'suspect_network': Looking for associations, friends, or network of a specific suspect.
- 'vehicle_network': Looking for crimes or suspects linked to a specific vehicle.
- 'crime_network': Looking for the network or connections around a specific crime/FIR.
- 'repeat_offenders': Looking for repeat offenders, top criminals, or most active suspects.
- 'criminal_cluster': Looking for high-risk networks or criminal clusters.
- 'general': General chat, non-specific questions, or casual conversation.

Also extract:
- 'crime_type': The specific crime (e.g., 'theft', 'fraud', 'murder', 'cybercrime'). Translate to English if in Kannada.
- 'district': The district or city mentioned (e.g., 'Mysuru', 'Bengaluru').
- 'time_frame': Any time reference.
"""

class IntentEngine:
    @staticmethod
    def extract_intent(query: str) -> Dict[str, Any]:
        """
        Extract structured intent from a natural language query using FallbackManager.
        """
        prompt_template = PromptTemplate(
            template=INTENT_EXTRACTION_PROMPT,
            input_variables=["query"]
        )
        
        prompt_text = prompt_template.format(query=query)
        
        try:
            # Use FallbackManager to execute with structured output
            response = FallbackManager.execute_with_fallback(
                prompt=prompt_text,
                structured_schema=IntentResponse,
                temperature=0.0
            )
            result = response["result"]
            provider = response["provider"]
            
            # result is an IntentResponse object since we used structured_schema
            return {
                "intent_data": result.model_dump(),
                "provider": provider,
                "status": "success"
            }
            
        except Exception as e:
            logger.error(f"Intent extraction failed: {e}")
            return {
                "intent_data": {
                    "intent": "general",
                    "crime_type": None,
                    "district": None,
                    "time_frame": None
                },
                "provider": "none",
                "status": "error",
                "error": str(e)
            }
