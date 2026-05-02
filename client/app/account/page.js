'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Shield, ShieldCheck, Edit, Save, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function AccountPage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      try {
        const u = JSON.parse(localUser);
        setFullName(u.full_name || u.name || '');
        setEmail(u.email || '');
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSuccess('');
    const localUser = localStorage.getItem('user');
    if (localUser) {
      try {
        const u = JSON.parse(localUser);
        u.full_name = fullName;
        u.name = fullName;
        u.email = email;
        localStorage.setItem('user', JSON.stringify(u));
        setSuccess('Account updated successfully!');
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <div className="space-y-10 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Account Management</h1>
          <p className="text-slate-500 mt-2 text-lg">Manage your personal profile and account preferences.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verification</p>
            <p className="text-sm font-bold text-slate-900">Verified Member</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
              <User size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{fullName || 'Developer'}</h3>
              <p className="text-sm text-slate-500">{email || 'No email set'}</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5"
                />
              </div>
            </div>
          </div>

          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium rounded-xl flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-500" />
              {success}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex gap-3">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2 text-sm shadow-sm"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Preferences / Advanced Zone */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Account Security</h3>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Manage authentication methods, single sign-on connections, and active login sessions.
          </p>
          <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition">
            Change Password <ArrowRight size={14} />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-red-100 p-8 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
          <h3 className="text-lg font-bold text-red-600 mb-4">Danger Zone</h3>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Permanently delete your account and remove all of your progress, resumes, and data from PrepSprint.
          </p>
          <button className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold transition text-sm">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
