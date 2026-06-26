from sqlalchemy.orm import Session
from app.models.alert import Alert
from typing import Dict, Any

class PrioritizationEngine:
    def get_priorities(self, db: Session) -> Dict[str, Any]:
        open_alerts = db.query(Alert).filter(Alert.status == "OPEN").all()
        
        if not open_alerts:
            return {
                "status": "insufficient_data",
                "required_records": 1,
                "available_records": 0,
                "message": "No open alerts to prioritize."
            }
            
        priorities = []
        for alert in open_alerts:
            base_score = 50
            if alert.severity == "CRITICAL":
                base_score += 40
            elif alert.severity == "HIGH":
                base_score += 25
                
            priorities.append({
                "entity_id": alert.id,
                "entity_type": "ALERT",
                "priority_score": base_score,
                "explanation": f"Base priority derived from severity: {alert.severity}",
                "confidence": 90,
                "evidence": [f"Alert Severity: {alert.severity}", f"Status: {alert.status}"],
                "source_systems": ["PostgreSQL", "Alert Engine"]
            })
            
        # Sort by priority score desc
        priorities.sort(key=lambda x: x["priority_score"], reverse=True)
            
        return {
            "status": "success",
            "priorities": priorities
        }

prioritization_engine = PrioritizationEngine()
