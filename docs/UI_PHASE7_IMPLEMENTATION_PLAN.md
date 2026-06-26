# Phase 7A Implementation Plan: Advanced UI/UX Upgrade

## Objective
Execute the design documented in `UI_UX_DESIGN_V3.md`, transforming the application into a production-grade Intelligence Command Center. Eradicate all remaining mock data and hook up the UI strictly to existing robust backend APIs.

## Step 1: Base Configuration & Styling Upgrade
1. **Design System Injection**: Update `globals.css` and Tailwind config (if applicable) with the new V3 Command Center Dark Theme (`#0B1220`, `#111827`, etc.).
2. **Layout Overhaul**: Update `DashboardLayout.tsx` to match the "Command Navigation" shell. Integrate the persistent Intelligence Feed Ticker at the top/bottom.

## Step 2: Global Components Construction
1. Build `GlobalSearchBar.tsx` and integrate it into the top header. Wire it to a federated search API call.
2. Build `IntelligenceFeedTicker.tsx` and simulate WebSocket streaming with periodic API polling if websockets aren't active yet.
3. Build `ConfidenceMeter.tsx` and `ReasoningTracePanel.tsx` for the AI workspace.

## Step 3: Page Upgrades
1. **AI Assistant (`ai-assistant/page.tsx`)**:
   - Transition from simple chat to a multi-panel workspace.
   - Embed Map and Graph components dynamically based on LLM response metadata.
   - Connect the UI to the actual `/api/v1/chat` backend, ensuring the `reasoning_trace` and `sources` are rendered.
2. **Crime Map (`crime-map/page.tsx`)**:
   - Replace generic mapping logic with Mapbox GL / MapLibre.
   - Implement layers: Heatmaps, Incident points, Threat Pulse animations.
3. **Knowledge Graph (`knowledge-graph/page.tsx`)**:
   - Verify all `INITIAL_NODES` mocks are deleted.
   - Connect force-directed graph to `/api/v1/neo4j/high-risk-networks`.
   - Implement node expansion and slide-out `GraphNodeDetails.tsx`.
4. **Dashboard (`dashboard/page.tsx`)**:
   - Build Executive Command Center views (Threat Score widgets).
   - Hook up widgets to real PostgreSQL analytical endpoints.
   - Implement "Wall Mode" toggle for large displays.

## Step 4: Visual Hooks & Micro-Animations
1. Implement Framer Motion (or equivalent CSS transitions) for organic node expansion in the graph.
2. Implement CSS pulsing for high-risk Map points and Alert Center items.
3. Add AI "thinking" animations simulating graph traversal in the chat interface.

## Step 5: Verification
1. Run a complete UI audit via `scripts/verify_phase4.py` equivalents for frontend.
2. Ensure no hardcoded JSON/arrays remain in `src/app` or `src/components`.
3. Generate `docs/UI_VERIFICATION_REPORT.md` confirming API connectivity.

## Timeline
- **Days 1-2**: Styling, Layouts, and Global Components.
- **Days 3-4**: Page Upgrades (AI Workspace, Map, Graph).
- **Day 5**: Visual Hooks, Verification, and Clean-up.
