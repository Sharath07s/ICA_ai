from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Any
from app.services.streaming.streaming_manager import streaming_manager
from app.services.streaming.event_bus import event_bus

router = APIRouter()

@router.websocket("/ws/command-wall")
async def ws_command_wall(websocket: WebSocket):
    await streaming_manager.connect(websocket, "command-wall")
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        streaming_manager.disconnect(websocket, "command-wall")

@router.websocket("/ws/alerts")
async def ws_alerts(websocket: WebSocket):
    await streaming_manager.connect(websocket, "alerts")
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        streaming_manager.disconnect(websocket, "alerts")

@router.websocket("/ws/officer-workspace")
async def ws_officer_workspace(websocket: WebSocket):
    await streaming_manager.connect(websocket, "officer-workspace")
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        streaming_manager.disconnect(websocket, "officer-workspace")

@router.websocket("/ws/predictive")
async def ws_predictive(websocket: WebSocket):
    await streaming_manager.connect(websocket, "predictive")
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        streaming_manager.disconnect(websocket, "predictive")

@router.websocket("/ws/system-health")
async def ws_system_health(websocket: WebSocket):
    await streaming_manager.connect(websocket, "system-health")
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        streaming_manager.disconnect(websocket, "system-health")

@router.get("/metrics")
def get_streaming_metrics() -> Any:
    return {
        "event_bus": event_bus.get_metrics(),
        "websockets": streaming_manager.get_metrics()
    }
