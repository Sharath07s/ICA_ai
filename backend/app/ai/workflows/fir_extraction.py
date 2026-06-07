from typing import Dict, TypedDict, List
from langchain_core.prompts import PromptTemplate
from langgraph.graph import StateGraph, END
from pydantic import BaseModel, Field

# Define State for the Graph
class ExtractionState(TypedDict):
    raw_text: str
    summary: str
    entities: dict
    modus_operandi: str
    status: str

# Define Output Schemas for Structured Parsing
class ExtractedEntities(BaseModel):
    suspects: List[str] = Field(description="Names or descriptions of suspects")
    victims: List[str] = Field(description="Names or descriptions of victims")
    vehicles: List[str] = Field(description="Vehicle license plates or models")
    locations: List[str] = Field(description="Specific addresses or landmarks")

def summarize_fir(state: ExtractionState) -> ExtractionState:
    """Summarizes the raw FIR text."""
    # In production, call the configured AIProvider LLM.
    # We mock the LLM call for architecture demonstration.
    raw_text = state["raw_text"]
    state["summary"] = f"Summary generated for: {raw_text[:30]}..."
    state["status"] = "summarized"
    return state

def extract_entities(state: ExtractionState) -> ExtractionState:
    """Extracts Suspects, Victims, Vehicles, and Locations using structured output."""
    # In production, use provider.llm.with_structured_output(ExtractedEntities)
    state["entities"] = {
        "suspects": ["Unknown Male"],
        "victims": ["Local Business Owner"],
        "vehicles": ["KA-01-AB-1234"],
        "locations": ["MG Road"]
    }
    state["status"] = "entities_extracted"
    return state

def match_modus_operandi(state: ExtractionState) -> ExtractionState:
    """Matches the extracted text against known MOs in the vector database."""
    # In production, this embeds the text and queries PGVector.
    state["modus_operandi"] = "Night-time lock-breaking (Confidence: 89%)"
    state["status"] = "completed"
    return state

def build_fir_workflow() -> StateGraph:
    """Builds the LangGraph workflow for processing FIRs."""
    workflow = StateGraph(ExtractionState)
    
    workflow.add_node("summarize", summarize_fir)
    workflow.add_node("extract", extract_entities)
    workflow.add_node("match_mo", match_modus_operandi)
    
    workflow.set_entry_point("summarize")
    workflow.add_edge("summarize", "extract")
    workflow.add_edge("extract", "match_mo")
    workflow.add_edge("match_mo", END)
    
    return workflow.compile()
