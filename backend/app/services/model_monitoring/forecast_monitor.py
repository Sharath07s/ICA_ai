from sqlalchemy.orm import Session
from app.services.predictive_validation.forecast_validator import ForecastValidator

class ForecastMonitor:
    def __init__(self, db: Session):
        self.db = db

    def monitor(self) -> dict:
        # Wrap the validator to track metrics over time
        # In a real deployed system we'd log this to a timeseries db.
        val = ForecastValidator(self.db).validate()
        
        if val.get("status") == "insufficient_data":
            return {"status": "insufficient_data"}
            
        return {
            "status": "success",
            "mae": val.get("mae", 0),
            "mape": val.get("mape", 0),
            "rmse": val.get("rmse", 0),
            "trend": "Stable" if val.get("mape", 100) < 20 else "Degrading"
        }
