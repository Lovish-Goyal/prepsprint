'use client';

import { useAuth } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import { usePathname } from 'next/navigation';
import { Search, Bell, User, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LayoutContent({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [globalCreditWarning, setGlobalCreditWarning] = useState(null);

  useEffect(() => {
    const handleCreditError = (e) => {
      setGlobalCreditWarning(
        e.detail || "AI Provider Credits Exceeded: Please recharge your OpenRouter credit balance to continue using live AI features."
      );
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('ai-credits-exceeded', handleCreditError);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('ai-credits-exceeded', handleCreditError);
      }
    };
  }, []);

  // Pages that use the Sidebar layout
  const toolkitRoutes = ['/dashboard', '/resume', '/roadmap', '/technologies', '/skills', '/mentor', '/account'];
  const isToolkitPage = toolkitRoutes.some(route => pathname?.startsWith(route));
  
  // Auth pages (no navbar/footer/sidebar)
  const isAuthPage = pathname?.startsWith('/auth');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-500/10 rounded-full blur-2xl" />
        
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo with animated ring */}
          <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
            {/* Spinning gradient border */}
            <div className="absolute inset-0 rounded-2xl border-4 border-slate-200 border-t-blue-600 animate-spin" />
            
            {/* Inner Badge */}
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-600/30">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Prep<span className="text-blue-600">Sprint</span></h2>
          <p className="text-slate-400 text-[10px] mt-2 font-bold tracking-widest uppercase animate-pulse">
            Configuring Workspace
          </p>
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


          {globalCreditWarning && (
            <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs px-8 py-3 flex gap-3 items-center justify-between shadow-sm transition-all duration-300">
              <div className="flex gap-2.5 items-center">
                <AlertCircle className="text-amber-600 shrink-0" size={16} />
                <div className="leading-relaxed font-semibold">
                  <strong className="text-amber-900 font-bold uppercase tracking-wider text-[10px] mr-2">AI Credits Alert</strong>
                  {globalCreditWarning}
                </div>
              </div>
              <button 
                onClick={() => setGlobalCreditWarning(null)}
                className="text-amber-500 hover:text-amber-700 font-bold text-xs uppercase hover:underline outline-none"
              >
                Dismiss
              </button>
            </div>
          )}

          <main className="flex-1 p-8 overflow-y-auto overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} />
      {globalCreditWarning && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs px-8 py-3 flex gap-3 items-center justify-between shadow-sm transition-all duration-300">
          <div className="flex gap-2.5 items-center">
            <AlertCircle className="text-amber-600 shrink-0" size={16} />
            <div className="leading-relaxed font-semibold">
              <strong className="text-amber-950 font-bold uppercase tracking-wider text-[10px] mr-2">AI Credits Alert</strong>
              {globalCreditWarning}
            </div>
          </div>
          <button 
            onClick={() => setGlobalCreditWarning(null)}
            className="text-amber-500 hover:text-amber-700 font-bold text-xs uppercase hover:underline outline-none"
          >
            Dismiss
          </button>
        </div>
      )}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
