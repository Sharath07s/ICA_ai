import requests
import json
import os

BASE_URL = "http://localhost:8000/api/v1"

def print_step(step_name):
    print(f"\n{'='*50}\nVERIFYING: {step_name}\n{'='*50}")

def verify():
    # 1. Neo4j Health & Counts
    print_step("Neo4j Health & Connection")
    try:
        r = requests.get(f"{BASE_URL}/neo4j/health")
        data = r.json()
        print(f"Status: {r.status_code}")
        print(f"Data: {json.dumps(data, indent=2)}")
        if data.get("status") != "healthy":
            print("ERROR: Neo4j is not healthy!")
    except Exception as e:
        print(f"Failed to connect: {e}")

    # 2. Network APIs
    print_step("Criminal Network APIs (Repeat Offenders)")
    try:
        r = requests.get(f"{BASE_URL}/neo4j/repeat-offenders?limit=3")
        data = r.json()
        print(f"Status: {r.status_code}")
        print(f"Found {len(data)} repeat offenders.")
        if len(data) > 0:
            print(f"First offender: {data[0]}")
    except Exception as e:
        print(f"Failed: {e}")

    # 3. Intent Engine & Chat Graph Routing
    print_step("Chat Intent Engine & Graph Reasoning")
    try:
        payload = {"query": "Show me the top repeat offenders and high risk network"}
        # Depending on auth, might need a mock token or header. 
        # But if the endpoint has Depends(get_current_user), this might fail without auth.
        # Let's check how chat endpoint is protected.
        headers = {"Authorization": "Bearer test"} # might fail if no test user
        r = requests.post(f"{BASE_URL}/chat/", json=payload, headers=headers)
        if r.status_code == 401:
            print("401 Unauthorized. Bypassing HTTP and using internal python call for Chat verification.")
            import sys
            sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            from app.api.v1.chat import _keyword_intent
            from app.ai.query_planner.planner import QueryPlanner
            
            # Test intent engine directly
            from app.ai.intents.engine import IntentEngine
            print("Extracting intent internally...")
            intent_res = IntentEngine.extract_intent(payload['query'])
            print(f"Extracted intent: {intent_res['intent_data']['intent']}")
            
            # Test query planner routing
            print("Testing QueryPlanner routing...")
            # We need a db session, but graph queries don't use the db.
            context = QueryPlanner.execute_intent(None, {"intent": "repeat_offenders"})
            print(f"Mapped Action: {context['mapped_action']}")
            print(f"Data elements returned from Neo4j through planner: {len(context['data'])}")
            
        else:
            print(f"Status: {r.status_code}")
            data = r.json()
            print(f"Intent: {data.get('intent')}")
            print(f"Message: {data.get('message')}")
            print(f"Record Count: {data.get('record_count')}")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == '__main__':
    verify()
