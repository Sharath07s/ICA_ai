"use client";

import React from "react";
import { AlertTriangle, ShieldAlert, AlertCircle, Info, ChevronRight, Activity } from "lucide-react";

interface AlertFeedProps {
  alerts: any[];
  isLoading: boolean;
  onSelectAlert: (alert: any) => void;
  selectedAlertId: string | null;
}

export default function AlertFeed({ alerts, isLoading, onSelectAlert, selectedAlertId }: AlertFeedProps) {
  if (isLoading) {
    return (
      <div suppressHydrationWarning className="flex-1 flex items-center justify-center">
        <Activity className="h-6 w-6 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center flex-col gap-2 opacity-50">
        <ShieldAlert className="h-8 w-8 text-slate-500" />
        <span className="text-sm font-bold text-slate-400">No active alerts</span>
      </div>
    );
  }

  const getIcon = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "HIGH": return <ShieldAlert className="h-4 w-4 text-amber-500" />;
      case "MEDIUM": return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getBorderColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "border-red-500/50";
      case "HIGH": return "border-amber-500/50";
      case "MEDIUM": return "border-yellow-500/50";
      default: return "border-blue-500/50";
    }
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
      {alerts?.map((alert) => (
        <div 
          key={alert.id}
          onClick={() => onSelectAlert(alert)}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedAlertId === alert.id 
              ? `bg-slate-800 ${getBorderColor(alert.severity)}` 
              : "bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-slate-600"
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              {getIcon(alert.severity)}
              <h4 className="text-sm font-bold text-slate-200">{alert.type}</h4>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          <h3 className="text-base font-bold text-white mb-2">{alert.title}</h3>
          
          <div className="flex items-center justify-between mt-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-950 px-2 py-0.5 rounded">
              {alert.district}
            </span>
            <div className="flex items-center gap-1 text-xs text-blue-400 font-medium">
              Details <ChevronRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
