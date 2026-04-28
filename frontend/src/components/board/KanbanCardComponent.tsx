'use client';

import React, { memo } from 'react';
import { MessageCircle } from 'lucide-react';
import type { Card } from '@/lib/types';

interface KanbanCardProps {
  card: Card;
  onCardClick?: (card: Card) => void;
}

export const KanbanCard = memo(function KanbanCard({
  card,
  onCardClick,
}: KanbanCardProps) {
  const completedTasks =
    card.checklist?.filter((item) => item.completed).length || 0;
  const totalTasks = card.checklist?.length || 0;

  return (
    <div
      onClick={() => onCardClick?.(card)}
      className="bg-surface-card border border-border rounded-lg p-3 mb-3 shadow-card hover:shadow-md cursor-grab active:cursor-grabbing transition-all"
    >
      {/* Labels */}
      {card.labels.length > 0 && (
        <div className="flex gap-1 mb-2 flex-wrap">
          {card.labels.map((label) => (
            <span
              key={label.id}
              className="h-1.5 rounded-full px-2 text-xs text-white"
              style={{ backgroundColor: label.color }}
              title={label.name}
            />
          ))}
        </div>
      )}

      {/* Title */}
      <p className="text-sm font-medium text-text-heading leading-snug">
        {card.title}
      </p>

      {/* Image */}
      {card.imageUrl && (
        <img
          src={card.imageUrl}
          alt={card.title}
          className="w-full h-28 object-cover rounded-md mt-2 bg-gray-200"
        />
      )}

      {/* Checklist Progress */}
      {totalTasks > 0 && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-muted">
              {completedTasks}/{totalTasks}
            </span>
          </div>
          <div className="w-full bg-surface-muted rounded-full h-1">
            <div
              className="bg-brand h-1 rounded-full transition-all"
              style={{
                width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 text-xs">
        <div className="flex items-center gap-2">
          {card.dueDate && (
            <span
              className={`rounded px-2 py-1 ${
                card.isOverdue
                  ? 'bg-red-50 text-red-600'
                  : 'text-text-muted'
              }`}
            >
              {new Date(card.dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          )}

          {card.commentCount > 0 && (
            <span className="flex items-center gap-1 text-text-muted">
              <MessageCircle className="w-3 h-3" />
              {card.commentCount}
            </span>
          )}
        </div>

        {/* Assignee */}
        {card.assignees.length > 0 && (
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: card.assignees[0].avatarColor }}>
            {card.assignees[0].initials}
          </div>
        )}
      </div>
    </div>
  );
});

export default KanbanCard;
