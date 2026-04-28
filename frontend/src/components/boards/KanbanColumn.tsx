"use client";

import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { MoreHorizontal, Plus } from "lucide-react";
import type { KanbanCardData, KanbanStatus } from "@/lib/mock-data";
import { KanbanCard } from "./KanbanCard";

interface KanbanColumnProps {
  id: KanbanStatus;
  title: string;
  cards: KanbanCardData[];
  onAddCard: (status: KanbanStatus) => void;
  onOpenCard: (card: KanbanCardData) => void;
}

export function KanbanColumn({ id, title, cards, onAddCard, onOpenCard }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <section
      ref={setNodeRef}
      className={`min-w-[280px] rounded-[20px] border bg-white/3 p-3 backdrop-blur ${
        isOver ? "border-[var(--accent)]" : "border-[var(--border)]"
      }`}
      aria-label={`${title} column`}
    >
      <div className="mb-3 flex items-center justify-between gap-3 px-1 py-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-[var(--text-primary)]">{title}</h2>
          <span className="rounded-full bg-[var(--surface)] px-2 py-0.5 text-[11px] text-[var(--text-secondary)]">
            {cards.length}
          </span>
        </div>
        <button
          type="button"
          aria-label={`Column menu for ${title}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-secondary)] transition hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <SortableContext items={cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} onOpenCard={onOpenCard} />
          ))}
        </div>
      </SortableContext>

      <button
        type="button"
        onClick={() => onAddCard(id)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] px-3 py-3 text-sm text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
        aria-label={`Add a card to ${title}`}
      >
        <Plus className="h-4 w-4" />
        Add a card
      </button>
    </section>
  );
}

function SortableCard({
  card,
  onOpenCard,
}: {
  card: KanbanCardData;
  onOpenCard: (card: KanbanCardData) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: {
      type: "card",
      card,
    },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <KanbanCard
        card={card}
        dragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
        onClick={() => onOpenCard(card)}
      />
    </div>
  );
}
