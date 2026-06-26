"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Search, 
  Network, 
  User, 
  ShieldAlert, 
  Link2, 
  Phone, 
  Car, 
  FileText,
  AlertTriangle,
  Info,
  Sliders,
  ChevronRight,
  TrendingUp,
  Clock
} from "lucide-react";
import GraphNodeDetails from "@/components/GraphNodeDetails";
import NetworkGraph from "@/components/NetworkGraph";

// Dynamic Graph State using Neo4j
const API_BASE = "http://localhost:8000/api/v1";

function KnowledgeGraphContent() {
  const searchParams = useSearchParams();
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNode, setSelectedNode] = useState<any>(null);
  
  // Highlight mode
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<string[]>([]);
  const [nodeCoordinates, setNodeCoordinates] = useState<Record<string, {x: number, y: number}>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real graph data from Neo4j API
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE}/neo4j/high-risk-networks`);
        const data = await res.json();
        
        if (data.nodes && data.edges) {
          setNodes(data.nodes);
          setEdges(data.edges);
          
          // Generate circular layout
          const coords: Record<string, {x: number, y: number}> = {};
          const cx = 250;
          const cy = 175;
          const r = 120;
          data.nodes?.forEach((node: any, idx: number) => {
            const angle = (idx / data.nodes.length) * 2 * Math.PI;
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

  // Focus on URL node param if provided
  useEffect(() => {
    const focusParam = searchParams.get("focus");
    if (focusParam) {
      const decoded = decodeURIComponent(focusParam);
      const matchedNode = nodes.find(n => n.label.toLowerCase().includes(decoded.toLowerCase()));
      if (matchedNode) {
        handleNodeClick(matchedNode);
      }
    }
  }, [searchParams]);

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
    
    // Highlight neighbors
    const neighbors = edges
      ?.filter(e => e.source === node.id || e.target === node.id)
      ?.map(e => e.source === node.id ? e.target : e.source);
    
    setHighlightedNodeIds([node.id, ...neighbors]);
  };

  const resetSelection = () => {
    setSelectedNode(null);
    setHighlightedNodeIds([]);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const matchedNode = nodes.find(n => n.label.toLowerCase().includes(searchQuery.toLowerCase()));
    if (matchedNode) {
      handleNodeClick(matchedNode);
    } else {
      resetSelection();
    }
  };

  // Dynamic layout is handled in state nodeCoordinates

  // Node styles and edge styles moved to NetworkGraph component

  return (
    <DashboardLayout>
      <div className="space-y-6 h-full flex flex-col">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">Criminal Relationship Graph</h1>
            <p className="text-sm text-slate-400">Discovering multi-degree associations, shared assets, and common modus operandi</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-[10px] font-bold text-blue-400">
            <Network className="h-3.5 w-3.5 animate-pulse" />
            <span>NEO4J DATABASE ONLINE</span>
          </div>
        </div>

        {/* Search Toolbar */}
        <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Search suspect profile or node name (e.g. 'Vicky Saluja', 'Kariya Raja')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          
          <div className="flex gap-2 w-full sm:w-auto">
            {selectedNode && (
              <button
                onClick={resetSelection}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-400 rounded-xl transition-colors"
              >
                Clear Focus
              </button>
            )}
            <button className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-400 rounded-xl transition-colors">
              <Sliders className="h-4 w-4" />
              <span>Edge Weight</span>
            </button>
          </div>
        </div>

        {/* Main interactive panel */}
        <div className="flex-1 min-h-[500px] grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Node Constellation Map */}
          <div className="lg:col-span-8 bg-slate-950/40 border border-slate-800 rounded-2xl flex items-center justify-center p-6 relative overflow-hidden">
            
            {/* Network Graph Component */}
            <NetworkGraph 
              nodes={nodes}
              edges={edges}
              nodeCoordinates={nodeCoordinates}
              selectedNode={selectedNode}
              highlightedNodeIds={highlightedNodeIds}
              onNodeClick={handleNodeClick}
              className="w-full flex-1 flex items-center justify-center"
            />

            {/* Float Legends */}
            <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-850 p-3 rounded-xl text-[9px] space-y-1.5">
              <span className="font-bold text-slate-350 block uppercase">Node Dictionary</span>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-950 border border-blue-400" />
                  <span>Suspect Profile (Neo4j Node)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-950 border border-red-500" />
                  <span>Crime Incident (CCTNS Case)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-purple-950 border border-purple-400" />
                  <span>Phone Log (CDR Record)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-950 border border-amber-400" />
                  <span>Linked Vehicle (ANPR Sighting)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right panel: Node inspector */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Quick stats board */}
            <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-2">Network Parameters</h4>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Total Nodes</span>
                  <span className="text-sm font-bold text-slate-300">{nodes.length} nodes</span>
                </div>
                <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Modus Links</span>
                  <span className="text-sm font-bold text-slate-300">{edges.length} links</span>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-slate-900/40 border border-slate-800 p-5 rounded-2xl flex flex-col min-h-[300px]">
              <GraphNodeDetails 
                selectedNode={selectedNode} 
                edges={edges} 
                nodes={nodes} 
                onNodeClick={handleNodeClick} 
              />
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default function KnowledgeGraphPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-cyan-400 text-sm font-semibold">Loading Knowledge Graph…</div>
        </div>
      </DashboardLayout>
    }>
      <KnowledgeGraphContent />
    </Suspense>
  );
}
