'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Map, 
  Database, 
  Sparkles, 
  FileText,
  Target,
  User,
  ShieldCheck,
  Settings
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'resume', label: 'Resume Builder', icon: FileText, href: '/resume' },
    { id: 'roadmap', label: 'Career Roadmap', icon: Map, href: '/roadmap' },
    { id: 'technologies', label: 'Technologies', icon: Database, href: '/technologies' },
    { id: 'skills', label: 'Skill Analyzer', icon: Target, href: '/skills' },
    { id: 'mentor', label: 'AI Mentor', icon: Sparkles, href: '/mentor' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 h-screen sticky top-0 flex flex-col border-r border-slate-800">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
            P
          </div>
          <span className="text-xl font-bold text-white tracking-tight">PrepSprint</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-4 mb-4">
          Toolkit
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                isActive
                  ? 'bg-slate-800 text-white shadow-sm shadow-black/20'
                  : 'hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-indigo-400' : 'text-slate-500'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800">
        <Link
          href="/account"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
            pathname === '/account' ? 'text-white' : 'hover:text-white'
          }`}
        >
          <User size={18} className="text-slate-500" />
          <span>Account</span>
        </Link>
        <div className="mt-4 px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Status</p>
          <div className="flex items-center gap-2 text-xs text-white font-medium">
            <ShieldCheck size={14} className="text-emerald-400" />
            Verified Member
          </div>
        </div>
      </div>
    </aside>
  );
}
