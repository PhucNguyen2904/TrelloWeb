'use client';

import React, { useState, useEffect } from 'react';
import { Star, Filter, Menu } from 'lucide-react';
import { getBoards } from '@/lib/api';
import KanbanColumnComponent from '@/components/board/KanbanColumnComponent';
import type { Card } from '@/lib/types';

interface KanbanColumn {
  id: string;
  name: string;
  cardIds: string[];
}

interface BoardCard {
  id: string;
  title: string;
  columnId: string;
  description?: string;
  labels: any[];
  assignees: any[];
  commentCount: number;
}

interface Board {
  id: string;
  name: string;
  coverColor: string;
  members: Array<{ id: string; name: string; initials: string; avatarColor: string }>;
  columns: KanbanColumn[];
  cards: BoardCard[];
}

interface CardDetailModal {
  card: Card;
}

export default function BoardsPage() {
  const [selectedCard, setSelectedCard] = useState<CardDetailModal | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        setLoading(true);
        // Fetch all boards, then use the first one
        const boards = await getBoards();
        if (boards && boards.length > 0) {
          setBoard(boards[0]);
        }
      } catch (err) {
        // Silently fail — show empty board shell, never show error to user
        console.error('Failed to fetch board:', err);
        setBoard(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-brand border-t-transparent rounded-full mx-auto"></div>
          <p className="text-text-muted text-sm mt-4">Loading board...</p>
        </div>
      </div>
    );
  }

  // No board data — render an empty shell with no columns
  if (!board) {
    return (
      <div className="h-full flex flex-col space-y-4" style={{
        background: 'linear-gradient(135deg, #6B8DD6 0%, #8ECAE6 50%, #A8DADC 100%)',
        backgroundAttachment: 'fixed',
      }}>
        <div className="bg-surface-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-text-heading">Board</h1>
        </div>
        <div className="flex-1 overflow-x-auto bg-surface-app px-6 py-4">
          <div className="flex gap-4 h-full min-w-min" />
        </div>
      </div>
    );
  }

  // Map cards from real API data
  const getCardsForColumn = (columnId: string): Card[] => {
    const boardCards = (board as any).cards as BoardCard[] | undefined;
    if (!boardCards) return [];
    return boardCards
      .filter((c) => c.columnId === columnId)
      .map((c) => ({
        id: c.id,
        title: c.title,
        columnId: c.columnId,
        description: c.description,
        labels: c.labels ?? [],
        assignees: c.assignees ?? [],
        commentCount: c.commentCount ?? 0,
      }));
  };

  return (
    <div className="h-full flex flex-col space-y-4" style={{
      background: 'linear-gradient(135deg, #6B8DD6 0%, #8ECAE6 50%, #A8DADC 100%)',
      backgroundAttachment: 'fixed',
    }}>
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
          {board.columns.map((column) => (
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

      {/* Card Detail Modal */}
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
