'use client';

import { motion } from "framer-motion";
import { Task, TaskStatus } from "@/lib/types";
import { useMemo, useState } from "react";
import { Edit2, Plus, X } from "lucide-react";

interface TaskModalProps {
  isOpen: boolean;
  isLoading: boolean;
  task?: Task | null;
  onCreate?: (data: { title: string; description: string; status: TaskStatus }) => void;
  onUpdate?: (id: number, data: { title: string; description: string; status: TaskStatus }) => void;
  onClose: () => void;
}

export function TaskModal({
  isOpen,
  isLoading,
  task,
  onCreate,
  onUpdate,
  onClose,
}: TaskModalProps) {
  const initialState = useMemo(
    () => ({
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status ?? TaskStatus.TODO,
    }),
    [task]
  );
  const [draft, setDraft] = useState<typeof initialState | null>(null);
  const [titleFocused, setTitleFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);
  const [statusFocused, setStatusFocused] = useState(false);
  const currentDraft = draft ?? initialState;
  const title = currentDraft.title;
  const description = currentDraft.description;
  const status = currentDraft.status;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (task) {
      onUpdate?.(task.id, { title: title.trim(), description: description.trim(), status });
    } else {
      onCreate?.({ title: title.trim(), description: description.trim(), status });
    }
  };

  const handleClose = () => {
    setDraft(null);
    onClose();
  };

  const isEditing = !!task;

  const inputStyle = (focused: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '9px 12px',
    background: '#ffffff',
    border: `1px solid ${focused ? '#0079bf' : '#c0c7d2'}`,
    borderRadius: 8,
    fontSize: 14,
    color: '#181c20',
    outline: 'none',
    boxShadow: focused ? '0 0 0 3px rgba(0,121,191,0.12)' : 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  });

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.50)',
            zIndex: 40,
          }}
        />
      )}

      {/* Modal */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90vw',
            maxWidth: 560,
            zIndex: 50,
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 12,
              boxShadow: '0px 12px 24px rgba(0,0,0,0.15)',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '28px 28px 24px',
              position: 'relative',
            }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                borderRadius: 6,
                background: 'transparent',
                border: 'none',
                color: '#707882',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#ebeef4')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <X size={16} />
            </button>

            {/* Title */}
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#181c20',
                marginBottom: 24,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {isEditing ? (
                <>
                  <Edit2 style={{ width: 20, height: 20, color: '#0079bf' }} />
                  Edit Task
                </>
              ) : (
                <>
                  <Plus style={{ width: 20, height: 20, color: '#0079bf' }} />
                  Create New Task
                </>
              )}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Title Input */}
              <div>
                <label
                  htmlFor="task-title"
                  style={{
                    display: 'block',
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#707882',
                    marginBottom: 6,
                  }}
                >
                  Task Title
                </label>
                <input
                  id="task-title"
                  type="text"
                  autoFocus
                  placeholder="e.g., Implement user authentication"
                  value={title}
                  onChange={(e) =>
                    setDraft((current) => ({ ...(current ?? initialState), title: e.target.value }))
                  }
                  maxLength={150}
                  style={inputStyle(titleFocused)}
                  onFocus={() => setTitleFocused(true)}
                  onBlur={() => setTitleFocused(false)}
                  disabled={isLoading}
                />
                <p style={{ fontSize: 11, color: '#b0b7c3', marginTop: 4 }}>{title.length}/150 characters</p>
              </div>

              {/* Description Textarea */}
              <div>
                <label
                  htmlFor="task-description"
                  style={{
                    display: 'block',
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#707882',
                    marginBottom: 6,
                  }}
                >
                  Description
                </label>
                <textarea
                  id="task-description"
                  placeholder="Add more details about this task..."
                  value={description}
                  onChange={(e) =>
                    setDraft((current) => ({ ...(current ?? initialState), description: e.target.value }))
                  }
                  maxLength={500}
                  rows={4}
                  style={{
                    ...inputStyle(descFocused),
                    resize: 'none',
                  }}
                  onFocus={() => setDescFocused(true)}
                  onBlur={() => setDescFocused(false)}
                  disabled={isLoading}
                />
                <p style={{ fontSize: 11, color: '#b0b7c3', marginTop: 4 }}>{description.length}/500 characters</p>
              </div>

              {/* Status Select */}
              <div>
                <label
                  htmlFor="task-status"
                  style={{
                    display: 'block',
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#707882',
                    marginBottom: 6,
                  }}
                >
                  Status
                </label>
                <select
                  id="task-status"
                  value={status}
                  onChange={(e) =>
                    setDraft((current) => ({ ...(current ?? initialState), status: e.target.value as TaskStatus }))
                  }
                  style={inputStyle(statusFocused)}
                  onFocus={() => setStatusFocused(true)}
                  onBlur={() => setStatusFocused(false)}
                  disabled={isLoading}
                >
                  <option value={TaskStatus.TODO}>📌 Todo</option>
                  <option value={TaskStatus.DOING}>🔄 In Progress</option>
                  <option value={TaskStatus.DONE}>✅ Done</option>
                </select>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
                <button
                  type="submit"
                  disabled={!title.trim() || isLoading}
                  style={{
                    flex: 1,
                    background: '#0079bf',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 16px',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    opacity: (!title.trim() || isLoading) ? 0.5 : 1,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => { if (title.trim() && !isLoading) e.currentTarget.style.background = '#005f98'; }}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#0079bf')}
                >
                  {isLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Task' : 'Create Task')}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    background: '#ffffff',
                    color: '#404751',
                    border: '1px solid #c0c7d2',
                    borderRadius: 8,
                    padding: '10px 16px',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f3fa')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </>
  );
}
