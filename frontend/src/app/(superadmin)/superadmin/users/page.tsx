'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useToast } from '@/store/useToastStore';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Edit2, 
  Slash, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Users as UsersIcon,
  Shield,
  ClipboardList,
  ArrowRight
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface Role {
  id: number;
  name: string;
}

interface SAUser {
  id: number;
  email: string;
  is_active?: boolean;
  role?: Role;
  created_at?: string;
  name?: string;
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

const ITEMS_PER_PAGE = 10;

function avatarLetter(email: string) {
  return email.charAt(0).toUpperCase();
}

/* ─── Skeleton ────────────────────────────────────────────────────────────── */

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4"><div className="h-10 w-10 rounded-full bg-slate-100" /></td>
      <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-100 rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-12 bg-slate-100 rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-100 rounded" /></td>
      <td className="px-6 py-4"><div className="h-8 w-24 bg-slate-100 rounded ml-auto" /></td>
    </tr>
  );
}

/* ─── Main page ───────────────────────────────────────────────────────────── */

export default function SuperAdminUsersPage() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteData, setInviteData] = useState({ email: '', role_id: 1 });

  // Debounce
  const debounceRef = useRef<any>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 300);
  }, [search]);

  // Queries
  const { data: allUsers = [], isLoading: usersLoading } = useQuery<SAUser[]>({
    queryKey: ['sa-users'],
    queryFn: async () => {
      const res = await api.get('/api/super-admin/users', { params: { limit: 100 } });
      return Array.isArray(res.data) ? res.data : [];
    }
  });

  const { data: roles = [] } = useQuery<Role[]>({
    queryKey: ['sa-roles'],
    queryFn: async () => {
      const res = await api.get('/api/super-admin/roles');
      return Array.isArray(res.data) ? res.data : [];
    }
  });

  // Mutations
  const inviteMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/super-admin/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sa-users'] });
      toast.success('User invited');
      setShowInvite(false);
    },
    onError: () => toast.error('Failed to invite user')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/api/super-admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sa-users'] });
      toast.success('User deleted');
    }
  });

  // Filter & Paginate
  const filtered = useMemo(() => {
    let list = allUsers;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(u => u.email.toLowerCase().includes(q) || u.name?.toLowerCase().includes(q));
    }
    if (roleFilter) list = list.filter(u => u.role?.name === roleFilter);
    return list;
  }, [allUsers, debouncedSearch, roleFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">Users</h2>
          <p className="text-sm text-[#6B7280]">Manage platform members and their access permissions.</p>
        </div>
        <button 
          onClick={() => setShowInvite(true)} 
          className="flex items-center justify-center gap-2 rounded-lg bg-[#1565C0] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#1976D2] shadow-sm active:scale-95"
        >
          <Plus size={18} />
          Create User
        </button>
      </div>

      {/* Main Table Card */}
      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#E5E7EB] bg-white px-6 py-4 gap-4">
          <div className="relative w-full sm:w-80">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..." 
              className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] outline-none"
              type="text" 
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-all">
              <Filter size={16} />
              Filters
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-all">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
              <tr>
                <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-[0.05em] text-[#6B7280]">User</th>
                <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-[0.05em] text-[#6B7280]">Role</th>
                <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-[0.05em] text-[#6B7280]">Status</th>
                <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-[0.05em] text-[#6B7280]">Last Active</th>
                <th className="px-6 py-3 text-right text-[12px] font-medium uppercase tracking-[0.05em] text-[#6B7280]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {usersLoading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : paginated.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-[#6B7280]">No users found matching your search.</td></tr>
              ) : (
                paginated.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-[#1565C0] text-sm">
                          {avatarLetter(user.email)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#111827]">{user.name || user.email.split('@')[0]}</div>
                          <div className="text-xs text-[#6B7280]">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                        user.role?.name?.toLowerCase() === 'superadmin' || user.role?.name?.toLowerCase() === 'admin'
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {user.role?.name || 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full ${user.is_active !== false ? 'bg-[#22C55E]' : 'bg-[#9CA3AF]'}`} />
                        <span className="text-sm text-[#374151]">{user.is_active !== false ? 'Active' : 'Inactive'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6B7280]">{user.created_at ? '2 mins ago' : '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <button className="p-2 text-[#9CA3AF] hover:text-[#1565C0] hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                        <button className="p-2 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-red-50 rounded-lg transition-all"><Slash size={16} /></button>
                        <button 
                          onClick={() => { if(confirm('Delete user?')) deleteMutation.mutate(user.id) }}
                          className="p-2 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-[#E5E7EB] bg-white px-6 py-4">
          <span className="text-sm text-[#6B7280]">
            Showing {(page-1)*ITEMS_PER_PAGE+1} to {Math.min(page*ITEMS_PER_PAGE, filtered.length)} of {filtered.length} users
          </span>
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p-1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#9CA3AF] hover:bg-[#F9FAFB] disabled:opacity-50 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button 
                key={i} 
                onClick={() => setPage(i+1)} 
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                  page === i+1 
                  ? "bg-[#1565C0] text-white shadow-sm" 
                  : "border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]"
                }`}
              >
                {i+1}
              </button>
            ))}
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p+1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#9CA3AF] hover:bg-[#F9FAFB] disabled:opacity-50 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-[#E5E7EB] rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-[#1565C0] rounded-lg"><UsersIcon size={20} /></div>
            <h3 className="font-bold text-[#111827]">Active Seats</h3>
          </div>
          <div className="text-3xl font-bold text-[#111827]">32 / 50</div>
          <div className="w-full bg-[#F3F4F6] rounded-full h-2 mt-4">
            <div className="bg-[#1565C0] h-2 rounded-full" style={{ width: '64%' }}></div>
          </div>
          <p className="text-xs text-[#6B7280] mt-2">64% of license used</p>
        </div>

        <div className="bg-white p-6 border border-[#E5E7EB] rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-50 text-slate-600 rounded-lg"><Shield size={20} /></div>
            <h3 className="font-bold text-[#111827]">Security Pulse</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-[#6B7280]">2FA Enabled</span><span className="font-bold">92%</span></div>
            <div className="flex justify-between text-sm"><span className="text-[#6B7280]">SSO Linked</span><span className="font-bold">100%</span></div>
          </div>
        </div>

        <div className="bg-white p-6 border border-[#E5E7EB] rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><ClipboardList size={20} /></div>
              <h3 className="font-bold text-[#111827]">Pending Invites</h3>
            </div>
            <p className="text-sm text-[#6B7280]">There are currently 4 pending workspace invitations.</p>
          </div>
          <button className="mt-4 text-sm font-bold text-[#1565C0] flex items-center gap-1 hover:underline">
            View Invites <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-2xl mx-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-[#111827] mb-2">Invite User</h3>
            <p className="text-sm text-[#6B7280] mb-8">Send an invite to a new platform member.</p>
            <form onSubmit={(e) => { e.preventDefault(); inviteMutation.mutate(inviteData); }}>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">Email Address</label>
                  <input 
                    type="email" required
                    value={inviteData.email}
                    onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-[#E5E7EB] rounded-lg outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0]"
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">Assign Role</label>
                  <select 
                    value={inviteData.role_id}
                    onChange={(e) => setInviteData({...inviteData, role_id: Number(e.target.value)})}
                    className="w-full p-3 bg-slate-50 border border-[#E5E7EB] rounded-lg outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0]"
                  >
                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-10">
                <button type="button" onClick={() => setShowInvite(false)} className="px-6 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={inviteMutation.isPending} className="px-6 py-2.5 bg-[#1565C0] text-white font-bold rounded-lg shadow-sm hover:bg-[#1976D2]">
                  {inviteMutation.isPending ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
