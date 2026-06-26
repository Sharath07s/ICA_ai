import React from "react";
import { FolderOpen, MapPin, Clock, ShieldAlert, User, CheckCircle2 } from "lucide-react";

interface CaseSummaryProps {
  caseData: {
    id: string;
    firNumber: string;
    crimeType: string;
    district: string;
    station: string;
    investigator: string;
    status: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    riskLevel: string;
    dateOpened: string;
    dateUpdated: string;
  };
}

export default function CaseSummary({ caseData }: CaseSummaryProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL": return "text-red-400 bg-red-500/10 border-red-500/20";
      case "HIGH": return "text-orange-400 bg-orange-500/10 border-orange-500/20";
      case "MEDIUM": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      default: return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
      <div className="bg-slate-950/50 border-b border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-950/40 border border-blue-900/50 rounded-xl flex items-center justify-center text-blue-400">
            <FolderOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg tracking-tight leading-tight">{caseData.firNumber}</h2>
            <p className="text-xs text-slate-400 font-medium">Case ID: {caseData.id}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${getPriorityColor(caseData.priority)}`}>
            {caseData.priority} PRIORITY
          </span>
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            {caseData.status}
          </span>
        </div>
      </div>
      
      <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Crime Type</span>
          <span className="text-sm font-semibold text-slate-200">{caseData.crimeType}</span>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Risk Level</span>
          <span className="text-sm font-bold text-red-400 flex items-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5" />
            {caseData.riskLevel}
          </span>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Jurisdiction</span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-200">{caseData.station}</span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3" />
              {caseData.district}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Investigator</span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-blue-400" />
              {caseData.investigator}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Date Opened</span>
          <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-slate-500" />
            {caseData.dateOpened}
          </span>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Last Updated</span>
          <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-slate-500" />
            {caseData.dateUpdated}
          </span>
        </div>
      </div>
    </div>
  );
}
