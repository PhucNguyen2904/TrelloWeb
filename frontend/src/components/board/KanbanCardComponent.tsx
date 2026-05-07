'use client';

import React, { memo } from 'react';
import { MessageCircle, Clock, AlignLeft } from 'lucide-react';

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
      className="bg-white border border-slate-100 rounded-lg overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all cursor-pointer group"

    >
      {/* Label Strip */}
      {card.labels.length > 0 && (
        <div className="flex gap-1 h-1.5 w-full">
          {card.labels.map((label) => (
            <div
              key={label.id}
              className="flex-1 h-full first:rounded-tl-lg last:rounded-tr-lg"
              style={{ backgroundColor: label.color }}
              title={label.name}
            />

          ))}
        </div>
      )}

      {/* Image Thumbnail */}
      {card.imageUrl && (
        <div className="w-full h-32 overflow-hidden border-b border-slate-50">
          <img
            src={card.imageUrl}
            alt={card.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="p-3">
        {/* Title */}
        <p className="text-[14px] font-medium text-slate-800 leading-[1.4] mb-3 line-clamp-2">
          {card.title}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Due Date */}
            {card.dueDate && (
              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                  card.isOverdue
                    ? 'bg-red-50 text-red-600 border border-red-100'
                    : 'bg-slate-50 text-slate-500 border border-slate-100'
                }`}
              >
                <Clock className="w-3 h-3" />
                {card.isOverdue && <span className="mr-0.5">⚠</span>}
                {new Date(card.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            )}

            {/* Checklist */}
            {totalTasks > 0 && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                <AlignLeft className="w-3.5 h-3.5" />
                <span>{completedTasks}/{totalTasks}</span>
              </div>
            )}

            {/* Comments */}
            {card.commentCount > 0 && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{card.commentCount}</span>
              </div>
            )}
          </div>

          {/* Assignee */}
          {card.assignees.length > 0 && (
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-extrabold border-2 border-white shadow-sm ring-1 ring-slate-100"
              style={{ backgroundColor: card.assignees[0].avatarColor }}
              title={card.assignees[0].name}
            >
              {card.assignees[0].initials}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});


export default KanbanCard;
