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
    <div className="h-48 animate-pulse rounded-2xl border border-border bg-surface-muted shadow-card" />
  );
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/api/admin/roles/${initial!.id}`, { name, description });
        toast.success('Role updated');
      } else {
        await api.post('/api/admin/roles', { name, description });
        toast.success('Role created');
      }
      onSuccess();
    } catch {
      toast.error(isEdit ? 'Failed to update role' : 'Failed to create role');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? 'Edit role' : 'Create role'}
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface-card p-6 shadow-modal mx-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-text-heading">
              {isEdit ? 'Edit Role' : 'Create Role'}
            </h2>
            <p className="text-sm text-text-muted mt-0.5">
              {isEdit ? 'Update role name and description.' : 'Define a new role for your team.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-text-muted hover:bg-surface-muted transition"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-muted">
              Role Name
            </label>
            <Input
              required
              placeholder="e.g. manager, editor…"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-muted">
              Description
            </label>
            <Textarea
              placeholder="Describe what this role can do…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={saving}>
              {isEdit ? 'Save Changes' : 'Create Role'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Role detail slide-over ──────────────────────────────────────────────── */

interface RoleDetailProps {
  role: Role;
  onClose: () => void;
  onEdit: (r: Role) => void;
  onDelete: (r: Role) => void;
}

function RoleDetail({ role, onClose, onEdit, onDelete }: RoleDetailProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div
        className="fixed right-0 top-0 z-[9999] h-full w-full max-w-md bg-surface-card shadow-modal flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label={`Role details: ${role.name}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-light">
              <Shield size={16} className="text-brand" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-heading capitalize">{role.name}</h2>
              <p className="text-xs text-text-muted">{role.user_count ?? 0} users</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-text-muted hover:bg-surface-muted transition"
            aria-label="Close panel"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Description */}
          {role.description && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
                Description
              </p>
              <p className="text-sm text-text-body">{role.description}</p>
            </div>
          )}

          {/* Permissions */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
              Permissions
            </p>
            {role.permissions && role.permissions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((perm) => (
                  <span
                    key={perm.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-text-body"
                  >
                    <Tag size={11} className="text-text-muted" />
                    {perm.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted italic">No permissions defined</p>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <Button
            variant="secondary"
            size="sm"
            leadingIcon={<Edit2 size={14} />}
            onClick={() => onEdit(role)}
          >
            Edit Role
          </Button>
          <Button
            variant="danger"
            size="sm"
            leadingIcon={<Trash2 size={14} />}
            onClick={() => onDelete(role)}
          >
            Delete
          </Button>
        </div>
      </div>
    </>
  );
}

/* ─── Role card ───────────────────────────────────────────────────────────── */

function RoleCard({
  role,
  onClick,
}: {
  role: Role;
  onClick: (r: Role) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(role)}
      className="group w-full text-left rounded-2xl border border-border bg-surface-card p-5 shadow-card hover:border-brand/30 hover:shadow-md transition-all duration-200 flex flex-col gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      aria-label={`Open ${role.name} role details`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-brand-light group-hover:bg-brand/10 transition">
            <Shield size={16} className="text-brand" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-text-heading capitalize truncate">{role.name}</p>
            <div className="flex items-center gap-1 mt-0.5 text-xs text-text-muted">
              <Users size={11} />
              <span>{role.user_count ?? 0} users</span>
            </div>
          </div>
        </div>
        <ChevronRight
          size={15}
          className="flex-shrink-0 text-text-muted group-hover:text-brand transition mt-0.5"
        />
      </div>

      {/* Description */}
      {role.description && (
        <p className="text-xs text-text-muted line-clamp-2">{role.description}</p>
      )}

      {/* Permissions tags */}
      {role.permissions && role.permissions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {role.permissions.slice(0, 4).map((perm) => (
            <span
              key={perm.id}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-text-muted"
            >
              <Tag size={9} />
              {perm.name}
            </span>
          ))}
          {role.permissions.length > 4 && (
            <span className="inline-flex items-center rounded-full border border-border bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-text-muted">
              +{role.permissions.length - 4} more
            </span>
          )}
        </div>
      )}
    </button>
  );
}

/* ─── Main page ───────────────────────────────────────────────────────────── */

export default function SuperAdminRolesPage() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [detailRole, setDetailRole] = useState<Role | null>(null);

  const { data: roles = [], isLoading } = useQuery<Role[]>({
    queryKey: ['sa-roles'],
    queryFn: async () => {
      const res = await api.get('/api/admin/roles');
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/admin/roles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sa-roles'] });
      toast.success('Role deleted');
      setDetailRole(null);
    },
    onError: () => toast.error('Failed to delete role'),
  });

  const handleDelete = (role: Role) => {
    if (confirm(`Delete role "${role.name}"? Users with this role will be unassigned.`)) {
      deleteMutation.mutate(role.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['sa-roles'] });
    setShowForm(false);
    setEditRole(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-heading">Role Management</h1>
          <p className="mt-1 text-sm text-text-muted">Define roles and permissions for your team</p>
        </div>
        <Button
          variant="primary"
          size="md"
          leadingIcon={<Plus size={15} />}
          onClick={() => setShowForm(true)}
        >
          Create Role
        </Button>
      </div>

      {/* ── Card grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : roles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-card py-20 text-center shadow-card">
          <Shield size={40} className="mb-4 text-text-muted/40" />
          <p className="text-sm font-semibold text-text-muted">No roles defined yet</p>
          <p className="mt-1 text-xs text-text-muted">
            Click <strong>Create Role</strong> to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              onClick={(r) => setDetailRole(r)}
            />
          ))}
        </div>
      )}

      {/* ── Create / Edit modal */}
      {(showForm || editRole) && (
        <RoleForm
          initial={editRole ?? undefined}
          onClose={() => { setShowForm(false); setEditRole(null); }}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* ── Role detail slide-over */}
      {detailRole && (
        <RoleDetail
          role={detailRole}
          onClose={() => setDetailRole(null)}
          onEdit={(r) => {
            setDetailRole(null);
            setEditRole(r);
          }}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
