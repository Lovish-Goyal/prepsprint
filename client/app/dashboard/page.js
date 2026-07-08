'use client';

import Link from 'next/link';
import { 
  FileText, 
  Map, 
  Database, 
  Target, 
  Sparkles, 
  ArrowRight, 
  Zap
} from 'lucide-react';

export default function Dashboard() {
  const tools = [
    {
      title: 'Resume Builder',
      description: 'Create an ATS-optimized professional resume.',
      action: 'Create Resume',
      href: '/resume',
      icon: FileText,
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      title: 'Career Roadmap',
      description: 'Structured blueprints for technical role mastery.',
      action: 'View Roadmap',
      href: '/roadmap',
      icon: Map,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Technologies',
      description: 'Discover trending and emerging tech stacks.',
      action: 'Explore Tech',
      href: '/technologies',
      icon: Database,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Skill Analyzer',
      description: 'Identify skill gaps for your target positions.',
      action: 'Analyze Skills',
      href: '/skills',
      icon: Target,
      color: 'bg-rose-50 text-rose-600',
    },
    {
      title: 'AI Mentor',
      description: 'Get instant architectural and career guidance.',
      action: 'Start Chat',
      href: '/mentor',
      icon: Sparkles,
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Toolkit Dashboard</h1>
          <p className="text-slate-500 mt-2 text-lg">Select a tool to start architecting your professional growth.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Zap size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Tool</p>
            <p className="text-sm font-bold text-slate-900">Resume Builder</p>
          </div>
        </div>
      </section>

      {/* Toolkit Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Your Toolkit</h2>
          <Link href="/account" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            Manage Account <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <div key={idx} className="toolkit-card p-6 flex flex-col justify-between group hover:border-indigo-100 hover:shadow-md transition-all bg-white rounded-2xl border border-slate-200 min-h-[220px]">
                <div>
                  <div className={`w-12 h-12 rounded-xl ${tool.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-sm`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{tool.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">{tool.description}</p>
                </div>
                <Link 
                  href={tool.href}
                  className="text-sm font-bold text-indigo-650 hover:text-indigo-750 flex items-center gap-1.5 transition-colors group/link mt-auto"
                >
                  {tool.action}
                  <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
