'use client';

import { useAuth } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import { usePathname } from 'next/navigation';
import { Search, Bell, User, AlertCircle, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LayoutContent({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [globalCreditWarning, setGlobalCreditWarning] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
        {/* Mobile Header Bar */}
        <header className="lg:hidden bg-slate-900 border-b border-slate-800 text-slate-100 h-[60px] flex items-center justify-between px-6 sticky top-0 z-40">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-md">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Prep<span className="text-indigo-400">Sprint</span></span>
          </Link>
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>
        </header>

        {/* Desktop Sidebar (hidden on mobile/tablet) */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile/Tablet Sidebar Drawer Overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
              onClick={() => setMobileSidebarOpen(false)}
            />
            {/* Drawer */}
            <div className="relative w-64 bg-slate-900 text-slate-300 h-full flex flex-col border-r border-slate-800 z-50 animate-slide-in">
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                  aria-label="Close navigation menu"
                >
                  <X size={20} />
                </button>
              </div>
              <Sidebar mobileMode={true} closeDrawer={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

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

          <main className="flex-1 p-4 sm:p-8 overflow-y-auto overflow-x-hidden">
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
