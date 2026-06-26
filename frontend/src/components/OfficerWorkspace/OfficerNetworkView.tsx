"use client";

import React from "react";
import { Network } from "lucide-react";

export default function OfficerNetworkView() {
  return (
    <div className="h-full bg-slate-900/50 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
      <div className="p-3 border-b border-slate-800 bg-slate-950/50 flex items-center gap-2">
        <Network className="h-4 w-4 text-purple-500" />
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Local Network (Neo4j)</h3>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center opacity-50 relative p-4">
        {/* Placeholder for actual D3/ForceGraph network map of assigned cases */}
        <Network className="h-8 w-8 text-slate-500 mb-2 relative z-10" />
        <span className="text-xs font-bold text-slate-400 uppercase relative z-10 text-center">Graph initialization pending<br/>case selection</span>
      </div>
    </div>
  );
}
