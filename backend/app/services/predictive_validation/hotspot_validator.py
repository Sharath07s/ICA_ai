from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.models.crime import Crime

class HotspotValidator:
    def __init__(self, db: Session):
        self.db = db
        self.now = datetime.utcnow()

    def validate(self) -> dict:
        MIN_RECORDS = 50
        
        geocoded_crimes = self.db.query(Crime).filter(Crime.latitude.isnot(None)).count()
        if geocoded_crimes < MIN_RECORDS:
            return {
                "status": "insufficient_data",
                "available_records": geocoded_crimes,
                "required_records": MIN_RECORDS
            }
            
        # Windows
        val_start = self.now - timedelta(days=14)
        t1_start = val_start - timedelta(days=14)
        t2_start = val_start - timedelta(days=28)
        
        # 1. Back-test: What hotspots would we have predicted at val_start?
        # Logic: rec_vol >= 5 AND (pst_vol == 0 OR escalation > 0.5)
        t1_vols = dict(self.db.query(Crime.district_id, func.count(Crime.id)).filter(
            Crime.created_at >= t1_start, Crime.created_at < val_start, Crime.latitude.isnot(None)
        ).group_by(Crime.district_id).all())
        
        t2_vols = dict(self.db.query(Crime.district_id, func.count(Crime.id)).filter(
            Crime.created_at >= t2_start, Crime.created_at < t1_start, Crime.latitude.isnot(None)
        ).group_by(Crime.district_id).all())
        
        predicted_hotspots = set()
        for dist_id, rec_vol in t1_vols.items():
            if not dist_id: continue
            pst_vol = t2_vols.get(dist_id, 0)
            if rec_vol >= 5 and (pst_vol == 0 or (rec_vol - pst_vol) / pst_vol > 0.5):
                predicted_hotspots.add(dist_id)
                
        # 2. Actual Observations: Did these districts actually maintain or increase high density?
        # Actual dense districts in the validation window
        actual_vols = dict(self.db.query(Crime.district_id, func.count(Crime.id)).filter(
            Crime.created_at >= val_start, Crime.latitude.isnot(None)
        ).group_by(Crime.district_id).all())
        
        actual_hotspots = set([d for d, v in actual_vols.items() if v >= 5 and d])
        
        if not predicted_hotspots and not actual_hotspots:
             return {
                "status": "insufficient_data",
                "available_records": geocoded_crimes,
                "required_records": MIN_RECORDS
            }
            
        true_positives = len(predicted_hotspots.intersection(actual_hotspots))
        false_positives = len(predicted_hotspots - actual_hotspots)
        false_negatives = len(actual_hotspots - predicted_hotspots)
        
        precision = true_positives / (true_positives + false_positives) if (true_positives + false_positives) > 0 else 0
        recall = true_positives / (true_positives + false_negatives) if (true_positives + false_negatives) > 0 else 0
        f1 = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
        
        return {
            "status": "validated",
            "precision": round(precision, 2),
            "recall": round(recall, 2),
            "f1_score": round(f1, 2),
            "evidence": [
                f"Historical spatial records analyzed: {geocoded_crimes}",
                "Hotspot escalation algorithm back-tested against a 14-day holdout validation set.",
                f"Metric computed from real spatial density observations (TP: {true_positives}, FP: {false_positives})."
            ]
        }
