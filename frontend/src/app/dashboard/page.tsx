'use client';

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Board } from "@/lib/types";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import { Plus, Shield, Users, Layout } from "lucide-react";
import { BoardCard } from "@/components/board/BoardCard";
import { CreateBoardModal } from "@/components/board/CreateBoardModal";
import { useToast } from "@/store/useToastStore";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const toast = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const isAdmin = user?.role?.name === 'admin' || user?.role?.name === 'superadmin';
  const isSuperAdmin = user?.role?.name === 'superadmin';

  // Fetch Boards (Regular Users Only)
  const { data: boards = [], isLoading: isBoardsLoading } = useQuery<Board[]>({
    queryKey: ['boards'],
    queryFn: async () => {
      const res = await api.get('/boards');
      return res.data;
    },
    enabled: !isAdmin,
  });

  // Fetch Users (Admin & SuperAdmin)
  const { data: usersList = [], isLoading: isUsersLoading } = useQuery<any[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const endpoint = isSuperAdmin ? '/super-admin/users' : '/admin/users';
      const res = await api.get(endpoint);
      return res.data;
    },
    enabled: isAdmin,
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

  // Create Board
  const createBoardMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await api.post('/boards', { name });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      setIsCreateModalOpen(false);
      toast.success('Board created successfully');
    },
    onError: () => {
      toast.error('Failed to create board');
    }
  });

  // Rename Board
  const renameBoardMutation = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const res = await api.put(`/boards/${id}`, { name });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      toast.success('Board renamed successfully');
    },
    onError: () => {
      toast.error('Failed to rename board');
    }
  });

  // Delete Board
  const deleteBoardMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/boards/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      toast.success('Board deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete board');
    }
  });

  const getRoleChipStyle = (roleName: string): React.CSSProperties => {
    if (roleName === 'superadmin') {
      return { background: '#ffdad6', color: '#93000a', borderRadius: 9999, padding: '2px 8px', fontSize: 11, fontWeight: 600 };
    }
    if (roleName === 'admin') {
      return { background: '#d4e0f8', color: '#576377', borderRadius: 9999, padding: '2px 8px', fontSize: 11, fontWeight: 600 };
    }
    return { background: '#ebeef4', color: '#404751', borderRadius: 9999, padding: '2px 8px', fontSize: 11, fontWeight: 600 };
  };

  return (
    <DashboardLayout topbarProps={{ title: isAdmin ? 'Manage Users' : 'My Boards' }}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#181c20', display: 'flex', alignItems: 'center', gap: 12, margin: 0 }}>
            {isSuperAdmin && <Shield style={{ width: 32, height: 32, color: '#0079bf' }} />}
            {isAdmin && !isSuperAdmin && <Users style={{ width: 32, height: 32, color: '#0079bf' }} />}
            {!isAdmin && <Layout style={{ width: 32, height: 32, color: '#0079bf' }} />}
            {isSuperAdmin ? 'Super Admin — Manage All Users' : isAdmin ? 'Manage Users' : 'Your Boards'}
          </h1>

          {!isAdmin && (
            <button
              id="dashboard-create-board-btn"
              onClick={() => setIsCreateModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#0079bf',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#005f98')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#0079bf')}
            >
              <Plus style={{ width: 16, height: 16 }} />
              Create Board
            </button>
          )}
        </div>

        {/* Boards Grid - Regular Users */}
        {!isAdmin && (
          <>
            {isBoardsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-40 animate-pulse rounded-2xl" style={{ background: '#ebeef4' }} />
                ))}
              </div>
            ) : boards.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  textAlign: 'center',
                  paddingTop: 80,
                  paddingBottom: 80,
                  background: '#ffffff',
                  border: '2px dashed #c0c7d2',
                  borderRadius: 16,
                }}
              >
                <Layout style={{ width: 48, height: 48, color: '#c0c7d2', margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#404751', marginBottom: 8 }}>No boards yet</h3>
                <p style={{ fontSize: 14, color: '#707882', marginBottom: 24 }}>Create your first board to start organizing tasks.</p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: '#0079bf',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 20px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Plus style={{ width: 16, height: 16 }} />
                  Create Your First Board
                </button>
              </motion.div>
            ) : (
              <>
                {/* Section Label */}
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#707882', marginBottom: 16 }}>
                  YOUR BOARDS
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {boards.map((board) => (
                    <BoardCard
                      key={board.id}
                      board={board}
                      onRename={(id, name) => renameBoardMutation.mutate({ id, name })}
                      onDelete={(id) => deleteBoardMutation.mutate(id)}
                      isLoading={renameBoardMutation.isPending || deleteBoardMutation.isPending}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Users Table - Admin/SuperAdmin */}
        {isAdmin && (
          <>
            {isUsersLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl" style={{ background: '#ebeef4' }} />
                ))}
              </div>
            ) : usersList.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  textAlign: 'center',
                  paddingTop: 80,
                  paddingBottom: 80,
                  background: '#ffffff',
                  border: '2px dashed #c0c7d2',
                  borderRadius: 16,
                }}
              >
                <Users style={{ width: 48, height: 48, color: '#c0c7d2', margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#404751', marginBottom: 8 }}>No users found</h3>
                <p style={{ fontSize: 14, color: '#707882' }}>There are no users to manage yet.</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e0e2e9',
                  borderRadius: 12,
                  overflow: 'hidden',
                }}
              >
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#f7f9ff', borderBottom: '1px solid #e0e2e9' }}>
                    <tr>
                      <th style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#707882' }}>ID</th>
                      <th style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#707882' }}>Email</th>
                      <th style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#707882' }}>Role</th>
                      <th style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#707882', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u, idx) => (
                      <tr
                        key={u.id}
                        style={{ borderTop: idx > 0 ? '1px solid #f1f3fa' : 'none' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#fafbff')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '14px 20px', fontSize: 13, color: '#707882' }}>#{u.id}</td>
                        <td style={{ padding: '14px 20px', fontSize: 13, color: '#181c20', fontWeight: 500 }}>{u.email}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={getRoleChipStyle(u.role?.name || 'user')}>
                            {u.role?.name || 'unknown'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                            {/* Role management and delete actions will be handled by UsersTable in Phase 9 */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Create Board Modal */}
      <CreateBoardModal
        isOpen={isCreateModalOpen}
        isLoading={createBoardMutation.isPending}
        onCreate={(name) => createBoardMutation.mutate(name)}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </DashboardLayout>
  );
}
