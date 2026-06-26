import asyncio
import time
import httpx
import json

API_BASE = "http://localhost:8000/api/v1"

class LoadTester:
    def __init__(self, concurrency: int = 50, duration_seconds: int = 10):
        self.concurrency = concurrency
        self.duration_seconds = duration_seconds
        self.stats = {
            "requests_sent": 0,
            "successes": 0,
            "failures": 0,
            "latencies": []
        }

    async def _worker(self, client: httpx.AsyncClient, end_time: float):
        while time.time() < end_time:
            start = time.time()
            try:
                # Target the read-heavy open alerts endpoint
                response = await client.get(f"{API_BASE}/alerts/open")
                if response.status_code == 200:
                    self.stats["successes"] += 1
                else:
                    self.stats["failures"] += 1
            except Exception:
                self.stats["failures"] += 1
            
            latency = (time.time() - start) * 1000
            self.stats["latencies"].append(latency)
            self.stats["requests_sent"] += 1
            await asyncio.sleep(0.01)

    async def run(self):
        print(f"Starting load test: {self.concurrency} concurrent workers for {self.duration_seconds}s")
        end_time = time.time() + self.duration_seconds
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            tasks = [self._worker(client, end_time) for _ in range(self.concurrency)]
            await asyncio.gather(*tasks)

        self._print_results()

    def _print_results(self):
        print("=== Load Test Results ===")
        print(f"Total Requests: {self.stats['requests_sent']}")
        print(f"Successes: {self.stats['successes']}")
        print(f"Failures: {self.stats['failures']}")
        
        if self.stats["latencies"]:
            avg_latency = sum(self.stats["latencies"]) / len(self.stats["latencies"])
            max_latency = max(self.stats["latencies"])
            print(f"Avg Latency: {avg_latency:.2f}ms")
            print(f"Max Latency: {max_latency:.2f}ms")
            print(f"Throughput: {self.stats['successes'] / self.duration_seconds:.2f} req/s")

if __name__ == "__main__":
    tester = LoadTester()
    asyncio.run(tester.run())
