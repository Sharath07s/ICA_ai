# Phase 7B UI Implementation Plan
**Karnataka Crime Intelligence Assistant (KCIA)**

This document details the implementation plan for transforming the KCIA platform into a comprehensive Police Intelligence Operating System, as specified in `UI_UX_DESIGN_V4_PHASE7B.md`.

> **Note on Strategy:** To maximize Datathon impact with minimum development time, we prioritize high-visibility intelligence visualizations (Investigation, FIR, Timeline, Executive) and mock or proxy the backend endpoints where full integration (e.g., streaming websockets for Command Wall) is too heavy for a rapid sprint.

---

## Sprint 1: Investigation Workspace
**Goal:** Deliver a unified, case-centric environment combining timeline, network, and geographical intelligence with an AI Copilot.

- **Files to Create:**
  - `src/app/investigation/page.tsx`
  - `src/components/Investigation/CaseSummary.tsx`
  - `src/components/Investigation/AICopilot.tsx`
  - `src/components/Investigation/EvidenceIntel.tsx`
- **Files to Modify:**
  - `src/components/DashboardLayout.tsx` (Add navigation)
  - `src/app/knowledge-graph/page.tsx` (Refactor to allow embedding within investigation)
- **Backend APIs Needed:**
  - `GET /api/v1/investigations/:id`
  - `POST /api/v1/ai/investigation-copilot`
- **Frontend Components Needed:**
  - CaseSummaryCard
  - AICopilotPanel
  - InvestigationActions (Assign, Export, Alert)
- **Estimated Effort:** 3 Days
- **Dependencies:** Base UI (Phase 7A), Neo4j Graph API

---

## Sprint 2: FIR Intelligence Workspace
**Goal:** Transform static FIRs into searchable, explainable, and linked intelligence assets.

- **Files to Create:**
  - `src/app/fir/[id]/page.tsx`
  - `src/components/FIR/FIRHeader.tsx`
  - `src/components/FIR/AISummary.tsx`
  - `src/components/FIR/ExtractedEntities.tsx`
  - `src/components/FIR/SimilarFIRs.tsx`
- **Files to Modify:**
  - `src/app/dashboard/page.tsx` (Link FIR table rows to FIR workspace)
- **Backend APIs Needed:**
  - `GET /api/v1/firs/:id`
  - `GET /api/v1/firs/:id/entities`
  - `GET /api/v1/firs/:id/similar` (Powered by PGVector RAG)
- **Frontend Components Needed:**
  - AISummaryPanel
  - EntityTagCloud
  - SimilarFIRsList
- **Estimated Effort:** 3 Days
- **Dependencies:** Investigation Workspace, PGVector Embeddings

---

## Sprint 3: Timeline Intelligence
**Goal:** Provide an interactive chronological visualization of suspect movements, networks, and crimes.

- **Files to Create:**
  - `src/app/timeline/page.tsx`
  - `src/components/Timeline/HorizontalTimeline.tsx`
  - `src/components/Timeline/EventNode.tsx`
  - `src/components/Timeline/TimelineFilters.tsx`
- **Files to Modify:**
  - `src/app/investigation/page.tsx` (Embed timeline)
- **Backend APIs Needed:**
  - `GET /api/v1/timeline/entity/:id`
- **Frontend Components Needed:**
  - Interactive Slider
  - Event Detail Tooltip
  - Timeline Filter Bar
- **Estimated Effort:** 2 Days
- **Dependencies:** FIR Intelligence Workspace

---

## Sprint 4: Executive Dashboard
**Goal:** Provide statewide intelligence awareness for SP, DCP, and State Command staff.

- **Files to Create:**
  - `src/app/executive/page.tsx`
  - `src/components/Executive/ThreatLevelIndicator.tsx`
  - `src/components/Executive/DistrictRankingTable.tsx`
  - `src/components/Executive/ExecutiveInsights.tsx`
- **Files to Modify:**
  - `src/components/DashboardLayout.tsx` (Add role-based navigation)
- **Backend APIs Needed:**
  - `GET /api/v1/analytics/state-threat`
  - `GET /api/v1/analytics/district-rankings`
  - `GET /api/v1/ai/executive-briefing`
- **Frontend Components Needed:**
  - Threat Dial/Gauge (LOW to CRITICAL)
  - KPI Cards
  - AI Briefing Text Block
- **Estimated Effort:** 2 Days
- **Dependencies:** None

---

## Sprint 5: Alert Center
**Goal:** Provide real-time intelligence notifications and an actionable workflow.

- **Files to Create:**
  - `src/app/alerts/page.tsx`
  - `src/components/Alerts/AlertFeed.tsx`
  - `src/components/Alerts/AlertDetailPanel.tsx`
- **Files to Modify:**
  - `src/components/DashboardLayout.tsx` (Add notification badge)
- **Backend APIs Needed:**
  - `GET /api/v1/alerts`
  - `PATCH /api/v1/alerts/:id/status`
- **Frontend Components Needed:**
  - Severity Badges (Critical, High, Medium, Low)
  - Alert Workflow Action Buttons (Assign, Escalate, Resolve)
- **Estimated Effort:** 2 Days
- **Dependencies:** None

---

## Sprint 6: Officer Workspace
**Goal:** Provide a personalized environment for patrol units and field officers.

- **Files to Create:**
  - `src/app/officer/page.tsx`
  - `src/components/Officer/TaskBoard.tsx`
  - `src/components/Officer/SavedIntelligence.tsx`
  - `src/components/Officer/ActivityFeed.tsx`
- **Files to Modify:**
  - `src/components/DashboardLayout.tsx`
- **Backend APIs Needed:**
  - `GET /api/v1/officer/tasks`
  - `GET /api/v1/officer/bookmarks`
  - `GET /api/v1/officer/activity`
- **Frontend Components Needed:**
  - Kanban Task Board
  - Bookmark List
  - Activity Timeline
- **Estimated Effort:** 3 Days
- **Dependencies:** Alert Center

---

## Sprint 7: Command Wall
**Goal:** Deliver a high-contrast, large-typography auto-rotating view for operations centers.

- **Files to Create:**
  - `src/app/command-wall/page.tsx`
  - `src/components/CommandWall/AutoRefresher.tsx`
  - `src/components/CommandWall/FullscreenContainer.tsx`
- **Files to Modify:**
  - `src/app/globals.css` (High-contrast utility classes)
- **Backend APIs Needed:**
  - `GET /api/v1/stream/live-crime` (SSE/Websocket or fast polling)
- **Frontend Components Needed:**
  - Large Typography Widgets
  - Rotating View Container (State Threat -> Hotspots -> Alerts)
- **Estimated Effort:** 2 Days
- **Dependencies:** Executive Dashboard, Crime Map (Phase 7A)

---

## Sprint 8: System Health Center
**Goal:** Operational transparency regarding API and database (Neo4j, Postgres, LLM) status.

- **Files to Create:**
  - `src/app/system-health/page.tsx`
  - `src/components/SystemHealth/ServiceStatus.tsx`
  - `src/components/SystemHealth/MetricsChart.tsx`
- **Files to Modify:**
  - `src/components/DashboardLayout.tsx` (Footer or Settings link)
- **Backend APIs Needed:**
  - `GET /api/v1/health`
- **Frontend Components Needed:**
  - Traffic Light Indicators (Online, Warning, Offline)
  - Sparkline latency charts
- **Estimated Effort:** 1 Day
- **Dependencies:** None
