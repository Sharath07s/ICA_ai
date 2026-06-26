import asyncio
from fastapi import WebSocket
from typing import Dict, List
import json
from app.services.streaming.event_bus import event_bus

class StreamingManager:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(StreamingManager, cls).__new__(cls)
            # Channel mapping
            cls._instance.active_connections: Dict[str, List[WebSocket]] = {
                "command-wall": [],
                "alerts": [],
                "officer-workspace": [],
                "predictive": [],
                "system-health": []
            }
            # Start bridging EventBus to WebSockets
            event_bus.subscribe("*", cls._instance._bridge_event)
        return cls._instance

    async def connect(self, websocket: WebSocket, channel: str):
        await websocket.accept()
        if channel in self.active_connections:
            self.active_connections[channel].append(websocket)

    def disconnect(self, websocket: WebSocket, channel: str):
        if channel in self.active_connections and websocket in self.active_connections[channel]:
            self.active_connections[channel].remove(websocket)

    async def broadcast(self, message: str, channel: str):
        if channel not in self.active_connections: return
        
        disconnected = []
        for connection in self.active_connections[channel]:
            try:
                await connection.send_text(message)
            except Exception:
                disconnected.append(connection)
                
        # Cleanup
        for d in disconnected:
            self.disconnect(d, channel)

    async def _bridge_event(self, event_obj: dict):
        """
        Routes generic events from EventBus down to the appropriate WebSockets
        based on domain logic.
        """
        msg = json.dumps(event_obj)
        t = event_obj.get("event_type", "")
        
        # Command Wall cares about nearly everything
        await self.broadcast(msg, "command-wall")
        
        # System Health cares about everything
        await self.broadcast(msg, "system-health")
        
        # Alerts
        if t in ["ALERT_CREATED", "ALERT_RESOLVED", "CRIME_CREATED"]:
            await self.broadcast(msg, "alerts")
            
        # Officer Workspace
        if t in ["ALERT_CREATED", "CRIME_CREATED", "SUSPECT_UPDATED"]:
            await self.broadcast(msg, "officer-workspace")
            
        # Predictive
        if t in ["PREDICTION_UPDATED", "HOTSPOT_DETECTED", "RECIDIVISM_ALERT", "MODEL_DRIFT_DETECTED", "NETWORK_EXPANDED"]:
            await self.broadcast(msg, "predictive")

    def get_metrics(self) -> dict:
        total = sum(len(conns) for conns in self.active_connections.values())
        return {
            "active_connections": total,
            "channels": {k: len(v) for k, v in self.active_connections.items()}
        }

streaming_manager = StreamingManager()
