'use client';

import { Board } from "@/lib/types";
import Link from "next/link";
import { motion } from "framer-motion";
import { MoreVertical, Trash2, Edit2 } from "lucide-react";
import { useState } from "react";

interface BoardCardProps {
  board: Board;
  onRename?: (boardId: number, newName: string) => void;
  onDelete?: (boardId: number) => void;
  isLoading?: boolean;
}

const COVER_COLORS = ['#0079bf', '#61bd4f', '#f2d600', '#ff9f1a', '#eb5a46', '#c377e0'];

export function BoardCard({ board, onRename, onDelete, isLoading }: BoardCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(board.name);
  const [hovered, setHovered] = useState(false);

  const coverColor = COVER_COLORS[board.id % COVER_COLORS.length];

  const handleSaveRename = () => {
    if (editName.trim() && editName !== board.name) {
      onRename?.(board.id, editName.trim());
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${board.name}"?`)) {
      onDelete?.(board.id);
    }
  };

  const getDateText = () => {
    if (!board.created_at) return 'Just now';
    const date = new Date(board.created_at);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      layoutId={`board-${board.id}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: 'relative',
        height: 140,
        backgroundColor: '#ffffff',
        border: '1px solid #e0e2e9',
        borderRadius: 12,
        boxShadow: hovered ? '0px 4px 16px rgba(0,0,0,0.12)' : '0px 1px 3px rgba(0,0,0,0.10)',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      {/* Color Strip */}
      <div
        style={{
          height: 6,
          background: coverColor,
          width: '100%',
          borderRadius: '12px 12px 0 0',
          flexShrink: 0,
        }}
      />

      {/* Menu Button */}
      <div style={{ position: 'absolute', top: 14, right: 10, zIndex: 10 }}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            padding: '6px',
            borderRadius: 6,
            background: hovered ? '#f1f3fa' : 'transparent',
            border: 'none',
            color: '#404751',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s',
            opacity: hovered ? 1 : 0,
          }}
          disabled={isLoading}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#ebeef4')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#f1f3fa')}
        >
          <MoreVertical style={{ width: 16, height: 16 }} />
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              position: 'absolute',
              top: 36,
              right: 0,
              backgroundColor: '#ffffff',
              border: '1px solid #e0e2e9',
              borderRadius: 10,
              boxShadow: '0px 8px 24px rgba(0,0,0,0.12)',
              zIndex: 20,
              overflow: 'hidden',
              minWidth: 140,
            }}
          >
            <button
              onClick={() => {
                setIsEditing(true);
                setIsMenuOpen(false);
              }}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '8px 14px',
                fontSize: 13,
                color: '#404751',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                textAlign: 'left',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f3fa')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Edit2 style={{ width: 14, height: 14 }} />
              Rename
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '8px 14px',
                fontSize: 13,
                color: '#ba1a1a',
                background: 'transparent',
                border: 'none',
                borderTop: '1px solid #f1f3fa',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                textAlign: 'left',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#ffdad6')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Trash2 style={{ width: 14, height: 14 }} />
              Delete
            </button>
          </motion.div>
        )}
      </div>

      {/* Edit Mode */}
      {isEditing ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            padding: 16,
            background: 'rgba(255,255,255,0.97)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 10,
            zIndex: 20,
          }}
        >
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value.slice(0, 100))}
            maxLength={100}
            autoFocus
            style={{
              width: '100%',
              padding: '8px 10px',
              background: '#f7f9ff',
              border: '1px solid #c0c7d2',
              borderRadius: 8,
              color: '#181c20',
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#0079bf')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#c0c7d2')}
            disabled={isLoading}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleSaveRename}
              disabled={!editName.trim() || editName === board.name || isLoading}
              style={{
                flex: 1,
                padding: '7px 0',
                background: '#0079bf',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                opacity: (!editName.trim() || editName === board.name || isLoading) ? 0.5 : 1,
              }}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setEditName(board.name);
                setIsEditing(false);
              }}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '7px 0',
                background: '#ffffff',
                color: '#404751',
                border: '1px solid #c0c7d2',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* Normal View */
        <Link
          href={`/board/${board.id}`}
          style={{
            position: 'absolute',
            inset: 0,
            padding: '12px 16px 14px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            textDecoration: 'none',
          }}
        >
          <h3
            style={{
              fontWeight: 600,
              fontSize: 15,
              color: hovered ? '#005f98' : '#181c20',
              lineHeight: 1.4,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              transition: 'color 0.15s',
              marginBottom: 6,
            }}
          >
            {board.name}
          </h3>
          <p style={{ fontSize: 12, color: '#707882', margin: 0 }}>
            {getDateText()}
          </p>
        </Link>
      )}
    </motion.div>
  );
}
