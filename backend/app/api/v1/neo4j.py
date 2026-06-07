from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, List
from app.db.neo4j import neo4j_conn
from app.ai.neo4j.intelligence import neo4j_intelligence
from pydantic import BaseModel
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

class CypherQuery(BaseModel):
    query: str

@router.get("/health")
def neo4j_health() -> Dict[str, Any]:
    health_status = neo4j_conn.check_health()
    if health_status.get("status") != "healthy":
        raise HTTPException(status_code=503, detail=health_status)
    return health_status

@router.get("/network/{suspect_id}")
def get_suspect_network(suspect_id: str):
    return neo4j_intelligence.get_suspect_network(suspect_id)

@router.get("/crime/{crime_id}")
def get_crime_network(crime_id: str):
    # Retrieve nodes/edges directly querying or add to intelligence
    return neo4j_intelligence.execute_query(
        f"MATCH path = (c:Crime {{id: '{crime_id}'}})-[*1..2]-(connected) UNWIND nodes(path) AS n UNWIND relationships(path) AS r RETURN collect(distinct n) AS nodes, collect(distinct r) AS edges"
    )

@router.get("/vehicle/{vehicle_number}")
def get_vehicle_network(vehicle_number: str):
    return neo4j_intelligence.find_crimes_by_vehicle(vehicle_number)

@router.get("/repeat-offenders")
def get_repeat_offenders():
    return neo4j_intelligence.find_repeat_offenders()

@router.get("/high-risk-networks")
def get_high_risk_networks():
    return neo4j_intelligence.get_high_risk_network()

@router.post("/query")
def execute_custom_query(payload: CypherQuery):
    try:
        return neo4j_intelligence.execute_query(payload.query)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
