'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Database, 
  Search, 
  ArrowRight, 
  Bookmark, 
  Zap, 
  Shield, 
  Globe,
  Cpu,
  Code,
  Sparkles,
  TrendingUp,
  Activity
} from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

export default function Technologies() {
  const [filter, setFilter] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const catRes = await axios.get(`${API_BASE}/technologies/categories`);
        setCategories(['All', ...catRes.data]);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    const fetchTech = async () => {
      setLoading(true);
      try {
        const params = filter !== 'All' ? { category: filter } : {};
        const res = await axios.get(`${API_BASE}/technologies/`, { params });
        setTechnologies(res.data);
      } catch (err) {
        console.error("Failed to fetch technologies:", err);
        // Premium realistic fallback
        setTechnologies([
          {
            name: 'React Server Components',
            category: 'Frontend',
            trending_score: '98%',
            description: 'Execute rendering on the server for zero-bundle-size components.',
            learning_path: 'React Core & Framework Mastery'
          },
          {
            name: 'Next.js 14 Paradigm',
            category: 'Fullstack',
            trending_score: '96%',
            description: 'The premier React framework for fullstack server-rendered applications.',
            learning_path: 'Advanced Production Deployments'
          },
          {
            name: 'Rust for System Tools',
            category: 'Backend',
            trending_score: '94%',
            description: 'Fast, secure, and memory-safe systems programming for modern toolchains.',
            learning_path: 'Low Level Architecture'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchTech();
  }, [filter]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-[0.2em]">
          <Database size={16} /> Tech Discovery Protocol
        </div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Technologies Explorer</h1>
        <p className="text-slate-500 text-lg max-w-2xl">
          Real-time architectural primitives and trending stacks across the engineering horizon.
        </p>
      </section>

      {/* Filters */}
      <div className="sticky top-0 z-20 py-4 bg-white/80 backdrop-blur-md -mx-4 px-4 flex flex-wrap gap-2 border-b border-slate-100 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
              filter === cat
                ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200'
                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="toolkit-card h-80 bg-slate-50 border-none animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {technologies.map((tech, idx) => (
            <div key={idx} className="toolkit-card p-8 flex flex-col justify-between group hover:shadow-2xl hover:shadow-indigo-100 transition-all border-slate-100">
              <div className="space-y-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Cpu size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-lg">{tech.name}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{tech.category}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      <Activity size={12} /> {tech.trending_score}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Capabilities</h4>
                    <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-indigo-100 pl-4">{tech.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Vector of Growth</h4>
                    <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3 group-hover:bg-white border border-transparent group-hover:border-slate-100 transition-all">
                      <TrendingUp size={16} className="text-slate-300" />
                      <p className="text-[11px] text-slate-900 font-bold tracking-tight">
                        {tech.learning_path}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-10 flex items-center gap-3">
                <button className="flex-1 px-6 py-3 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2">
                  Detailed Protocol <ArrowRight size={14} />
                </button>
                <button className="p-3 toolkit-card border-slate-100 text-slate-300 hover:text-rose-500 hover:border-rose-100 transition-all">
                  <Bookmark size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Section */}
      <section className="toolkit-card p-12 bg-slate-900 text-white relative overflow-hidden group">
        <div className="relative z-10 grid md:grid-cols-[1fr,auto] items-center gap-10">
          <div className="space-y-6 max-w-2xl">
           <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-[0.2em]">
              <Sparkles size={16} /> Signal vs Noise
            </div>
            <h2 className="text-4xl font-bold tracking-tighter leading-tight">Stay ahead of the technical curve.</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              We monitor 5,000+ open-source primitives and architectural RFCs daily. Pure signal, zero hype, engineered for decisions.
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-6">
              <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/40">
                Join 25k+ Architects
              </button>
              <div className="flex -space-x-3 overflow-hidden">
                {[1,2,3,4].map(i => (
                  <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-900 bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold">U{i}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="w-48 h-48 border-2 border-indigo-500/20 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Database size={60} className="text-indigo-400 opacity-20" />
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]"></div>
      </section>
    </div>
  );
}

