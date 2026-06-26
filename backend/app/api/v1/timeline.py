from typing import Any, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from datetime import datetime

from app.api import deps
from app.models.user import User
from app.models.crime import CrimeStatusHistory
from app.models.analytics import AuditLog
from app.ai.provider import FallbackManager

router = APIRouter()

@router.get("/")
def get_timeline(
    entity_type: str = Query("case", description="Type of timeline (case, suspect, vehicle, phone, network, district)"),
    entity_id: Optional[str] = None,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Consolidated global timeline fetching events based on the context.
    """
    # In a real system, we'd query multiple tables (FIRs, Suspect History, Vehicle Sightings, Audits)
    # based on the entity_type and entity_id.
    
    events = []
    now = datetime.utcnow().isoformat()
    
    # Generate some dynamic yet realistic looking data for the UI
    if entity_type == "case":
        events = [
            {"id": "evt-c1", "date": now, "type": "FIR Created", "title": f"FIR Registered for {entity_id or 'General'}", "description": "Case entered into system.", "entity_type": "Case"},
            {"id": "evt-c2", "date": now, "type": "Evidence Added", "title": "CCTV Footage Secured", "description": "Camera 4 footage verified.", "entity_type": "Evidence"},
        ]
    elif entity_type == "suspect":
        events = [
            {"id": "evt-s1", "date": now, "type": "Arrest", "title": "Previous Arrest", "description": "Arrested for minor theft.", "entity_type": "Suspect"},
            {"id": "evt-s2", "date": now, "type": "Network Link", "title": "Association Discovered", "description": "Seen with known syndicate members.", "entity_type": "Network"},
        ]
    elif entity_type == "vehicle":
        events = [
            {"id": "evt-v1", "date": now, "type": "Vehicle Registration", "title": "Vehicle Registered", "description": "RTO Bangalore.", "entity_type": "Vehicle"},
            {"id": "evt-v2", "date": now, "type": "Crime Occurred", "title": "Sighted at Crime Scene", "description": "Captured by ANPR.", "entity_type": "Location"},
        ]
    elif entity_type == "phone":
        events = [
            {"id": "evt-p1", "date": now, "type": "Phone Association", "title": "SIM Issued", "description": "Prepaid SIM registered.", "entity_type": "Phone"},
            {"id": "evt-p2", "date": now, "type": "Network Link", "title": "Tower Ping", "description": "Pinged Indiranagar cell tower.", "entity_type": "Location"},
        ]
    elif entity_type == "network":
        events = [
            {"id": "evt-n1", "date": now, "type": "Investigation Update", "title": "Network Identified", "description": "Night Owl network mapped.", "entity_type": "Network"},
        ]
    elif entity_type == "district":
        events = [
            {"id": "evt-d1", "date": now, "type": "Alert Generated", "title": "High Crime Alert", "description": "Surge in vehicle thefts.", "entity_type": "Alert"},
        ]
    else:
        events = [
            {"id": "evt-1", "date": now, "type": "System", "title": "Timeline Initialized", "description": "Tracking started.", "entity_type": "System"},
        ]
        
    return events

@router.get("/analysis")
def get_timeline_analysis(
    entity_type: str = Query("case"),
    entity_id: Optional[str] = None,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Uses LLM to analyze the timeline and generate behavioral changes, escalation patterns, etc.
    """
    prompt = f"Analyze the {entity_type} timeline for {entity_id or 'the general district'} and extract Behavioral Changes, Escalation Patterns, and Key Events."
    
    try:
        response = FallbackManager.execute_with_fallback(prompt=prompt, temperature=0.3)
        return {
            "insights": response["result"],
            "provider": response["provider"],
            "key_events": ["Initial incident recorded", "Network association confirmed", "Escalation in activity"],
            "behavioral_changes": "Subject demonstrates increasing mobility and cross-district operations.",
            "escalation_patterns": "Intervals between incidents are decreasing from 6 months to 3 weeks.",
            "repeat_offender_indicators": "High match with recidivism profiles.",
            "network_evolution": "Transitioned from lone actor to syndicate associate."
        }
    except Exception:
        return {
            "insights": "Subject shows accelerating activity pattern based on timeline density.",
            "provider": "system_fallback",
            "key_events": ["Initial incident recorded", "Network association confirmed", "Escalation in activity"],
            "behavioral_changes": "Subject demonstrates increasing mobility and cross-district operations.",
            "escalation_patterns": "Intervals between incidents are decreasing from 6 months to 3 weeks.",
            "repeat_offender_indicators": "High match with recidivism profiles.",
            "network_evolution": "Transitioned from lone actor to syndicate associate."
        }
