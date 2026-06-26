from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models.crime import Crime

class ForecastValidator:
    def __init__(self, db: Session):
        self.db = db
        self.now = datetime.utcnow()

    def validate(self) -> dict:
        MIN_RECORDS = 60
        
        total_crimes = self.db.query(Crime).count()
        if total_crimes < MIN_RECORDS:
            return {
                "status": "insufficient_data",
                "available_records": total_crimes,
                "required_records": MIN_RECORDS
            }
            
        # T-30 to Now (Validation Window)
        val_start = self.now - timedelta(days=30)
        
        # T-120 to T-30 (Training Window, simulating past prediction logic)
        t1_start = val_start - timedelta(days=30)
        t2_start = val_start - timedelta(days=60)
        t3_start = val_start - timedelta(days=90)
        
        # We'll calculate across all districts to get a platform-level MAPE
        districts = self.db.query(Crime.district_id).distinct().all()
        
        errors = []
        actuals = []
        predicted_vals = []
        
        for (dist_id,) in districts:
            if not dist_id: continue
            
            # Simulated Training: What would we have predicted at T-30?
            p1 = self.db.query(Crime).filter(Crime.district_id == dist_id, Crime.created_at >= t1_start, Crime.created_at < val_start).count()
            p2 = self.db.query(Crime).filter(Crime.district_id == dist_id, Crime.created_at >= t2_start, Crime.created_at < t1_start).count()
            p3 = self.db.query(Crime).filter(Crime.district_id == dist_id, Crime.created_at >= t3_start, Crime.created_at < t2_start).count()
            
            # We must use exactly the same logic as the real engine: (P1*0.5) + (P2*0.3) + (P3*0.2)
            predicted = (p1 * 0.5) + (p2 * 0.3) + (p3 * 0.2)
            
            # Actual observation in validation window
            actual = self.db.query(Crime).filter(Crime.district_id == dist_id, Crime.created_at >= val_start).count()
            
            if actual > 0 or predicted > 0:
                actuals.append(actual)
                predicted_vals.append(predicted)
                errors.append(abs(actual - predicted))
                
        if not actuals:
            return {
                "status": "insufficient_data",
                "available_records": total_crimes,
                "required_records": MIN_RECORDS
            }
            
        mae = sum(errors) / len(errors)
        rmse = (sum([e**2 for e in errors]) / len(errors)) ** 0.5
        
        # MAPE calculation (protect against div by zero)
        mape_errors = [abs(a - p) / a for a, p in zip(actuals, predicted_vals) if a > 0]
        mape = (sum(mape_errors) / len(mape_errors) * 100) if mape_errors else 0.0
        
        return {
            "status": "validated",
            "mape": round(mape, 2),
            "mae": round(mae, 2),
            "rmse": round(rmse, 2),
            "records_used": total_crimes,
            "evidence": [
                f"Historical records analyzed: {total_crimes}",
                "Forecast compared against actual outcomes over a 30-day blind validation window.",
                f"Metric computed from {len(actuals)} real district observations."
            ]
        }
