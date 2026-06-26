"use client";

import React from "react";
import { Network, CheckCircle, AlertTriangle } from "lucide-react";

export default function Neo4jHealth({ data }: { data: any }) {
  if (!data) return <div className="h-full bg-slate-900 border border-slate-800 rounded-xl animate-pulse"></div>;

  const isHealthy = data.status === "healthy";

  return (
    <div className="h-full bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
      <div className="p-3 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <Network className="h-4 w-4 text-purple-500" /> Neo4j Graph DB
        </h3>
        {isHealthy ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <AlertTriangle className="h-4 w-4 text-amber-500" />}
      </div>
      
      <div className="flex-1 p-3 grid grid-cols-2 gap-3">
        <div className="bg-slate-950 rounded p-2 border border-slate-800">
          <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1">Latency</span>
          <span className={`text-lg font-mono ${data.latency_ms > 500 ? 'text-amber-500' : 'text-emerald-400'}`}>{data.latency_ms || 0}ms</span>
        </div>
        <div className="bg-slate-950 rounded p-2 border border-slate-800">
          <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1">Nodes</span>
          <span className="text-sm font-mono text-purple-400">{data.nodes || 0}</span>
        </div>
        
        <div className="col-span-2 mt-2 space-y-1">
          <div className="flex justify-between text-xs border-b border-slate-800 pb-1">
            <span className="text-slate-400">Relationships</span>
            <span className="font-mono text-slate-200">{data.relationships || 0}</span>
          </div>
          <div className="flex justify-between text-xs border-b border-slate-800 pb-1">
            <span className="text-slate-400">Suspects</span>
            <span className="font-mono text-slate-200">{data.suspects || 0}</span>
          </div>
          <div className="flex justify-between text-xs border-b border-slate-800 pb-1">
            <span className="text-slate-400">Vehicles</span>
            <span className="font-mono text-slate-200">{data.vehicles || 0}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Locations</span>
            <span className="font-mono text-slate-200">{data.locations || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
