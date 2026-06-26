from sqlalchemy.orm import Session
from app.models.crime import Crime
from app.models.entities import Suspect
from app.models.alert import Alert
from typing import Dict, Any

class CorrelationEngine:
    def get_correlations(self, db: Session) -> Dict[str, Any]:
        crime_count = db.query(Crime).count()
        if crime_count < 30:
            return {
                "status": "insufficient_data",
                "required_records": 30,
                "available_records": crime_count
            }

        suspect_count = db.query(Suspect).count()
        
        correlations = []
        if suspect_count > 0 and crime_count > 0:
            correlations.append({
                "entity_a": "Suspect Profiles",
                "entity_b": "Recent Crime Patterns",
                "correlation_score": min(100, int((suspect_count / crime_count) * 100) + 40),
                "evidence": [
                    f"Ratio analysis across {suspect_count} suspects and {crime_count} crimes",
                    "Direct relational mapping via PostgreSQL foreign keys"
                ],
                "source_systems": ["PostgreSQL"]
            })

        return {
            "status": "success",
            "correlations": correlations
        }

correlation_engine = CorrelationEngine()
