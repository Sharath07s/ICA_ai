# KSP Crime Intelligence Assistant (KCIA)
# BACKEND_SCHEMA.md
Version: 1.0
Date: June 2026

---

# 1. Overview

This document defines the backend architecture, database schema, entity relationships, API structure, storage strategy, and data models for the KSP Crime Intelligence Assistant (KCIA).

The system is designed to support:

- 1100+ Police Stations
- 50M+ Crime Records
- Statewide Crime Intelligence
- Conversational AI
- Criminal Network Analysis
- Crime Hotspot Detection
- Predictive Analytics
- Explainable AI
- Audit Compliance

---

# 2. Backend Architecture

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
Business Services Layer
    │
    ├── User Service
    ├── Crime Service
    ├── Investigation Service
    ├── Analytics Service
    ├── AI Service
    ├── Report Service
    ├── Notification Service
    └── Audit Service
    │
    ▼
Data Access Layer
    │
    ├── PostgreSQL
    ├── Neo4j
    ├── Redis
    ├── Vector Database
    └── Object Storage
```

---

# 3. Database Strategy

| Database | Purpose |
|-----------|----------|
| PostgreSQL | Core transactional records |
| Neo4j | Criminal network analysis |
| Redis | Cache & session management |
| pgvector / Milvus | AI semantic search |
| Object Storage | PDFs & evidence files |

---

# 4. PostgreSQL Schema

---

# USERS MODULE

## users

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    badge_number VARCHAR(50) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    password_hash TEXT,
    role_id UUID,
    station_id UUID,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

---

## roles

```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP
);
```

---

## permissions

```sql
CREATE TABLE permissions (
    id UUID PRIMARY KEY,
    code VARCHAR(100),
    name VARCHAR(255),
    description TEXT
);
```

---

## role_permissions

```sql
CREATE TABLE role_permissions (
    role_id UUID,
    permission_id UUID
);
```

---

# LOCATION MODULE

## districts

```sql
CREATE TABLE districts (
    id UUID PRIMARY KEY,
    district_name VARCHAR(100),
    district_code VARCHAR(20)
);
```

---

## police_stations

```sql
CREATE TABLE police_stations (
    id UUID PRIMARY KEY,
    district_id UUID,
    station_name VARCHAR(255),
    station_code VARCHAR(50),
    latitude NUMERIC,
    longitude NUMERIC,
    address TEXT
);
```

---

# CRIME MODULE

## crime_types

```sql
CREATE TABLE crime_types (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    category VARCHAR(255),
    ipc_sections TEXT,
    severity_level INTEGER
);
```

---

## crimes

```sql
CREATE TABLE crimes (
    id UUID PRIMARY KEY,
    fir_number VARCHAR(100),
    crime_type_id UUID,
    station_id UUID,
    district_id UUID,

    title VARCHAR(500),
    description TEXT,

    occurrence_date TIMESTAMP,
    reported_date TIMESTAMP,

    latitude NUMERIC,
    longitude NUMERIC,

    status VARCHAR(100),

    created_by UUID,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

---

## crime_status_history

```sql
CREATE TABLE crime_status_history (
    id UUID PRIMARY KEY,
    crime_id UUID,
    previous_status VARCHAR(100),
    new_status VARCHAR(100),
    updated_by UUID,
    updated_at TIMESTAMP
);
```

---

# SUSPECTS MODULE

## suspects

```sql
CREATE TABLE suspects (
    id UUID PRIMARY KEY,

    full_name VARCHAR(255),

    alias_name VARCHAR(255),

    gender VARCHAR(20),

    age INTEGER,

    dob DATE,

    identification_number VARCHAR(100),

    risk_score NUMERIC,

    profile_photo_url TEXT,

    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

---

## suspect_crimes

```sql
CREATE TABLE suspect_crimes (
    suspect_id UUID,
    crime_id UUID,
    role VARCHAR(100)
);
```

---

# VICTIMS MODULE

## victims

```sql
CREATE TABLE victims (
    id UUID PRIMARY KEY,

    full_name VARCHAR(255),

    gender VARCHAR(20),

    age INTEGER,

    contact_number VARCHAR(20),

    address TEXT,

    created_at TIMESTAMP
);
```

---

## victim_crimes

```sql
CREATE TABLE victim_crimes (
    victim_id UUID,
    crime_id UUID
);
```

---

# VEHICLES MODULE

## vehicles

```sql
CREATE TABLE vehicles (
    id UUID PRIMARY KEY,

    registration_number VARCHAR(50),

    vehicle_type VARCHAR(100),

    manufacturer VARCHAR(100),

    model VARCHAR(100),

    owner_name VARCHAR(255),

    created_at TIMESTAMP
);
```

---

## crime_vehicles

```sql
CREATE TABLE crime_vehicles (
    crime_id UUID,
    vehicle_id UUID
);
```

---

# EVIDENCE MODULE

## evidence

```sql
CREATE TABLE evidence (
    id UUID PRIMARY KEY,

    crime_id UUID,

    evidence_type VARCHAR(100),

    file_name TEXT,

    file_url TEXT,

    uploaded_by UUID,

    uploaded_at TIMESTAMP
);
```

---

# INVESTIGATION MODULE

## investigations

```sql
CREATE TABLE investigations (
    id UUID PRIMARY KEY,

    crime_id UUID,

    assigned_officer UUID,

    priority VARCHAR(50),

    summary TEXT,

    status VARCHAR(100),

    started_at TIMESTAMP,

    completed_at TIMESTAMP
);
```

---

## investigation_notes

```sql
CREATE TABLE investigation_notes (
    id UUID PRIMARY KEY,

    investigation_id UUID,

    note TEXT,

    created_by UUID,

    created_at TIMESTAMP
);
```

---

# REPORTS MODULE

## reports

```sql
CREATE TABLE reports (
    id UUID PRIMARY KEY,

    title VARCHAR(255),

    report_type VARCHAR(100),

    generated_by UUID,

    file_url TEXT,

    generated_at TIMESTAMP
);
```

---

# AI MODULE

## ai_conversations

```sql
CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY,

    user_id UUID,

    session_name VARCHAR(255),

    started_at TIMESTAMP,

    ended_at TIMESTAMP
);
```

---

## ai_messages

```sql
CREATE TABLE ai_messages (
    id UUID PRIMARY KEY,

    conversation_id UUID,

    sender VARCHAR(50),

    message TEXT,

    created_at TIMESTAMP
);
```

---

## ai_query_logs

```sql
CREATE TABLE ai_query_logs (
    id UUID PRIMARY KEY,

    user_id UUID,

    query TEXT,

    generated_sql TEXT,

    execution_time_ms INTEGER,

    confidence_score NUMERIC,

    created_at TIMESTAMP
);
```

---

# PREDICTION MODULE

## crime_predictions

```sql
CREATE TABLE crime_predictions (
    id UUID PRIMARY KEY,

    district_id UUID,

    crime_type_id UUID,

    prediction_date DATE,

    predicted_count INTEGER,

    confidence_score NUMERIC,

    model_version VARCHAR(100),

    created_at TIMESTAMP
);
```

---

# HOTSPOT MODULE

## hotspot_analysis

```sql
CREATE TABLE hotspot_analysis (
    id UUID PRIMARY KEY,

    district_id UUID,

    crime_type_id UUID,

    hotspot_level VARCHAR(50),

    center_latitude NUMERIC,

    center_longitude NUMERIC,

    confidence_score NUMERIC,

    created_at TIMESTAMP
);
```

---

# AUDIT MODULE

## audit_logs

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,

    user_id UUID,

    action VARCHAR(255),

    module VARCHAR(255),

    resource_id UUID,

    metadata JSONB,

    ip_address VARCHAR(100),

    created_at TIMESTAMP
);
```

---

# NOTIFICATION MODULE

## notifications

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,

    user_id UUID,

    title VARCHAR(255),

    message TEXT,

    type VARCHAR(100),

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP
);
```

---

# 5. Neo4j Graph Schema

Purpose:

Criminal Network Analysis

---

# Nodes

```text
Person
Suspect
Victim
Crime
Vehicle
Phone
Address
Organization
Location
```

---

# Relationships

```text
KNOWS

CONTACTED

ASSOCIATED_WITH

PARTICIPATED_IN

USED

VISITED

RESIDES_AT

OWNS

RELATED_TO

WORKS_FOR
```

---

# Example Graph

```text
(Suspect A)
    │
CONTACTED
    │
(Suspect B)

(Suspect B)
    │
OWNS
    │
(Vehicle X)

(Vehicle X)
    │
USED_IN
    │
(Crime Y)
```

---

# 6. Vector Database Schema

Purpose:

RAG Search

Semantic Investigation Search

---

# Collection: crime_documents

```json
{
  "document_id": "uuid",
  "crime_id": "uuid",
  "content": "FIR text...",
  "embedding": [],
  "created_at": "timestamp"
}
```

---

# Collection: investigation_notes

```json
{
  "note_id": "uuid",
  "investigation_id": "uuid",
  "content": "Investigation notes...",
  "embedding": []
}
```

---

# Collection: witness_statements

```json
{
  "statement_id": "uuid",
  "crime_id": "uuid",
  "content": "Witness statement...",
  "embedding": []
}
```

---

# 7. Redis Schema

Purpose:

Caching

Rate Limiting

Session Storage

---

# Keys

```text
user_session:{id}

chat_context:{session_id}

otp:{phone}

rate_limit:{user_id}

dashboard_cache:{district}
```

---

# 8. File Storage Structure

```text
/storage

    /evidence

        /images

        /videos

        /documents

    /reports

        /pdf

    /exports

    /investigation-files
```

---

# 9. API Architecture

```text
/api/v1

    /auth

    /users

    /roles

    /crimes

    /suspects

    /victims

    /vehicles

    /investigations

    /analytics

    /hotspots

    /predictions

    /reports

    /chat

    /audit

    /notifications
```

---

# 10. AI Service Architecture

```text
AI Gateway

    │

    ├── Intent Detection

    ├── Query Planner

    ├── SQL Generator

    ├── Graph Query Generator

    ├── Retrieval Service

    ├── Response Generator

    └── Explainability Service
```

---

# 11. Event Architecture

Events:

```text
CrimeCreated

CrimeUpdated

SuspectAdded

InvestigationStarted

PredictionGenerated

HotspotDetected

ReportGenerated

UserLoggedIn

AIQueryExecuted
```

---

# 12. Security Requirements

Authentication

```text
OAuth2

JWT

Refresh Tokens

MFA
```

---

Authorization

```text
RBAC

ABAC (Future)
```

---

Encryption

```text
TLS 1.3

AES-256
```

---

# 13. Database Index Strategy

High Priority Indexes

```sql
crimes(fir_number)

crimes(crime_type_id)

crimes(district_id)

crimes(occurrence_date)

suspects(full_name)

vehicles(registration_number)

audit_logs(user_id)

ai_query_logs(user_id)
```

---

# 14. Scaling Strategy

PostgreSQL

```text
Read Replicas

Partitioning

Connection Pooling
```

---

Neo4j

```text
Cluster Mode

Read Replicas
```

---

Redis

```text
Redis Cluster
```

---

# 15. Data Retention Policy

```text
Audit Logs:
7 Years

AI Logs:
5 Years

Reports:
10 Years

Predictions:
3 Years

Hotspot Analysis:
3 Years
```

---

# 16. MVP Schema Scope

Included in Datathon MVP

✅ Users

✅ Roles

✅ Crimes

✅ Suspects

✅ Police Stations

✅ AI Conversations

✅ AI Query Logs

✅ Reports

✅ Hotspots

✅ Audit Logs

---

Future Releases

V2

- Real-Time Alerts
- Mobile Sync
- Evidence Intelligence

V3

- CCTV Metadata
- Facial Recognition Integration
- Interstate Crime Intelligence

---

END OF BACKEND_SCHEMA.md