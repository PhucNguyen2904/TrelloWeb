'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  UserPlus,
  Edit2,
  PowerOff,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Users,
  Filter,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { useToast } from '@/store/useToastStore';

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
}

type SortField = 'id' | 'email' | 'role' | 'created_at';
type SortOrder = 'asc' | 'desc';

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

const ITEMS_PER_PAGE = 20;

function getRoleBadgeClass(name?: string) {
  switch (name) {
    case 'superadmin':
      return 'bg-purple-100 text-purple-700';
    case 'admin':
      return 'bg-blue-100 text-blue-700';
    case 'user':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-surface-muted text-text-muted';
  }
}

function avatarLetter(email: string) {
  return email.charAt(0).toUpperCase();
}

function formatDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/* ─── Skeleton row ────────────────────────────────────────────────────────── */

function SkeletonRow() {
  return (
    <tr>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 w-full animate-pulse rounded-md bg-surface-muted" />
        </td>
      ))}
    </tr>
  );
}

/* ─── Invite Modal ────────────────────────────────────────────────────────── */

interface InviteModalProps {
  roles: Role[];
  onClose: () => void;
  onSuccess: () => void;
}

function InviteModal({ roles, onClose, onSuccess }: InviteModalProps) {
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState<number>(roles[0]?.id ?? 1);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/api/admin/users', { email, role_id: roleId });
      toast.success('User invited successfully');
      onSuccess();
    } catch {
      toast.error('Failed to invite user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Invite user"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface-card p-6 shadow-modal mx-4">
        <h2 className="mb-1 text-lg font-bold text-text-heading">Invite User</h2>
        <p className="mb-5 text-sm text-text-muted">
          Send an invite to a new team member.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-muted">
              Email
            </label>
            <Input
              type="email"
              required
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-muted">
              Role
            </label>
            <Select
              value={roleId}
              onChange={(e) => setRoleId(Number(e.target.value))}
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={saving}
              leadingIcon={<UserPlus size={16} />}
            >
              Invite
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Edit Role Dropdown (inline) ─────────────────────────────────────────── */

interface EditRoleDropdownProps {
  userId: number;
  currentRoleId?: number;
  roles: Role[];
  onSave: (userId: number, roleId: number) => void;
  onCancel: () => void;
  saving: boolean;
}

function EditRoleDropdown({
  userId,
  currentRoleId,
  roles,
  onSave,
  onCancel,
  saving,
}: EditRoleDropdownProps) {
  const [selected, setSelected] = useState<number>(currentRoleId ?? roles[0]?.id ?? 1);

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selected}
        onChange={(e) => setSelected(Number(e.target.value))}
        className="py-1 text-xs"
        disabled={saving}
      >
        {roles.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </Select>
      <button
        onClick={() => onSave(userId, selected)}
        disabled={saving}
        className="rounded-lg p-1.5 text-green-700 hover:bg-green-100 disabled:opacity-50"
        aria-label="Save role"
      >
        ✓
      </button>
      <button
        onClick={onCancel}
        disabled={saving}
        className="rounded-lg p-1.5 text-text-muted hover:bg-surface-muted disabled:opacity-50"
        aria-label="Cancel"
      >
        ✕
      </button>
    </div>
  );
}

/* ─── Sort header ─────────────────────────────────────────────────────────── */

interface SortHeaderProps {
  field: SortField;
  label: string;
  current: SortField;
  order: SortOrder;
  onSort: (f: SortField) => void;
}

function SortHeader({ field, label, current, order, onSort }: SortHeaderProps) {
  const active = current === field;
  return (
    <th
      scope="col"
      aria-sort={active ? (order === 'asc' ? 'ascending' : 'descending') : 'none'}
      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted select-none"
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className="flex items-center gap-1.5 hover:text-text-body transition-colors"
        aria-label={`Sort by ${label}`}
      >
        {label}
        {active &&
          (order === 'asc' ? (
            <ChevronUp size={13} aria-hidden />
          ) : (
            <ChevronDown size={13} aria-hidden />
          ))}
      </button>
    </th>
  );
}

/* ─── Main page ───────────────────────────────────────────────────────────── */

export default function SuperAdminUsersPage() {
  const queryClient = useQueryClient();
  const toast = useToast();

  // UI state
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [showInvite, setShowInvite] = useState(false);

  // Debounce search
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  // ── Queries
  const { data: allUsers = [], isLoading: usersLoading } = useQuery<SAUser[]>({
    queryKey: ['sa-users'],
    queryFn: async () => {
      const pageSize = 200;
      let skip = 0;
      const all: SAUser[] = [];
      while (true) {
        const res = await api.get('/api/super-admin/users', {
          params: { skip, limit: pageSize },
        });
        const batch: SAUser[] = Array.isArray(res.data) ? res.data : [];
        all.push(...batch);
        if (batch.length < pageSize) break;
        skip += pageSize;
      }
      return all;
    },
  });

  const { data: roles = [] } = useQuery<Role[]>({
    queryKey: ['sa-roles'],
    queryFn: async () => {
      const res = await api.get('/api/super-admin/roles');
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  // ── Mutations
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: number; roleId: number }) => {
      await api.put(`/api/super-admin/users/${userId}/role`, { role_id: roleId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sa-users'] });
      toast.success('Role updated');
      setEditingUserId(null);
    },
    onError: () => toast.error('Failed to update role'),
  });

  const deactivateMutation = useMutation({
    mutationFn: async (userId: number) => {
      await api.put(`/api/admin/users/${userId}/deactivate`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sa-users'] });
      toast.success('User deactivated');
    },
    onError: () => toast.error('Failed to deactivate user'),
  });

  // ── Filter + sort + paginate (client-side)
  const filtered = useMemo(() => {
    let list = allUsers;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter((u) => u.email.toLowerCase().includes(q));
    }
    if (roleFilter) {
      list = list.filter((u) => u.role?.name === roleFilter);
    }
    const sorted = [...list].sort((a, b) => {
      let av: string | number = a.id;
      let bv: string | number = b.id;
      if (sortField === 'email') { av = a.email; bv = b.email; }
      else if (sortField === 'role') { av = a.role?.name ?? ''; bv = b.role?.name ?? ''; }
      else if (sortField === 'created_at') {
        av = new Date(a.created_at ?? 0).getTime();
        bv = new Date(b.created_at ?? 0).getTime();
      }
      if (typeof av === 'string') {
        av = av.toLowerCase();
        bv = (bv as string).toLowerCase();
      }
      if (av < bv) return sortOrder === 'asc' ? -1 : 1;
      if (av > bv) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [allUsers, debouncedSearch, roleFilter, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortOrder('asc'); }
    setPage(1);
  };

  const uniqueRoles = useMemo(
    () => Array.from(new Set(allUsers.map((u) => u.role?.name).filter(Boolean))),
    [allUsers]
  );

  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const rangeEnd = Math.min(page * ITEMS_PER_PAGE, filtered.length);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Page header */}
      <div>
        <h1 className="text-2xl font-bold text-text-heading">User Management</h1>
        <p className="mt-1 text-sm text-text-muted">
          Manage accounts and roles across the platform
        </p>
      </div>

      {/* ── Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-muted pl-9 pr-4 py-2.5 text-sm text-text-heading placeholder:text-text-muted outline-none focus:border-brand focus:ring-2 focus:ring-brand-light transition"
            aria-label="Search users"
          />
        </div>

        {/* Role filter */}
        <div className="relative min-w-[140px]">
          <Filter
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="w-full appearance-none rounded-xl border border-border bg-surface-muted pl-8 pr-8 py-2.5 text-sm text-text-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand-light transition"
            aria-label="Filter by role"
          >
            <option value="">All roles</option>
            {uniqueRoles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
        </div>

        <div className="ml-auto">
          <Button
            variant="primary"
            size="md"
            leadingIcon={<UserPlus size={15} />}
            onClick={() => setShowInvite(true)}
          >
            Invite User
          </Button>
        </div>
      </div>

      {/* ── Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="border-b border-border bg-surface-muted">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
                  User
                </th>
                <SortHeader field="email" label="Email" current={sortField} order={sortOrder} onSort={handleSort} />
                <SortHeader field="role" label="Role" current={sortField} order={sortOrder} onSort={handleSort} />
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Status
                </th>
                <SortHeader field="created_at" label="Joined" current={sortField} order={sortOrder} onSort={handleSort} />
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {usersLoading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Users size={36} className="mx-auto mb-3 text-text-muted/40" />
                    <p className="text-sm font-semibold text-text-muted">No users found</p>
                  </td>
                </tr>
              ) : (
                paginated.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-surface-muted"
                  >
                    {/* Avatar + initials */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}
                        >
                          {avatarLetter(user.email)}
                        </div>
                        <span className="text-xs text-text-muted">#{user.id}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-3.5 text-sm font-medium text-text-heading">
                      {user.email}
                    </td>

                    {/* Role */}
                    <td className="px-5 py-3.5">
                      {editingUserId === user.id ? (
                        <EditRoleDropdown
                          userId={user.id}
                          currentRoleId={user.role?.id}
                          roles={roles}
                          onSave={(uid, rid) => updateRoleMutation.mutate({ userId: uid, roleId: rid })}
                          onCancel={() => setEditingUserId(null)}
                          saving={updateRoleMutation.isPending}
                        />
                      ) : (
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-medium ${getRoleBadgeClass(user.role?.name)}`}
                        >
                          {user.role?.name ?? 'unknown'}
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          user.is_active !== false
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            user.is_active !== false ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                        {user.is_active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-3.5 text-sm text-text-muted">
                      {formatDate(user.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {editingUserId !== user.id && (
                          <button
                            onClick={() => setEditingUserId(user.id)}
                            disabled={updateRoleMutation.isPending}
                            className="rounded-lg p-2 text-text-muted transition hover:bg-surface-muted hover:text-brand disabled:opacity-50"
                            title="Edit role"
                            aria-label={`Edit role for ${user.email}`}
                          >
                            <Edit2 size={15} />
                          </button>
                        )}
                        {user.is_active !== false && (
                          <button
                            onClick={() => deactivateMutation.mutate(user.id)}
                            disabled={deactivateMutation.isPending}
                            className="rounded-lg p-2 text-text-muted transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            title="Deactivate user"
                            aria-label={`Deactivate ${user.email}`}
                          >
                            <PowerOff size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination */}
        {!usersLoading && filtered.length > ITEMS_PER_PAGE && (
          <div className="flex flex-col items-start gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-text-muted">
              Showing {rangeStart}–{rangeEnd} of {filtered.length} users
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-border bg-surface-card p-2 text-text-muted transition hover:bg-surface-muted disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft size={15} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => (
                  <React.Fragment key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="px-1 text-text-muted">…</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      aria-current={p === page ? 'page' : undefined}
                      className={`min-w-[32px] rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                        p === page
                          ? 'bg-brand text-white'
                          : 'border border-border bg-surface-card text-text-body hover:bg-surface-muted'
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-border bg-surface-card p-2 text-text-muted transition hover:bg-surface-muted disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Invite modal */}
      {showInvite && (
        <InviteModal
          roles={roles}
          onClose={() => setShowInvite(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['sa-users'] });
            setShowInvite(false);
          }}
        />
      )}
    </div>
  );
}
