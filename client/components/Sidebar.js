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
  Settings,
  LogOut
} from 'lucide-react';

export default function Sidebar({ mobileMode = false, closeDrawer }) {
  const pathname = usePathname();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'resume', label: 'Resume Builder', icon: FileText, href: '/resume' },
    { id: 'roadmap', label: 'Career Roadmap', icon: Map, href: '/roadmap' },
    { id: 'technologies', label: 'Technologies', icon: Database, href: '/technologies' },
    { id: 'skills', label: 'Skill Analyzer', icon: Target, href: '/skills' },
    { id: 'mentor', label: 'AI Mentor', icon: Sparkles, href: '/mentor' },
  ];

  const handleLinkClick = () => {
    if (closeDrawer) {
      closeDrawer();
    }
  };

  const content = (
    <div className="flex flex-col h-full">
      <div className="p-8">
        <Link href="/" onClick={handleLinkClick} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Prep<span className="text-indigo-400">Sprint</span></span>
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
              onClick={handleLinkClick}
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

      <div className="p-4 mt-auto border-t border-slate-800 flex flex-col gap-2">
        <Link
          href="/account"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
            pathname === '/account' ? 'text-white' : 'hover:text-white'
          }`}
        >
          <User size={18} className="text-slate-500" />
          <span>Account</span>
        </Link>
        <button
          onClick={() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            window.location.href = '/';
          }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full text-left"
        >
          <LogOut size={18} className="text-red-400" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  if (mobileMode) {
    return <div className="flex-1 flex flex-col h-full">{content}</div>;
  }

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 h-screen sticky top-0 flex flex-col border-r border-slate-800">
      {content}
    </aside>
  );
}
