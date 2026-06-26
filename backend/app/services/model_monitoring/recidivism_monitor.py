from sqlalchemy.orm import Session
from app.services.predictive_validation.recidivism_validator import RecidivismValidator

class RecidivismMonitor:
    def __init__(self, db: Session):
        self.db = db

    def monitor(self) -> dict:
        val = RecidivismValidator(self.db).validate()
        
        if val.get("status") == "insufficient_data":
            return {"status": "insufficient_data"}
            
        return {
            "status": "success",
            "accuracy": val.get("accuracy", 0),
            "precision": val.get("precision", 0),
            "recall": val.get("recall", 0),
            "f1_score": val.get("f1_score", 0),
            "trend": "Stable"
        }
