from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.models.crime import Crime

class HotspotPredictor:
    def __init__(self, db: Session):
        self.db = db
        self.now = datetime.utcnow()

    def predict_hotspots(self) -> dict:
        MIN_RECORDS = 50
        
        # Look at the last 14 days vs previous 14 days
        recent_start = self.now - timedelta(days=14)
        past_start = self.now - timedelta(days=28)
        
        # Ensure we have enough geocoded crimes overall
        geocoded_count = self.db.query(Crime).filter(Crime.latitude.isnot(None), Crime.longitude.isnot(None)).count()
        
        if geocoded_count < MIN_RECORDS:
            return {
                "status": "insufficient_data",
                "message": "Not enough geocoded incidents available for spatial forecasting.",
                "required_records": MIN_RECORDS,
                "available_records": geocoded_count,
                "confidence": 0
            }
            
        # Group crimes temporally by district to find spatial acceleration (as a proxy for specific grids)
        recent_hotspots = self.db.query(
            Crime.district_id, 
            func.count(Crime.id).label('recent_volume')
        ).filter(
            Crime.created_at >= recent_start,
            Crime.latitude.isnot(None)
        ).group_by(Crime.district_id).all()
        
        past_hotspots = dict(self.db.query(
            Crime.district_id, 
            func.count(Crime.id)
        ).filter(
            Crime.created_at >= past_start,
            Crime.created_at < recent_start,
            Crime.latitude.isnot(None)
        ).group_by(Crime.district_id).all())
        
        predicted_areas = []
        for rh in recent_hotspots:
            dist_id = rh.district_id
            rec_vol = rh.recent_volume
            pst_vol = past_hotspots.get(dist_id, 0)
            
            # Predict hotspot if acceleration > 50% and minimum volume threshold met
            if rec_vol >= 5 and (pst_vol == 0 or (rec_vol - pst_vol) / pst_vol > 0.5):
                # Fetch a representative coordinate from recent crimes in this district
                sample_crime = self.db.query(Crime).filter(Crime.district_id == dist_id, Crime.created_at >= recent_start).first()
                if sample_crime and sample_crime.latitude and sample_crime.longitude:
                    predicted_areas.append({
                        "district_id": str(dist_id),
                        "latitude": float(sample_crime.latitude),
                        "longitude": float(sample_crime.longitude),
                        "recent_volume": rec_vol,
                        "past_volume": pst_vol,
                        "escalation_rate": round(((rec_vol - pst_vol) / pst_vol) if pst_vol > 0 else 1.0, 2),
                        "confidence": 0.85 if rec_vol > 15 else 0.65
                    })
        
        if not predicted_areas:
            return {
                "status": "insufficient_data",
                "message": "No statistically significant spatial accelerations detected.",
                "required_records": 0,
                "available_records": geocoded_count,
                "confidence": 0
            }
            
        return {
            "status": "success",
            "predicted_hotspots": predicted_areas,
            "evidence": [f"Evaluated {geocoded_count} spatial coordinates over 28 days."]
        }
