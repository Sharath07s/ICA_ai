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
          data.nodes.forEach((node: any, idx: number) => {
            const angle = (idx / data.nodes.length) * 2 * Math.PI;
            coords[node.id] = {
              x: cx + r * Math.cos(angle),
              y: cy + r * Math.sin(angle)
            };
          });
          setNodeCoordinates(coords);
        }
      } catch (err) {
        console.error("Failed to fetch knowledge graph", err);
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
      .filter(e => e.source === node.id || e.target === node.id)
      .map(e => e.source === node.id ? e.target : e.source);
    
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

  // Node styles
  const getNodeColorClass = (type: string, isHighlighted: boolean, isSelected: boolean) => {
    if (highlightedNodeIds.length > 0 && !isHighlighted) {
      return "fill-slate-900 stroke-slate-800 opacity-20";
    }

    let fill = "";
    let stroke = "";
    
    switch (type) {
      case "suspect":
        fill = "fill-blue-900/60";
        stroke = "stroke-blue-400";
        break;
      case "crime":
        fill = "fill-red-900/60";
        stroke = "stroke-red-500";
        break;
      case "phone":
        fill = "fill-purple-900/60";
        stroke = "stroke-purple-400";
        break;
      case "vehicle":
        fill = "fill-amber-900/60";
        stroke = "stroke-amber-400";
        break;
      default:
        fill = "fill-slate-900";
        stroke = "stroke-slate-400";
    }

    if (isSelected) {
      stroke = `${stroke} stroke-[3.5px] drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]`;
    }

    return `${fill} ${stroke}`;
  };

  const getEdgeStyle = (edge: any) => {
    const isEdgeHighlighted = highlightedNodeIds.includes(edge.source) && highlightedNodeIds.includes(edge.target);
    
    if (highlightedNodeIds.length > 0 && !isEdgeHighlighted) {
      return "stroke-slate-900 opacity-15";
    }

    return isEdgeHighlighted 
      ? "stroke-blue-500 stroke-[1.8px] opacity-80" 
      : "stroke-slate-800 stroke-[1px] opacity-40";
  };

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
            
            {/* Background constellation overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#081730_1px,transparent_1px)] [background-size:2rem_2rem] opacity-35" />

            {/* SVG Network Graph */}
            <svg 
              className="w-full max-w-2xl h-[420px] z-10 select-none"
              viewBox="0 0 500 350"
            >
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-850" />
                </marker>
              </defs>

              {/* Draw Edges */}
              {edges.map((edge, idx) => {
                const start = nodeCoordinates[edge.source];
                const end = nodeCoordinates[edge.target];
                if (!start || !end) return null;
                return (
                  <g key={`edge-${idx}`}>
                    <line
                      x1={start.x}
                      y1={start.y}
                      x2={end.x}
                      y2={end.y}
                      className={`transition-all duration-300 ${getEdgeStyle(edge)}`}
                    />
                    {/* Tiny edge tag (if highlighted) */}
                    {highlightedNodeIds.includes(edge.source) && highlightedNodeIds.includes(edge.target) && (
                      <rect
                        x={(start.x + end.x) / 2 - 20}
                        y={(start.y + end.y) / 2 - 6}
                        width="40"
                        height="12"
                        rx="3"
                        className="fill-slate-950 stroke-slate-850 stroke-[0.5px] opacity-90"
                      />
                    )}
                    {highlightedNodeIds.includes(edge.source) && highlightedNodeIds.includes(edge.target) && (
                      <text
                        x={(start.x + end.x) / 2}
                        y={(start.y + end.y) / 2 + 3}
                        textAnchor="middle"
                        className="text-[5px] font-bold fill-slate-400 font-mono scale-[0.9]"
                      >
                        {edge.relation}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Draw Nodes */}
              {nodes.map((node) => {
                const coord = nodeCoordinates[node.id];
                if (!coord) return null;
                
                const isSelected = selectedNode?.id === node.id;
                const isHighlighted = highlightedNodeIds.includes(node.id);
                
                let Icon: any = User;
                if (node.type === "crime") Icon = FileText;
                if (node.type === "phone") Icon = Phone;
                if (node.type === "vehicle") Icon = Car;

                return (
                  <g 
                    key={node.id} 
                    transform={`translate(${coord.x}, ${coord.y})`}
                    className="cursor-pointer"
                    onClick={() => handleNodeClick(node)}
                  >
                    {/* Ring highlight glow */}
                    {isSelected && (
                      <circle r="16" className="fill-blue-500/10 stroke-blue-500/30 stroke-[2.5px] animate-ping opacity-75" />
                    )}
                    
                    {/* Node circle */}
                    <circle
                      r="12"
                      className={`transition-all duration-300 ${getNodeColorClass(node.type, isHighlighted, isSelected)}`}
                    />

                    {/* Node Icon inside */}
                    <g transform="translate(-5, -5)" className={`${
                      highlightedNodeIds.length > 0 && !isHighlighted ? "opacity-20" : "opacity-90"
                    }`}>
                      <Icon className="h-2.5 w-2.5 text-white" strokeWidth={2.5} />
                    </g>

                    {/* Text Label */}
                    <text
                      y="20"
                      textAnchor="middle"
                      className={`text-[6px] font-bold font-sans tracking-wide transition-all ${
                        isSelected 
                          ? "fill-blue-400 text-xs font-extrabold" 
                          : highlightedNodeIds.length > 0 && !isHighlighted 
                          ? "fill-slate-650 opacity-20" 
                          : "fill-slate-300"
                      }`}
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>

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

            {/* Selected Node Details */}
            <div className="flex-1 bg-slate-900/40 border border-slate-800 p-5 rounded-2xl flex flex-col min-h-[300px]">
              {selectedNode ? (
                <div className="space-y-4 flex-1 flex flex-col">
                  {/* Header info */}
                  <div className="border-b border-slate-800 pb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest block font-mono">
                        Clearance clearance clearance
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                        selectedNode.risk === "High" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {selectedNode.risk} Threat
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base mt-1 leading-snug">{selectedNode.label}</h3>
                  </div>

                  {/* Rating */}
                  <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-850 text-center">
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">Risk Assessment index</span>
                    <span className="text-lg font-extrabold text-red-400">{selectedNode.rating} / 10</span>
                  </div>

                  {/* Description */}
                  <div className="space-y-1 text-xs">
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Profile Summary</span>
                    <p className="text-slate-300 leading-normal bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                      {selectedNode.desc}
                    </p>
                  </div>

                  {/* Relationship list */}
                  <div className="space-y-2 flex-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Direct Links ({
                      edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).length
                    })</span>
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                      {edges
                        .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                        .map((edge, idx) => {
                          const targetNodeId = edge.source === selectedNode.id ? edge.target : edge.source;
                          const targetNode = nodes.find(n => n.id === targetNodeId);
                          return (
                            <div 
                              key={idx} 
                              onClick={() => handleNodeClick(targetNode)}
                              className="p-2.5 bg-slate-950/60 hover:bg-slate-900 border border-slate-850 rounded-xl flex items-center justify-between text-[10px] cursor-pointer transition-colors"
                            >
                              <div className="flex flex-col min-w-0">
                                <span className="font-semibold text-slate-200 truncate">{targetNode?.label}</span>
                                <span className="text-[8px] text-slate-500 mt-0.5">{edge.relation}</span>
                              </div>
                              <span className="text-[9px] font-bold text-blue-400 font-mono">{edge.weight}%</span>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Explainable AI block */}
                  <div className="p-3 bg-blue-950/15 border border-blue-900/30 rounded-xl space-y-1.5 mt-auto">
                    <span className="text-[9px] font-bold text-blue-400 uppercase flex items-center gap-1">
                      <Info className="h-3.5 w-3.5" />
                      <span>Security clearance statement</span>
                    </span>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Linkages calculated via cell tower overlap signatures, co-arrest history, and direct phone transaction logs.
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      const query = `Analyze suspect relationships and connections for ${selectedNode.label}`;
                      window.location.href = `/ai-assistant?query=${encodeURIComponent(query)}`;
                    }}
                    className="w-full py-2.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all text-center"
                  >
                    Examine Relations via AI
                  </button>

                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
                  <Network className="h-8 w-8 text-slate-650" />
                  <p className="text-xs font-semibold">Focus a Node Link</p>
                  <p className="text-[10px] text-slate-650 max-w-[180px]">Select any icon node in the network constellation to view full relationship intelligence</p>
                </div>
              )}
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
