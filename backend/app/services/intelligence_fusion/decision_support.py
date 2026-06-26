from sqlalchemy.orm import Session
from typing import Dict, Any
from .fusion_engine import fusion_engine

class DecisionSupportEngine:
    def get_recommendations(self, db: Session) -> Dict[str, Any]:
        fusion_out = fusion_engine.get_unified_signals(db)
        if fusion_out.get("status") == "insufficient_data":
            return fusion_out
            
        recommendations = []
        signals = fusion_out.get("signals", [])
        
        for sig in signals:
            if sig["risk_level"] == "HIGH":
                recommendations.append({
                    "action": "Escalate District Patrol Resources",
                    "justification": sig["signal"],
                    "confidence": sig["confidence"],
                    "evidence": sig["evidence"],
                    "source_systems": sig["source_systems"]
                })
            elif sig["risk_level"] == "MEDIUM":
                recommendations.append({
                    "action": "Launch Targeted Investigation",
                    "justification": sig["signal"],
                    "confidence": sig["confidence"],
                    "evidence": sig["evidence"],
                    "source_systems": sig["source_systems"]
                })
                
        return {
            "status": "success",
            "recommendations": recommendations
        }

decision_support_engine = DecisionSupportEngine()
