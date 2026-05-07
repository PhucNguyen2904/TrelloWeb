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

const DEFAULT_COLUMNS = ["To Do", "In Progress", "Testing", "Done"];


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
  const getCardsForColumn = (columnName: string): Card[] => {
    const boardCards = (board as any).cards as BoardCard[] | undefined;
    if (!boardCards) return [];
    
    // Find the column ID for this name from board.columns if it exists
    const column = board.columns.find(c => c.name.toLowerCase() === columnName.toLowerCase());
    const columnId = column?.id;

    return boardCards
      .filter((c) => c.columnId === columnId)
      .map((c) => ({
        id: c.id,
        title: c.title,
        columnId: c.columnId || '',
        description: c.description,
        labels: c.labels ?? [],
        assignees: c.assignees ?? [],
        commentCount: c.commentCount ?? 0,
      }));
  };


  return (
    <div className="h-full flex flex-col" style={{
      background: 'linear-gradient(135deg, #6b8fa3, #7a9e8e)',
      backgroundAttachment: 'fixed',
    }}>

      {/* Board Header */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white drop-shadow-sm">{board.name}</h1>
          <button
            aria-label="Star board"
            className="p-1 text-white/80 hover:text-amber-400 transition-colors"
          >
            <Star className="w-5 h-5 fill-current" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Member avatars */}
          <div className="flex items-center">
            {board.members.slice(0, 4).map((member, idx) => (
              <div
                key={member.id}
                className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center text-xs font-bold text-white"
                style={{
                  backgroundColor: member.avatarColor,
                  marginLeft: idx === 0 ? 0 : -10,
                  zIndex: 10 - idx,
                }}
                title={member.name}
              >
                {member.initials}
              </div>
            ))}
            {board.members.length > 4 && (
              <div 
                className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center text-xs font-bold text-white bg-slate-500/80 backdrop-blur-sm -ml-2.5 z-0"
              >
                +{board.members.length - 4}
              </div>
            )}
          </div>

          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-lg transition-all border border-white/30">
            <Filter className="w-4 h-4" />
            Filters
          </button>

          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-lg transition-all border border-white/30">
            <Menu className="w-4 h-4" />
            Show menu
          </button>
        </div>
      </div>


      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto px-6 py-4">
        <div className="flex gap-6 h-full min-w-min items-start">
          {DEFAULT_COLUMNS.map((colName) => {
            const column = board.columns.find(c => c.name.toLowerCase() === colName.toLowerCase());
            return (
              <KanbanColumnComponent
                key={colName}
                column={{
                  id: column?.id || colName,
                  name: colName,
                  cardIds: column?.cardIds || []
                }}
                cards={getCardsForColumn(colName)}
                onCardClick={(card) => setSelectedCard({ card })}
                onAddCard={(columnId) => {
                  console.log('Add card to', columnId);
                }}
              />
            );
          })}
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
