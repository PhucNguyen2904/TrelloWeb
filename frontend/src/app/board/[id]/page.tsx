'use client';

import { useState, use } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Board, Task, TaskStatus } from '@/lib/types';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/store/useToastStore';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { KanbanColumn } from '@/components/board/KanbanColumn';
import { TaskModal } from '@/components/board/TaskModal';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BoardPage({ params }: PageProps) {
  const { id } = use(params);
  const boardId = parseInt(id);
  const queryClient = useQueryClient();
  const toast = useToast();
  const user = useAuthStore((state) => state.user);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { data: board, isLoading: isBoardLoading } = useQuery<Board>({
    queryKey: ['board', boardId],
    queryFn: async () => {
      const res = await api.get(`/boards/${boardId}`);
      return res.data;
    },
  });

  const { data: tasks = [], isLoading: isTasksLoading } = useQuery<Task[]>({
    queryKey: ['tasks', boardId],
    queryFn: async () => {
      const res = await api.get(`/tasks?board_id=${boardId}`);
      return res.data;
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: { title: string; description: string; status: TaskStatus }) => {
      const res = await api.post('/tasks', {
        ...data,
        board_id: boardId,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
      setIsTaskModalOpen(false);
      setSelectedTask(null);
      toast.success('Task created successfully');
    },
    onError: () => {
      toast.error('Failed to create task');
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { title: string; description: string; status: TaskStatus } }) => {
      const res = await api.put(`/tasks/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
      setIsTaskModalOpen(false);
      setSelectedTask(null);
      toast.success('Task updated successfully');
    },
    onError: () => {
      toast.error('Failed to update task');
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
      toast.success('Task deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete task');
    }
  });

  const moveTaskMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: TaskStatus }) => {
      const res = await api.put(`/tasks/${id}`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
      toast.success('Task moved successfully');
    },
    onError: () => {
      toast.error('Failed to move task');
    }
  });

  const isLoading = createTaskMutation.isPending || updateTaskMutation.isPending || deleteTaskMutation.isPending || moveTaskMutation.isPending;

  const handleOpenCreateModal = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCreateTask = (data: { title: string; description: string; status: TaskStatus }) => {
    createTaskMutation.mutate(data);
  };

  const handleUpdateTask = (id: number, data: { title: string; description: string; status: TaskStatus }) => {
    updateTaskMutation.mutate({ id, data });
  };

  if (isBoardLoading) {
    return (
      <DashboardLayout topbarProps={{ title: 'Loading...' }}>
        <div className="animate-pulse space-y-4">
          <div className="h-10 rounded-lg" style={{ background: '#ebeef4' }} />
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-lg" style={{ background: '#ebeef4' }} />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!board) {
    return (
      <DashboardLayout topbarProps={{ title: 'Board Not Found' }}>
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
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#404751', marginBottom: 8 }}>Board not found</h3>
          <p style={{ fontSize: 14, color: '#707882', marginBottom: 24 }}>This board does not exist or you do not have access to it.</p>
          <Link
            href="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#0079bf',
              color: '#ffffff',
              borderRadius: 8,
              padding: '8px 20px',
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <ArrowLeft style={{ width: 16, height: 16 }} />
            Back to Dashboard
          </Link>
        </motion.div>
      </DashboardLayout>
    );
  }

  const isOwner = board.owner_id === user?.id;
  const isAdmin = user?.role?.name === 'admin' || user?.role?.name === 'superadmin';

  if (!isOwner && !isAdmin) {
    return (
      <DashboardLayout topbarProps={{ title: 'Access Denied' }}>
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
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#404751', marginBottom: 8 }}>Access Denied</h3>
          <p style={{ fontSize: 14, color: '#707882', marginBottom: 24 }}>You do not have permission to access this board.</p>
          <Link
            href="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#0079bf',
              color: '#ffffff',
              borderRadius: 8,
              padding: '8px 20px',
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <ArrowLeft style={{ width: 16, height: 16 }} />
            Back to Dashboard
          </Link>
        </motion.div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout topbarProps={{ title: board.name }}>
      <div className="space-y-6">
        {/* Board Actions Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 4,
          }}
        >
          <Link
            href="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              color: '#707882',
              textDecoration: 'none',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#181c20')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#707882')}
          >
            <ArrowLeft style={{ width: 16, height: 16 }} />
            Back
          </Link>
          <button
            id="board-add-task-btn"
            onClick={handleOpenCreateModal}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              background: '#0079bf',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              opacity: isLoading ? 0.6 : 1,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = '#005f98'; }}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#0079bf')}
          >
            <Plus style={{ width: 14, height: 14 }} />
            Add Task
          </button>
        </div>

        {/* Kanban Board */}
        {isTasksLoading ? (
          <div
            style={{
              display: 'flex',
              gap: 12,
              overflowX: 'auto',
              paddingBottom: 16,
            }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse"
                style={{
                  minWidth: 280,
                  height: 384,
                  background: '#ebeef4',
                  borderRadius: 10,
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              gap: 12,
              overflowX: 'auto',
              paddingBottom: 32,
              paddingTop: 4,
              alignItems: 'flex-start',
            }}
          >
            <KanbanColumn
              title="📌 Todo"
              status={TaskStatus.TODO}
              tasks={tasks}
              onAddTask={handleOpenCreateModal}
              onEditTask={handleEditTask}
              onDeleteTask={(id) => deleteTaskMutation.mutate(id)}
              onMoveTask={(id, status) => moveTaskMutation.mutate({ id, status })}
              isLoading={isLoading}
            />
            <KanbanColumn
              title="🔄 In Progress"
              status={TaskStatus.DOING}
              tasks={tasks}
              onAddTask={handleOpenCreateModal}
              onEditTask={handleEditTask}
              onDeleteTask={(id) => deleteTaskMutation.mutate(id)}
              onMoveTask={(id, status) => moveTaskMutation.mutate({ id, status })}
              isLoading={isLoading}
            />
            <KanbanColumn
              title="✅ Done"
              status={TaskStatus.DONE}
              tasks={tasks}
              onAddTask={handleOpenCreateModal}
              onEditTask={handleEditTask}
              onDeleteTask={(id) => deleteTaskMutation.mutate(id)}
              onMoveTask={(id, status) => moveTaskMutation.mutate({ id, status })}
              isLoading={isLoading}
            />

            {/* Add another list */}
            <div
              style={{
                width: 280,
                flexShrink: 0,
                background: '#ebeef4',
                border: '2px dashed #c0c7d2',
                borderRadius: 10,
                padding: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#707882',
                fontSize: 14,
                transition: 'background 0.15s, color 0.15s',
                minHeight: 60,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e0e2e9';
                e.currentTarget.style.color = '#005f98';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ebeef4';
                e.currentTarget.style.color = '#707882';
              }}
            >
              + Add another list
            </div>
          </div>
        )}
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        isLoading={isLoading}
        task={selectedTask}
        onCreate={handleCreateTask}
        onUpdate={handleUpdateTask}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
        }}
      />
    </DashboardLayout>
  );
}