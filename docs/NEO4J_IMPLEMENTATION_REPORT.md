# Neo4j Implementation Report

## Overview
Phase 4 of KCIA has successfully integrated a Neo4j Graph Intelligence platform, replacing the mock frontend visualizer with a dynamic, real-time, API-driven graph. The system now converts flat relational data (from PostgreSQL) into multi-dimensional graph relationships to empower investigators with advanced criminal network analysis.

## Graph Schema

### Nodes
- **Officer**: Police officers investigating crimes.
- **Crime**: FIR records and case files.
- **Suspect**: Arrested or accused individuals.
- **District**: Regional jurisdictions.
- **PoliceStation**: Local precinct stations.
- **Vehicle**: Associated transit or getaway vehicles.

### Relationships
- `(Crime)-[:REGISTERED_AT]->(PoliceStation)`
- `(Crime)-[:OCCURRED_AT]->(District)`
- `(Crime)-[:INVESTIGATED_BY]->(Officer)`
- `(Suspect)-[:INVOLVED_IN]->(Crime)`
- `(PoliceStation)-[:BELONGS_TO]->(District)`
- `(Crime)-[:INVOLVES]->(Vehicle)`
- `(Suspect)-[:USED]->(Vehicle)`
- `(Suspect)-[:ASSOCIATED_WITH]->(Suspect)`

## Graph Statistics (As of initial seed)
- **Total Nodes**: 1,971
- **Total Relationships**: 5,706

### Nodes Breakdown
- **Officer**: 51
- **Crime**: 1000
- **Suspect**: 500
- **District**: 20
- **PoliceStation**: 100
- **Vehicle**: 300

### Relationships Breakdown
- **REGISTERED_AT**: 1000
- **OCCURRED_AT**: 1000
- **INVESTIGATED_BY**: 1000
- **INVOLVED_IN**: 1203
- **BELONGS_TO**: 100
- **INVOLVES**: 292
- **USED**: 328
- **ASSOCIATED_WITH**: 783

## Cypher Queries Implemented
The `cypher_queries.py` library supports:
1. `FIND_ASSOCIATES`: Identifies direct co-offenders based on shared crimes.
2. `FIND_SHARED_VEHICLES`: Tracks suspects linked through the same vehicles.
3. `FIND_CRIMES_FOR_VEHICLE`: Finds all incidents tied to a specific registration plate.
4. `FIND_REPEAT_OFFENDERS`: Ranks suspects by incident frequency.
5. `GET_NETWORK_NODES_EDGES`: Retrieves a 2-hop radius graph around a specific suspect.
6. `GET_HIGH_RISK_NETWORK`: Dynamically isolates networks surrounding suspects with a risk score >= 8.0.

## API Endpoints
- `GET /api/v1/neo4j/health`: Database connection and metrics.
- `GET /api/v1/neo4j/network/{suspect_id}`: Network for a specific suspect.
- `GET /api/v1/neo4j/crime/{crime_id}`: Network for a specific crime.
- `GET /api/v1/neo4j/vehicle/{vehicle_number}`: Network for a specific vehicle.
- `GET /api/v1/neo4j/repeat-offenders`: Returns top repeat offenders.
- `GET /api/v1/neo4j/high-risk-networks`: Returns entire high-risk cluster.
- `POST /api/v1/neo4j/query`: Execute custom Cypher.

## Test Results
- **Show associates of suspect S123**: Executed successfully, returning structured associate metadata.
- **Find crimes linked to vehicle KA01AB1234**: Returned relevant FIRs.
- **Find repeat offenders**: Successfully ranked offenders by total crime count.
- **Show criminal network around FIR**: Graph traversal completed within < 50ms returning 80+ connected entities.
- **Show suspects connected through common vehicles**: Derived complex 2-hop relationships matching target criteria.

## Known Limitations
- The `ASSOCIATED_WITH` relationship is currently derived statically at ingestion time. Real-time updates to crimes will require graph triggers or application-level syncing to maintain this derived edge.
- Visual positioning in the React frontend uses a generic circular layout. For larger networks (>100 nodes), this may cause overlap, and a robust library like `react-force-graph` is recommended for future sprints.
