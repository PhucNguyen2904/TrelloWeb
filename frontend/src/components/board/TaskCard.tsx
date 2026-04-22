'use client';

import { Task, TaskStatus } from "@/lib/types";
import { motion } from "framer-motion";
import { MoreVertical, Trash2, Edit2, ArrowRight } from "lucide-react";
import { useState } from "react";

interface TaskCardProps {
  task: Task;
  onEdit?: () => void;
  onDelete?: () => void;
  onMove?: (newStatus: TaskStatus) => void;
  isLoading?: boolean;
}

export function TaskCard({ task, onEdit, onDelete, onMove, isLoading }: TaskCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const getRelativeTime = (date: string | undefined): string => {
    if (!date) return 'Just now';
    const now = new Date();
    const taskDate = new Date(date);
    const diffMs = now.getTime() - taskDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return taskDate.toLocaleDateString();
  };

  const getStatusOptions = (): TaskStatus[] => {
    const allStatuses: TaskStatus[] = [TaskStatus.TODO, TaskStatus.DOING, TaskStatus.DONE];
    return allStatuses.filter((s) => s !== task.status);
  };

  const getStatusLabel = (status: TaskStatus): string => {
    const labels: Record<TaskStatus, string> = {
      [TaskStatus.TODO]: 'Todo',
      [TaskStatus.DOING]: 'In Progress',
      [TaskStatus.DONE]: 'Done',
    };
    return labels[status];
  };

  const handleDelete = () => {
    if (confirm(`Delete "${task.title}"?`)) {
      onDelete?.();
    }
  };

  return (
    <motion.div
      layoutId={`task-${task.id}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: 'relative',
        backgroundColor: '#ffffff',
        border: '1px solid #e6e8ee',
        borderRadius: 8,
        boxShadow: hovered ? '0px 4px 12px rgba(0,0,0,0.10)' : '0px 1px 3px rgba(0,0,0,0.08)',
        padding: 12,
        cursor: 'grab',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'box-shadow 0.15s, transform 0.15s',
      }}
    >
      {/* Menu Button */}
      <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            padding: 4,
            borderRadius: 6,
            background: 'transparent',
            border: 'none',
            color: '#707882',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s, color 0.15s',
            opacity: hovered || isMenuOpen ? 1 : 0,
          }}
          disabled={isLoading}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f1f3fa';
            e.currentTarget.style.color = '#181c20';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#707882';
          }}
        >
          <MoreVertical style={{ width: 14, height: 14 }} />
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              position: 'absolute',
              top: 28,
              right: 0,
              backgroundColor: '#ffffff',
              border: '1px solid #e0e2e9',
              borderRadius: 8,
              boxShadow: '0px 8px 24px rgba(0,0,0,0.12)',
              zIndex: 20,
              overflow: 'hidden',
              minWidth: 160,
            }}
          >
            <button
              onClick={() => {
                onEdit?.();
                setIsMenuOpen(false);
              }}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: 13,
                color: '#404751',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                textAlign: 'left',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f3fa')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Edit2 style={{ width: 13, height: 13 }} />
              Edit
            </button>

            {/* Move Submenu */}
            {getStatusOptions().length > 0 && (
              <>
                <div style={{ borderTop: '1px solid #f1f3fa' }} />
                {getStatusOptions().map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      onMove?.(status);
                      setIsMenuOpen(false);
                    }}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: 13,
                      color: '#404751',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f3fa')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <ArrowRight style={{ width: 13, height: 13 }} />
                    Move to {getStatusLabel(status)}
                  </button>
                ))}
              </>
            )}

            <div style={{ borderTop: '1px solid #f1f3fa' }} />
            <button
              onClick={() => {
                handleDelete();
                setIsMenuOpen(false);
              }}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: 13,
                color: '#ba1a1a',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                textAlign: 'left',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#ffdad6')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Trash2 style={{ width: 13, height: 13 }} />
              Delete
            </button>
          </motion.div>
        )}
      </div>

      {/* Task Content */}
      <div style={{ paddingRight: 28 }}>
        <h4
          style={{
            fontWeight: 500,
            fontSize: 14,
            color: '#181c20',
            marginBottom: 4,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.4,
          }}
        >
          {task.title}
        </h4>
        {task.description && (
          <p
            style={{
              fontSize: 12,
              color: '#707882',
              marginBottom: 6,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.4,
            }}
          >
            {task.description}
          </p>
        )}
        <p style={{ fontSize: 11, color: '#b0b7c3', margin: 0 }}>{getRelativeTime(task.created_at)}</p>
      </div>
    </motion.div>
  );
}
