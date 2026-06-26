# Phase 8: Predictive Crime Intelligence Architecture Plan

## 1. Overview
The objective of Phase 8 is to evolve the KCIA platform from a descriptive intelligence system (what happened) into a predictive intelligence engine (what will happen). 

This upgrade strictly adheres to the "No Rewrites" and "No Mocks" guidelines. Existing APIs, UI layouts, and databases are preserved and extended. All predictions are dynamically generated using historical data from PostgreSQL, structural topologies from Neo4j, and contextual similarities via pgvector/RAG.

## 2. New Backend Services (`backend/app/services/predictive/`)

### 2.1 Crime Forecaster (`crime_forecaster.py`)
- **Inputs**: Historical crime volumes aggregated by District and Crime Type over time (using PostgreSQL).
- **Logic**: Calculates trends (e.g., Simple Moving Average, exponential weighting) to forecast the next 30-day volume.
- **Explainability**: Returns statistical evidence supporting the trend (e.g., "75% increase in last quarter").

### 2.2 Hotspot Predictor (`hotspot_predictor.py`)
- **Inputs**: Historical crime coordinates (lat/long) grouped temporally and spatially.
- **Logic**: Identifies high-density clusters exhibiting recent volume acceleration to project emerging hotspots.
- **Explainability**: Returns boundary areas and rate of escalation.

### 2.3 Recidivism Engine (`recidivism.py`)
- **Inputs**: 
  - *PostgreSQL*: Historical crime count, severity, recency for a given suspect.
  - *Neo4j*: Degree centrality, known associates.
- **Logic**: Computes a weighted risk score determining the probability of reoffending.
- **Explainability**: Outputs the precise metrics driving the score (e.g., "Linked to 4 high-severity crimes", "Degree centrality > 5").

### 2.4 Network Growth Engine (`network_growth.py`)
- **Inputs**: Current graph topography from Neo4j (`Suspect`-`[KNOWS]`-`Suspect`).
- **Logic**: Evaluates community size and recent linkage acceleration to predict structural expansion.
- **Explainability**: Returns Cypher-derived evidence (e.g., "Added 3 associates in 14 days").

## 3. API Integrations (`backend/app/api/v1/predictive.py`)

A new API router will safely isolate the predictive endpoints:
- `GET /api/v1/predictive/forecast` (Crime forecasting)
- `GET /api/v1/predictive/hotspots` (Hotspot prediction)
- `GET /api/v1/predictive/offenders` (Recidivism)
- `GET /api/v1/predictive/networks` (Network growth)
- `POST /api/v1/predictive/briefing` (AI synthesis of predictions)

*The router will be added to `api.py` without modifying existing routes.*

## 4. Alert Engine Upgrade (`backend/app/services/alert_engine.py`)

A new method `_evaluate_predictive_alerts()` will be appended to the existing `AlertEngine` class. It will trigger internal calls to the new predictive services and insert rows into the `Alert` table with `type="Predictive"`, seamlessly integrating into the existing Alert Center UI.

## 5. Frontend Integration (`frontend/src/`)

### 5.1 New Page (`/predictive-intelligence`)
A dedicated command center utilizing the existing `DashboardLayout.tsx` and design system (lucide-react icons, dark theme, grid layouts).
- **Forecast Overview Widget**
- **Future Hotspots Widget**
- **Recidivism Intelligence Widget**
- **Network Growth Widget**
- **AI Briefing Panel**

### 5.2 Minor UI Upgrades
- `DashboardLayout.tsx`: Add "Predictive Intelligence" to the sidebar.
- `CrimeMap.tsx` (or equivalent map component): Safely extend properties to support an optional "Predictive Hotspots" overlay.

## 6. Constraints & Safety
- **No Mock Data**: If historical data is insufficient to form a prediction, the services will explicitly return `empty` or `low confidence` states rather than generating fake values.
- **Backward Compatibility**: No changes to existing PostgreSQL schemas or Neo4j data ingestion logic.
