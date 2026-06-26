# UI Component Inventory - Phase 7A

## 1. Existing Components (To Be Upgraded)

### Pages (`src/app/`)
- `ai-assistant/page.tsx`: Upgrade to AI Intelligence Workspace with Evidence, Graph, Map, and Reasoning Trace panels.
- `crime-map/page.tsx`: Upgrade map provider to Mapbox GL / MapLibre. Implement heatmap layers, real-time feeds, and Dark Intelligence Mode.
- `dashboard/page.tsx`: Upgrade into Command Center Dashboard. Remove mock data. Add Live Crime Feed ticker and Threat Score widgets.
- `investigation-board/page.tsx`: Upgrade to case-centric investigation workspace. Integrate timelines and cross-referencing.
- `knowledge-graph/page.tsx`: Upgrade Neo4j visualization. Add node expansion, risk coloring, and cluster detection. Ensure ALL mocks are removed (as per Phase 4 report).
- `login/page.tsx`: Refine to Government-grade secure access look and feel.
- `reports/page.tsx`: Upgrade for multi-agency intelligence sharing exports.

### Components (`src/components/`)
- `DashboardLayout.tsx`: Upgrade to Command Navigation shell. Add Alert Center sidebar/drawer.
- `ui/button.tsx`: Existing base component.

## 2. Missing Components (To Be Built)

### Layout & Navigation
- `CommandCenterWall.tsx`: Dedicated Wall Mode view for large screens.
- `GlobalSearchBar.tsx`: Omni-bar for universal entity search.
- `IntelligenceFeedTicker.tsx`: Auto-scrolling ticker of real-time intelligence.

### AI Workspace
- `ReasoningTracePanel.tsx`: Explainable AI step-by-step logic.
- `SourceAttribution.tsx`: Link AI claims to FIRs/Graph.
- `ConfidenceMeter.tsx`: Visual score of AI reliability.

### Knowledge Graph
- `GraphNodeDetails.tsx`: Slide-out panel for deep dossier views when clicking a graph node.
- `GraphTimelineFilter.tsx`: Filter relationships by time.

### Analytics & Mapping
- `ThreatPulseIndicator.tsx`: Animated visual hook for high-risk zones.
- `MapHeatmapLayer.tsx`: Integration layer for Mapbox/MapLibre crime density.

### Domain Specific
- `CriminalDossier.tsx`: 360-degree suspect profile.
- `FIRWorkspace.tsx`: Document-centric view for semantic search results.
- `EvidenceLinker.tsx`: Component to manage physical/digital evidence.
