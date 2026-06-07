"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  FolderOpen, 
  User, 
  FileText, 
  MapPin, 
  Plus, 
  Trash2, 
  Link2, 
  Clock, 
  Sparkles,
  Info,
  CheckCircle,
  FileCheck
} from "lucide-react";

interface SuspectCard {
  id: string;
  name: string;
  role: string;
  rating: number;
  status: string;
  linkedEvidence: string[];
}

interface EvidenceCard {
  id: string;
  title: string;
  type: string;
  registeredDate: string;
  desc: string;
}

interface StickyNote {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

const INITIAL_SUSPECTS: SuspectCard[] = [
  { id: "s1", name: "Vicky Saluja", role: "Ringleader / Auto Smuggler", rating: 9.4, status: "Wanted / Active", linkedEvidence: ["e1", "e3"] },
  { id: "s2", name: "Aslam Khan", role: "Logistics Broker", rating: 8.8, status: "Under Surveillance", linkedEvidence: ["e1"] },
  { id: "s3", name: "Kariya Raja", role: "House Burglar", rating: 9.1, status: "Active in Mysuru", linkedEvidence: ["e2"] }
];

const INITIAL_EVIDENCE: EvidenceCard[] = [
  { id: "e1", title: "Toyota Fortuner (KA-01-MJ-4001)", type: "Asset", registeredDate: "2026-06-02", desc: "Intercepted at border checkpoint. GPS logs confirm Koramangala theft connection." },
  { id: "e2", title: "Getaway Motorcycle CCTV Capture", type: "Media", registeredDate: "2026-06-05", desc: "Pulsar 220 with obscured plate spotted speeding away from Vidyaranyapuram burglary." },
  { id: "e3", title: "Burner SIM Cellular Tower Overlaps", type: "Telecom", registeredDate: "2026-06-03", desc: "Calls made from border cell towers match Vicky's transit timings precisely." }
];

const INITIAL_NOTES: StickyNote[] = [
  { id: "n1", author: "Inspector K. Murthy", content: "Whitefield ATM jackpotting footprint matches Ramesh Kumar's coding signatures exactly. Check his associates' local tower pings.", timestamp: "2026-06-06 14:30" },
  { id: "n2", author: "SI Shivaraj", content: "Kariya Raja sighted in Kuvempunagar sector. Deploying unmarked scouts near Vidyaranyapuram window-breaking sites.", timestamp: "2026-06-05 18:15" }
];

export default function InvestigationBoardPage() {
  const [suspects, setSuspects] = useState<SuspectCard[]>(INITIAL_SUSPECTS);
  const [evidence, setEvidence] = useState<EvidenceCard[]>(INITIAL_EVIDENCE);
  const [notes, setNotes] = useState<StickyNote[]>(INITIAL_NOTES);

  // New Note Form States
  const [noteContent, setNoteContent] = useState("");
  const [authorName, setAuthorName] = useState("Officer");

  // Selection states for linking
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    const newNote: StickyNote = {
      id: "note-" + Date.now(),
      author: authorName || "Officer",
      content: noteContent,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    setNotes([newNote, ...notes]);
    setNoteContent("");
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const deleteSuspect = (id: string) => {
    setSuspects(suspects.filter(s => s.id !== id));
  };

  const deleteEvidence = (id: string) => {
    setEvidence(evidence.filter(e => e.id !== id));
  };

  const handleLinkElements = () => {
    if (!selectedSuspectId || !selectedEvidenceId) return;

    setSuspects(prevSuspects => 
      prevSuspects.map(s => {
        if (s.id === selectedSuspectId) {
          // Add evidence if not already linked
          const updatedEvidence = s.linkedEvidence.includes(selectedEvidenceId)
            ? s.linkedEvidence
            : [...s.linkedEvidence, selectedEvidenceId];
          return { ...s, linkedEvidence: updatedEvidence };
        }
        return s;
      })
    );

    // Reset selection
    setSelectedSuspectId(null);
    setSelectedEvidenceId(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 h-full flex flex-col">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">Active Investigation Board</h1>
            <p className="text-sm text-slate-400">Officer case workspace, pinned dossier links, and analytical case notes</p>
          </div>
          
          <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 p-2 text-xs font-mono text-slate-400">
            <FolderOpen className="h-4 w-4 text-blue-400" />
            <span>CASE: CR-BLR-2026-AUTO-T</span>
          </div>
        </div>

        {/* Board Operations Panel */}
        <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Link Manager:</span>
            <div className="flex gap-2">
              <select
                className="bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-2 text-slate-200 focus:outline-none"
                value={selectedSuspectId || ""}
                onChange={(e) => setSelectedSuspectId(e.target.value || null)}
              >
                <option value="">-- Select Suspect --</option>
                {suspects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              
              <span className="text-slate-500 font-semibold mt-1.5">&#8596;</span>

              <select
                className="bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-2 text-slate-200 focus:outline-none"
                value={selectedEvidenceId || ""}
                onChange={(e) => setSelectedEvidenceId(e.target.value || null)}
              >
                <option value="">-- Select Evidence --</option>
                {evidence.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.title}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleLinkElements}
              disabled={!selectedSuspectId || !selectedEvidenceId}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-600/10 flex items-center gap-1"
            >
              <Link2 className="h-3.5 w-3.5" />
              <span>Link Pinned Elements</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-[10px] text-slate-455 font-medium">
            <Info className="h-3.5 w-3.5 text-blue-400 shrink-0" />
            <span>Changes persist locally in the active officer console view.</span>
          </div>
        </div>

        {/* Pinboard Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* COLUMN 1: PINNED SUSPECTS */}
          <div className="space-y-4 bg-slate-900/20 border border-slate-850 rounded-2xl p-5">
            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
              <span className="text-xs font-bold text-slate-350 uppercase tracking-wider flex items-center gap-1.5">
                <User className="h-4 w-4 text-blue-400" /> Pinned Suspects
              </span>
              <span className="text-[10px] bg-blue-950 text-blue-400 px-2 py-0.5 rounded font-bold">{suspects.length}</span>
            </div>

            <div className="space-y-3">
              {suspects.map((suspect) => (
                <div key={suspect.id} className="p-4 bg-slate-950/60 border border-slate-850 rounded-xl space-y-3 relative group hover:border-slate-700/80 transition-all">
                  
                  {/* Delete button */}
                  <button 
                    onClick={() => deleteSuspect(suspect.id)}
                    className="absolute top-3 right-3 text-slate-650 hover:text-red-400 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase block font-mono">Dossier Profile</span>
                    <h4 className="font-bold text-white text-sm mt-0.5">{suspect.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{suspect.role}</p>
                  </div>

                  <div className="flex justify-between items-center text-[10px]">
                    <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                      suspect.status.includes("Wanted") ? "bg-red-500/10 text-red-400" : "bg-blue-500/10 text-blue-400"
                    }`}>
                      {suspect.status}
                    </span>
                    <span className="text-red-400 font-bold">Threat: {suspect.rating}/10</span>
                  </div>

                  {/* Linked evidence indicator */}
                  {suspect.linkedEvidence.length > 0 && (
                    <div className="border-t border-slate-900 pt-2.5 space-y-1.5">
                      <span className="text-[9px] font-bold text-slate-500 block uppercase">Linked Case Assets ({suspect.linkedEvidence.length})</span>
                      <div className="flex flex-wrap gap-1">
                        {suspect.linkedEvidence.map((evId) => {
                          const evObj = evidence.find(e => e.id === evId);
                          return evObj ? (
                            <span 
                              key={evId}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-900 border border-slate-800 text-[8px] font-semibold text-slate-300 rounded"
                              title={evObj.desc}
                            >
                              <FileCheck className="h-2.5 w-2.5 text-blue-400" />
                              {evObj.title.split(" (")[0]}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 2: KEY CASE EVIDENCE */}
          <div className="space-y-4 bg-slate-900/20 border border-slate-850 rounded-2xl p-5">
            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
              <span className="text-xs font-bold text-slate-350 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-amber-500" /> Pinned Case Assets
              </span>
              <span className="text-[10px] bg-amber-950 text-amber-400 px-2 py-0.5 rounded font-bold">{evidence.length}</span>
            </div>

            <div className="space-y-3">
              {evidence.map((ev) => (
                <div key={ev.id} className="p-4 bg-slate-950/60 border border-slate-850 rounded-xl space-y-2 relative group hover:border-slate-700/80 transition-all">
                  
                  {/* Delete button */}
                  <button 
                    onClick={() => deleteEvidence(ev.id)}
                    className="absolute top-3 right-3 text-slate-650 hover:text-red-400 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase block font-mono">{ev.type} File</span>
                      <h4 className="font-bold text-white text-xs mt-0.5 leading-snug">{ev.title}</h4>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-normal">{ev.desc}</p>
                  
                  <div className="text-[9px] text-slate-500 font-mono">
                    ADDED: {ev.registeredDate}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 3: CASE TIMELINE NOTES */}
          <div className="space-y-4 bg-slate-900/20 border border-slate-850 rounded-2xl p-5 h-full flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
              <span className="text-xs font-bold text-slate-350 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-emerald-400" /> Officer Logs & Notes
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-bold">{notes.length}</span>
            </div>

            {/* Note entry Form */}
            <form onSubmit={handleAddNote} className="space-y-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-850">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Officer name"
                  className="w-1/3 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-200 placeholder-slate-650 focus:outline-none"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                />
                <span className="text-[10px] text-slate-500 mt-2">writes log:</span>
              </div>
              <textarea
                placeholder="Type critical observation or case link details..."
                rows={2}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200 placeholder-slate-650 focus:outline-none resize-none"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
              <button
                type="submit"
                className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] font-bold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Pin Observation</span>
              </button>
            </form>

            {/* Sticky Notes Feed */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[340px]">
              {notes.map((note) => (
                <div key={note.id} className="p-3.5 bg-amber-950/5 hover:bg-amber-950/10 border border-amber-900/25 rounded-xl space-y-2 relative group transition-colors">
                  
                  {/* Delete button */}
                  <button 
                    onClick={() => deleteNote(note.id)}
                    className="absolute top-2 right-2 text-slate-600 hover:text-red-400 p-0.5 rounded transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>

                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">
                      {note.author}
                    </span>
                    <span className="text-[8px] text-slate-500 font-mono">{note.timestamp}</span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-normal font-sans">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
