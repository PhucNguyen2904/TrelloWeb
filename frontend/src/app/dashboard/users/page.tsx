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

export default function AdminUsersPage() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const toast = useToast();

  const isAdmin = user?.role?.name === 'admin';

  // Fetch Users (admin scope only)
  const { data: users = [], isLoading: isUsersLoading } = useQuery<DashboardUser[]>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const pageSize = 200;
      let skip = 0;
      const allUsers: DashboardUser[] = [];

      while (true) {
        const res = await api.get('/api/admin/users', {
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

  // Delete User
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete user');
    },
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
          <h1 className="font-display text-3xl text-[var(--text-primary)]">Manage Users</h1>
        </div>
        <p className="mt-1 pl-9 text-sm text-[var(--text-secondary)] md:pl-9">
          View and manage users you have permission to access.
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
            roles={[]}
            isSuperAdmin={false}
            currentUserId={user?.id}
            onDelete={(userId) => deleteUserMutation.mutate(userId)}
            isLoading={deleteUserMutation.isPending}
          />
        </div>
      )}
    </div>
  );
}
