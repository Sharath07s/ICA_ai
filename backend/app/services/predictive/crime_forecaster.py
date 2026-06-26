from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.models.crime import Crime, CrimeType
from app.models.location import District

class CrimeForecaster:
    def __init__(self, db: Session):
        self.db = db
        self.now = datetime.utcnow()

    def predict_volume(self, district_id: str, crime_type_id: str = None) -> dict:
        # Minimum records threshold for reliable prediction
        MIN_RECORDS = 30
        
        # Calculate historical periods
        t1_start = self.now - timedelta(days=30)
        t2_start = self.now - timedelta(days=60)
        t3_start = self.now - timedelta(days=90)
        
        query = self.db.query(Crime).filter(Crime.district_id == district_id)
        if crime_type_id:
            query = query.filter(Crime.crime_type_id == crime_type_id)
            
        total_records = query.count()
        
        if total_records < MIN_RECORDS:
            return {
                "status": "insufficient_data",
                "message": "Not enough historical incidents available for reliable forecasting.",
                "required_records": MIN_RECORDS,
                "available_records": total_records,
                "confidence": 0
            }
            
        # Get volume per 30-day period
        p1_volume = query.filter(Crime.created_at >= t1_start).count()
        p2_volume = query.filter(Crime.created_at >= t2_start, Crime.created_at < t1_start).count()
        p3_volume = query.filter(Crime.created_at >= t3_start, Crime.created_at < t2_start).count()
        
        # Simple Weighted Moving Average (more weight to recent period)
        # Weights: P1: 0.5, P2: 0.3, P3: 0.2
        predicted_count = (p1_volume * 0.5) + (p2_volume * 0.3) + (p3_volume * 0.2)
        
        # Determine trend
        trend = "stable"
        if p1_volume > p2_volume * 1.15:
            trend = "increasing"
        elif p1_volume < p2_volume * 0.85:
            trend = "decreasing"
            
        # Calculate statistical confidence based on variance and sample size
        # A simple proxy: higher volume and stable variance = higher confidence
        variance = abs(p1_volume - p2_volume) + abs(p2_volume - p3_volume)
        base_confidence = min(total_records / 100.0, 0.7) # Base confidence caps at 70% based on N
        stability_bonus = 0.25 if variance < (p1_volume * 0.2) else 0.05
        confidence = round(base_confidence + stability_bonus, 2)
        confidence = min(max(confidence, 0.1), 0.95)
        
        evidence = [
            f"Total historical records used: {total_records}",
            f"Last 30 days volume: {p1_volume}",
            f"Previous 30 days volume: {p2_volume}"
        ]
        
        return {
            "status": "success",
            "district_id": district_id,
            "crime_type_id": crime_type_id,
            "predicted_count": int(predicted_count),
            "confidence": confidence,
            "trend": trend,
            "evidence": evidence
        }
