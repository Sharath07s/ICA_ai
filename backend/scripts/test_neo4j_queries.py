import sys
import os

# Add parent directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.ai.neo4j.intelligence import neo4j_intelligence

def run_tests():
    print("=== NEO4J INTELLIGENCE TESTS ===")
    
    # Need a real suspect_id. Let's fetch one first.
    suspects = neo4j_intelligence.execute_query("MATCH (s:Suspect) RETURN s.id AS id LIMIT 1")
    s_id = suspects[0]['id'] if suspects else "S123"
    
    print(f"\n1. Show associates of suspect {s_id}")
    res = neo4j_intelligence.find_associates(s_id)
    print(f"Found {len(res)} associates. First: {res[0] if res else 'None'}")
    
    # Need a real vehicle
    vehicles = neo4j_intelligence.execute_query("MATCH (v:Vehicle) RETURN v.reg_number AS reg LIMIT 1")
    v_id = vehicles[0]['reg'] if vehicles else "KA01AB1234"
    
    print(f"\n2. Find crimes linked to vehicle {v_id}")
    res2 = neo4j_intelligence.find_crimes_by_vehicle(v_id)
    print(f"Found {len(res2)} crimes. First: {res2[0] if res2 else 'None'}")
    
    print(f"\n3. Find repeat offenders")
    res3 = neo4j_intelligence.find_repeat_offenders(3)
    print(f"Found {len(res3)} repeat offenders. First: {res3[0] if res3 else 'None'}")
    
    # Need a real FIR
    crimes = neo4j_intelligence.execute_query("MATCH (c:Crime) RETURN c.fir_number AS fir LIMIT 1")
    c_id = crimes[0]['fir'] if crimes else "FIR-2025-441"
    
    print(f"\n4. Show criminal network around {c_id}")
    res4 = neo4j_intelligence.execute_query(
        f"MATCH path = (c:Crime {{fir_number: '{c_id}'}})-[*1..2]-(connected) UNWIND nodes(path) AS n RETURN count(distinct n) AS nodes_count"
    )
    print(f"Nodes in network: {res4[0]['nodes_count'] if res4 else 0}")
    
    print("\n5. Show suspects connected through common vehicles")
    res5 = neo4j_intelligence.execute_query(
        "MATCH (s1:Suspect)-[:USED]->(v:Vehicle)<-[:USED]-(s2:Suspect) WHERE s1.id < s2.id RETURN s1.name, s2.name, v.reg_number LIMIT 1"
    )
    print(f"Found common vehicle linkage: {res5[0] if res5 else 'None'}")

if __name__ == "__main__":
    run_tests()
