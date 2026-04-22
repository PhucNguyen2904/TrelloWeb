'use client';

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UsersTable } from "@/components/admin/UsersTable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/store/useToastStore";
import { motion } from "framer-motion";
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed"
        >
          <h3 className="text-xl font-medium text-gray-300 mb-2">Access Denied</h3>
          <p className="text-gray-500">You do not have permission to access this page.</p>
        </motion.div>
      </DashboardLayout>
    );
  }

  // Fetch Users
  const { data: users = [], isLoading: isUsersLoading } = useQuery<any[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const endpoint = isSuperAdmin ? '/super-admin/users' : '/admin/users';
      const res = await api.get(endpoint);
      return res.data;
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
    <DashboardLayout topbarProps={{ title: 'Manage Users' }}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-indigo-500" />
          <h1 className="text-3xl font-bold">
            {isSuperAdmin ? 'Super Admin - Manage All Users' : 'Manage Users'}
          </h1>
        </div>

        {/* Users Table */}
        {isUsersLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-white/5 animate-pulse rounded-xl border border-white/5" />
            ))}
          </div>
        ) : (
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
        )}
      </div>
    </DashboardLayout>
  );
}
