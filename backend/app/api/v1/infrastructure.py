from fastapi import APIRouter
from typing import Dict, Any

from app.services.infrastructure.backup_manager import backup_manager
from app.services.infrastructure.recovery_manager import recovery_manager
from app.services.infrastructure.monitoring_manager import monitoring_manager

router = APIRouter()

@router.get("/metrics")
async def get_system_metrics() -> Dict[str, Any]:
    return monitoring_manager.get_system_metrics()

@router.get("/backups")
async def get_backup_status() -> Dict[str, Any]:
    return backup_manager.get_backup_status()

@router.post("/backups/trigger")
async def trigger_backup() -> Dict[str, Any]:
    return backup_manager.trigger_backup()

@router.get("/recovery")
async def get_recovery_status() -> Dict[str, Any]:
    return recovery_manager.get_recovery_status()
