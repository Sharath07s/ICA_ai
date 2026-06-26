# Karnataka State Police Crime Intelligence Command Center (CICC)

# UI_UX_DESIGN_V3.md

Version: 3.0
Status: Production-Oriented
Date: June 2026

---

# 1. PRODUCT VISION
Create a next-generation Crime Intelligence Platform that enables investigators, analysts, officers, and command staff to discover, understand, predict, and act on crime intelligence through AI-powered analytics.
The platform must feel like a National Intelligence Platform and Palantir Gotham, not a CRUD Dashboard.

# 2. EXPERIENCE GOALS
Answer "What is happening now?", "Where is crime increasing?", "Who is most dangerous?", and "What actions should be taken?" in < 30 seconds using Natural Language + Visual Intelligence.

# 3. DESIGN PHILOSOPHY
- Intelligence First: Show actionable insights, not raw data.
- Explainable AI: Every AI response must display evidence, sources, confidence, related records, graph connections, and reasoning trace.
- Command Center Design: Deep dark themes, immersive data visualization.
- Visual Hooks: Use meaningful micro-animations to highlight increasing risk, expanding networks, and real-time intelligence flows.

# 4. DESIGN SYSTEM
**Theme:** Dark Command Center Theme
**Primary Colors:** Intelligence Navy (`#0B1220`), Police Blue (`#2563EB`), Success (`#10B981`), Warning (`#F59E0B`), Critical Alert (`#DC2626`), Intelligence Purple (`#7C3AED`).
**Surface Colors:** Primary Panel (`#111827`), Secondary Panel (`#1F2937`), Border (`#374151`).
**Typography:** Inter (Primary), Roboto (Secondary), Noto Sans Kannada.

# 5. APPLICATION LAYOUT
Layout Zones: Command Navigation, Main Investigation Workspace, Intelligence Feed, Alert Center.

---
*(Sections 6-21 inherited and upgraded from V2)*
---

# 22. USER ROLES & PERMISSIONS
Targeted workspaces based on RBAC:
- **Field Officer**: Mobile-first alert triage, basic queries.
- **Investigator**: Deep graph analysis, FIR workspace.
- **Intelligence Analyst**: Cross-jurisdiction network analytics, predictive modeling.
- **Executive/Command**: High-level KPIs, resource allocation, statewide threat assessment.

# 23. INVESTIGATION WORKSPACE
Case-centric analysis hub.
- Integrates case summaries, timeline, network map, geographical map, and AI Insights.
- AI Recommendations: Potential associates, related FIRs, similar cases.

# 24. FIR INTELLIGENCE WORKSPACE
Dedicated screen to deeply analyze a single FIR.
- Entity extraction highlights (Suspects, Locations, Vehicles).
- Similar FIRs clustered automatically.
- Semantic search across all uploaded FIR PDFs.

# 25. EVIDENCE INTELLIGENCE CENTER
Tracking physical and digital evidence linkages.
- Visualizing evidence chain of custody.
- Connecting seized devices/weapons to existing suspect networks.

# 26. TIMELINE INTELLIGENCE
Chronological visualization of suspect movements and crime events.
- Slider-based event chronologies.
- Sequence plotting to identify patterns in repeat offenses.

# 27. GLOBAL INTELLIGENCE SEARCH
A single, powerful Omni-bar for all entities.
- Instantly search Suspects, Vehicles, Phone Numbers, and FIRs simultaneously.
- Auto-complete with contextual risk indicators.

# 28. EXPLAINABLE AI PANEL
A dedicated slide-out or inline panel demystifying AI conclusions.
- **Reasoning Trace**: Step-by-step logic of how the LLM arrived at the answer.
- **Source Attribution**: Direct links to FIR PDFs or Database Rows.
- **Confidence Calibration**: Visual meters indicating the reliability of the insight.

# 29. COMMAND CENTER WALL MODE
Optimized for large Operations Center displays.
- High-contrast, large typography.
- Auto-rotating views (Statewide Threat -> Top Hotspots -> Active Critical Alerts).
- Live Crime Feed streaming ticker.

# 30. COMPLIANCE & AUDIT CENTER
System health and accountability oversight.
- Immutable audit logs of all queries and data access.
- RBAC compliance monitoring.

# 31. OFFICER WORKSPACE
Tailored for patrol units.
- Focus on beat zone alerts, immediate suspect lookups, and rapid intelligence retrieval in the field.

# 32. AI RECOMMENDATIONS ENGINE
Proactive intelligence generation.
- Pushes recommendations to users before they ask (e.g., "Network X is expanding in your district. Recommended action: Increase patrol in Zone A").

# 33. SYSTEM HEALTH DASHBOARD
Real-time monitoring of Neo4j, PostgreSQL, and LLM API availability and latency.

# 34. EMERGENCY RESPONSE CENTER
Centralized view for rapid response to critical, in-progress incidents. Focus on real-time location tracking and immediate resource allocation.

# 35. MULTI-AGENCY INTELLIGENCE SHARING
Secure workflows to export dossiers, network subgraphs, and intelligence briefs to external agencies (e.g., CBI, NIA) with redacted PII options.

# 36. INTELLIGENCE BRIEFING WORKSPACE
Automated generation of shift briefings and daily intelligence summaries for roll-call, compiled by the AI based on overnight activity.

---
# VISUAL HOOKS & REALISM UPGRADES
- **Live Crime Feed**: Auto-scrolling ticker of real-time incidents.
- **District Threat Pulse**: Soft glowing animations on map hotspots based on severity.
- **Network Expansion Animation**: Smooth, organic node reveal when expanding criminal networks in Neo4j.
- **AI Activity Indicator**: "Thinking" visualizations simulating data processing and graph traversal.

# END OF UI_UX_DESIGN_V3.md
