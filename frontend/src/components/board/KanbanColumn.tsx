'use client';

import { Card } from "@/lib/types";
import React from "react";
import { Plus } from "lucide-react";

interface KanbanColumnComponentProps {
  id: string;
  name: string;
  cards: Card[];
  onCardClick?: (card: Card) => void;
  onAddCard?: (columnId: string) => void;
}

export function KanbanColumnComponent({
  id,
  name,
  cards,
  onCardClick,
  onAddCard,
}: KanbanColumnComponentProps) {
  return (
    <div className="min-w-[272px] max-w-[300px] bg-surface-muted rounded-xl border border-border flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-heading">{name}</h3>
        <div className="px-2 py-1 bg-border rounded-full text-xs text-text-body">
          {cards.length}
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => onCardClick?.(card)}
            className="p-3 bg-surface-card rounded-lg border border-border shadow-card hover:shadow-lg transition-shadow cursor-pointer"
          >
            {/* Labels */}
            {card.labels && card.labels.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {card.labels.map((label) => (
                  <span
                    key={label.id}
                    className="px-2 py-1 rounded text-xs text-white"
                    style={{ backgroundColor: label.color }}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <p className="text-sm font-medium leading-snug text-text-heading mb-2">
              {card.title}
            </p>

            {/* Image */}
            {card.imageUrl && (
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full h-28 object-cover rounded mb-2"
              />
            )}

            {/* Checklist Progress */}
            {card.checklist && card.checklist.length > 0 && (
              <div className="mb-2">
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand"
                    style={{
                      width: `${(card.checklist.filter((item) => item.completed).length / card.checklist.length) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  {card.checklist.filter((item) => item.completed).length}/{card.checklist.length}
                </p>
              </div>
            )}

            {/* Footer: Due Date + Comments + Assignee */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {card.dueDate && (
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      card.isOverdue
                        ? "bg-red-100 text-red-700"
                        : "bg-border text-text-muted"
                    }`}
                  >
                    {new Date(card.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
                {card.commentCount > 0 && (
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    💬 {card.commentCount}
                  </span>
                )}
              </div>

              {/* Assignee Avatar */}
              {card.assignees && card.assignees.length > 0 && (
                <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center text-xs text-white font-semibold">
                  {card.assignees[0].initials}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Card Button */}
      <button
        onClick={() => onAddCard?.(id)}
        className="w-full px-3 py-2 text-text-muted hover:text-text-heading hover:bg-white transition-colors flex items-center justify-center gap-2 text-sm"
      >
        <Plus className="w-4 h-4" />
        Add a card
      </button>
    </div>
  );
}
