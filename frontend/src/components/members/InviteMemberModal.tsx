'use client';

import React, { useState } from 'react';
import { X, Mail, Shield, UserPlus, Info } from 'lucide-react';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string, role: string) => Promise<void>;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ isOpen, onClose, onInvite }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      await onInvite(email, role);
      setEmail('');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to invite member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#1565C0]/10 rounded-lg text-[#1565C0]">
              <UserPlus className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Invite Member</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest px-1">
              <Mail className="w-3 h-3" />
              Email Address
            </label>
            <input 
              autoFocus
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-slate-50 border-2 border-transparent focus:border-[#1565C0]/20 focus:bg-white rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-slate-400"
              required
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest px-1">
              <Shield className="w-3 h-3" />
              Assign Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`p-3 rounded-xl border-2 transition-all text-left ${role === 'user' ? 'border-[#1565C0] bg-blue-50/50 ring-4 ring-blue-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
              >
                <p className={`text-xs font-black uppercase tracking-wider ${role === 'user' ? 'text-[#1565C0]' : 'text-slate-400'}`}>User</p>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Can view and edit boards they are added to.</p>
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`p-3 rounded-xl border-2 transition-all text-left ${role === 'admin' ? 'border-[#1565C0] bg-blue-50/50 ring-4 ring-blue-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
              >
                <p className={`text-xs font-black uppercase tracking-wider ${role === 'admin' ? 'text-[#1565C0]' : 'text-slate-400'}`}>Admin</p>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Full access to manage workspace and members.</p>
              </button>
            </div>
          </div>

          {/* Info Note */}
          <div className="flex gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
              The invited member will receive an email with instructions. The default temporary password will be <strong>Password123!</strong>.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-[11px] font-bold">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full bg-[#1565C0] hover:bg-[#0d47a1] disabled:opacity-50 disabled:hover:bg-[#1565C0] text-white py-4 rounded-xl font-black text-sm tracking-wide transition-all shadow-lg shadow-blue-100 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Send Invitation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteMemberModal;
