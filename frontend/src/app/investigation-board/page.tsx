"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import CaseSummary from "@/components/Investigation/CaseSummary";
import AICopilot from "@/components/Investigation/AICopilot";
import EvidenceIntel from "@/components/Investigation/EvidenceIntel";
import NetworkGraph from "@/components/NetworkGraph";
import CaseTimeline from "@/components/Investigation/CaseTimeline";
import CaseMapPanel from "@/components/Investigation/CaseMapPanel";
import InvestigationActionsPanel from "@/components/Investigation/InvestigationActionsPanel";
import ThreatAssessmentPanel from "@/components/Investigation/ThreatAssessmentPanel";
import InvestigationAuditTrail from "@/components/Investigation/InvestigationAuditTrail";
import InvestigationHealthPanel from "@/components/Investigation/InvestigationHealthPanel";

const MOCK_CASE = {
  id: "INV-2026-8812",
  firNumber: "BLR-FIR-2026-0412",
  crimeType: "Cyber-Physical Theft",
  district: "Bengaluru City",
  station: "Indiranagar PS",
  investigator: "Insp. Vikram Rao",
  status: "ACTIVE INVESTIGATION",
  priority: "CRITICAL" as const,
  riskLevel: "HIGH THREAT",
  dateOpened: "06 JUN 2026 04:15 HRS",
  dateUpdated: "17 JUN 2026 14:30 HRS"
};

const API_BASE = "http://localhost:8000/api/v1";

export default function InvestigationBoardPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [nodeCoordinates, setNodeCoordinates] = useState<Record<string, {x: number, y: number}>>({});
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE}/neo4j/high-risk-networks`);
        const data = await res.json();
        
        if (data.nodes && data.edges) {
          const subNodes = data.nodes.slice(0, 8);
          const subNodeIds = subNodes?.map((n: any) => n.id);
          const subEdges = data.edges?.filter((e: any) => subNodeIds.includes(e.source) && subNodeIds.includes(e.target));

          setNodes(subNodes);
          setEdges(subEdges);
          
          const coords: Record<string, {x: number, y: number}> = {};
          const cx = 250;
          const cy = 175;
          const r = 100;
          subNodes?.forEach((node: any, idx: number) => {
            const angle = (idx / subNodes.length) * 2 * Math.PI;
            coords[node.id] = {
              x: cx + r * Math.cos(angle),
              y: cy + r * Math.sin(angle)
            };
          });
          setNodeCoordinates(coords);
        }
      } catch (err) {
        console.warn("Failed to fetch knowledge graph", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGraphData();
  }, []);

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
    const neighbors = edges
      ?.filter(e => e.source === node.id || e.target === node.id)
      ?.map(e => e.source === node.id ? e.target : e.source);
    setHighlightedNodeIds([node.id, ...neighbors]);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">Investigation Workspace</h1>
            <p className="text-sm text-slate-400">Comprehensive case context, AI analysis, and intelligence mapping.</p>
          </div>
          <div className="flex gap-3 h-24">
            <InvestigationActionsPanel investigationId={MOCK_CASE.id} />
          </div>
        </div>

        <CaseSummary caseData={MOCK_CASE} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: AI Copilot & Threat */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="h-[450px]">
              <AICopilot />
            </div>
            <div className="h-[350px]">
              <ThreatAssessmentPanel investigationId={MOCK_CASE.id} />
            </div>
            <div className="flex-1">
              <InvestigationHealthPanel investigationId={MOCK_CASE.id} />
            </div>
          </div>

          {/* Center Column: Timeline & Evidence */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="h-[500px]">
              <CaseTimeline investigationId={MOCK_CASE.id} />
            </div>
            <div className="h-[300px]">
              <EvidenceIntel />
            </div>
          </div>

          {/* Right Column: Geographic & Network Intelligence */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="h-[400px]">
              <CaseMapPanel investigationId={MOCK_CASE.id} />
            </div>
            
            <div className="h-[400px] bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                <h3 className="text-sm font-bold text-white tracking-wide">Network Intelligence</h3>
                {isLoading && <span className="text-[10px] text-blue-400 animate-pulse uppercase tracking-widest font-bold">Syncing...</span>}
              </div>
              <div className="flex-1 p-2 bg-slate-950/20 relative">
                {!isLoading && nodes.length > 0 ? (
                  <NetworkGraph 
                    nodes={nodes}
                    edges={edges}
                    nodeCoordinates={nodeCoordinates}
                    selectedNode={selectedNode}
                    highlightedNodeIds={highlightedNodeIds}
                    onNodeClick={handleNodeClick}
                    className="h-full w-full"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500 font-semibold">
                    Initializing local graph...
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 min-h-[250px]">
              <InvestigationAuditTrail investigationId={MOCK_CASE.id} />
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
