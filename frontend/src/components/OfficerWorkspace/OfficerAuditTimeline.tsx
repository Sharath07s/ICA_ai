"use client";

import React from "react";
import { Terminal } from "lucide-react";

export default function OfficerAuditTimeline({ logs }: { logs: any[] }) {
  return (
    <div suppressHydrationWarning className="h-full bg-slate-900/50 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
      <div className="p-3 border-b border-slate-800 bg-slate-950/50 flex items-center gap-2">
        <Terminal className="h-4 w-4 text-emerald-500" />
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Audit Timeline</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-3 bg-black/40">
        {(!logs || logs.length === 0) ? (
          <div className="text-center text-slate-600 text-xs font-mono py-4">No audit events generated.</div>
        ) : (
          <div className="space-y-1">
            {logs?.map((log: any) => (
              <div key={log.id} className="text-[10px] font-mono text-slate-400">
                <span className="text-emerald-500">[{new Date(log.created_at).toISOString()}]</span> {log.action} - {log.resource_id || "SYSTEM"}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
