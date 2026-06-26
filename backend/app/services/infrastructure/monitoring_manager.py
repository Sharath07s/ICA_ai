import os
import psutil
from typing import Dict, Any

class MonitoringManager:
    def __init__(self):
        self.api_latency_ms = []
        self.max_history = 100

    def record_api_latency(self, latency_ms: float):
        self.api_latency_ms.append(latency_ms)
        if len(self.api_latency_ms) > self.max_history:
            self.api_latency_ms.pop(0)

    def get_system_metrics(self) -> Dict[str, Any]:
        # Using real system metrics using psutil and os to avoid fabricating data
        try:
            cpu_percent = psutil.cpu_percent(interval=0.1)
            mem = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            avg_latency = sum(self.api_latency_ms) / len(self.api_latency_ms) if self.api_latency_ms else 0.0

            return {
                "status": "operational",
                "cpu_usage_percent": cpu_percent,
                "memory_usage_percent": mem.percent,
                "memory_used_gb": round(mem.used / (1024**3), 2),
                "memory_total_gb": round(mem.total / (1024**3), 2),
                "disk_usage_percent": disk.percent,
                "avg_api_latency_ms": round(avg_latency, 2),
                "recorded_requests": len(self.api_latency_ms)
            }
        except Exception:
            return {"status": "unavailable"}

monitoring_manager = MonitoringManager()
