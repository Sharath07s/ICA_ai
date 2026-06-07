# KSP Crime Intelligence Assistant (KCIA)

# Technical Requirements Document (TRD)

Version: 1.0
Status: Draft
Date: June 2026

---

# Technical Overview

The KCIA platform is a distributed intelligence system designed to provide conversational access to statewide crime data while supporting analytics, graph intelligence, geospatial intelligence, and predictive intelligence.

The architecture follows a modular service-oriented design with AI-first workflows.

---

# System Architecture

```text
Frontend
   │
   ▼
API Gateway
   │
   ▼
Authentication Service
   │
   ▼
Backend Services
   │
   ├── Crime Service
   ├── User Service
   ├── Analytics Service
   ├── Report Service
   ├── Audit Service
   └── AI Service
   │
   ▼
Data Layer
   │
   ├── PostgreSQL
   ├── Neo4j
   ├── Redis
   ├── pgvector
   └── Object Storage
```

---

# Technology Stack

## Frontend

```text
Next.js
React
TypeScript
TailwindCSS
ShadCN
```

---

## Backend

```text
FastAPI
Python 3.12
SQLAlchemy
Alembic
```

---

## AI

```text
Qwen 3
Llama 3
LangGraph
LangChain
Sentence Transformers
```

---

## Databases

### Relational

```text
PostgreSQL
```

### Graph

```text
Neo4j
```

### Cache

```text
Redis
```

### Vector

```text
pgvector
```

---

## GIS

```text
PostGIS
Leaflet
GeoPandas
```

---

# Service Architecture

## Authentication Service

Responsibilities:

- Login
- Token generation
- Role validation
- Session management

---

## User Service

Responsibilities:

- User management
- Role management
- Permissions

---

## Crime Service

Responsibilities:

- FIR management
- Crime records
- Search
- Filtering

---

## AI Service

Responsibilities:

- Intent detection
- Query planning
- Retrieval
- Response generation

---

## Analytics Service

Responsibilities:

- Trends
- Hotspots
- Predictions
- Demographic analysis

---

## Report Service

Responsibilities:

- PDF generation
- Report exports

---

## Audit Service

Responsibilities:

- User activity tracking
- Compliance logging

---

# Data Architecture

## PostgreSQL

Stores:

- Users
- Crimes
- Investigations
- Reports
- Audit Logs

---

## Neo4j

Stores:

- Criminal networks
- Relationships
- Association graphs

---

## Vector Database

Stores:

- FIR embeddings
- Case summaries
- Investigation notes

---

# AI Architecture

## Layer 1

Intent Detection

Input:

```text
Show theft hotspots in Mysuru
```

Output:

```json
{
  "intent":"hotspot_analysis",
  "crime_type":"theft",
  "district":"mysuru"
}
```

---

## Layer 2

Query Planner

Determines:

- SQL query
- Graph query
- Analytics workflow

---

## Layer 3

Retrieval Layer

Sources:

- PostgreSQL
- Neo4j
- Vector Search

---

## Layer 4

Reasoning Layer

Uses:

- Retrieved evidence
- Historical analytics
- Context memory

---

## Layer 5

Response Generator

Produces:

- Answer
- Confidence
- Explanation
- Visual references

---

# RAG Pipeline

```text
User Query
      │
      ▼
Embedding Model
      │
      ▼
Vector Search
      │
      ▼
Relevant Records
      │
      ▼
LLM Reasoning
      │
      ▼
Response
```

---

# Criminal Network Architecture

## Nodes

- Suspect
- Victim
- Crime
- Vehicle
- Phone
- Address
- Organization

---

## Relationships

- KNOWS
- CONTACTED
- ASSOCIATED_WITH
- USED
- VISITED
- OWNS

---

# Hotspot Detection Architecture

Input:

- Latitude
- Longitude
- Crime Type
- Time

Processing:

- Spatial clustering
- Heatmap generation
- Risk scoring

Output:

- Heatmap
- Cluster map
- Alert

---

# Prediction Engine

Models:

```text
XGBoost
LightGBM
Prophet
```

Features:

```text
Crime History
Seasonality
Population Density
District Statistics
```

Outputs:

```text
Forecast
Risk Score
Confidence
```

---

# Security Architecture

## Authentication

```text
OAuth2
JWT
MFA
```

---

## Authorization

```text
RBAC
```

---

## Encryption

At Rest:

AES-256

In Transit:

TLS 1.3

---

# Logging & Monitoring

## Logging

```text
ELK Stack
```

---

## Monitoring

```text
Prometheus
Grafana
```

---

# Deployment Architecture

## Containers

```text
Docker
```

---

## Orchestration

```text
Kubernetes
```

---

## CI/CD

```text
GitHub Actions
ArgoCD
```

---

# Performance Targets

| Metric | Target |
|----------|----------|
| API Response | < 2 sec |
| AI Response | < 5 sec |
| Search | < 2 sec |
| Availability | 99.9% |
| Concurrent Users | 10,000+ |

---

# MVP Technical Scope

Included:

- FastAPI Backend
- PostgreSQL
- Neo4j
- AI Chat
- RAG Search
- Crime Search
- Network Graph
- Hotspot Analysis
- PDF Reports
- RBAC
- Audit Logs

---

# Production Roadmap

## V2

- Voice Assistant
- Forecasting Models
- Mobile Support

## V3

- Real-Time Intelligence
- CCTNS Integration
- Multi-Agent AI

## V4

- Evidence Intelligence
- Multimodal AI
- Cross-State Intelligence

---

# Technical Vision Statement

KCIA will evolve into a secure, scalable, explainable AI-driven intelligence platform capable of serving the operational, investigative, and strategic needs of Karnataka State Police while supporting tens of millions of crime records and statewide intelligence workflows.

