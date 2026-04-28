'use client';

import React, { useState } from 'react';
import { Star, Filter, Menu } from 'lucide-react';
import { boards, cards, kanbanColumns, members } from '@/lib/mock-data';
import KanbanColumnComponent from '@/components/board/KanbanColumnComponent';
import type { Card } from '@/lib/types';

interface CardDetailModal {
  card: Card;
}

export default function BoardsPage() {
  const [selectedCard, setSelectedCard] = useState<CardDetailModal | null>(null);
  const board = boards[0]; // Use first board

  // Map cards to columns
  const getCardsForColumn = (columnId: string) => {
    return cards.filter((card) => card.columnId === columnId);
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Board Header */}
      <div className="bg-surface-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-text-heading">{board.name}</h1>
          <button
            aria-label="Star board"
            className="p-1 text-text-muted hover:text-amber-500 transition-colors"
          >
            <Star className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Member avatars */}
          <div className="flex items-center">
            {board.members.slice(0, 4).map((member, idx) => (
              <div
                key={member.id}
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white -ml-2"
                style={{
                  backgroundColor: member.avatarColor,
                  marginLeft: idx === 0 ? 0 : -8,
                }}
                title={member.name}
              >
                {member.initials}
              </div>
            ))}
            {board.members.length > 4 && (
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white bg-text-muted -ml-2">
                +{board.members.length - 4}
              </div>
            )}
          </div>

          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg hover:bg-surface-muted transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>

          <button className="p-2 text-text-muted hover:bg-surface-muted rounded-lg transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto bg-surface-app px-6 py-4">
        <div className="flex gap-4 h-full min-w-min">
          {kanbanColumns.map((column) => (
            <KanbanColumnComponent
              key={column.id}
              column={column}
              cards={getCardsForColumn(column.id)}
              onCardClick={(card) => setSelectedCard({ card })}
              onAddCard={(columnId) => {
                console.log('Add card to', columnId);
              }}
            />
          ))}
        </div>
      </div>

      {/* TODO: Card Detail Modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="bg-surface-card rounded-xl shadow-modal w-[760px] max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-text-heading">
                {selectedCard.card.title}
              </h2>
              <button
                onClick={() => setSelectedCard(null)}
                className="p-1 text-text-muted hover:bg-surface-muted rounded transition-colors"
              >
                ×
              </button>
            </div>

            {/* Card detail content will go here */}
            <p className="text-sm text-text-body">Card details coming soon...</p>
          </div>
        </div>
      )}
    </div>
  );
}
