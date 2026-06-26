from sqlalchemy.orm import Session
from app.services.model_monitoring.drift_detector import DriftDetector
from app.services.model_monitoring.forecast_monitor import ForecastMonitor
from app.services.model_monitoring.hotspot_monitor import HotspotMonitor
from app.services.model_monitoring.recidivism_monitor import RecidivismMonitor
from app.services.model_monitoring.network_monitor import NetworkMonitor

class MonitoringSummary:
    def __init__(self, db: Session):
        self.db = db

    def generate_summary(self) -> dict:
        drift = DriftDetector(self.db).detect()
        
        if drift.get("status") == "insufficient_data":
            return {"status": "insufficient_data"}
            
        fore = ForecastMonitor(self.db).monitor()
        hot = HotspotMonitor(self.db).monitor()
        rec = RecidivismMonitor(self.db).monitor()
        net = NetworkMonitor().monitor()
        
        # Calculate Reliability Score (Proxy mapping validation to avg explainability confidence)
        # High reliability means validation accuracy is high when confidence is high.
        # Here we just use a unified metric based on the aggregate F1/Accuracy scores
        
        f1_scores = [
            hot.get("f1_score", 0),
            rec.get("f1_score", 0),
            net.get("accuracy", 0)
        ]
        
        avg_f1 = sum(f1_scores) / max(len(f1_scores), 1)
        reliability = min(max(int(avg_f1 * 100), 0), 100)
        
        return {
            "status": "success",
            "drift_detection": drift,
            "forecast_monitoring": fore,
            "hotspot_monitoring": hot,
            "recidivism_monitoring": rec,
            "network_monitoring": net,
            "reliability_score": reliability,
            "reliability_level": "HIGH" if reliability >= 80 else ("MEDIUM" if reliability >= 60 else "LOW")
        }
