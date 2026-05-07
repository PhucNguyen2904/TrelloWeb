'use client';

import React, { memo } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import type { Card, KanbanColumn } from '@/lib/types';
import { KanbanCard } from './KanbanCardComponent';

interface KanbanColumnProps {
  column: KanbanColumn;
  cards: Card[];
  onCardClick?: (card: Card) => void;
  onAddCard?: (columnId: string) => void;
}

export const KanbanColumnComponent = memo(function KanbanColumnComponent({
  column,
  cards,
  onCardClick,
  onAddCard,
}: KanbanColumnProps) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-[12px] p-4 w-[280px] flex-shrink-0 flex flex-col max-h-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-white/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[15px] text-slate-800 tracking-tight">
          {column.name}
        </h3>
        <button
          className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-all"
          aria-label="Column menu"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto space-y-3 min-h-[10px] pr-1 -mr-1 custom-scrollbar">
        {cards.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-[13px] text-slate-400 italic">No tasks here</p>
          </div>
        ) : (
          cards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              onCardClick={onCardClick}
            />
          ))
        )}
      </div>

      {/* Add Card Button */}
      <button
        onClick={() => onAddCard?.(column.id)}
        className="w-full mt-4 text-[13px] font-bold text-blue-600 hover:bg-blue-50 rounded-xl py-2.5 flex items-center gap-2 justify-center transition-all border border-transparent hover:border-blue-100"
      >
        <Plus className="w-4 h-4" />
        Add a card
      </button>
    </div>
  );
});


export default KanbanColumnComponent;
