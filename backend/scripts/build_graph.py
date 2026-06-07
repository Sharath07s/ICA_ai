import sys
import os
import argparse
import logging
from sqlalchemy.orm import Session

# Add the parent directory to the path so we can import 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from app.db.neo4j import neo4j_conn
from app.models.crime import Crime, CrimeType
from app.models.entities import Suspect, SuspectCrime, Victim, VictimCrime, Vehicle, CrimeVehicle
from app.models.location import PoliceStation, District
from app.models.user import User

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def reset_graph(session):
    logger.info("Resetting Neo4j Graph...")
    session.run("MATCH (n) DETACH DELETE n")
    logger.info("Graph reset complete.")

def build_graph(pg_session: Session, neo4j_session):
    logger.info("Building Neo4j Graph from PostgreSQL...")

    # Fetch Data
    crimes = pg_session.query(Crime).all()
    suspects = pg_session.query(Suspect).all()
    victims = pg_session.query(Victim).all()
    vehicles = pg_session.query(Vehicle).all()
    stations = pg_session.query(PoliceStation).all()
    districts = pg_session.query(District).all()
    users = pg_session.query(User).all()

    # Create Nodes
    logger.info(f"Creating Nodes... (Crimes: {len(crimes)}, Suspects: {len(suspects)}, Vehicles: {len(vehicles)})")
    
    for district in districts:
        neo4j_session.run(
            "MERGE (d:District {id: $id}) SET d.name = $name",
            id=str(district.id), name=district.district_name
        )

    for station in stations:
        neo4j_session.run(
            "MERGE (s:PoliceStation {id: $id}) SET s.name = $name",
            id=str(station.id), name=station.station_name
        )
        if station.district_id:
            neo4j_session.run(
                """
                MATCH (s:PoliceStation {id: $sid})
                MATCH (d:District {id: $did})
                MERGE (s)-[:BELONGS_TO]->(d)
                """,
                sid=str(station.id), did=str(station.district_id)
            )

    for user in users:
        neo4j_session.run(
            "MERGE (u:Officer {id: $id}) SET u.name = $name",
            id=str(user.id), name=f"{user.first_name or ''} {user.last_name or ''}".strip()
        )

    for crime in crimes:
        neo4j_session.run(
            "MERGE (c:Crime {id: $id}) SET c.fir_number = $fir, c.title = $title, c.status = $status",
            id=str(crime.id), fir=crime.fir_number, title=crime.title, status=crime.status
        )
        if crime.station_id:
            neo4j_session.run(
                """
                MATCH (c:Crime {id: $cid})
                MATCH (s:PoliceStation {id: $sid})
                MERGE (c)-[:REGISTERED_AT]->(s)
                """,
                cid=str(crime.id), sid=str(crime.station_id)
            )
        if crime.district_id:
            neo4j_session.run(
                """
                MATCH (c:Crime {id: $cid})
                MATCH (d:District {id: $did})
                MERGE (c)-[:OCCURRED_AT]->(d)
                """,
                cid=str(crime.id), did=str(crime.district_id)
            )
        if crime.created_by:
            neo4j_session.run(
                """
                MATCH (c:Crime {id: $cid})
                MATCH (u:Officer {id: $uid})
                MERGE (c)-[:INVESTIGATED_BY]->(u)
                """,
                cid=str(crime.id), uid=str(crime.created_by)
            )

    for suspect in suspects:
        neo4j_session.run(
            "MERGE (s:Suspect {id: $id}) SET s.name = $name, s.alias = $alias, s.risk_score = $risk",
            id=str(suspect.id), name=suspect.full_name, alias=suspect.alias_name, risk=float(suspect.risk_score) if suspect.risk_score else 0.0
        )

    for vehicle in vehicles:
        neo4j_session.run(
            "MERGE (v:Vehicle {id: $id}) SET v.reg_number = $reg, v.model = $model",
            id=str(vehicle.id), reg=vehicle.registration_number, model=vehicle.model
        )

    for victim in victims:
        neo4j_session.run(
            "MERGE (v:Victim {id: $id}) SET v.name = $name",
            id=str(victim.id), name=victim.full_name
        )

    logger.info("Creating Relationships...")

    # Suspect-Crime
    suspect_crimes = pg_session.query(SuspectCrime).all()
    for sc in suspect_crimes:
        neo4j_session.run(
            """
            MATCH (s:Suspect {id: $sid})
            MATCH (c:Crime {id: $cid})
            MERGE (s)-[:INVOLVED_IN {role: $role}]->(c)
            """,
            sid=str(sc.suspect_id), cid=str(sc.crime_id), role=sc.role or 'Unknown'
        )

    # Crime-Vehicle
    crime_vehicles = pg_session.query(CrimeVehicle).all()
    for cv in crime_vehicles:
        neo4j_session.run(
            """
            MATCH (c:Crime {id: $cid})
            MATCH (v:Vehicle {id: $vid})
            MERGE (c)-[:INVOLVES]->(v)
            WITH c, v
            OPTIONAL MATCH (s:Suspect)-[:INVOLVED_IN]->(c)
            FOREACH (x IN CASE WHEN s IS NOT NULL THEN [1] ELSE [] END |
                MERGE (s)-[:USED]->(v)
            )
            """,
            cid=str(cv.crime_id), vid=str(cv.vehicle_id)
        )

    # Victim-Crime
    victim_crimes = pg_session.query(VictimCrime).all()
    for vc in victim_crimes:
        neo4j_session.run(
            """
            MATCH (v:Victim {id: $vid})
            MATCH (c:Crime {id: $cid})
            MERGE (v)-[:VICTIM_OF]->(c)
            """,
            vid=str(vc.victim_id), cid=str(vc.crime_id)
        )

    # Derive Suspect-Suspect associations from shared crimes
    logger.info("Deriving Suspect-Suspect Associations...")
    neo4j_session.run(
        """
        MATCH (s1:Suspect)-[:INVOLVED_IN]->(c:Crime)<-[:INVOLVED_IN]-(s2:Suspect)
        WHERE s1.id < s2.id
        MERGE (s1)-[:ASSOCIATED_WITH]->(s2)
        """
    )

    logger.info("Graph Building Complete!")

def verify_graph(neo4j_session):
    nodes = neo4j_session.run("MATCH (n) RETURN count(n) as c").single()["c"]
    rels = neo4j_session.run("MATCH ()-[r]->() RETURN count(r) as c").single()["c"]
    
    labels = neo4j_session.run("MATCH (n) RETURN labels(n)[0] as label, count(n) as count")
    rel_types = neo4j_session.run("MATCH ()-[r]->() RETURN type(r) as type, count(r) as count")

    print("\n" + "="*30)
    print("NEO4J GRAPH VERIFICATION")
    print("="*30)
    print(f"Total Nodes: {nodes}")
    print(f"Total Relationships: {rels}\n")
    
    print("Nodes by Label:")
    for record in labels:
        print(f" - {record['label']}: {record['count']}")
        
    print("\nRelationships by Type:")
    for record in rel_types:
        print(f" - {record['type']}: {record['count']}")
    print("="*30 + "\n")

def main():
    parser = argparse.ArgumentParser(description="Build Neo4j graph from PostgreSQL")
    parser.add_argument("--reset", action="store_true", help="Clear the Neo4j graph before building")
    parser.add_argument("--verify", action="store_true", help="Verify node and relationship counts")
    args = parser.parse_args()

    pg_session = SessionLocal()
    neo4j_session = neo4j_conn.get_session()

    if not neo4j_session:
        logger.error("Could not connect to Neo4j. Check settings and ensure the service is running.")
        sys.exit(1)

    try:
        if args.reset:
            reset_graph(neo4j_session)
        
        if not args.verify or args.reset:
            build_graph(pg_session, neo4j_session)

        if args.verify:
            verify_graph(neo4j_session)

    finally:
        pg_session.close()
        neo4j_session.close()

if __name__ == "__main__":
    main()
