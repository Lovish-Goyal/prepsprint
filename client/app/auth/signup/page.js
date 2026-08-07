'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // OTP Verification States
  const [showOTP, setShowOTP] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Timer effect for resend cooldown
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_BASE}/auth/signup/send-otp`, {
        email,
        password,
        full_name: fullName,
        username: email.split('@')[0],
      });
      
      setShowOTP(true);
      setOtpError('');
      setOtpSuccess('Verification code sent to your email.');
      setResendCooldown(60);
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err);
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setOtpError('');
    setOtpSuccess('');

    if (otpCode.length !== 6) {
      setOtpError('Please enter a 6-digit code.');
      return;
    }

    setOtpLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/auth/signup/verify`, {
        email,
        otp: otpCode,
      });

      if (response.data.token) {
        localStorage.setItem('accessToken', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.id,
          full_name: response.data.full_name,
          email: response.data.email,
          username: response.data.username,
        }));
        router.push('/dashboard');
      }
    } catch (err) {
      console.error("Verify OTP Error:", err.response?.data || err);
      setOtpError(err.response?.data?.detail || 'Verification failed. Please check the code and try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setOtpError('');
    setOtpSuccess('');
    setOtpLoading(true);

    try {
      await axios.post(`${API_BASE}/auth/signup/resend-otp`, {
        email,
      });
      setOtpSuccess('A new verification code has been sent to your email.');
      setResendCooldown(60);
    } catch (err) {
      console.error("Resend OTP Error:", err.response?.data || err);
      setOtpError(err.response?.data?.detail || 'Failed to resend code. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center px-4 py-12 md:py-16 relative overflow-hidden">
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
          {!showOTP ? (
            <>
              <h1 className="text-3xl font-bold mb-2 text-gray-900">Create Account</h1>
              <p className="text-gray-600 mb-8">Join thousands of developers building elite careers</p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                      required
                    />
                  </div>
                </div>

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

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <label className="flex items-start gap-3 py-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 mt-1 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the{' '}
                    <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-70 mt-6"
                >
                  {loading ? 'Sending Verification Code...' : 'Create Account'}
                </button>
              </form>

              {/* Login Link */}
              <p className="mt-8 text-center text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                  <ShieldCheck size={40} />
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-2 text-center text-gray-900">Verify Email</h1>
              <p className="text-gray-600 text-center mb-8">
                We've sent a 6-digit verification code to <span className="font-semibold text-gray-900">{email}</span>. Please enter it below.
              </p>

              {otpError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {otpError}
                </div>
              )}

              {otpSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  {otpSuccess}
                </div>
              )}

              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                    6-Digit Verification Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      className="w-full text-center text-2xl font-bold tracking-[0.75em] pl-[0.375em] py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={otpLoading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-70"
                >
                  {otpLoading ? 'Verifying...' : 'Verify & Create Account'}
                </button>
              </form>

              {/* Resend and Go Back controls */}
              <div className="mt-8 flex flex-col gap-4 items-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendCooldown > 0 || otpLoading}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm disabled:opacity-50"
                >
                  <RefreshCw size={16} className={otpLoading ? 'animate-spin' : ''} />
                  {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Resend Verification Code'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowOTP(false);
                    setOtpCode('');
                    setOtpError('');
                    setOtpSuccess('');
                  }}
                  className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium text-sm"
                >
                  <ArrowLeft size={16} /> Change Email or Info
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
