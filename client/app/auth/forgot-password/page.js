'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, ShieldCheck, Lock, Eye, EyeOff, CheckCircle2, RefreshCw, KeyRound } from 'lucide-react';
import { authAPI } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Verify OTP, 3: Reset Password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Step 2 OTP verification states
  const [otpCode, setOtpCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Step 3 Password reset states
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Timer effect for resend cooldown
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authAPI.forgotPassword({ email });
      setSuccess('Verification OTP code has been sent to your email.');
      setStep(2);
      setResendCooldown(60);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send reset code. Please check your email and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (otpCode.length !== 6) {
      setError('Please enter a 6-digit code.');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.verifyForgotPasswordOTP({ email, otp: otpCode });
      setResetToken(response.data.token);
      setSuccess('OTP verified successfully. You may now reset your password.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authAPI.forgotPassword({ email });
      setSuccess('A new OTP code has been sent to your email.');
      setResendCooldown(60);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      await authAPI.resetPassword({ token: resetToken, new_password: password });
      setSuccess('Your password has been successfully reset.');
      setStep(4); // 4: Completed
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password. The token may have expired.');
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
          {step === 1 && (
            <>
              <h1 className="text-3xl font-bold mb-2 text-gray-900">Forgot Password</h1>
              <p className="text-gray-600 mb-8">Enter your registered email and we'll send you a verification code</p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSendOTP} className="space-y-5">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-70"
                >
                  {loading ? 'Sending code...' : 'Send Verification Code'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <Link href="/auth/login" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm">
                  <ArrowLeft size={16} /> Back to Sign In
                </Link>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                  <ShieldCheck size={40} />
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-2 text-center text-gray-900">Verify OTP</h1>
              <p className="text-gray-600 text-center mb-8 font-medium">
                We've sent a secure reset code to <span className="font-semibold text-gray-900">{email}</span>.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  {success}
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-70"
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
              </form>

              <div className="mt-8 flex flex-col gap-4 items-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendCooldown > 0 || loading}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm disabled:opacity-50"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Resend Verification Code'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtpCode('');
                    setError('');
                    setSuccess('');
                  }}
                  className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium text-sm"
                >
                  <ArrowLeft size={16} /> Back to Change Email
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                  <KeyRound size={40} />
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-2 text-gray-900">New Password</h1>
              <p className="text-gray-600 mb-8">Enter your new secure password below</p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  {success}
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-5">
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
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
                    Confirm New Password
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-70"
                >
                  {loading ? 'Updating Password...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}

          {step === 4 && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-50 rounded-full text-green-600">
                  <CheckCircle2 size={48} />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Success!</h1>
              <p className="text-gray-600 text-sm font-medium">
                Your password has been successfully reset. You can now use your new credentials to log in.
              </p>
              <Link
                href="/auth/login"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                Go to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
