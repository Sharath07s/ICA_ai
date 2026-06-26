"use client";

import React, { useState } from "react";
import { BrainCircuit, Send, Search } from "lucide-react";

export default function OfficerCopilot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: "user", content: input };
    setMessages([...messages, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/officer/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMsg.content })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: "assistant", ...data }]);
      }
    } catch (err) {
      console.warn(err);
      setMessages(prev => [...prev, { role: "assistant", response: "System error contacting Copilot uplink." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[600px] bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-xl">
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
            <BrainCircuit className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">AI Officer Copilot</h3>
            <p className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase">Secured & Grounded</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-50">
            <BrainCircuit className="h-10 w-10 text-blue-500 mb-3" />
            <p className="text-sm font-bold text-slate-400">"What should I investigate next?"</p>
          </div>
        )}
        
        {messages?.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-xl p-3 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 border border-slate-700'}`}>
              {msg.role === 'user' ? (
                <p className="text-sm">{msg.content}</p>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-slate-200">{msg.response}</p>
                  
                  {msg.priority_actions && msg.priority_actions.length > 0 && (
                    <div className="bg-slate-900 p-2 rounded border border-slate-700">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-1">Priority Actions</span>
                      <ul className="text-xs text-slate-300 list-disc pl-4 space-y-1">
                        {msg.priority_actions?.map((act: string, j: number) => <li key={j}>{act}</li>)}
                      </ul>
                    </div>
                  )}
                  
                  {msg.evidence_used && msg.evidence_used.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {msg.evidence_used?.map((ev: string, j: number) => (
                        <span key={j} className="text-[9px] font-mono bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                          SOURCE: {ev}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-xl p-3 border border-slate-700">
              <span className="text-sm text-slate-400 flex items-center gap-2">
                <Search className="h-4 w-4 animate-spin text-blue-500" /> Querying Databases...
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Copilot for tactical advice..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 rounded flex items-center justify-center transition-colors"
          >
            <Send className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
