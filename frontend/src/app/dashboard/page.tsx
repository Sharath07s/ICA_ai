"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useCrimes } from "../../hooks/useCrimes";
import { 
  Search, 
  AlertTriangle, 
  Map, 
  TrendingUp, 
  Activity, 
  FileText, 
  Clock, 
  ArrowRight,
  Shield,
  Filter,
  Eye,
  Plus,
  Sliders,
  ChevronRight,
  AlertCircle
} from "lucide-react";

// Mock crimes fallback for high-fidelity presentation
const MOCK_CRIMES = [
  {
    id: "c1",
    fir_number: "BLR-FIR-2026-0412",
    title: "ATM Jackpotting & Cash Trapping",
    type: "Cyber-Physical Theft",
    district: "Bengaluru City",
    station: "Indiranagar PS",
    date: "2026-06-06",
    status: "Under Investigation",
    severity: "High",
    risk_level: "High",
    modus_operandi: "Insertion of malware-loaded USB device into NCR ATMs during low-traffic night hours.",
    suspects: ["Ramesh Kumar (Active)", "Unknown Associate (Alias: Cyber-G)" ]
  },
  {
    id: "c2",
    fir_number: "MYS-FIR-2026-0941",
    title: "Burglary of Locked Residential Property",
    type: "House Breaking By Night",
    district: "Mysuru",
    station: "Vidyaranyapuram PS",
    date: "2026-06-05",
    status: "FIR Registered",
    severity: "Medium",
    risk_level: "Medium",
    modus_operandi: "Crowbar entry through rear window. Target: Gold ornaments and digital assets.",
    suspects: ["Kariya Raja (Sighted in locality)"]
  },
  {
    id: "c3",
    fir_number: "MNG-FIR-2026-0210",
    title: "Phishing & Ransomware Extortion",
    type: "Cyber Crime",
    district: "Mangaluru",
    station: "Cyber Crime PS",
    date: "2026-06-04",
    status: "Under Investigation",
    severity: "High",
    risk_level: "High",
    modus_operandi: "Spear-phishing emails targeting local cooperative bank employees, deploying LockBit variant.",
    suspects: ["Siberian Syndicate (Group IP matched)", "Local Mule Account Holder"]
  },
  {
    id: "c4",
    fir_number: "HBL-FIR-2026-1189",
    title: "Commercial Theft at Jewelry Store",
    type: "Larceny",
    district: "Hubballi-Dharwad",
    station: "Gokul Road PS",
    date: "2026-06-03",
    status: "Acquitted/Closed",
    severity: "Low",
    risk_level: "Low",
    modus_operandi: "Shoplifting by distraction during festival peak hours.",
    suspects: ["Gowri S. (Apprehended)"]
  },
  {
    id: "c5",
    fir_number: "BLR-FIR-2026-0399",
    title: "Organized Automobile Smuggling Ring",
    type: "Vehicle Theft",
    district: "Bengaluru City",
    station: "Koramangala PS",
    date: "2026-06-02",
    status: "Under Investigation",
    severity: "High",
    risk_level: "High",
    modus_operandi: "GPS jammer deployment, electronic key fob bypass, immediate transport to border states.",
    suspects: ["Vicky Saluja (Wanted)", "Aslam Khan"]
  }
];

const CRITICAL_ALERTS = [
  {
    id: "a1",
    title: "Modus Operandi Match Alert",
    description: "ATM Jackpotting M.O. matched between Indiranagar PS and Whitefield PS within a 24hr window.",
    time: "10 mins ago",
    severity: "critical"
  },
  {
    id: "a2",
    title: "Emerging Cybercrime Cluster",
    description: "Spike in digital blackmail scams targeting senior citizens in Mangaluru (up 45% this week).",
    time: "2 hours ago",
    severity: "warning"
  },
  {
    id: "a3",
    title: "Network Link Sighted",
    description: "Associate of Kariya Raja detected via mobile tower cell overlap in Mysuru Central.",
    time: "4 hours ago",
    severity: "critical"
  }
];

export default function DashboardPage() {
  const { data: crimes, isLoading, error } = useCrimes();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrime, setSelectedCrime] = useState<any>(null);

  // Use live data if available, otherwise fall back to rich mock data
  const crimesList = crimes && crimes.length > 0 ? crimes : MOCK_CRIMES;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/ai-assistant?query=${encodeURIComponent(searchQuery)}`);
  };

  const selectSuggestedPrompt = (prompt: string) => {
    router.push(`/ai-assistant?query=${encodeURIComponent(prompt)}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Welcome and Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">Statewide Intelligence Hub</h1>
            <p className="text-sm text-slate-400">Real-time analytical mapping and command console of Karnataka State Police</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 p-2 text-xs font-mono text-slate-400">
            <Clock className="h-4 w-4 text-blue-400" />
            <span>SESSION LIFETIME: 07:54:12</span>
          </div>
        </div>

        {/* Global AI Search Panel */}
        <div className="bg-slate-900/40 backdrop-blur border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
          <form onSubmit={handleSearchSubmit} className="relative flex gap-3 max-w-5xl mx-auto">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700/80 focus:border-blue-500 rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                placeholder="Ask KCIA AI: 'Show burglary hotspots in Mysuru' or 'Analyze links for Kariya Raja'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-6 py-3.5 text-sm font-semibold transition-all shadow-md shadow-blue-600/15 flex items-center gap-2"
            >
              <span>Query AI</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </form>
          
          {/* Quick Suggestions */}
          <div className="mt-3.5 flex flex-wrap gap-2 items-center text-xs">
            <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Suggested Queries:</span>
            {[
              "Burglary hotspots in Mysuru",
              "Cybercrime growth trends in Bengaluru East",
              "Organized auto theft networks",
              "Suspect ties of Vicky Saluja"
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => selectSuggestedPrompt(prompt)}
                className="px-3 py-1 bg-slate-950 hover:bg-slate-800/80 border border-slate-850 hover:border-slate-700 rounded-full text-slate-400 hover:text-slate-200 transition-all font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Four Core Stat Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Stat 1 */}
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-slate-700/80 transition-all duration-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Investigations</p>
                <h3 className="text-2xl font-bold mt-1 text-white">{crimesList.length + 120}</h3>
              </div>
              <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
                <Activity className="h-5 w-5" />
              </div>
            </div>
            {/* Sparkline SVG */}
            <div className="mt-4 flex items-end justify-between">
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +14.2% from last month
              </span>
              <svg className="w-16 h-8 text-blue-500" viewBox="0 0 100 50">
                <path d="M 0,35 Q 20,40 40,20 T 80,10 T 100,5" fill="none" stroke="currentColor" strokeWidth="2.5" />
              </svg>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-slate-700/80 transition-all duration-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Critical Alerts</p>
                <h3 className="text-2xl font-bold mt-1 text-red-400">3</h3>
              </div>
              <div className="p-2.5 bg-red-500/10 rounded-xl border border-red-500/20 text-red-400 animate-pulse">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-[10px] text-red-400 font-semibold">2 pending response</span>
              <svg className="w-16 h-8 text-red-500" viewBox="0 0 100 50">
                <path d="M 0,45 Q 20,20 40,40 T 80,15 T 100,8" fill="none" stroke="currentColor" strokeWidth="2.5" />
              </svg>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-slate-700/80 transition-all duration-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">AI Predictive Forecasts</p>
                <h3 className="text-2xl font-bold mt-1 text-indigo-400">18</h3>
              </div>
              <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
                <Shield className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-[10px] text-indigo-400 font-semibold">89% confidence average</span>
              <svg className="w-16 h-8 text-indigo-500" viewBox="0 0 100 50">
                <path d="M 0,42 Q 25,25 50,45 T 100,5" fill="none" stroke="currentColor" strokeWidth="2.5" />
              </svg>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-slate-700/80 transition-all duration-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Pending Reports</p>
                <h3 className="text-2xl font-bold mt-1 text-amber-500">6</h3>
              </div>
              <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-500">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-[10px] text-amber-500 font-semibold">Requires supervisor signoff</span>
              <svg className="w-16 h-8 text-amber-500" viewBox="0 0 100 50">
                <path d="M 0,30 Q 30,50 60,35 T 100,45" fill="none" stroke="currentColor" strokeWidth="2.5" />
              </svg>
            </div>
          </div>

        </div>

        {/* Middle Section: Alerts Feed & District Hotspots Map Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Critical Alerts Feed */}
          <div className="lg:col-span-5 p-6 bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col h-[400px]">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                <h3 className="font-bold text-white text-base">Security & Modus Operandi Alerts</h3>
              </div>
              <span className="text-[10px] bg-red-950 text-red-400 border border-red-900 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                LIVE
              </span>
            </div>

            <div className="flex-1 overflow-y-auto mt-4 space-y-3 pr-1">
              {CRITICAL_ALERTS.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-3.5 rounded-xl border transition-all hover:bg-slate-900/90 ${
                    alert.severity === "critical" 
                      ? "bg-red-950/10 border-red-900/40 hover:border-red-900/60" 
                      : "bg-amber-950/10 border-amber-900/40 hover:border-amber-900/60"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                      alert.severity === "critical" ? "text-red-400" : "text-amber-400"
                    }`}>
                      <AlertCircle className="h-3.5 w-3.5" />
                      {alert.title}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{alert.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{alert.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Crime Map Preview Card */}
          <div className="lg:col-span-7 p-6 bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col h-[400px] relative overflow-hidden">
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-4 z-10">
              <div>
                <h3 className="font-bold text-white text-base">Statewide Threat & Hotspot Forecast</h3>
                <p className="text-xs text-slate-400">Interactive geographic risk allocation</p>
              </div>
              <button 
                onClick={() => router.push("/crime-map")}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-300 transition-colors font-semibold"
              >
                <span>Full Screen Analysis</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Stylized SVG Map of Karnataka (simplistic polygon grid for datathon aesthetics) */}
            <div className="flex-1 flex items-center justify-center relative bg-slate-950/30 rounded-xl border border-slate-800/60 mt-4 overflow-hidden">
              <svg className="w-[300px] h-[220px] text-blue-900/25" viewBox="0 0 200 300" fill="currentColor">
                {/* Simulated Karnataka Districts */}
                <path d="M50 30 L80 10 L100 40 L90 80 L60 80 Z" className="hover:fill-blue-600/40 cursor-pointer transition-colors" data-title="Belagavi" stroke="#1E4D92" strokeWidth="1"/>
                <path d="M80 10 L120 20 L130 50 L100 40 Z" className="hover:fill-blue-600/40 cursor-pointer transition-colors" data-title="Vijayapura" stroke="#1E4D92" strokeWidth="1"/>
                <path d="M120 20 L150 40 L140 80 L130 50 Z" className="hover:fill-red-650/40 fill-red-950/20 cursor-pointer transition-colors" data-title="Kalaburagi (High Risk)" stroke="#D93025" strokeWidth="1"/>
                <path d="M100 40 L130 50 L140 80 L110 90 L90 80 Z" className="hover:fill-blue-600/40 cursor-pointer transition-colors" stroke="#1E4D92" strokeWidth="1"/>
                <path d="M90 80 L110 90 L100 130 L70 120 Z" className="hover:fill-blue-600/40 cursor-pointer transition-colors" stroke="#1E4D92" strokeWidth="1"/>
                <path d="M100 130 L130 140 L120 180 L80 170 Z" className="hover:fill-amber-600/40 fill-amber-950/20 cursor-pointer transition-colors" data-title="Shivamogga (Medium Risk)" stroke="#F9A825" strokeWidth="1"/>
                {/* Bengaluru Area */}
                <path d="M120 180 L150 170 L160 210 L130 220 Z" className="hover:fill-red-650/40 fill-red-950/40 cursor-pointer transition-colors animate-pulse duration-2000" data-title="Bengaluru Urban (Critical Hotspot)" stroke="#D93025" strokeWidth="1.5"/>
                <path d="M80 170 L120 180 L130 220 L90 230 Z" className="hover:fill-blue-600/40 cursor-pointer transition-colors" data-title="Mysuru" stroke="#1E4D92" strokeWidth="1"/>
                <path d="M90 230 L130 220 L110 280 L70 260 Z" className="hover:fill-blue-600/40 cursor-pointer transition-colors" stroke="#1E4D92" strokeWidth="1"/>
              </svg>

              {/* Float Legend */}
              <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-800 p-2 rounded-lg text-[10px] space-y-1 z-10">
                <span className="font-bold text-slate-300 block mb-0.5">Threat Index</span>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span>High Risk Zone</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>Elevated Risk</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  <span>Normal Sector</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section: Latest FIRs Table */}
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-4 mb-4">
            <div>
              <h3 className="font-bold text-white text-lg">Active First Information Reports (FIRs)</h3>
              <p className="text-xs text-slate-400">Real-time case log synchronizing CCTNS databases</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200 rounded-lg text-xs font-semibold transition-colors">
                <Filter className="h-3.5 w-3.5" />
                <span>Filter Districts</span>
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200 rounded-lg text-xs font-semibold transition-colors">
                <Sliders className="h-3.5 w-3.5" />
                <span>Customize Columns</span>
              </button>
            </div>
          </div>

          {/* Table container with horizontal scroll */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-950/20">
                  <th className="py-3 px-4">FIR Number</th>
                  <th className="py-3 px-4">Crime Classification</th>
                  <th className="py-3 px-4">District Sector</th>
                  <th className="py-3 px-4">Police Jurisdiction</th>
                  <th className="py-3 px-4">Registration Date</th>
                  <th className="py-3 px-4 text-center">Threat Rating</th>
                  <th className="py-3 px-4 text-center">Case Status</th>
                  <th className="py-3 px-4 text-right">Intel Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-xs">
                {crimesList.map((crime: any) => (
                  <tr key={crime.id} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400 group-hover:text-blue-300">
                      {crime.fir_number}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {crime.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {crime.district}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {crime.station}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {crime.date}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        crime.severity === "High" 
                          ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                          : crime.severity === "Medium"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        {crime.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold ${
                        crime.status === "Under Investigation" 
                          ? "text-blue-400" 
                          : crime.status === "FIR Registered"
                          ? "text-amber-400"
                          : "text-slate-500"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          crime.status === "Under Investigation" 
                            ? "bg-blue-500 animate-pulse" 
                            : crime.status === "FIR Registered"
                            ? "bg-amber-500"
                            : "bg-slate-600"
                        }`} />
                        {crime.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={() => setSelectedCrime(crime)}
                        className="p-1 px-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-850 hover:border-slate-700 rounded text-[10px] font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1 ml-auto"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Case Inspector side drawer */}
      {selectedCrime && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#061224] border-l border-slate-800 p-6 md:p-8 flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-250">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <span className="font-mono text-xs text-blue-400 font-bold">{selectedCrime.fir_number}</span>
                <h2 className="text-xl font-bold text-white mt-1 leading-snug">{selectedCrime.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedCrime(null)}
                className="p-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Content body */}
            <div className="flex-1 overflow-y-auto py-6 space-y-6">
              
              {/* Core Attributes Grid */}
              <div className="grid grid-cols-2 gap-4 bg-slate-950/40 border border-slate-850 rounded-xl p-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Crime Type</span>
                  <span className="text-xs font-semibold text-slate-200">{selectedCrime.type}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Threat Index</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-0.5 ${
                    selectedCrime.severity === "High" 
                      ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                      : selectedCrime.severity === "Medium"
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {selectedCrime.severity}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Police Station</span>
                  <span className="text-xs text-slate-300">{selectedCrime.station} ({selectedCrime.district})</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Registration Date</span>
                  <span className="text-xs font-mono text-slate-300">{selectedCrime.date}</span>
                </div>
              </div>

              {/* Modus Operandi */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Modus Operandi (M.O.)</h4>
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-850 leading-relaxed text-xs text-slate-300">
                  {selectedCrime.modus_operandi}
                </div>
              </div>

              {/* Suspects linked */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Associated Suspect Profiles</h4>
                <div className="space-y-2">
                  {selectedCrime.suspects.map((suspect: string, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-850">
                      <span className="text-xs font-semibold text-slate-200">{suspect}</span>
                      <button 
                        onClick={() => {
                          setSelectedCrime(null);
                          router.push(`/knowledge-graph?focus=${encodeURIComponent(suspect)}`);
                        }}
                        className="text-[10px] font-bold text-blue-400 hover:text-blue-300 underline"
                      >
                        Inspect Node Link
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Audit Badge */}
              <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-red-500 font-bold text-[10px] uppercase">
                  <Shield className="h-4 w-4" />
                  <span>Audit Trail & Classification</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Access to FIR file records has been registered under active user session logs. This information is classified as law enforcement sensitive and must not be copied or distributed outside police firewalls.
                </p>
              </div>

            </div>

            {/* Footer buttons */}
            <div className="border-t border-slate-800 pt-4 flex gap-3">
              <button 
                onClick={() => {
                  setSelectedCrime(null);
                  router.push(`/ai-assistant?query=Analyze%20links%20for%2520${encodeURIComponent(selectedCrime.fir_number)}`);
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold text-center transition-colors"
              >
                Analyze Case with AI
              </button>
              <button 
                onClick={() => setSelectedCrime(null)}
                className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
