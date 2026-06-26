# UI Dataflow Architecture - Phase 7A

## Overview
This document maps how data flows from the backend APIs (PostgreSQL, Neo4j, RAG LLM) to the newly upgraded V3 frontend components, ensuring all mock data is eradicated and the system operates dynamically.

## 1. Authentication Flow
**Source**: `POST /api/v1/auth/login`
**Flow**:
1. User enters credentials.
2. Next.js calls Auth Service (`src/services/auth.service.ts`).
3. Backend issues JWT token.
4. Token stored securely in Zustand store (`src/store/authStore.ts`) and HTTP-only cookies.
5. Role-Based Access Control (RBAC) determines accessible workspaces (e.g., Executive vs. Field Officer).

## 2. Global Intelligence Search Flow
**Source**: `GET /api/v1/search?q={query}`
**Flow**:
1. User types in `GlobalSearchBar.tsx`.
2. Backend federates search across PostgreSQL (FIRs, Suspects, Vehicles) and Neo4j nodes.
3. Debounced results render instantly with entity-type icons.

## 3. AI Intelligence Workspace Flow
**Source**: `POST /api/v1/chat`
**Flow**:
1. User submits query in `ai-assistant/page.tsx`.
2. Backend Intent Engine routes query to either:
   - **RAG Pipeline**: Retrieves FIR chunks from `pgvector`.
   - **Graph Engine**: Queries Neo4j for network data.
3. LLM synthesizes response.
4. Frontend receives structured JSON payload containing:
   - `summary` (Text)
   - `reasoning_trace` (Array of steps -> feeds `ReasoningTracePanel.tsx`)
   - `confidence_score` (Float -> feeds `ConfidenceMeter.tsx`)
   - `sources` (Array -> feeds `SourceAttribution.tsx` and PDF Viewer)
   - `graph_context` (GraphData -> feeds embedded Knowledge Graph panel).

## 4. Knowledge Graph Flow
**Source**: `GET /api/v1/neo4j/{endpoint}`
**Flow**:
1. `knowledge-graph/page.tsx` mounts.
2. Calls endpoint (e.g., `/high-risk-networks` or `/repeat-offenders`).
3. D3/React-Force-Graph library maps `nodes` and `links` arrays to visual canvas.
4. On node click -> fetch node details from PostgreSQL (`GET /api/v1/suspects/{id}`) -> renders `GraphNodeDetails.tsx` drawer.

## 5. Map & Hotspot Flow
**Source**: `GET /api/v1/analytics/hotspots` and `GET /api/v1/crimes/live`
**Flow**:
1. `crime-map/page.tsx` loads Mapbox/MapLibre canvas.
2. GeoJSON payload fetched from PostGIS backend.
3. Renders `MapHeatmapLayer.tsx`.
4. WebSockets or Server-Sent Events (SSE) push live crime updates to trigger `ThreatPulseIndicator.tsx` animations.

## 6. Real-Time Alert Ticker Flow
**Source**: WebSocket / SSE `/api/v1/alerts/stream`
**Flow**:
1. Connection established on app load.
2. Backend streams critical events (e.g., crime spikes).
3. `IntelligenceFeedTicker.tsx` updates UI without page reload.
