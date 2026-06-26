"use client";

import React from "react";
import { Download, FileText, Share2 } from "lucide-react";

export default function FIRActionsPanel() {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col h-full justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4">
        <button className="flex items-center justify-center gap-2 p-3 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-xl transition-colors text-indigo-400">
          <FileText className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Intelligence Brief</span>
        </button>
        <button className="flex items-center justify-center gap-2 p-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl transition-colors text-blue-400">
          <Download className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">PDF Export</span>
        </button>
        <button className="flex items-center justify-center gap-2 p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-xl transition-colors text-slate-300">
          <Share2 className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Share Securely</span>
        </button>
      </div>
    </div>
  );
}
