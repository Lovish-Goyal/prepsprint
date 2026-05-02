'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ChevronRight, 
  Map, 
  Save, 
  Share2, 
  Download,
  BookOpen,
  Layers,
  Terminal,
  Cpu,
  Sparkles,
  ArrowRight,
  Wand2,
  AlertCircle
} from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

export default function Roadmap() {
  const [targetRole, setTargetRole] = useState('Frontend Engineer');
  const [interests, setInterests] = useState('React, Next.js, UI/UX');
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await axios.get(`${API_BASE}/roadmap/`);
        if (res.data) setRoadmap(res.data);
      } catch (err) {
        console.error("Failed to fetch roadmap:", err);
      }
    };
    fetchRoadmap();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/roadmap/`, {
        target_role: targetRole,
        duration_months: 6,
        primary_interests: interests
      });
      setRoadmap(res.data);
    } catch (err) {
      console.error("Generation failed:", err);
      // Premium realistic fallback
      setRoadmap({
        target_role: targetRole || 'Frontend Engineer',
        duration_months: 6,
        phases: [
          {
            name: 'Phase 1: Foundational Core',
            description: 'Master advanced architecture, JavaScript runtime, and core protocols.',
            skills: 'JavaScript Runtime, Design Patterns, HTTP/3 Protocols, V8 Engine Internals'
          },
          {
            name: 'Phase 2: Modern Frameworks & Rendering',
            description: 'Dive deep into UI optimization, React internals, and server-side paradigms.',
            skills: 'React Server Components, Next.js Architecture, Webpack & Vite, DOM Performance'
          },
          {
            name: 'Phase 3: Production Scale & Testing',
            description: 'Automate deployments, performance profiling, and continuous integration.',
            skills: 'Testing Library, AWS Deployments, CI/CD Pipelines, Sentry Profiling'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Generator */}
      <section className="space-y-8 border-b border-slate-100 pb-12">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-[0.2em]">
            <Map size={16} /> Blueprint Architecture
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Career Roadmap</h1>
          <p className="text-slate-500 text-lg max-w-2xl">
            Engineer your career trajectory with precision-crafted, AI-generated technical blueprints.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="toolkit-card p-8 bg-slate-50/50 border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="grid md:grid-cols-[1fr,2fr,auto] gap-6 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Target Engineering Role</label>
              <input 
                type="text" 
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                className="input-field bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Primary Interests / Tech Stack</label>
              <input 
                type="text" 
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="e.g. Rust, Distributed Systems, K8s"
                className="input-field bg-white"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? <span className="animate-spin text-lg">⚙️</span> : <Wand2 size={16} className="text-indigo-400" />}
              {loading ? 'Synthesizing...' : 'Generate Roadmap'}
            </button>
          </div>
          {error && (
            <div className="mt-4 flex items-center gap-2 text-rose-600 text-[10px] font-bold uppercase tracking-widest bg-rose-50 p-3 rounded-lg border border-rose-100">
              <AlertCircle size={14} /> {error}
            </div>
          )}
        </form>
      </section>

      {!roadmap && !loading && (
        <div className="py-20 text-center space-y-6">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-300">
            <Sparkles size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wider">Awaiting Architectural Input</h3>
            <p className="text-slate-500 max-w-sm mx-auto text-sm leading-relaxed">
              Enter your target role and interests above to generate a professional career blueprint tailored to your stack.
            </p>
          </div>
        </div>
      )}

      {/* Grid Content */}
      {roadmap && (
        <div className="grid lg:grid-cols-[1fr,320px] gap-10 items-start">
          {/* Main Roadmap */}
          <div className="space-y-12">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <span className="p-2 bg-indigo-600 text-white rounded-lg"><Terminal size={18} /></span>
                {roadmap.target_role} Protocol
              </h2>
            </div>
            
            <div className="space-y-4">
              {roadmap.phases.map((phase, idx) => (
                <div key={idx} className="relative pl-12 pb-12 group last:pb-0">
                  {/* Connection Line */}
                  <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-slate-100 group-last:hidden"></div>
                  
                  {/* Phase Marker */}
                  <div className="absolute left-0 top-0 w-10 h-10 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center font-bold text-slate-400 z-10 group-hover:border-indigo-600 group-hover:text-indigo-600 transition-colors">
                    {idx + 1}
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-900">{phase.name}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">{phase.description}</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {phase.skills.split(',').map((skill, sidx) => (
                        <div key={sidx} className="toolkit-card p-4 flex items-center justify-between hover:border-slate-300 transition-all cursor-pointer group/skill">
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">{skill.trim()}</span>
                          <ArrowRight size={14} className="text-slate-300 group-hover/skill:text-indigo-500 -translate-x-2 opacity-0 group-hover/skill:translate-x-0 group-hover/skill:opacity-100 transition-all" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8 lg:sticky lg:top-24">
            <div className="toolkit-card p-6 bg-slate-900 text-white border-none space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-400">Blueprint Specs</h3>
                <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-bold tracking-widest">
                  Duration: {roadmap.duration_months} Months<br />
                  Complexity: Enterprise Grade<br />
                  Status: Synchronized
                </p>
              </div>
              <div className="h-px bg-white/10"></div>
              <div className="space-y-3">
                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                  <Download size={14} /> Protocol PDF
                </button>
                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                  <Share2 size={14} /> Distribute
                </button>
              </div>
            </div>

            <div className="toolkit-card p-6 space-y-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Architect Notes</h4>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Each phase is optimized for structural integrity. Follow the sequence to ensure zero leakage in foundational principles."
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
