import { Network, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function GraphNodeDetails({ selectedNode, edges, nodes, onNodeClick }: any) {
  const router = useRouter();

  if (!selectedNode) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
        <Network className="h-8 w-8 text-slate-600" />
        <p className="text-xs font-semibold">Focus a Node Link</p>
        <p className="text-[10px] text-slate-500 max-w-[180px]">Select any icon node in the network constellation to view full relationship intelligence</p>
      </div>
    );
  }

  const directEdges = edges?.filter((e: any) => e.source === selectedNode.id || e.target === selectedNode.id);

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={selectedNode.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-4 flex-1 flex flex-col"
      >
        <div className="border-b border-slate-800 pb-3">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest block font-mono">
              Clearance Level: Active
            </span>
            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
              selectedNode.risk === "High" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"
            }`}>
              {selectedNode.risk} Threat
            </span>
          </div>
          <h3 className="font-bold text-white text-base mt-1 leading-snug">{selectedNode.label}</h3>
        </div>

        <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-850 text-center">
          <span className="text-[9px] text-slate-500 block uppercase font-bold">Risk Assessment index</span>
          <span className="text-lg font-extrabold text-red-400">{selectedNode.rating} / 10</span>
        </div>

        <div className="space-y-1 text-xs">
          <span className="text-[9px] font-bold text-slate-500 uppercase block">Profile Summary</span>
          <p className="text-slate-300 leading-normal bg-slate-950/40 p-3 rounded-lg border border-slate-850">
            {selectedNode.desc}
          </p>
        </div>

        <div className="space-y-2 flex-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Direct Links ({directEdges.length})</span>
          <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
            {directEdges?.map((edge: any, idx: number) => {
              const targetNodeId = edge.source === selectedNode.id ? edge.target : edge.source;
              const targetNode = nodes.find((n: any) => n.id === targetNodeId);
              return (
                <div 
                  key={idx} 
                  onClick={() => onNodeClick(targetNode)}
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
            router.push(`/ai-assistant?query=${encodeURIComponent(query)}`);
          }}
          className="w-full py-2.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all text-center"
        >
          Examine Relations via AI
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
