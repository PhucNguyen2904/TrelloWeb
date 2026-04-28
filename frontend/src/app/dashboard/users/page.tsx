'use client';

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UsersTable } from "@/components/admin/UsersTable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/store/useToastStore";
import { Users } from "lucide-react";

export default function UsersPage() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const toast = useToast();

  const isSuperAdmin = user?.role?.name === 'superadmin';
  const isAdmin = user?.role?.name === 'admin' || isSuperAdmin;

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <DashboardLayout topbarProps={{ title: 'Access Denied' }}>
        <div
          className="animate-fadeIn text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 px-6"
        >
          <h3 className="mb-2 text-lg font-semibold text-slate-700">Access Denied</h3>
          <p className="text-sm text-slate-500">You do not have permission to access this page.</p>
        </div>
      </DashboardLayout>
    );
  }

  // Fetch Users
  const { data: users = [], isLoading: isUsersLoading } = useQuery<any[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const endpoint = isSuperAdmin ? '/super-admin/users' : '/admin/users';
      const pageSize = 200;
      let skip = 0;
      const allUsers: any[] = [];

      while (true) {
        const res = await api.get(endpoint, {
          params: { skip, limit: pageSize },
        });
        const batch = Array.isArray(res.data) ? res.data : [];
        allUsers.push(...batch);

        if (batch.length < pageSize) break;
        skip += pageSize;
      }

      return allUsers;
    },
  });

  // Fetch Roles (SuperAdmin Only)
  const { data: roles = [] } = useQuery<any[]>({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await api.get('/super-admin/roles');
      return res.data;
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

  return (
    <DashboardLayout
      topbarProps={{
        title: 'Users Management',
        subtitle: 'Manage access, roles, and user lifecycle efficiently.',
      }}
    >
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <section className="mb-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Users Management</p>
          <div className="flex items-start gap-3 md:items-center">
            <Users className="mt-0.5 h-7 w-7 shrink-0 text-[#0079BF] md:mt-0" />
            <h1 className="text-2xl font-bold leading-tight text-slate-800 md:text-3xl">
              {isSuperAdmin ? 'Manage All Users' : 'Manage Users'}
            </h1>
          </div>
          <p className="pl-10 text-sm text-slate-500">
            {isSuperAdmin
              ? 'View and manage all users across the workspace.'
              : 'View and manage users you have permission to access.'}
          </p>
        </section>

        {/* Users Table */}
        {isUsersLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="skeleton animate-stagger-{i} h-16 rounded-xl border border-slate-200"
                style={{ animationDelay: `${(i - 1) * 50}ms` }}
              />
            ))}
          </div>
        ) : (
          <div className="animate-fadeIn">
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
    </DashboardLayout>
  );
}
