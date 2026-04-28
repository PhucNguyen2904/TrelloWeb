'use client';

import { UsersTable } from "@/components/admin/UsersTable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/store/useToastStore";
import { Users } from "lucide-react";

interface DashboardUser {
  id: number;
  email: string;
  role?: {
    id: number;
    name: string;
  };
  created_at?: string;
}

interface RoleOption {
  id: number;
  name: string;
}

export default function UsersPage() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const toast = useToast();

  const isSuperAdmin = user?.role?.name === 'superadmin';
  const isAdmin = user?.role?.name === 'admin' || isSuperAdmin;

  // Fetch Users
  const { data: users = [], isLoading: isUsersLoading } = useQuery<DashboardUser[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const endpoint = isSuperAdmin ? '/super-admin/users' : '/admin/users';
      const pageSize = 200;
      let skip = 0;
      const allUsers: DashboardUser[] = [];

      while (true) {
        const res = await api.get(endpoint, {
          params: { skip, limit: pageSize },
        });
        const batch = Array.isArray(res.data) ? (res.data as DashboardUser[]) : [];
        allUsers.push(...batch);

        if (batch.length < pageSize) break;
        skip += pageSize;
      }

      return allUsers;
    },
    enabled: isAdmin,
  });

  // Fetch Roles (SuperAdmin Only)
  const { data: roles = [] } = useQuery<RoleOption[]>({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await api.get('/super-admin/roles');
      return Array.isArray(res.data) ? (res.data as RoleOption[]) : [];
    },
    enabled: isSuperAdmin,
  });

  // Delete User
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      const endpoint = isSuperAdmin ? `/super-admin/users/${id}` : `/admin/users/${id}`;
      await api.delete(endpoint);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete user');
    }
  });

  // Update User Role (SuperAdmin Only)
  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: number; roleId: number }) => {
      const res = await api.put(`/super-admin/users/${userId}/role`, { role_id: roleId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User role updated successfully');
    },
    onError: () => {
      toast.error('Failed to update user role');
    }
  });

  if (!isAdmin) {
    return (
      <div className="rounded-[28px] border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center shadow-[var(--shadow-soft)]">
        <h3 className="font-display text-2xl text-[var(--text-primary)]">Access Denied</h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="rounded-[28px] border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_92%,transparent)] p-5 shadow-[var(--shadow-soft)] md:p-6">
        <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--text-secondary)]">Users Management</p>
        <div className="mt-2 flex items-start gap-3 md:items-center">
          <Users className="mt-0.5 h-6 w-6 shrink-0 text-[var(--accent)] md:mt-0" />
          <h1 className="font-display text-3xl text-[var(--text-primary)]">
            {isSuperAdmin ? 'Manage All Users' : 'Manage Users'}
          </h1>
        </div>
        <p className="mt-1 pl-9 text-sm text-[var(--text-secondary)] md:pl-9">
          {isSuperAdmin
            ? 'View and manage all users across the workspace.'
            : 'View and manage users you have permission to access.'}
        </p>
      </section>

      {isUsersLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-[24px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-soft)]"
            />
          ))}
        </div>
      ) : (
        <div>
          <UsersTable
            users={users}
            roles={roles}
            isSuperAdmin={isSuperAdmin}
            currentUserId={user?.id}
            onEdit={(userId, roleId) =>
              updateUserRoleMutation.mutate({ userId, roleId })
            }
            onDelete={(userId) => deleteUserMutation.mutate(userId)}
            isLoading={deleteUserMutation.isPending || updateUserRoleMutation.isPending}
          />
        </div>
      )}
    </div>
  );
}
