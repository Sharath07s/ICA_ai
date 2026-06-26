"use client";

import React from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";

export default function ActiveAlertsPanel({ alerts }: { alerts: any[] }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="h-full bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-center">
        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">0 Active Alerts</span>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
      <div className="p-3 border-b border-slate-800 bg-slate-950/50">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-amber-500" /> Active Priority Alerts
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {alerts?.map(a => (
          <div key={a.id} className="p-2 border border-slate-800 rounded bg-slate-950 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${a.severity === 'CRITICAL' ? 'text-red-500' : 'text-amber-500'}`}>
                {a.type}
              </span>
              <span className="text-[9px] text-slate-500 font-mono">{a.district}</span>
            </div>
            <p className="text-xs text-slate-300 truncate">{a.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
