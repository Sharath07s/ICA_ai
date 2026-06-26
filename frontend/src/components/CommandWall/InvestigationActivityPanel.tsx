"use client";

import React from "react";
import { FolderSearch } from "lucide-react";

export default function InvestigationActivityPanel({ data }: { data: any }) {
  if (!data) return <div className="h-full bg-slate-900 border border-slate-800 rounded-xl"></div>;

  return (
    <div className="h-full bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
      <div className="p-3 border-b border-slate-800 bg-slate-950/50">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <FolderSearch className="h-4 w-4 text-emerald-500" /> Investigation Status
        </h3>
      </div>
      <div className="flex-1 flex flex-col justify-center px-4 gap-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-400">Total Open Cases</span>
          <span className="text-xl font-mono text-white">{data.active}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-400">High Priority Workload</span>
          <span className="text-xl font-mono text-amber-500">{data.high_priority}</span>
        </div>
      </div>
    </div>
  );
}
