'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Shield,
  Users,
  Edit2,
  Trash2,
  X,
  ChevronRight,
  Tag,
  ShieldCheck,
  UserCog,
  History,
  MoreVertical,
  UserPlus
} from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { useToast } from '@/store/useToastStore';

/* ─── Types ───────────────────────────────────────────────────────────────── */

interface Permission {
  id: number;
  name: string;
  description?: string;
}

interface Role {
  id: number;
  name: string;
  description?: string;
  user_count?: number;
  permissions?: Permission[];
}

/* ─── Skeleton card ───────────────────────────────────────────────────────── */

function SkeletonCard() {
  return (
    <div className="h-64 animate-pulse rounded-xl border border-[#E5E7EB] bg-slate-50" />
  );
}

/* ─── Role Icons ──────────────────────────────────────────────────────────── */

function getRoleIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes('superadmin')) return <ShieldCheck className="text-[#0079BF]" />;
  if (n.includes('admin')) return <UserCog className="text-slate-600" />;
  if (n.includes('member')) return <Users className="text-slate-600" />;
  return <Shield className="text-slate-600" />;
}

/* ─── Role form (create / edit) ───────────────────────────────────────────── */

interface RoleFormProps {
  initial?: Role;
  onClose: () => void;
  onSuccess: () => void;
}

function RoleForm({ initial, onClose, onSuccess }: RoleFormProps) {
  const isEdit = !!initial;
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const { data: allPermissions = [] } = useQuery<Permission[]>({
    queryKey: ['sa-permissions'],
    queryFn: async () => {
      const res = await api.get('/api/super-admin/permissions');
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>(
    initial?.permissions?.map((p) => p.id) ?? []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let roleId = initial?.id;
      if (isEdit) {
        await api.put(`/api/super-admin/roles/${roleId}`, { name, description });
      } else {
        const res = await api.post('/api/super-admin/roles', { name, description });
        roleId = res.data.id;
      }
      
      if (roleId) {
        await api.put(`/api/super-admin/roles/${roleId}/permissions`, {
          permission_ids: selectedPermissionIds,
        });
      }
      
      toast.success(isEdit ? 'Role updated' : 'Role created');
      onSuccess();
    } catch {
      toast.error(isEdit ? 'Failed to update role' : 'Failed to create role');
    } finally {
      setSaving(false);
    }
  };

  const togglePermission = (id: number) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#111827]">
              {isEdit ? 'Edit Role' : 'Create Role'}
            </h2>
            <p className="text-sm text-[#6B7280]">
              {isEdit ? 'Update role name and permissions.' : 'Define a new access level.'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">Role Name</label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">Description</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">Permissions</label>
            <div className="max-h-48 overflow-y-auto rounded-xl border border-[#E5E7EB] bg-slate-50 p-4 space-y-3">
              {allPermissions.map((perm) => (
                <label key={perm.id} className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedPermissionIds.includes(perm.id)}
                    onChange={() => togglePermission(perm.id)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-[#1565C0] focus:ring-[#1565C0]/20"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#374151] group-hover:text-[#1565C0] transition-colors">{perm.name}</p>
                    {perm.description && <p className="text-xs text-[#6B7280] leading-relaxed">{perm.description}</p>}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#1565C0] text-white font-bold rounded-lg hover:bg-[#1976D2] transition-all">
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Role Card ───────────────────────────────────────────────────────────── */

function RoleCard({ role, onClick }: { role: Role; onClick: (r: Role) => void }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm flex flex-col hover:border-[#0079BF] hover:shadow-md transition-all group relative">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center">
          {getRoleIcon(role.name)}
        </div>
        <div className="flex items-center gap-1.5 bg-blue-50 text-[#0079BF] px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
          <Users size={14} />
          {role.user_count ?? 0} Users
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-[#111827] mb-1">{role.name}</h3>
      <p className="text-sm text-[#6B7280] mb-4 line-clamp-2 min-h-[40px]">{role.description || 'No description provided for this role.'}</p>
      
      <div className="space-y-2 flex-grow">
        <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Key Permissions</p>
        <div className="flex flex-wrap gap-2">
          {role.permissions?.slice(0, 3).map(p => (
            <span key={p.id} className="bg-slate-50 px-2 py-1 rounded border border-[#E5E7EB] text-[11px] text-[#374151]">
              {p.name}
            </span>
          )) || <span className="text-xs text-slate-400 italic">No permissions</span>}
          {role.permissions && role.permissions.length > 3 && (
            <span className="bg-slate-50 px-2 py-1 rounded border border-[#E5E7EB] text-[11px] text-[#6B7280]">
              +{role.permissions.length - 3} more
            </span>
          )}
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-[#E5E7EB] flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onClick(role)}
          className="text-[#0079BF] text-xs font-bold hover:underline flex items-center gap-1"
        >
          Edit Role
        </button>
        <div className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer">
          <MoreVertical size={16} className="text-slate-400" />
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ───────────────────────────────────────────────────────────── */

export default function SuperAdminRolesPage() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);

  const { data: roles = [], isLoading } = useQuery<Role[]>({
    queryKey: ['sa-roles'],
    queryFn: async () => {
      const res = await api.get('/api/super-admin/roles');
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['sa-roles'] });
    setShowForm(false);
    setEditRole(null);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">Role Management</h1>
          <p className="text-sm text-[#6B7280] mt-1">Define and manage access levels across your organization.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#1565C0] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#1976D2] shadow-sm active:scale-95"
        >
          <Plus size={18} />
          Create New Role
        </button>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            {roles.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                onClick={(r) => setEditRole(r)}
              />
            ))}
            
            {/* Create Custom Role Placeholder */}
            <div 
              onClick={() => setShowForm(true)}
              className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-[#0079BF] hover:bg-blue-50/30 transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-[#0079BF] group-hover:scale-110 transition-transform mb-4">
                <Plus size={32} />
              </div>
              <h3 className="font-bold text-[#374151] group-hover:text-[#0079BF] transition-colors">Create Custom Role</h3>
              <p className="text-xs text-[#6B7280] max-w-[200px] mt-2">Define a unique set of permissions for specialized needs.</p>
            </div>
          </>
        )}
      </div>

      {/* Audit Log Section */}
      <section className="mt-12">
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#E5E7EB] flex justify-between items-center bg-[#F9FAFB]">
            <h3 className="font-bold text-[#111827]">Recent Role Changes</h3>
            <button className="text-[#0079BF] text-xs font-bold hover:underline">View Audit Log</button>
          </div>
          <div className="divide-y divide-[#E5E7EB]">
            <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0079BF]">
                  <History size={20} />
                </div>
                <div>
                  <p className="text-sm text-[#111827]"><span className="font-bold">Alex Rivera</span> modified <span className="font-bold text-[#0079BF]">Admin</span> permissions</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">2 hours ago • Updated "Billing Access"</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
            <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0079BF]">
                  <UserPlus size={20} />
                </div>
                <div>
                  <p className="text-sm text-[#111827]"><span className="font-bold">Sarah Chen</span> assigned 4 users to <span className="font-bold text-[#0079BF]">Viewer</span> role</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">5 hours ago • Bulk Update</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
          </div>
        </div>
      </section>

      {/* Create / Edit Modal */}
      {(showForm || editRole) && (
        <RoleForm
          initial={editRole ?? undefined}
          onClose={() => { setShowForm(false); setEditRole(null); }}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
