'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';
import { authAPI } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authAPI.forgotPassword({ email });
      setSuccess('Reset link has been sent to your email address. Please check your inbox.');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send reset link. Please check your email and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="glow-blob w-[500px] h-[500px] bg-blue-500/10 -top-40 -right-40 absolute rounded-full blur-3xl pointer-events-none" />
      <div className="glow-blob w-[500px] h-[500px] bg-purple-500/10 -bottom-40 -left-40 absolute rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <Link href="/" className="flex items-center gap-3 mb-8 justify-center">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-[14px] font-extrabold text-white shadow-lg shadow-blue-600/20">
            PS
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            PrepSprint
          </span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Forgot Password</h1>
          <p className="text-gray-600 mb-8">Enter your email and we'll send you a password reset link</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
              {success}
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-70"
              >
                {loading ? 'Sending link...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          {/* Back to Login Link */}
          <div className="mt-8 text-center">
            <Link href="/auth/login" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm">
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
