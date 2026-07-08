'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Shield, ShieldCheck, Edit, Save, ArrowRight, X } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { userAPI } from '@/lib/api';

export default function AccountPage() {
  const { user, setUser } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [bio, setBio] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Password change states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || user.name || '');
      setEmail(user.email || '');
      setImage(user.image || '');
      setBio(user.bio || '');
    } else {
      const localUser = localStorage.getItem('user');
      if (localUser) {
        try {
          const u = JSON.parse(localUser);
          setFullName(u.full_name || u.name || '');
          setEmail(u.email || '');
          setImage(u.image || '');
          setBio(u.bio || '');
        } catch (e) {
          // ignore
        }
      }
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("Image size should be less than 1MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const response = await userAPI.updateProfile({
        name: fullName,
        email: email,
        image: image || null,
        bio: bio || ''
      });
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      setSuccess('Account updated successfully!');
    } catch (err) {
      console.error("Failed to update profile via API, saving locally:", err);
      // Try local save
      const localUser = localStorage.getItem('user');
      if (localUser) {
        try {
          const u = JSON.parse(localUser);
          u.full_name = fullName;
          u.name = fullName;
          u.email = email;
          u.image = image;
          u.bio = bio;
          localStorage.setItem('user', JSON.stringify(u));
          setUser(u);
          setSuccess('Account updated locally!');
        } catch (e) {
          setError('Failed to update account');
        }
      } else {
        setError(err.response?.data?.detail || 'Failed to update account');
      }
    }
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    setPasswordLoading(true);
    try {
      await userAPI.changePassword({
        current_password: currentPassword,
        new_password: newPassword
      });
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess('');
      }, 2000);
    } catch (err) {
      setPasswordError(err.response?.data?.detail || 'Failed to change password. Please check your current password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const doubleConfirm = confirm(
      "WARNING: This will permanently delete your PrepSprint account and ALL associated resumes, roadmaps, and skills tracking history.\n\nAre you absolutely sure you want to proceed?"
    );
    if (!doubleConfirm) return;

    const finalConfirm = confirm(
      "FINAL CONFIRMATION: click OK to execute the permanent deletion."
    );
    if (!finalConfirm) return;

    try {
      await userAPI.deleteAccount();
      alert("Your account has been deleted.");
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
      window.location.href = '/';
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete account. Please try again.');
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
          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-100">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden shadow-sm">
                {image ? (
                  <img src={image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} />
                )}
              </div>
              <label className="absolute inset-0 bg-black/40 text-white text-[10px] font-bold uppercase rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{fullName || 'Developer'}</h3>
              <p className="text-sm text-slate-500">{email || 'No email set'}</p>
              <label className="mt-1.5 inline-block text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer hover:underline">
                Change Profile Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
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
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input
                  type="email"
                  disabled
                  value={email}
                  placeholder="john@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-400 text-sm outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a short bio about your professional background, tech stacks, or career goals..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm outline-none transition focus:border-indigo-500 focus:bg-white"
            />
          </div>

          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium rounded-xl flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-500" />
              {success}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-sm font-medium rounded-xl">
              {error}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex gap-3">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition flex items-center gap-2 text-sm shadow-sm"
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
            Manage your password to secure your account credentials.
          </p>
          <button 
            onClick={() => setShowPasswordModal(true)}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition"
          >
            Change Password <ArrowRight size={14} />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-red-100 p-8 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
          <h3 className="text-lg font-bold text-red-600 mb-4">Danger Zone</h3>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Permanently delete your account and remove all of your progress, resumes, and data from PrepSprint.
          </p>
          <button 
            onClick={handleDeleteAccount}
            className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold transition text-sm"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Change Password</h3>
              <button 
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError('');
                  setPasswordSuccess('');
                }}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handlePasswordChangeSubmit} className="p-6 space-y-4">
              {passwordError && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-semibold">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="p-3.5 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs font-semibold">
                  {passwordSuccess}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm outline-none focus:border-indigo-500"
                />
                <p className="text-[10px] text-slate-450 mt-1">At least 8 characters</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError('');
                    setPasswordSuccess('');
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white rounded-lg font-bold transition disabled:opacity-50"
                >
                  {passwordLoading ? 'Saving...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
