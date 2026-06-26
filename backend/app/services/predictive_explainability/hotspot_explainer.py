from sqlalchemy.orm import Session
from app.services.predictive.hotspot_predictor import HotspotPredictor
from app.services.predictive_validation.hotspot_validator import HotspotValidator
from app.services.predictive_explainability.confidence_engine import ConfidenceEngine

class HotspotExplainer:
    def __init__(self, db: Session):
        self.db = db

    def explain(self) -> dict:
        engine = HotspotPredictor(self.db)
        pred_res = engine.predict_hotspots()
        
        if pred_res.get("status") == "insufficient_data":
            return {"status": "insufficient_data"}
            
        val = HotspotValidator(self.db).validate()
        hist_acc = 0.8
        if val.get("status") == "validated":
            hist_acc = val.get("f1_score", 0.8)
            
        explained_hotspots = []
        for hs in pred_res.get("predicted_hotspots", []):
            signal_str = min(hs.get("escalation_rate", 0.5), 1.0)
            
            conf = ConfidenceEngine.calculate_confidence(
                available_records=pred_res.get("records_analyzed", 50),
                required_records=50,
                historical_accuracy=hist_acc,
                signal_strength=signal_str
            )
            
            evidence = [
                f"Historical geospatial density analyzed",
                f"District {hs.get('district_id')[:8]} showed recent volume of {hs.get('recent_volume')}",
                f"Acceleration rate computed at {hs.get('escalation_rate') * 100}%",
                f"Spatial validation model operates with {hist_acc * 100}% historical F1 Score"
            ]
            
            explained_hotspots.append({
                "district_id": hs.get("district_id"),
                "prediction": hs,
                "explainability": {
                    "confidence_score": conf["confidence"],
                    "confidence_level": conf["confidence_level"],
                    "evidence": evidence,
                    "risk_drivers": ["Spatial Density", "Volume Acceleration"]
                }
            })
            
        return {
            "status": "success",
            "hotspots": explained_hotspots
        }
