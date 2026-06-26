"use client";

import React from "react";
import { FolderOpen, MapPin, Calendar, ExternalLink } from "lucide-react";

export default function AssignedCasesPanel({ cases }: { cases: any[] }) {
  if (!cases || cases.length === 0) {
    return (
      <div suppressHydrationWarning className="h-full bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center opacity-70">
        <FolderOpen className="h-8 w-8 text-slate-500 mb-2" />
        <span className="text-sm font-bold text-slate-400">No active cases assigned</span>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-900/50 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
      <div className="p-3 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-blue-500" /> My Active Cases
        </h3>
        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] px-2 py-0.5 rounded font-mono">
          {cases.length} TOTAL
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {cases?.map((c) => (
          <div key={c.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 hover:border-slate-600 transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                {c.fir_number || c.id.substring(0,8).toUpperCase()}
              </span>
              <ExternalLink className="h-3 w-3 text-slate-600 group-hover:text-blue-400" />
            </div>
            <p className="text-xs font-medium text-slate-200 mb-3 line-clamp-2">{c.description || "No description provided"}</p>
            <div className="flex justify-between items-center text-[10px] text-slate-500">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Location Pending
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {new Date(c.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
