import React from "react";
import { User, Phone, Car, FileText } from "lucide-react";

interface NetworkGraphProps {
  nodes: any[];
  edges: any[];
  nodeCoordinates: Record<string, {x: number, y: number}>;
  selectedNode: any;
  highlightedNodeIds: string[];
  onNodeClick: (node: any) => void;
  className?: string;
}

export default function NetworkGraph({ 
  nodes, 
  edges, 
  nodeCoordinates, 
  selectedNode, 
  highlightedNodeIds, 
  onNodeClick,
  className = ""
}: NetworkGraphProps) {

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
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background constellation overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#081730_1px,transparent_1px)] [background-size:2rem_2rem] opacity-35" />

      {/* SVG Network Graph */}
      <svg 
        className="w-full max-w-2xl h-[420px] z-10 select-none mx-auto"
        viewBox="0 0 500 350"
      >
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-850" />
          </marker>
        </defs>

        {/* Draw Edges */}
        {edges?.map((edge, idx) => {
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
        {nodes?.map((node) => {
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
              onClick={() => onNodeClick(node)}
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
    </div>
  );
}
