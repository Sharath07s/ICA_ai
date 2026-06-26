import asyncio
import json
from playwright.async_api import async_playwright

ROUTES = [
    "/",
    "/login",
    "/dashboard",
    "/command-wall",
    "/predictive-intelligence",
    "/intelligence-fusion",
    "/investigations",
    "/alerts",
    "/suspects",
    "/officers"
]

BASE_URL = "http://localhost:3000"

async def verify_routes():
    report = {
        "Routes PASS": [],
        "Routes FAIL": [],
        "Console Errors": [],
        "Network Failures": [],
        "Runtime Exceptions": [],
        "Hydration Failures": [],
        "WebSocket Failures": []
    }

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        
        for route in ROUTES:
            url = f"{BASE_URL}{route}"
            print(f"Testing route: {route}")
            
            context = await browser.new_context()
            page = await context.new_page()
            
            # Listeners
            page.on("console", lambda msg: process_console(route, msg, report))
            page.on("pageerror", lambda err: process_page_error(route, err, report))
            page.on("requestfailed", lambda req: process_request_failed(route, req, report))
            page.on("websocket", lambda ws: ws.on("socketerror", lambda err: process_ws_error(route, err, report)))
            page.on("websocket", lambda ws: ws.on("close", lambda ws_close: process_ws_close(route, ws_close, report)))
            
            try:
                response = await page.goto(url, wait_until="domcontentloaded", timeout=10000)
                if response and response.ok:
                    report["Routes PASS"].append(route)
                else:
                    status = response.status if response else "Unknown"
                    report["Routes FAIL"].append({"route": route, "status": status})
                    
                # Wait a bit for dynamic client rendering to settle
                await asyncio.sleep(3)
            except Exception as e:
                report["Routes FAIL"].append({"route": route, "error": str(e)})
            
            await context.close()
            
        await browser.close()
        
    with open("verification_report.json", "w") as f:
        json.dump(report, f, indent=2)
        
    print("Verification complete. Results saved to verification_report.json")

def process_console(route, msg, report):
    if msg.type == "error":
        text = msg.text
        if "Hydration" in text or "does not match server-rendered HTML" in text or "Minified React error #418" in text or "Minified React error #423" in text:
            report["Hydration Failures"].append({"route": route, "error": text})
        elif "WebSocket" in text and "failed" in text:
            if "ERR_CONNECTION_REFUSED" not in text:
                report["WebSocket Failures"].append({"route": route, "error": text})
        elif "ERR_CONNECTION_REFUSED" not in text and "ERR_ABORTED" not in text:
            report["Console Errors"].append({"route": route, "error": text})

def process_page_error(route, err, report):
    report["Runtime Exceptions"].append({"route": route, "error": err.message, "stack": err.stack})

def process_request_failed(route, request, report):
    if request.url.startswith(BASE_URL) or "api/v1" in request.url:
        err_text = request.failure
        if err_text and "net::ERR_ABORTED" not in err_text and "net::ERR_CONNECTION_REFUSED" not in err_text:
            report["Network Failures"].append({"route": route, "url": request.url, "error": err_text})

def process_ws_error(route, err, report):
    err_text = str(err)
    if "net::ERR_CONNECTION_REFUSED" not in err_text and "net::ERR_ABORTED" not in err_text:
        report["WebSocket Failures"].append({"route": route, "error": err_text})

def process_ws_close(route, ws, report):
    pass # we might not treat normal closure as a failure unless it's an abnormal code, but console will catch the explicit connection errors usually.

if __name__ == "__main__":
    asyncio.run(verify_routes())
