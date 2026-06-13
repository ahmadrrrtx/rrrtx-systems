"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Lock, CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); setError("");
    if (newPassword.length < 6) { setError("New password must be at least 6 characters."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword, newPassword }) });
      const data = await res.json();
      if (res.ok) { setMessage("Password updated successfully."); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }
      else { setError(data.error || "Failed to update password."); }
    } catch { setError("Something went wrong."); } finally { setLoading(false); }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl">
        <div className="mb-6"><h1 className="text-2xl font-bold text-white mb-1">Settings</h1><p className="text-sm text-slate-400">Manage your account and preferences.</p></div>
        <div className="p-6 rounded-xl border border-slate-800/50 bg-slate-950/40 space-y-6">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center"><Lock className="w-5 h-5 text-cyan-400" /></div><div><h2 className="text-sm font-semibold text-white">Change Password</h2><p className="text-xs text-slate-400">Update your admin login password.</p></div></div>
          {message && <div className="px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-400 flex items-center gap-2"><CheckCircle className="w-4 h-4" />{message}</div>}
          {error && <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label><input type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all" placeholder="Enter current password" /></div>
            <div><label className="block text-sm font-medium text-slate-300 mb-2">New Password</label><input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all" placeholder="Min 6 characters" /></div>
            <div><label className="block text-sm font-medium text-slate-300 mb-2">Confirm New Password</label><input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all" placeholder="Repeat new password" /></div>
            <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50">{loading ? "Updating..." : "Update Password"}</button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
