from sqlalchemy.orm import Session
from sqlalchemy import func, case
from datetime import datetime, timedelta
import logging

from app.models.alert import Alert
from app.models.crime import Crime, CrimeType
from app.models.entities import Suspect, SuspectCrime
from app.models.location import District
from app.ai.neo4j.intelligence import neo4j_intelligence

logger = logging.getLogger(__name__)

class AlertEngine:
    def __init__(self, db: Session):
        self.db = db
        self.now = datetime.utcnow()
        self.seven_days_ago = self.now - timedelta(days=7)
        self.fourteen_days_ago = self.now - timedelta(days=14)

    def evaluate_all(self):
        """Run all heuristics and persist generated alerts."""
        self._evaluate_crime_spikes()
        self._evaluate_hotspot_escalation()
        self._evaluate_repeat_offenders()
        self._evaluate_emerging_networks()
        self._evaluate_predictive_alerts()
        self._evaluate_model_health()
        self.db.commit()

    def _create_alert_if_not_exists(self, type_val: str, severity: str, title: str, description: str, district: str, source: str):
        # Prevent spamming the same exact alert within 24h
        recent_alert = self.db.query(Alert).filter(
            Alert.title == title,
            Alert.created_at >= self.now - timedelta(days=1)
        ).first()
        
        if not recent_alert:
            new_alert = Alert(
                type=type_val,
                severity=severity,
                title=title,
                description=description,
                district=district,
                source=source,
                created_at=self.now,
                resolved=False
            )
            self.db.add(new_alert)
            from app.services.streaming.event_bus import event_bus
            event_bus.publish_sync(
                event_type="ALERT_CREATED",
                source="ALERT_ENGINE",
                payload={"type": type_val, "severity": severity, "title": title},
                db=self.db
            )

    def _evaluate_crime_spikes(self):
        spikes = self.db.query(
            CrimeType.category,
            District.name,
            func.count(Crime.id).label('recent_count'),
            func.sum(case((Crime.created_at >= self.fourteen_days_ago) & (Crime.created_at < self.seven_days_ago), 1)).else_(0).label('past_count')
        ).join(Crime, Crime.crime_type_id == CrimeType.id)\
         .join(District, Crime.district_id == District.id)\
         .filter(Crime.created_at >= self.seven_days_ago)\
         .group_by(CrimeType.category, District.name)\
         .having(func.count(Crime.id) >= 1).all()

        for s in spikes:
            recent = s.recent_count or 0
            past = s.past_count or 0
            
            # Spike detected if volume > 5 and growth > 50%
            if recent > 5 and (past == 0 or ((recent - past) / past) > 0.5):
                severity = "CRITICAL" if recent > 15 else "HIGH"
                self._create_alert_if_not_exists(
                    type_val="Crime Spike",
                    severity=severity,
                    title=f"Significant {s.category} Spike in {s.name}",
                    description=f"Detected {recent} cases in the last 7 days compared to {past} in the previous week.",
                    district=s.name,
                    source="POSTGRESQL"
                )

    def _evaluate_hotspot_escalation(self):
        hotspots = self.db.query(
            District.name,
            func.count(Crime.id).label('volume')
        ).join(Crime, Crime.district_id == District.id)\
         .filter(Crime.created_at >= self.seven_days_ago)\
         .group_by(District.name)\
         .having(func.count(Crime.id) >= 20).all()
         
        for h in hotspots:
            self._create_alert_if_not_exists(
                type_val="Hotspot Escalation",
                severity="HIGH",
                title=f"Escalating Crime Density in {h.name}",
                description=f"High concentration of crimes ({h.volume} cases) reported within the active timeframe.",
                district=h.name,
                source="POSTGRESQL"
            )

    def _evaluate_repeat_offenders(self):
        offenders = self.db.query(
            Suspect.full_name,
            func.count(SuspectCrime.crime_id).label('crime_count')
        ).join(SuspectCrime, SuspectCrime.suspect_id == Suspect.id)\
         .group_by(Suspect.id, Suspect.full_name)\
         .having(func.count(SuspectCrime.crime_id) >= 3).all()
         
        for o in offenders:
            self._create_alert_if_not_exists(
                type_val="Repeat Offender",
                severity="MEDIUM",
                title=f"Repeat Offender Threshold Reached: {o.full_name}",
                description=f"Suspect is now linked to {o.crime_count} distinct crimes.",
                district="Multiple",
                source="POSTGRESQL"
            )

    def _evaluate_emerging_networks(self):
        cypher = """
        MATCH (s:Suspect)-[:KNOWS]-(associate:Suspect)
        WITH s, count(associate) AS degree
        WHERE degree >= 5
        OPTIONAL MATCH (s)-[:PARTICIPATED_IN]->(c:Crime)-[:OCCURRED_IN]->(d:District)
        RETURN s.full_name AS name, degree AS members, collect(distinct d.name) AS districts
        LIMIT 5
        """
        try:
            results = neo4j_intelligence.execute_query(cypher)
            for r in results:
                name = r.get("name", "Unknown")
                members = r.get("members", 0)
                districts = ", ".join(r.get("districts", [])) or "Unknown"
                
                self._create_alert_if_not_exists(
                    type_val="Emerging Network",
                    severity="CRITICAL",
                    title=f"Expanding Network Detected around {name}",
                    description=f"Neo4j degree centrality indicates an expanding syndicate of {members} associates spanning {districts}.",
                    district=districts,
                    source="NEO4J"
                )
        except Exception as e:
            logger.error(f"Failed to evaluate neo4j network alerts: {e}")
    def _evaluate_model_health(self):
        from app.services.model_monitoring.monitoring_summary import MonitoringSummary
        
        try:
            summary = MonitoringSummary(self.db).generate_summary()
            if summary.get("status") == "insufficient_data":
                return
                
            # 1. Model Drift
            drift = summary.get("drift_detection", {})
            vol_drift = drift.get("volume_drift_pct", 0)
            if abs(vol_drift) > 0.3: # >30% volume shift
                self._create_alert_if_not_exists(
                    type_val="MODEL_DRIFT_DETECTED",
                    severity="MEDIUM",
                    title="Significant Data Volume Drift Detected",
                    description=f"Ingestion volume has shifted by {vol_drift*100:.1f}%. Models may require recalibration.",
                    district="GLOBAL",
                    source="SYSTEM"
                )
                
            # 2. Forecast Degradation
            fore = summary.get("forecast_monitoring", {})
            if fore.get("trend") == "Degrading":
                self._create_alert_if_not_exists(
                    type_val="FORECAST_DEGRADATION",
                    severity="HIGH",
                    title="Predictive Forecaster Degradation",
                    description=f"Crime forecaster MAPE has risen to {fore.get('mape')}%.",
                    district="GLOBAL",
                    source="SYSTEM"
                )
                
            # 3. Reliability Drop
            rel = summary.get("reliability_score", 100)
            if rel < 60:
                self._create_alert_if_not_exists(
                    type_val="LOW_CONFIDENCE_RELIABILITY",
                    severity="HIGH",
                    title="Intelligence Reliability Critical",
                    description=f"System reliability score dropped to {rel}. Predictions may be unreliable.",
                    district="GLOBAL",
                    source="SYSTEM"
                )
        except Exception as e:
            print(f"Model health evaluation failed: {e}")
    def _evaluate_predictive_alerts(self):
        # Hotspot Prediction
        from app.services.predictive.hotspot_predictor import HotspotPredictor
        hp = HotspotPredictor(self.db)
        hotspot_res = hp.predict_hotspots()
        if hotspot_res.get("status") == "success":
            for area in hotspot_res.get("predicted_hotspots", []):
                if area["confidence"] > 0.75:
                    # Look up district name safely
                    dist = self.db.query(District).get(area["district_id"])
                    d_name = dist.name if dist else "Unknown"
                    self._create_alert_if_not_exists(
                        type_val="Predictive",
                        severity="HIGH",
                        title=f"Predicted Hotspot Formation in {d_name}",
                        description=f"Algorithm predicts escalating spatial density. Escalation rate: {area['escalation_rate']*100}%.",
                        district=d_name,
                        source="PREDICTIVE_ENGINE"
                    )
        
        # Network Growth Prediction
        from app.services.predictive.network_growth import NetworkGrowthEngine
        nge = NetworkGrowthEngine()
        net_res = nge.predict_growth()
        if net_res.get("status") == "success":
            for net in net_res.get("network_predictions", []):
                if net["expansion_risk"] == "HIGH":
                    self._create_alert_if_not_exists(
                        type_val="Predictive",
                        severity="CRITICAL",
                        title=f"Predicted Syndicate Expansion: {net['suspect_name']}",
                        description=f"Structural metrics predict addition of {net['predicted_new_connections_30d']} new associates within 30 days.",
                        district="Multiple",
                        source="PREDICTIVE_ENGINE"
                    )
