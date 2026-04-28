"use client";

import Image from "next/image";
import { memo } from "react";
import { MessageSquare, GripVertical } from "lucide-react";
import { format, isBefore, startOfDay } from "date-fns";
import type { KanbanCardData } from "@/lib/mock-data";

const priorityColor: Record<KanbanCardData["priority"], string> = {
  critical: "bg-[var(--accent-danger)]",
  high: "bg-[var(--accent-warm)]",
  medium: "bg-[var(--accent-blue)]",
  low: "bg-[var(--accent-success)]",
};

interface KanbanCardProps {
  card: KanbanCardData;
  dragging?: boolean;
  dragHandleProps?: Record<string, unknown>;
  onClick: () => void;
}

function KanbanCardComponent({ card, dragging = false, dragHandleProps, onClick }: KanbanCardProps) {
  const dueDate = new Date(card.dueDate);
  const overdue = isBefore(dueDate, startOfDay(new Date()));

  return (
    <article
      className={`group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-[0_12px_24px_rgba(0,0,0,0.18)] transition-all duration-150 hover:border-[var(--border-hover)] ${
        dragging ? "scale-[1.01] border-[var(--accent)] shadow-[var(--shadow-glow)]" : ""
      }`}
    >
      <div className={`mb-3 h-0.5 w-full rounded-full ${priorityColor[card.priority]}`} />
      {card.cover ? (
        <div className="relative mb-3 h-[120px] overflow-hidden rounded-lg">
          <Image src={card.cover} alt="" fill className="object-cover" sizes="280px" loading="lazy" />
        </div>
      ) : null}
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left"
        aria-label={`Open card ${card.title}`}
      >
        <p className="text-sm font-medium text-[var(--text-primary)]">{card.title}</p>
      </button>
      <div className="mt-3 flex items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-3">
          <span className={`font-mono-ui ${overdue ? "text-[var(--accent-warm)]" : "text-[var(--text-secondary)]"}`}>
            {format(dueDate, "MMM dd")}
          </span>
          <span className="inline-flex items-center gap-1 text-[var(--text-secondary)]">
            <MessageSquare className="h-3.5 w-3.5" />
            {card.comments}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white"
            style={{ backgroundColor: card.assignee.color }}
          >
            {card.assignee.initials}
          </span>
          <button
            type="button"
            aria-label={`Drag ${card.title}`}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[var(--text-tertiary)] opacity-0 transition group-hover:opacity-100"
            {...dragHandleProps}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

export const KanbanCard = memo(KanbanCardComponent);
