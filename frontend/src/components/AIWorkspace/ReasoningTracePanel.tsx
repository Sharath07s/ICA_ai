"use client";

import React from "react";
import { Database, Network, FileText, CheckCircle } from "lucide-react";

interface ReasoningTraceProps {
  trace?: string[];
  reasoning?: string[]; // Backwards compatibility
  evidenceUsed?: string[];
  databaseRecords?: string[];
  neo4jNodes?: string[];
  confidenceBreakdown?: { category: string; score: number }[];
  sourceAttribution?: string;
}

export default function ReasoningTracePanel({ 
  trace, 
  reasoning, 
  evidenceUsed, 
  databaseRecords, 
  neo4jNodes, 
  confidenceBreakdown, 
  sourceAttribution 
}: ReasoningTraceProps) {
  const steps = trace || reasoning;
  if (!steps || steps.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <span className="text-[9px] font-bold text-slate-400 block uppercase">Algorithmic Reasoning Chain</span>
        <div className="space-y-1.5 border-l border-slate-700 pl-3 ml-1 mt-2">
          {steps?.map((r, idx) => (
            <div key={idx} className="relative">
              <span className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-blue-500 border-2 border-slate-950"></span>
              <p className="text-[10px] text-slate-300 leading-normal font-mono bg-slate-950/60 p-2 rounded border border-slate-850">
                {r}
              </p>
            </div>
          ))}
        </div>
      </div>

      {(evidenceUsed || databaseRecords || neo4jNodes) && (
        <div className="pt-3 border-t border-slate-800/50 grid grid-cols-3 gap-2">
          {evidenceUsed && (
            <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-800/50">
              <div className="flex items-center gap-1 mb-1">
                <FileText className="h-3 w-3 text-emerald-400" />
                <span className="text-[8px] font-bold text-slate-400 uppercase">Evidence</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-200">{evidenceUsed.length} Linked Items</span>
            </div>
          )}
          {databaseRecords && (
            <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-800/50">
              <div className="flex items-center gap-1 mb-1">
                <Database className="h-3 w-3 text-amber-400" />
                <span className="text-[8px] font-bold text-slate-400 uppercase">DB Records</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-200">{databaseRecords.length} Rows Accessed</span>
            </div>
          )}
          {neo4jNodes && (
            <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-800/50">
              <div className="flex items-center gap-1 mb-1">
                <Network className="h-3 w-3 text-blue-400" />
                <span className="text-[8px] font-bold text-slate-400 uppercase">Neo4j Nodes</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-200">{neo4jNodes.length} Graph Hops</span>
            </div>
          )}
        </div>
      )}

      {confidenceBreakdown && (
        <div className="space-y-1">
          <span className="text-[9px] font-bold text-slate-400 block uppercase">Confidence Breakdown</span>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {confidenceBreakdown?.map((cb, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-950/40 p-1.5 rounded border border-slate-850">
                <span className="text-[9px] text-slate-300">{cb.category}</span>
                <span className="text-[9px] font-bold text-emerald-400">{cb.score}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sourceAttribution && (
        <div className="flex items-center gap-1.5 p-2 bg-blue-950/20 border border-blue-900/30 rounded-lg">
          <CheckCircle className="h-3 w-3 text-blue-400" />
          <span className="text-[9px] text-slate-400 font-mono">
            Source: <span className="text-blue-300 font-semibold">{sourceAttribution}</span>
          </span>
        </div>
      )}
    </div>
  );
}
