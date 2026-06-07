import logging
from typing import Dict, List, Any
from app.db.neo4j import neo4j_conn
from app.ai.neo4j import cypher_queries as queries

logger = logging.getLogger(__name__)

class Neo4jIntelligenceService:
    def __init__(self):
        self.get_session = neo4j_conn.get_session

    def find_associates(self, suspect_id: str) -> List[Dict[str, Any]]:
        with self.get_session() as session:
            result = session.run(queries.FIND_ASSOCIATES, suspect_id=suspect_id)
            return [dict(record) for record in result]

    def find_shared_vehicles(self, suspect_id: str) -> List[Dict[str, Any]]:
        with self.get_session() as session:
            result = session.run(queries.FIND_SHARED_VEHICLES, suspect_id=suspect_id)
            return [dict(record) for record in result]

    def find_crimes_by_vehicle(self, vehicle_number: str) -> List[Dict[str, Any]]:
        with self.get_session() as session:
            result = session.run(queries.FIND_CRIMES_FOR_VEHICLE, vehicle_number=vehicle_number)
            return [dict(record) for record in result]

    def find_repeat_offenders(self, limit: int = 10) -> List[Dict[str, Any]]:
        with self.get_session() as session:
            result = session.run(queries.FIND_REPEAT_OFFENDERS, limit=limit)
            return [dict(record) for record in result]

    def get_suspect_network(self, suspect_id: str) -> Dict[str, Any]:
        with self.get_session() as session:
            result = session.run(queries.GET_NETWORK_NODES_EDGES, suspect_id=suspect_id)
            record = result.single()
            if not record:
                return {"nodes": [], "edges": []}
            return self._format_graph_data(record["nodes"], record["edges"])

    def get_high_risk_network(self) -> Dict[str, Any]:
        with self.get_session() as session:
            result = session.run(queries.GET_HIGH_RISK_NETWORK)
            record = result.single()
            if not record:
                return {"nodes": [], "edges": []}
            return self._format_graph_data(record["nodes"], record["edges"])

    def execute_query(self, query: str) -> List[Dict[str, Any]]:
        with self.get_session() as session:
            result = session.run(query)
            return [dict(record) for record in result]

    def _format_graph_data(self, nodes, edges) -> Dict[str, Any]:
        formatted_nodes = []
        formatted_edges = []
        
        for n in nodes:
            labels = list(n.labels)
            label = labels[0] if labels else "Unknown"
            
            # Map Neo4j node to D3/React Flow format
            formatted_nodes.append({
                "id": str(n.get("id", n.element_id)), # Use element_id as fallback if no id property
                "label": n.get("name") or n.get("fir_number") or n.get("reg_number") or f"{label}_{n.element_id}",
                "type": label.lower(),
                "risk": "High" if float(n.get("risk_score", 0)) > 7 else ("Medium" if float(n.get("risk_score", 0)) > 4 else "Low"),
                "rating": float(n.get("risk_score", 5.0)),
                "desc": n.get("title") or n.get("alias") or n.get("model") or f"{label} entity"
            })

        for r in edges:
            formatted_edges.append({
                "source": str(r.start_node.get("id", r.start_node.element_id)),
                "target": str(r.end_node.get("id", r.end_node.element_id)),
                "relation": r.type,
                "weight": r.get("weight") or r.get("role") or 80, # Dummy weight if not present
                "desc": f"{r.type} relation"
            })

        return {"nodes": formatted_nodes, "edges": formatted_edges}

neo4j_intelligence = Neo4jIntelligenceService()
