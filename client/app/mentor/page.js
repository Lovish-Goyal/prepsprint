'use client';

import ChatComponent from '@/components/ChatComponent';
import { Sparkles, MessageSquare, Terminal, FileSearch, ShieldCheck } from 'lucide-react';

export default function MentorPage() {
  const presets = [
    { title: 'Architectural Review', desc: 'Get feedback on your system design choices.', icon: <Terminal size={18} /> },
    { title: 'Resume Section Audit', desc: 'In-depth analysis of your experience narratives.', icon: <FileSearch size={18} /> },
    { title: 'Tech Stack Strategy', desc: 'Identify optimal tools for your next big project.', icon: <Sparkles size={18} /> },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-[0.2em]">
          <Sparkles size={16} /> Technical Advisory
        </div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">AI Mentor</h1>
        <p className="text-slate-500 text-lg max-w-3xl">
          High-level architectural consulting and career strategy powered by specialized language models.
        </p>
      </section>

      <div className="grid lg:grid-cols-4 gap-10 min-h-[600px]">
        {/* Chat Main */}
        <div className="lg:col-span-3 flex flex-col toolkit-card bg-white overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                <Terminal size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Pathfinder-V4 Protocol</p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Consultant Online
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <ShieldCheck size={14} className="text-indigo-500" />
              Secure Session
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatComponent />
          </div>
        </div>

        {/* Sidebar / Presets */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Consultation Presets</h3>
            <div className="space-y-3">
              {presets.map((preset, idx) => (
                <button 
                  key={idx} 
                  className="w-full toolkit-card p-4 text-left group hover:border-indigo-400 transition-all bg-white"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 mb-3 flex items-center justify-center group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                    {preset.icon}
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">{preset.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{preset.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="toolkit-card p-6 bg-slate-50 border-dashed border-slate-300">
            <div className="flex items-center gap-2 text-indigo-600 mb-3">
              <MessageSquare size={16} />
              <p className="text-[10px] font-bold uppercase tracking-widest">Context Awareness</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pathfinder has access to your <span className="font-bold text-slate-700">Resume Draft V1</span> and <span className="font-bold text-slate-700">Frontend Roadmap</span> for context-aware assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

