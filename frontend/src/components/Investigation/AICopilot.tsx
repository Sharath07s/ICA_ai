import React from "react";
import { Sparkles, FileSearch, Users, Car, Network, PlusCircle } from "lucide-react";
import ConfidenceMeter from "../AIWorkspace/ConfidenceMeter";
import ReasoningTracePanel from "../AIWorkspace/ReasoningTracePanel";

export default function AICopilot() {
  const suggestions = [
    { label: "Find potential suspects", icon: Users },
    { label: "Search related FIRs", icon: FileSearch },
    { label: "Identify connected vehicles", icon: Car },
    { label: "Map criminal network", icon: Network },
  ];

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col h-full overflow-hidden">
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/10 border-b border-slate-800 p-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-purple-400" />
        <h3 className="text-sm font-bold text-white tracking-wide">AI Investigation Copilot</h3>
      </div>
      
      <div className="p-5 flex-1 flex flex-col gap-5 overflow-y-auto">
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Executive Summary</span>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
            Based on the initial FIR filing, this incident matches the M.O. of the "Night Owl" syndicate operating out of South Bengaluru. 
            The insertion of malware into ATMs matches 3 other unsolved cases in the past 60 days.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ConfidenceMeter confidence={87} />
          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Actionable Insight</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Prioritize Suspect: Ramesh Kumar
            </span>
          </div>
        </div>

        <ReasoningTracePanel 
          trace={[
            "Analyzed FIR modus operandi text using NLP.",
            "Found high semantic similarity (0.92) with unsolved ATM jackpotting cases in Koramangala and Indiranagar.",
            "Cross-referenced known associates of previous suspects.",
            "Identified Ramesh Kumar via active cell tower pings near incident location at 02:00 AM."
          ]} 
        />

        <div className="mt-auto space-y-2 pt-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Copilot Suggestions</span>
          <div className="grid grid-cols-2 gap-2">
            {suggestions?.map((s, i) => {
              const Icon = s.icon;
              return (
                <button 
                  key={i}
                  className="flex items-center gap-2 p-2 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 rounded-lg text-left transition-colors group"
                >
                  <div className="h-6 w-6 rounded bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-blue-500/50 group-hover:text-blue-400 transition-colors">
                    <Icon className="h-3 w-3 text-slate-400 group-hover:text-blue-400" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-300 group-hover:text-slate-100">{s.label}</span>
                  <PlusCircle className="h-3 w-3 text-slate-600 ml-auto group-hover:text-blue-400" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
