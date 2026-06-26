"use client";

import React from "react";
import { Filter } from "lucide-react";

interface AlertFiltersProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export default function AlertFilters({ activeFilter, setActiveFilter }: AlertFiltersProps) {
  const filters = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <div className="bg-slate-800 p-1.5 rounded-lg mr-2">
        <Filter className="h-4 w-4 text-slate-400" />
      </div>
      
      {filters?.map(filter => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${
            activeFilter === filter 
              ? "bg-blue-600 text-white" 
              : "bg-slate-900/50 text-slate-400 border border-slate-700 hover:bg-slate-800"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
