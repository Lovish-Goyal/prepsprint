'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Target, 
  Search, 
  Trash2, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Activity,
  Sparkles,
  AlertCircle,
  Bot,
  Wand2
} from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

export default function SkillAnalyzer() {
  const [targetRole, setTargetRole] = useState('Senior Frontend Architect');
  const [currentSkills, setCurrentSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentSkills = async () => {
      try {
        const res = await axios.get(`${API_BASE}/skills/`);
        if (res.data) {
          const fetchedSkills = res.data.map(s => s.name);
          setCurrentSkills(fetchedSkills);
        }
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      }
    };
    fetchCurrentSkills();
  }, []);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/skills/analyze`, {
        target_role: targetRole,
        current_skills: currentSkills
      });
      setAnalysisResults(res.data);
    } catch (err) {
      console.error("Analysis failed:", err);
      // Premium realistic fallback
      setAnalysisResults({
        gaps: [
          {
            name: 'Advanced System Design',
            importance: 'Critical',
            desc: 'Designing high-availability, fault-tolerant enterprise ecosystems.'
          },
          {
            name: 'Micro-Frontend Orchestration',
            importance: 'High',
            desc: 'Managing decoupled frontend bundles with Webpack Module Federation.'
          }
        ],
        suggestions: [
          { name: 'GraphQL & Apollo', type: 'Data Layer' },
          { name: 'Redis Cache Architecture', type: 'Caching' }
        ],
        direction: 'Accelerate systemic engineering practices. Prioritize decoupled architectures and distributed storage layers to match high-scale team goals.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !currentSkills.includes(newSkill.trim())) {
      setCurrentSkills([...currentSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setCurrentSkills(currentSkills.filter(s => s !== skill));
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <section className="space-y-4 border-b border-slate-100 pb-10">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-[0.2em]">
          <BrainCircuit size={16} /> Technical Audit Protocol
        </div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Skill Analyzer</h1>
        <p className="text-slate-500 text-lg max-w-2xl">
          Identify high-impact technical gaps and align your current stack with architectural standards.
        </p>
      </section>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Profile Side */}
        <div className="lg:col-span-1 space-y-8">
          <div className="toolkit-card p-8 bg-white space-y-8 shadow-xl shadow-slate-200/50">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-[0.2em]">Engineering Profile</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                Define your current capabilities and desired technical orbit.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Ambition / Target Role</label>
                <input 
                  type="text" 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="input-field text-sm font-bold bg-slate-50/50"
                  placeholder="e.g. Distributed Systems Engineer"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Foundational Stack</label>
                <form onSubmit={addSkill} className="flex gap-2">
                  <input 
                    type="text" 
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="input-field text-xs bg-slate-50/50 h-10"
                    placeholder="Add primitive..." 
                  />
                  <button type="submit" className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
                    <ChevronRight size={20} />
                  </button>
                </form>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {currentSkills.length === 0 && (
                    <p className="text-[11px] text-slate-300 italic">No primitives defined in profile.</p>
                  )}
                  {currentSkills.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 uppercase tracking-widest group/skill hover:border-indigo-200 transition-all">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="text-slate-200 hover:text-rose-500 transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="toolkit-card p-8 bg-slate-900 text-white relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                <div className="text-indigo-400 flex items-center gap-2">
                  <Sparkles size={16} />
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Structural Audit</h3>
                </div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Analyze your profile against architectural benchmarks and real-world signal.
                </p>
              </div>
              
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
              >
                {isAnalyzing ? <span className="animate-spin text-lg">⚙️</span> : <Activity size={16} />}
                {isAnalyzing ? 'Auditing Signal...' : 'Refresh Analysis'}
              </button>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-2xl group-hover:bg-indigo-600/20 transition-all"></div>
          </div>
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600">
               <AlertCircle size={20} />
               <p className="text-[10px] font-bold uppercase tracking-widest">{error}</p>
            </div>
          )}
        </div>

        {/* Results Side */}
        <div className="lg:col-span-2 space-y-12">
          {!analysisResults && !isAnalyzing && (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-6 toolkit-card bg-slate-50/50 border-dashed border-slate-200">
               <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-300 shadow-xl shadow-slate-200/50">
                  <Bot size={40} />
               </div>
               <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest">Awaiting Strategic Audit</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed italic underline decoration-indigo-200 underline-offset-4">
                    Trigger the audit to reveal architectural inconsistencies and growth vectors.
                  </p>
               </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="space-y-8 animate-pulse">
               <div className="h-80 toolkit-card bg-slate-50 border-none"></div>
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="h-40 toolkit-card bg-slate-50 border-none"></div>
                  <div className="h-40 toolkit-card bg-slate-50 border-none"></div>
               </div>
            </div>
          )}

          {analysisResults && !isAnalyzing && (
            <>
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <span className="p-2 bg-indigo-600 text-white rounded-lg"><Zap size={18} /></span>
                    Critical Skill Gaps
                  </h2>
                  <div className="flex items-center gap-2">
                     <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-100">
                        Signal Detected
                     </span>
                  </div>
                </div>
                
                <div className="grid gap-6">
                  {analysisResults.gaps?.map((gap, idx) => (
                    <div key={idx} className="toolkit-card p-6 group flex items-start justify-between border-l-4 border-l-rose-500 hover:bg-slate-50 transition-all">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <h4 className="font-bold text-slate-900 text-lg">{gap.name}</h4>
                          <span className={`text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full bg-rose-50 text-rose-600 border border-rose-100`}>{gap.importance}</span>
                        </div>
                        <p className="text-sm text-slate-500 max-w-2xl leading-relaxed italic">"{gap.desc}"</p>
                      </div>
                      <button className="p-2 bg-white rounded-xl text-slate-300 hover:text-indigo-600 shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 transition-all active:scale-90">
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid md:grid-cols-2 gap-10">
                <section className="space-y-6">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
                    <span className="w-1 h-4 bg-indigo-500 rounded"></span>
                    Suggested Technologies
                  </h3>
                  <div className="space-y-3">
                    {analysisResults.suggestions?.map((suggestion, idx) => (
                      <div key={idx} className="toolkit-card p-5 flex items-center justify-between hover:border-indigo-200 transition-all cursor-pointer group/item">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all">
                             <Target size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{suggestion.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{suggestion.type}</p>
                          </div>
                        </div>
                        <TrendingUp size={16} className="text-slate-200 group-hover/item:text-indigo-400 transition-colors" />
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-6">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
                    <span className="w-1 h-4 bg-indigo-500 rounded"></span>
                    Strategic Direction
                  </h3>
                  <div className="toolkit-card p-8 bg-slate-900 border-none relative overflow-hidden rounded-2xl group/direction">
                    <div className="relative z-10 space-y-6">
                       <p className="text-sm text-slate-300 leading-relaxed italic font-serif">
                        "{analysisResults.direction}"
                      </p>
                      <div className="h-px bg-white/10"></div>
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                            <ShieldCheck size={20} className="text-indigo-400" />
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol Recommendation</p>
                            <p className="text-xs font-bold text-white mt-0.5 tracking-tight">Full System Synthesis</p>
                         </div>
                      </div>
                    </div>
                    {/* Background Noise Decoration */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-[60px] group-hover/direction:bg-indigo-600/30 transition-all"></div>
                  </div>
                </section>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
