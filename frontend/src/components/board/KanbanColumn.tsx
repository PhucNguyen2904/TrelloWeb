'use client';

import { Task, TaskStatus } from "@/lib/types";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { TaskCard } from "./TaskCard";

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onAddTask?: () => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: number) => void;
  onMoveTask?: (taskId: number, newStatus: TaskStatus) => void;
  isLoading?: boolean;
}

export function KanbanColumn({
  title,
  status,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  isLoading = false,
}: KanbanColumnProps) {
  const columnTasks = tasks.filter((t) => t.status === status);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: 280,
        maxWidth: 320,
        background: '#f1f3fa',
        border: '1px solid #e0e2e9',
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 14px',
          borderBottom: '1px solid #e0e2e9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h3
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#181c20',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            margin: 0,
          }}
        >
          {title}
        </h3>
        <span
          style={{
            background: '#e0e2e9',
            color: '#404751',
            borderRadius: 9999,
            padding: '2px 8px',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {columnTasks.length}
        </span>
      </div>

      {/* Task List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          minHeight: 100,
        }}
      >
        {columnTasks.length === 0 ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 120,
            }}
          >
            <p style={{ fontSize: 13, color: '#b0b7c3', textAlign: 'center', margin: 0 }}>No tasks yet</p>
          </div>
        ) : (
          columnTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask?.(task)}
              onDelete={() => onDeleteTask?.(task.id)}
              onMove={(newStatus) => {
                if (newStatus !== status) {
                  onMoveTask?.(task.id, newStatus);
                }
              }}
              isLoading={isLoading}
            />
          ))
        )}
      </div>

      {/* Add a card Button */}
      <div style={{ padding: '6px 8px 8px' }}>
        <button
          onClick={onAddTask}
          disabled={isLoading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 12px',
            textAlign: 'left',
            background: 'transparent',
            border: 'none',
            borderRadius: 8,
            color: '#707882',
            fontSize: 13,
            cursor: 'pointer',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e6e8ee';
            e.currentTarget.style.color = '#005f98';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#707882';
          }}
        >
          <Plus size={14} />
          Add a card
        </button>
      </div>
    </motion.div>
  );
}
