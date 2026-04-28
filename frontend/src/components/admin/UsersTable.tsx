'use client';

import { useState, useMemo } from "react";
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
  roles?: Array<{ id: number; name: string }>;
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
      let aVal: string | number = a.id;
      let bVal: string | number = b.id;

      if (sortField === 'email') {
        aVal = a.email;
        bVal = b.email;
      }

      if (sortField === 'role') {
        aVal = a.role?.name || '';
        bVal = b.role?.name || '';
      } else if (sortField === 'created_at') {
        aVal = new Date(a.created_at || 0).getTime();
        bVal = new Date(b.created_at || 0).getTime();
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
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
        return 'bg-red-100 text-red-700';
      case 'admin':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const renderSortHeader = (field: SortField, label: string) => {
    const isCurrentField = sortField === field;
    const ariaSort = isCurrentField ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none';

    return (
      <th
        scope="col"
        aria-sort={ariaSort}
        className="select-none px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
      >
        <button
          type="button"
          onClick={() => handleSort(field)}
          className="flex items-center gap-2 text-left transition duration-200 ease-in-out hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-slate-300"
          aria-label={`Sort by ${label}`}
        >
          {label}
          {isCurrentField && (
            sortOrder === 'asc' ? (
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            )
          )}
        </button>
      </th>
    );
  };

  return (
    <div
      className="animate-fadeIn space-y-4"
    >
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by email..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="input-field py-2.5 pl-10 pr-4 text-sm"
          aria-label="Search users by email"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                {renderSortHeader('id', 'ID')}
                {renderSortHeader('email', 'Email')}
                {renderSortHeader('role', 'Role')}
                {renderSortHeader('created_at', 'Created')}
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center">
                    <div className="mx-auto max-w-md space-y-1">
                      <p className="text-base font-semibold text-slate-700">No users found</p>
                      <p className="text-sm text-slate-500">
                        Try adjusting search keywords or clear filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-5 py-3.5 text-sm text-slate-500">#{user.id}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-800">{user.email}</td>
                    <td className="px-5 py-3.5">
                      {editingUserId === user.id && isSuperAdmin ? (
                        <select
                          value={editRoleId}
                          onChange={(e) => setEditRoleId(parseInt(e.target.value))}
                          className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          disabled={isLoading}
                          aria-label="Select role"
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
                    <td className="px-5 py-3.5 text-sm text-slate-500">
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
                                    className="rounded-lg p-2 text-green-700 transition duration-200 ease-in-out hover:bg-green-100 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-green-300"
                                    title="Save"
                                    aria-label="Save changes"
                                  >
                                  ✓
                                </button>
                                <button
                                    onClick={() => setEditingUserId(null)}
                                    disabled={isLoading}
                                    className="rounded-lg p-2 text-slate-500 transition duration-200 ease-in-out hover:bg-slate-100 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-slate-300"
                                    title="Cancel"
                                    aria-label="Cancel editing"
                                  >
                                  ✕
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleEditRole(user.id, user.role?.id || 1)}
                                disabled={isLoading}
                                className="rounded-lg p-2 text-slate-500 transition duration-200 ease-in-out hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-indigo-300"
                                title="Edit Role"
                                aria-label="Edit user role"
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
                              className="rounded-lg p-2 text-slate-500 transition duration-200 ease-in-out hover:bg-red-50 hover:text-red-600 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-red-300"
                              title="Delete User"
                              aria-label={`Delete user ${user.email}`}
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
          <p className="text-sm text-slate-500">
            Showing {paginatedUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, sortedUsers.length)} of {sortedUsers.length} users
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || isLoading}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition duration-200 ease-in-out hover:bg-slate-50 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-slate-300"
              aria-label="Previous page"
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
                    aria-current={isActive ? "page" : undefined}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition duration-200 ease-in-out focus-visible:ring-2 ${
                      isActive
                        ? 'bg-[#0079BF] text-white focus-visible:ring-blue-400'
                        : 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 disabled:opacity-50 focus-visible:ring-slate-300'
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
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition duration-200 ease-in-out hover:bg-slate-50 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-slate-300"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
