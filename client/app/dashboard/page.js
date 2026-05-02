'use client';

import Link from 'next/link';
import { 
  FileText, 
  Map, 
  Database, 
  Target, 
  Sparkles, 
  ArrowRight, 
  ExternalLink,
  Zap,
  Clock
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

  const recentActivity = [
    { tool: 'Resume Builder', project: 'Software Engineer CV', time: '2 hours ago' },
    { tool: 'Roadmap', project: 'Senior Frontend Path', time: 'Yesterday' },
    { tool: 'Technologies', project: 'Next.js 14 Guide', time: '2 days ago' },
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
              <div key={idx} className="toolkit-card p-6 flex flex-col justify-between group">
                <div>
                  <div className={`w-12 h-12 rounded-xl ${tool.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{tool.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">{tool.description}</p>
                </div>
                <Link 
                  href={tool.href}
                  className="btn-primary w-full text-center flex items-center justify-center gap-2 group/btn"
                >
                  {tool.action}
                  <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Recent Activity */}
        <section className="lg:col-span-1">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Clock size={20} className="text-slate-400" /> Recent Activity
          </h2>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className={`p-4 flex items-center justify-between group cursor-pointer hover:bg-slate-50 transition-colors ${idx !== recentActivity.length - 1 ? 'border-b border-slate-100' : ''}`}>
                <div>
                  <p className="text-sm font-bold text-slate-900">{activity.project}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{activity.tool}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-slate-400 mb-1">{activity.time}</p>
                  <ExternalLink size={14} className="text-slate-300 ml-auto group-hover:text-indigo-500 transition-colors" />
                </div>
              </div>
            ))}
            <button className="w-full py-3 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-colors">
              View All History
            </button>
          </div>
        </section>

        {/* Editorial Feed */}
        <section className="lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Discovery & Insights</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="toolkit-card p-6 border-slate-800 bg-slate-900 text-white group">
              <div className="badge-indigo bg-indigo-500/20 text-indigo-300 mb-4 inline-block">Architecture</div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-indigo-300 transition-colors">The Micro-Frontend Dilemma</h3>
              <p className="text-sm text-slate-400 mb-6">Expert analysis on when to decouple your presentation layer.</p>
              <Link href="#" className="text-sm font-bold flex items-center gap-2 text-white">
                Read Analysis <ArrowRight size={16} />
              </Link>
            </div>
            <div className="toolkit-card p-6 group border-dashed bg-slate-50/50">
              <div className="badge-gray mb-4 inline-block">Career Strategy</div>
              <h3 className="text-lg font-bold mb-2">Architecting Your First 90 Days</h3>
              <p className="text-sm text-slate-500 mb-6">A framework for newly promoted Senior Engineering leaders.</p>
              <Link href="#" className="text-sm font-bold flex items-center gap-2 text-indigo-600">
                View Blueprint <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
