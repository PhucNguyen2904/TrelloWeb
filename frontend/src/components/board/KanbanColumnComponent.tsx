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
    <div className="bg-[#EBECF0] rounded-xl p-3 min-w-[272px] max-w-[300px] border border-border flex flex-col max-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-text-heading">
            {column.name}
          </h3>
          <span className="bg-border text-text-body rounded-full px-2 py-0.5 text-xs font-medium">
            {cards.length}
          </span>
        </div>
        <button
          className="p-1 text-text-muted hover:bg-white rounded transition-colors"
          aria-label="Column menu"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            onCardClick={onCardClick}
          />
        ))}
      </div>

      {/* Add Card Button */}
      <button
        onClick={() => onAddCard?.(column.id)}
        className="w-full mt-3 text-sm text-text-body hover:bg-white rounded-lg py-2 flex items-center gap-2 justify-center transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add a card
      </button>
    </div>
  );
});

export default KanbanColumnComponent;
