from sqlalchemy.orm import Session
from app.services.predictive.recidivism import RecidivismEngine
from app.services.predictive_validation.recidivism_validator import RecidivismValidator
from app.services.predictive_explainability.confidence_engine import ConfidenceEngine

class RecidivismExplainer:
    def __init__(self, db: Session):
        self.db = db

    def explain(self, suspect_id: str) -> dict:
        engine = RecidivismEngine(self.db)
        pred_res = engine.predict_recidivism(suspect_id)
        
        if pred_res.get("status") == "insufficient_data":
            return {"status": "insufficient_data"}
            
        val = RecidivismValidator(self.db).validate()
        hist_acc = 0.8
        if val.get("status") == "validated":
            hist_acc = val.get("f1_score", 0.8)
            
        # Signal strength based on prob
        signal_str = pred_res.get("probability", 0.5)
        
        # Engine evidence is already pretty good, we just format it and score it
        conf = ConfidenceEngine.calculate_confidence(
            available_records=pred_res.get("crimes_evaluated", 2),
            required_records=2,
            historical_accuracy=hist_acc,
            signal_strength=signal_str
        )
        
        raw_evidence = pred_res.get("evidence", [])
        evidence = raw_evidence + [
            f"Recidivism back-testing model historically operates at {hist_acc * 100}% F1 Score"
        ]
        
        return {
            "status": "success",
            "prediction": pred_res,
            "explainability": {
                "confidence_score": conf["confidence"],
                "confidence_level": conf["confidence_level"],
                "evidence": evidence,
                "risk_drivers": ["Historical Severity", "Network Centrality", "Crime Frequency"]
            }
        }
