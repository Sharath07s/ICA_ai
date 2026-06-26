import asyncio
import json
import time
from typing import Callable, Dict, List, Any
from sqlalchemy.orm import Session
from app.models.event_audit_log import EventAuditLog

class EventBus:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EventBus, cls).__new__(cls)
            cls._instance.subscribers: Dict[str, List[Callable]] = {}
            cls._instance.metrics = {
                "events_processed": 0,
                "dropped_events": 0,
                "total_processing_time_ms": 0.0,
                "events_per_minute": 0,
                "start_time": time.time()
            }
        return cls._instance

    def subscribe(self, event_type: str, callback: Callable):
        if event_type not in self.subscribers:
            self.subscribers[event_type] = []
        self.subscribers[event_type].append(callback)

    async def publish(self, event_type: str, source: str, payload: dict, db: Session = None):
        start_t = time.time()
        import uuid
        event_id = str(uuid.uuid4())
        
        event_obj = {
            "event_id": event_id,
            "event_type": event_type,
            "source": source,
            "timestamp": time.time(),
            "payload": payload
        }
        
        # Fire subscribers
        if event_type in self.subscribers:
            for cb in self.subscribers[event_type]:
                try:
                    await cb(event_obj)
                except Exception as e:
                    print(f"EventBus callback error: {e}")
                    
        # Also fire generic wildcard subscribers (useful for WebSockets)
        if "*" in self.subscribers:
            for cb in self.subscribers["*"]:
                try:
                    await cb(event_obj)
                except Exception as e:
                    print(f"EventBus wildcard callback error: {e}")

        processing_time = (time.time() - start_t) * 1000
        
        self.metrics["events_processed"] += 1
        self.metrics["total_processing_time_ms"] += processing_time
        
        uptime_minutes = (time.time() - self.metrics["start_time"]) / 60.0
        if uptime_minutes > 0:
            self.metrics["events_per_minute"] = self.metrics["events_processed"] / uptime_minutes
            
        # Persist to DB
        if db:
            try:
                log = EventAuditLog(
                    event_id=event_id,
                    event_type=event_type,
                    source=source,
                    status="processed",
                    processing_time_ms=processing_time
                )
                db.add(log)
                db.commit()
            except Exception as e:
                print(f"Failed to persist event log: {e}")
                self.metrics["dropped_events"] += 1
                
    def publish_sync(self, event_type: str, source: str, payload: dict, db: Session = None):
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                loop.create_task(self.publish(event_type, source, payload, db))
            else:
                loop.run_until_complete(self.publish(event_type, source, payload, db))
        except RuntimeError:
            asyncio.run(self.publish(event_type, source, payload, db))
                
    def get_metrics(self) -> dict:
        avg_latency = 0.0
        if self.metrics["events_processed"] > 0:
            avg_latency = self.metrics["total_processing_time_ms"] / self.metrics["events_processed"]
            
        return {
            "events_processed": self.metrics["events_processed"],
            "dropped_events": self.metrics["dropped_events"],
            "average_latency_ms": avg_latency,
            "events_per_minute": self.metrics["events_per_minute"],
        }

# Global singleton
event_bus = EventBus()
