"use client";

import React from "react";
import { MapPin, Flame } from "lucide-react";

export default function CrimeHotspotsPanel({ hotspots }: { hotspots: any[] }) {
  if (!hotspots || hotspots.length === 0) {
    return (
      <div className="h-full bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-center">
        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">No Escalating Hotspots</span>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
      <div className="p-3 border-b border-slate-800 bg-slate-950/50">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <Flame className="h-4 w-4 text-red-500" /> Active Hotspots
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {hotspots?.map((h, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 font-mono w-4">{i+1}.</span>
              <span className="text-xs font-bold text-slate-300">{h.district}</span>
            </div>
            <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-2 rounded border border-red-500/20">
              {h.count} INCIDENTS
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
