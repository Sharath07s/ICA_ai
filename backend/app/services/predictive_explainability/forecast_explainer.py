from sqlalchemy.orm import Session
from app.services.predictive.crime_forecaster import CrimeForecaster
from app.services.predictive_validation.forecast_validator import ForecastValidator
from app.services.predictive_explainability.confidence_engine import ConfidenceEngine

class ForecastExplainer:
    def __init__(self, db: Session):
        self.db = db

    def explain(self, district_id: str, crime_type_id: str = None) -> dict:
        # 1. Execute Prediction
        engine = CrimeForecaster(self.db)
        pred_res = engine.predict_volume(district_id, crime_type_id)
        
        if pred_res.get("status") == "insufficient_data":
            return {"status": "insufficient_data"}
            
        # 2. Execute Validation to get historical accuracy proxy
        # To avoid heavy computation on every explain request, we mock the retrieval 
        # of the validation metric in a real system, but here we actually execute it.
        val = ForecastValidator(self.db).validate()
        hist_acc = 0.8 # Default baseline
        if val.get("status") == "validated":
            mape = val.get("mape", 20)
            # Inverse MAPE to accuracy bounded at 0
            hist_acc = max(100 - mape, 0) / 100.0
            
        # 3. Calculate Confidence
        # Signal strength proxy: if it's a huge spike or drop, signal is stronger.
        # Just use the engine's internal confidence mapped to signal strength
        signal_str = pred_res.get("confidence", 0.5)
        
        conf = ConfidenceEngine.calculate_confidence(
            available_records=pred_res.get("records_analyzed", 60), # Fallback if missing
            required_records=30, # from CrimeForecaster MIN_RECORDS
            historical_accuracy=hist_acc,
            signal_strength=signal_str
        )
        
        # 4. Construct Explanation
        evidence = [
            f"Historical incidents analyzed: {pred_res.get('records_analyzed', 'N/A')}",
            f"Evaluated trailing 90-day volume windows",
            f"Weighted moving average trend resolved to: {pred_res.get('trend', 'unknown')}",
            f"Platform validation back-testing indicates historical MAPE of {val.get('mape', 'N/A')}%"
        ]
        
        return {
            "status": "success",
            "prediction": pred_res,
            "explainability": {
                "confidence_score": conf["confidence"],
                "confidence_level": conf["confidence_level"],
                "evidence": evidence,
                "risk_drivers": ["Volume Trends", "Temporal Sequencing"]
            }
        }
