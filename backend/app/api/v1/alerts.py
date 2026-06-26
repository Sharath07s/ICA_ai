from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.api import deps
from app.models.user import User
from app.models.alert import Alert
from app.services.alert_engine import AlertEngine
from app.services.streaming.event_bus import event_bus

router = APIRouter()

@router.get("/")
def get_alerts(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Trigger the AlertEngine to evaluate current intelligence and return all active alerts.
    """
    engine = AlertEngine(db)
    engine.evaluate_all()
    
    alerts = db.query(Alert).order_by(Alert.created_at.desc()).all()
    return alerts

@router.get("/open")
def get_open_alerts(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    alerts = db.query(Alert).filter(Alert.resolved == False).order_by(Alert.created_at.desc()).all()
    return alerts

@router.get("/high")
def get_high_alerts(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    alerts = db.query(Alert).filter(
        Alert.resolved == False,
        Alert.severity.in_(["HIGH", "CRITICAL"])
    ).order_by(Alert.created_at.desc()).all()
    return alerts

@router.get("/critical")
def get_critical_alerts(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    alerts = db.query(Alert).filter(
        Alert.resolved == False,
        Alert.severity == "CRITICAL"
    ).order_by(Alert.created_at.desc()).all()
    return alerts

@router.post("/{alert_id}/resolve")
def resolve_alert(
    alert_id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    alert.resolved = True
    alert.resolved_at = datetime.utcnow()
    db.commit()
    
    event_bus.publish_sync(
        event_type="ALERT_RESOLVED",
        source="API_ALERTS_RESOLVE",
        payload={"alert_id": alert_id, "severity": alert.severity},
        db=db
    )
    
    return {"status": "success", "alert": alert}
