import React from "react";
import { FileSearch } from "lucide-react";

interface EvidenceExplorerProps {
  evidence: string[];
  riskDrivers: string[];
}

export default function EvidenceExplorer({ evidence, riskDrivers }: EvidenceExplorerProps) {
  return (
    <div className="space-y-3">
      <div className="bg-slate-950 border border-slate-800 rounded p-3">
         <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
          <FileSearch className="h-3 w-3 text-blue-500" /> Grounding Evidence
         </h4>
         <ul className="text-[10px] font-mono text-slate-400 space-y-1.5 list-disc pl-4">
           {evidence?.map((ev, i) => (
             <li key={i}>{ev}</li>
           ))}
         </ul>
      </div>
      
      <div className="bg-slate-950 border border-slate-800 rounded p-3">
         <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          Mathematical Risk Drivers
         </h4>
         <div className="flex flex-wrap gap-2">
           {riskDrivers?.map((rd, i) => (
             <span key={i} className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
               {rd}
             </span>
           ))}
         </div>
      </div>
    </div>
  );
}
