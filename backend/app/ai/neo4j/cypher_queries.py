# backend/app/ai/neo4j/cypher_queries.py

FIND_ASSOCIATES = """
MATCH (s:Suspect {id: $suspect_id})-[:INVOLVED_IN]->(c:Crime)<-[:INVOLVED_IN]-(associate:Suspect)
WHERE s.id <> associate.id
RETURN associate.id AS associate_id, associate.name AS associate_name, count(c) AS shared_crimes, collect(c.fir_number) AS crime_firs
ORDER BY shared_crimes DESC
"""

FIND_SHARED_VEHICLES = """
MATCH (s:Suspect {id: $suspect_id})-[:USED]->(v:Vehicle)<-[:USED]-(associate:Suspect)
WHERE s.id <> associate.id
RETURN associate.id AS associate_id, associate.name AS associate_name, v.reg_number AS vehicle_number, count(v) AS weight
"""

FIND_CRIMES_FOR_VEHICLE = """
MATCH (c:Crime)-[:INVOLVES]->(v:Vehicle {reg_number: $vehicle_number})
RETURN c.id AS crime_id, c.fir_number AS fir_number, c.title AS title, c.status AS status
"""

FIND_CRIMINAL_NETWORK = """
MATCH path = (s:Suspect {id: $suspect_id})-[*1..2]-(connected)
WHERE (connected:Suspect OR connected:Crime OR connected:Vehicle OR connected:Location OR connected:PhoneNumber OR connected:PoliceStation OR connected:District)
RETURN path
"""

FIND_REPEAT_OFFENDERS = """
MATCH (s:Suspect)-[:INVOLVED_IN]->(c:Crime)
WITH s, count(c) AS crime_count
WHERE crime_count > 1
RETURN s.id AS suspect_id, s.name AS suspect_name, crime_count
ORDER BY crime_count DESC
LIMIT $limit
"""

FIND_MOST_CONNECTED_SUSPECTS = """
MATCH (s:Suspect)-[r]-()
RETURN s.id AS suspect_id, s.name AS suspect_name, count(r) AS connections
ORDER BY connections DESC
LIMIT $limit
"""

GET_NETWORK_NODES_EDGES = """
MATCH path = (s:Suspect {id: $suspect_id})-[*1..2]-(connected)
UNWIND nodes(path) AS n
UNWIND relationships(path) AS r
RETURN collect(distinct n) AS nodes, collect(distinct r) AS edges
"""

GET_HIGH_RISK_NETWORK = """
MATCH path = (s:Suspect)-[r:INVOLVED_IN|ASSOCIATED_WITH|USED]-(connected)
WHERE s.risk_score >= 8.0 OR s.risk_score = 'High'
UNWIND nodes(path) AS n
UNWIND relationships(path) AS r
RETURN collect(distinct n) AS nodes, collect(distinct r) AS edges
"""
