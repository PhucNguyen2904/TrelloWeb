'use client';

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Edit2, Trash2, ChevronUp, ChevronDown, Search } from "lucide-react";

interface User {
  id: number;
  email: string;
  role?: {
    id: number;
    name: string;
  };
  created_at?: string;
}

interface UsersTableProps {
  users: User[];
  roles?: any[];
  isSuperAdmin?: boolean;
  currentUserId?: number;
  onEdit?: (userId: number, roleId: number) => void;
  onDelete?: (userId: number) => void;
  isLoading?: boolean;
}

type SortField = 'id' | 'email' | 'role' | 'created_at';
type SortOrder = 'asc' | 'desc';

export function UsersTable({
  users,
  roles = [],
  isSuperAdmin = false,
  currentUserId,
  onEdit,
  onDelete,
  isLoading = false,
}: UsersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editRoleId, setEditRoleId] = useState<number>(1);

  const itemsPerPage = 10;

  // Filter by search query
  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  // Sort users
  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'role') {
        aVal = a.role?.name || '';
        bVal = b.role?.name || '';
      } else if (sortField === 'created_at') {
        aVal = new Date(a.created_at || 0).getTime();
        bVal = new Date(b.created_at || 0).getTime();
      }

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredUsers, sortField, sortOrder]);

  // Paginate
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedUsers.slice(start, start + itemsPerPage);
  }, [sortedUsers, currentPage]);

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleEditRole = (userId: number, currentRoleId: number) => {
    setEditingUserId(userId);
    setEditRoleId(currentRoleId);
  };

  const handleSaveRole = (userId: number) => {
    if (editRoleId !== undefined) {
      onEdit?.(userId, editRoleId);
      setEditingUserId(null);
    }
  };

  const handleDelete = (userId: number, userEmail: string) => {
    if (confirm(`Are you sure you want to delete "${userEmail}"? This action cannot be undone.`)) {
      onDelete?.(userId);
    }
  };

  const getRoleColor = (roleName?: string) => {
    switch (roleName) {
      case 'superadmin':
        return 'bg-[var(--error-container)] text-[var(--on-error-container)]';
      case 'admin':
        return 'bg-[var(--secondary-container)] text-[var(--on-secondary-container)]';
      default:
        return 'bg-[var(--surface-container)] text-[var(--text-secondary)]';
    }
  };

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
    <th
      onClick={() => handleSort(field)}
      className="cursor-pointer select-none px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
    >
      <div className="flex items-center gap-2">
        {label}
        {sortField === field && (
          sortOrder === 'asc' ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )
        )}
      </div>
    </th>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Search by email..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="input-field py-2.5 pl-10 pr-4 text-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-container-lowest)]">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="border-b border-[var(--border)] bg-[var(--surface-container-low)]">
              <tr>
                <SortHeader field="id" label="ID" />
                <SortHeader field="email" label="Email" />
                <SortHeader field="role" label="Role" />
                <SortHeader field="created_at" label="Created" />
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--surface-container)]">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center">
                    <div className="mx-auto max-w-md space-y-1">
                      <p className="text-base font-semibold text-[var(--text-secondary)]">No users found</p>
                      <p className="text-sm text-[var(--text-muted)]">
                        Try adjusting search keywords or clear filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-[var(--surface-container-low)]">
                    <td className="px-5 py-3.5 text-sm text-[var(--text-muted)]">#{user.id}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-[var(--text-primary)]">{user.email}</td>
                    <td className="px-5 py-3.5">
                      {editingUserId === user.id && isSuperAdmin ? (
                        <select
                          value={editRoleId}
                          onChange={(e) => setEditRoleId(parseInt(e.target.value))}
                          className="rounded-md border border-[var(--border)] bg-[var(--surface-container-lowest)] px-2 py-1 text-sm text-[var(--text-primary)] focus:border-[var(--border-focus)] focus:outline-none"
                          disabled={isLoading}
                        >
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className={`rounded-md px-2 py-1 text-xs font-medium ${getRoleColor(user.role?.name)}`}>
                          {user.role?.name || 'unknown'}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[var(--text-muted)]">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isSuperAdmin && user.id !== currentUserId && (
                          <>
                            {editingUserId === user.id ? (
                              <>
                                <button
                                  onClick={() => handleSaveRole(user.id)}
                                  disabled={isLoading}
                                  className="rounded-lg p-2 text-green-700 transition-colors hover:bg-green-100 disabled:opacity-50"
                                  title="Save"
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={() => setEditingUserId(null)}
                                  disabled={isLoading}
                                  className="rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-container)] disabled:opacity-50"
                                  title="Cancel"
                                >
                                  ✕
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleEditRole(user.id, user.role?.id || 1)}
                                disabled={isLoading}
                                className="rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50"
                                title="Edit Role"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                            )}
                          </>
                        )}
                        {user.id !== currentUserId &&
                          (isSuperAdmin ||
                            (user.role?.name !== 'admin' && user.role?.name !== 'superadmin')) && (
                            <button
                              onClick={() => handleDelete(user.id, user.email)}
                              disabled={isLoading}
                              className="rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                              title="Delete User"
                            >
                              <Trash2 className="h-4 w-4" />
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
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-[var(--text-muted)]">
            Showing {paginatedUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, sortedUsers.length)} of {sortedUsers.length} users
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || isLoading}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface-container-lowest)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-container-low)] disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                const isActive = page === currentPage;
                const isVisible = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;

                if (!isVisible && page !== 2 && page !== totalPages - 1) return null;

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    disabled={isLoading}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[var(--primary-container)] text-white'
                        : 'border border-[var(--border)] bg-[var(--surface-container-lowest)] text-[var(--text-primary)] hover:bg-[var(--surface-container-low)] disabled:opacity-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || isLoading}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface-container-lowest)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-container-low)] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
