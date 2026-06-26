import React from "react";
import { ShieldCheck } from "lucide-react";

export default function RecoveryStatusPanel({ data }: { data: any }) {
  if (!data) return <div className="h-full bg-slate-900/50 rounded-xl border border-slate-800 animate-pulse"></div>;

  return (
    <div className="h-full bg-slate-900/50 rounded-xl border border-slate-800 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-blue-400" />
          Disaster Recovery
        </h3>
        <span className={`text-[10px] font-mono px-2 py-1 rounded border ${data.readiness_score === 100 ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-orange-500/10 text-orange-400 border-orange-500/30'}`}>
          SCORE: {data.readiness_score}/100
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center">
          <div className="text-3xl font-black text-white mb-1">{data.available_restore_points || 0}</div>
          <div className="text-xs text-slate-500 font-mono tracking-widest uppercase">Restore Points</div>
        </div>
        
        <div className="mt-4 p-2 bg-black/40 rounded border border-slate-800/50 text-center">
          <span className="text-[10px] font-mono text-slate-400">{data.message}</span>
        </div>
      </div>
    </div>
  );
}
