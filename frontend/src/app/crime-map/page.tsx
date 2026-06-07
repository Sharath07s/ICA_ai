"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Filter, 
  Layers, 
  MapPin, 
  Calendar, 
  Sliders, 
  ShieldAlert, 
  Activity, 
  ChevronRight,
  Maximize2,
  Minimize2,
  Info
} from "lucide-react";

// Mock spatial hotspots
const HOTSPOTS = [
  {
    id: "h1",
    district: "Bengaluru City",
    locationName: "Indiranagar - Halasuru Sector",
    crimeCount: 18,
    threatScore: 9.4,
    riskLevel: "High",
    dominantCrime: "Cyber Jackpotting / Phishing",
    notes: "Correlated activity detected primarily during nocturnal hours (01:00 - 04:00). Highly linked with repeat offenders."
  },
  {
    id: "h2",
    district: "Mysuru",
    locationName: "Vidyaranyapuram - Kuvempunagar Axis",
    crimeCount: 11,
    threatScore: 7.8,
    riskLevel: "Medium",
    dominantCrime: "House Breaking by Night",
    notes: "Concentrated around locked residential properties. MO involves rear window access via pry tools."
  },
  {
    id: "h3",
    district: "Mangaluru",
    locationName: "Hampankatta - Port Area",
    crimeCount: 9,
    threatScore: 8.2,
    riskLevel: "High",
    dominantCrime: "Digital Ransomware Extortion",
    notes: "Targeting commercial networks and banking terminals. IP tracking points to cross-state proxy nodes."
  },
  {
    id: "h4",
    district: "Kalaburagi",
    locationName: "Station Bazaar Ward",
    crimeCount: 14,
    threatScore: 8.6,
    riskLevel: "High",
    dominantCrime: "Property Larceny & Smuggling",
    notes: "High concentration of retail cargo thefts close to regional distribution terminals."
  }
];

export default function CrimeMapPage() {
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedCrime, setSelectedCrime] = useState("All Crimes");
  const [selectedRange, setSelectedRange] = useState("Last 30 Days");
  
  // Layer states
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showClusters, setShowClusters] = useState(true);
  const [showStations, setShowStations] = useState(false);

  const [activeHotspot, setActiveHotspot] = useState<any>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  const districtsList = [
    "All Districts",
    "Bengaluru City",
    "Mysuru",
    "Mangaluru",
    "Hubballi-Dharwad",
    "Belagavi",
    "Kalaburagi"
  ];

  const crimeTypesList = [
    "All Crimes",
    "House Breaking",
    "Cyber Fraud",
    "Vehicle Theft",
    "Larceny"
  ];

  const filteredHotspots = HOTSPOTS.filter(h => {
    if (selectedDistrict !== "All Districts" && h.district !== selectedDistrict) return false;
    if (selectedCrime !== "All Crimes" && !h.dominantCrime.includes(selectedCrime.replace("All Crimes", ""))) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 h-full flex flex-col">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">Geospatial Intelligence Map</h1>
            <p className="text-sm text-slate-400">District threat analytics, spatiotemporal clustering, and police station boundaries</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 text-[10px] font-bold text-red-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
            </span>
            <span>HIGH RISK FLASHES IN BENGALURU URBAN</span>
          </div>
        </div>

        {/* Filters and Controls Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
          
          {/* District Select */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="h-3 w-3 text-blue-500" /> District Sector
            </label>
            <select
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              {districtsList.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Crime Select */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sliders className="h-3 w-3 text-indigo-400" /> Crime Classification
            </label>
            <select
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={selectedCrime}
              onChange={(e) => setSelectedCrime(e.target.value)}
            >
              {crimeTypesList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Range Select */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="h-3 w-3 text-amber-500" /> Temporal Range
            </label>
            <select
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
            >
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
              <option>Year-To-Date</option>
            </select>
          </div>

          {/* Map Layer Controls */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Layers className="h-3 w-3 text-emerald-400" /> Intelligence Overlays
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`flex-1 py-2 rounded-xl text-[10px] font-bold border transition-colors ${
                  showHeatmap 
                    ? "bg-red-500/10 border-red-500/30 text-red-400" 
                    : "bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-350"
                }`}
              >
                Heatmap
              </button>
              <button
                onClick={() => setShowClusters(!showClusters)}
                className={`flex-1 py-2 rounded-xl text-[10px] font-bold border transition-colors ${
                  showClusters 
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-400" 
                    : "bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-350"
                }`}
              >
                Clusters
              </button>
              <button
                onClick={() => setShowStations(!showStations)}
                className={`flex-1 py-2 rounded-xl text-[10px] font-bold border transition-colors ${
                  showStations 
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" 
                    : "bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-350"
                }`}
              >
                Stations
              </button>
            </div>
          </div>

        </div>

        {/* Map Viewport Area */}
        <div className="flex-1 min-h-[500px] grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left panel: Interactive SVG Map */}
          <div className="lg:col-span-8 bg-slate-950/40 border border-slate-800 rounded-2xl flex items-center justify-center p-6 relative overflow-hidden">
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#081730_1px,transparent_1px),linear-gradient(to_bottom,#081730_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] opacity-25" />

            {/* Glowing heat circles */}
            {showHeatmap && (
              <>
                <div className="absolute top-[65%] left-[62%] h-44 w-44 rounded-full bg-red-600/15 blur-3xl pointer-events-none animate-pulse duration-4000" />
                <div className="absolute top-[40%] left-[58%] h-32 w-32 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
                <div className="absolute top-[18%] left-[68%] h-36 w-36 rounded-full bg-red-500/10 blur-3xl pointer-events-none animate-pulse duration-3000" />
              </>
            )}

            {/* Karnataka Map SVG */}
            <svg 
              className="w-full max-w-lg h-[420px] text-slate-800 z-10 select-none filter drop-shadow-2xl" 
              viewBox="0 0 200 300"
            >
              {/* Belagavi Sector */}
              <path 
                d="M40 50 L80 30 L100 60 L90 100 L50 90 Z" 
                className={`transition-all duration-200 cursor-pointer ${
                  hoveredDistrict === "Belagavi" 
                    ? "fill-blue-500/30 stroke-blue-400 stroke-2" 
                    : "fill-slate-900/50 stroke-slate-700/80 hover:fill-slate-800/40"
                }`}
                onMouseEnter={() => setHoveredDistrict("Belagavi")}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => setSelectedDistrict("Belagavi")}
              />
              
              {/* Vijayapura Sector */}
              <path 
                d="M80 30 L120 40 L130 70 L100 60 Z" 
                className={`transition-all duration-200 cursor-pointer ${
                  hoveredDistrict === "Vijayapura" 
                    ? "fill-blue-500/30 stroke-blue-400 stroke-2" 
                    : "fill-slate-900/50 stroke-slate-700/80 hover:fill-slate-800/40"
                }`}
                onMouseEnter={() => setHoveredDistrict("Vijayapura")}
                onMouseLeave={() => setHoveredDistrict(null)}
              />

              {/* Kalaburagi Sector */}
              <path 
                d="M120 40 L160 55 L150 95 L130 70 Z" 
                className={`transition-all duration-200 cursor-pointer ${
                  hoveredDistrict === "Kalaburagi" 
                    ? "fill-red-500/30 stroke-red-500 stroke-2" 
                    : "fill-red-950/10 stroke-slate-700/80 hover:fill-red-900/20"
                }`}
                onMouseEnter={() => setHoveredDistrict("Kalaburagi")}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => {
                  setSelectedDistrict("Kalaburagi");
                  const hs = HOTSPOTS.find(h => h.district === "Kalaburagi");
                  if (hs) setActiveHotspot(hs);
                }}
              />

              {/* Central Districts */}
              <path 
                d="M100 60 L130 70 L150 95 L120 120 L90 100 Z" 
                className="fill-slate-900/50 stroke-slate-700/80 hover:fill-slate-800/40 transition-all duration-200 cursor-pointer"
              />
              
              {/* Shivamogga Sector */}
              <path 
                d="M90 100 L120 120 L110 160 L70 150 Z" 
                className="fill-slate-900/50 stroke-slate-700/80 hover:fill-slate-800/40 transition-all duration-200 cursor-pointer"
              />

              {/* Hubballi-Dharwad */}
              <path 
                d="M70 150 L110 160 L100 200 L60 190 Z" 
                className={`transition-all duration-200 cursor-pointer ${
                  hoveredDistrict === "Hubballi-Dharwad" 
                    ? "fill-blue-500/30 stroke-blue-400 stroke-2" 
                    : "fill-slate-900/50 stroke-slate-700/80 hover:fill-slate-800/40"
                }`}
                onMouseEnter={() => setHoveredDistrict("Hubballi-Dharwad")}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => setSelectedDistrict("Hubballi-Dharwad")}
              />

              {/* Mangaluru Sector */}
              <path 
                d="M60 190 L100 200 L90 235 L50 220 Z" 
                className={`transition-all duration-200 cursor-pointer ${
                  hoveredDistrict === "Mangaluru" 
                    ? "fill-red-500/30 stroke-red-500 stroke-2" 
                    : "fill-red-950/10 stroke-slate-700/80 hover:fill-red-900/20"
                }`}
                onMouseEnter={() => setHoveredDistrict("Mangaluru")}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => {
                  setSelectedDistrict("Mangaluru");
                  const hs = HOTSPOTS.find(h => h.district === "Mangaluru");
                  if (hs) setActiveHotspot(hs);
                }}
              />

              {/* Mysuru Sector */}
              <path 
                d="M90 235 L120 220 L130 255 L80 265 Z" 
                className={`transition-all duration-200 cursor-pointer ${
                  hoveredDistrict === "Mysuru" 
                    ? "fill-amber-500/30 stroke-amber-500 stroke-2" 
                    : "fill-amber-950/10 stroke-slate-700/80 hover:fill-amber-900/20"
                }`}
                onMouseEnter={() => setHoveredDistrict("Mysuru")}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => {
                  setSelectedDistrict("Mysuru");
                  const hs = HOTSPOTS.find(h => h.district === "Mysuru");
                  if (hs) setActiveHotspot(hs);
                }}
              />

              {/* Bengaluru Sector */}
              <path 
                d="M120 220 L155 210 L165 245 L130 255 Z" 
                className={`transition-all duration-200 cursor-pointer ${
                  hoveredDistrict === "Bengaluru City" 
                    ? "fill-red-500/40 stroke-red-500 stroke-2 animate-pulse duration-2000" 
                    : "fill-red-950/20 stroke-slate-700/80 hover:fill-red-900/30"
                }`}
                onMouseEnter={() => setHoveredDistrict("Bengaluru City")}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => {
                  setSelectedDistrict("Bengaluru City");
                  const hs = HOTSPOTS.find(h => h.district === "Bengaluru City");
                  if (hs) setActiveHotspot(hs);
                }}
              />

              {/* Southernmost districts */}
              <path 
                d="M80 265 L130 255 L115 295 L70 285 Z" 
                className="fill-slate-900/50 stroke-slate-700/80 hover:fill-slate-800/40 transition-all duration-200 cursor-pointer"
              />

              {/* Pulsing Hotspot Nodes */}
              {showClusters && (
                <>
                  {/* Bengaluru Cluster */}
                  <g className="cursor-pointer translate-x-[145px] translate-y-[225px]">
                    <circle r="9" className="fill-red-650/40 stroke-red-500 stroke-2 animate-ping opacity-60" />
                    <circle r="7" className="fill-red-600 text-white" />
                    <text textAnchor="middle" y="2.5" className="text-[7px] font-extrabold fill-white font-sans">18</text>
                  </g>
                  
                  {/* Mysuru Cluster */}
                  <g className="cursor-pointer translate-x-[102px] translate-y-[242px]">
                    <circle r="9" className="fill-amber-650/40 stroke-amber-500 stroke-2 animate-ping opacity-60" />
                    <circle r="7" className="fill-amber-500 text-white" />
                    <text textAnchor="middle" y="2.5" className="text-[7px] font-extrabold fill-white font-sans">11</text>
                  </g>

                  {/* Mangaluru Cluster */}
                  <g className="cursor-pointer translate-x-[72px] translate-y-[212px]">
                    <circle r="9" className="fill-red-650/40 stroke-red-500 stroke-2 animate-ping opacity-60" />
                    <circle r="7" className="fill-red-600 text-white" />
                    <text textAnchor="middle" y="2.5" className="text-[7px] font-extrabold fill-white font-sans">9</text>
                  </g>

                  {/* Kalaburagi Cluster */}
                  <g className="cursor-pointer translate-x-[142px] translate-y-[68px]">
                    <circle r="9" className="fill-red-650/40 stroke-red-500 stroke-2 animate-ping opacity-60" />
                    <circle r="7" className="fill-red-600 text-white" />
                    <text textAnchor="middle" y="2.5" className="text-[7px] font-extrabold fill-white font-sans">14</text>
                  </g>
                </>
              )}
            </svg>

            {/* Hover details tooltip */}
            {hoveredDistrict && (
              <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-lg text-xs z-20 pointer-events-none">
                <span className="font-bold text-white block">{hoveredDistrict}</span>
                <span className="text-slate-400 mt-1 block">Active Incidents: {
                  hoveredDistrict === "Bengaluru City" ? "18 (High Threat)" : 
                  hoveredDistrict === "Kalaburagi" ? "14 (High Threat)" :
                  hoveredDistrict === "Mysuru" ? "11 (Elevated Risk)" : 
                  hoveredDistrict === "Mangaluru" ? "9 (Elevated Risk)" : "1-2"
                }</span>
              </div>
            )}

            {/* Absolute Map Layer Status Display */}
            <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-850 p-3 rounded-xl text-[10px] space-y-1">
              <span className="font-bold text-slate-300 block uppercase">Layer Stats</span>
              <div className="flex gap-4">
                <div>
                  <span className="text-slate-500 block">HEATMAP</span>
                  <span className={`font-mono font-bold ${showHeatmap ? "text-emerald-400" : "text-slate-650"}`}>
                    {showHeatmap ? "ONLINE" : "OFFLINE"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">CLUSTERS</span>
                  <span className={`font-mono font-bold ${showClusters ? "text-emerald-400" : "text-slate-650"}`}>
                    {showClusters ? "ONLINE" : "OFFLINE"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">STATIONS</span>
                  <span className={`font-mono font-bold ${showStations ? "text-emerald-400" : "text-slate-650"}`}>
                    {showStations ? "ONLINE" : "OFFLINE"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Active Hotspot details / sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Legend card */}
            <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-3">Threat Indexes</h4>
              <div className="space-y-3 text-xs">
                
                <div className="flex items-start gap-2.5 p-2 bg-red-950/10 border border-red-900/30 rounded-xl">
                  <span className="h-2 w-2 rounded-full bg-red-500 shrink-0 mt-1.5 animate-pulse" />
                  <div>
                    <span className="font-bold text-red-400 block">CRITICAL THREAT ZONE (&gt;8.0)</span>
                    <span className="text-[10px] text-slate-455">High density clusters. Immediate proactive patrols required.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 bg-amber-950/10 border border-amber-900/30 rounded-xl">
                  <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <div>
                    <span className="font-bold text-amber-400 block">ELEVATED SECTOR (4.0 - 7.9)</span>
                    <span className="text-[10px] text-slate-455">Rising MO overlaps. Station analytics monitored hourly.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 bg-blue-950/10 border border-blue-900/30 rounded-xl">
                  <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                  <div>
                    <span className="font-bold text-blue-400 block">CONTROLLED SECTOR (&lt;4.0)</span>
                    <span className="text-[10px] text-slate-455">Standard property offenses. Normal patrol frequency.</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Hotspot details inspect */}
            <div className="flex-1 bg-slate-900/40 border border-slate-800 p-5 rounded-2xl flex flex-col min-h-[300px]">
              {activeHotspot ? (
                <div className="space-y-4 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="border-b border-slate-800 pb-3">
                    <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest block font-mono">
                      {activeHotspot.district} Sector
                    </span>
                    <h3 className="font-bold text-white text-base mt-0.5 leading-snug">{activeHotspot.locationName}</h3>
                  </div>

                  {/* Stat parameters */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-850 text-center">
                      <span className="text-[9px] text-slate-500 block uppercase font-bold">Threat Score</span>
                      <span className="text-lg font-extrabold text-red-400">{activeHotspot.threatScore} / 10</span>
                    </div>
                    <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-850 text-center">
                      <span className="text-[9px] text-slate-500 block uppercase font-bold">Cases Pinned</span>
                      <span className="text-lg font-extrabold text-slate-200">{activeHotspot.crimeCount} cases</span>
                    </div>
                  </div>

                  {/* Primary Mo */}
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Dominant MO Mode</span>
                    <span className="font-semibold text-slate-250 block">{activeHotspot.dominantCrime}</span>
                  </div>

                  {/* Notes */}
                  <div className="space-y-1 text-xs bg-slate-950/40 p-3 rounded-lg border border-slate-850 leading-relaxed text-slate-350">
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Field Intelligence Note</span>
                    {activeHotspot.notes}
                  </div>

                  {/* AI Recommendation */}
                  <div className="p-3 bg-blue-950/15 border border-blue-900/30 rounded-xl space-y-1.5 mt-auto">
                    <span className="text-[9px] font-bold text-blue-400 uppercase flex items-center gap-1">
                      <Info className="h-3.5 w-3.5" />
                      <span>KCIA AI Recommends</span>
                    </span>
                    <p className="text-[10px] text-slate-300 leading-normal">
                      Deploy 2 extra patrol units between Vidyaranyapuram and Kuvempunagar road junctions from 01:30 to 03:00. Integrate cell overlap scanning.
                    </p>
                  </div>

                  <button 
                    onClick={() => {
                      const query = `Analyze crime clusters and MO signatures for ${activeHotspot.locationName}`;
                      window.location.href = `/ai-assistant?query=${encodeURIComponent(query)}`;
                    }}
                    className="w-full py-2.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all text-center"
                  >
                    Examine Clusters with AI
                  </button>

                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
                  <Maximize2 className="h-8 w-8 text-slate-650" />
                  <p className="text-xs font-semibold">Select a District Sector or Cluster Node</p>
                  <p className="text-[10px] text-slate-600 max-w-[180px]">Click on the map highlights to view spatiotemporal intelligence</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
