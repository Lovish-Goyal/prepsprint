'use client';

import { useAuth } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import { usePathname } from 'next/navigation';
import { Search, Bell, User } from 'lucide-react';

export default function LayoutContent({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // Pages that use the Sidebar layout
  const toolkitRoutes = ['/dashboard', '/resume', '/roadmap', '/technologies', '/skills', '/mentor', '/account'];
  const isToolkitPage = toolkitRoutes.some(route => pathname?.startsWith(route));
  
  // Auth pages (no navbar/footer/sidebar)
  const isAuthPage = pathname?.startsWith('/auth');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading Workspace...</p>
        </div>
      </div>
    );
  }

  if (isAuthPage) {
    return children;
  }

  if (isToolkitPage) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-lg w-96">
              <Search size={16} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search tools, technologies, insights..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-6">
              <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-8 w-[1px] bg-slate-200"></div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 leading-none">{user?.name || 'Developer'}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-1">Free Tier</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden">
                  {user?.image ? <img src={user.image} alt="Profile" className="w-full h-full object-cover" /> : <User size={20} className="text-slate-400" />}
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
