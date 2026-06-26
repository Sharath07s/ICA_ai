"use client";

import React from "react";
import { UserCheck } from "lucide-react";

export default function OfficerActivityPanel({ data }: { data: any }) {
  if (!data) return <div className="h-full bg-slate-900 border border-slate-800 rounded-xl"></div>;

  return (
    <div className="h-full bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
      <div className="p-3 border-b border-slate-800 bg-slate-950/50">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-blue-500" /> Active Personnel
        </h3>
      </div>
      <div className="flex-1 flex flex-col justify-center px-4 gap-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-400">Officers On Duty</span>
          <span className="text-xl font-mono text-emerald-400">{data.active_officers}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-400">Actions Logged Today</span>
          <span className="text-xl font-mono text-blue-400">{data.actions_today}</span>
        </div>
      </div>
    </div>
  );
}
