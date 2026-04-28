"use client";

import { memo } from "react";
import type { CalendarEvent } from "@/lib/mock-data";

const eventColorMap: Record<CalendarEvent["kind"], string> = {
  Critical: "bg-[rgba(239,68,68,0.18)] text-[#fca5a5]",
  Sprint: "bg-[rgba(99,102,241,0.18)] text-[#a5b4fc]",
  Planning: "bg-[rgba(99,102,241,0.18)] text-[#c4b5fd]",
  Design: "bg-[rgba(16,185,129,0.18)] text-[#6ee7b7]",
  "UI/Dev": "bg-[rgba(59,130,246,0.18)] text-[#93c5fd]",
  Content: "bg-[rgba(245,158,11,0.18)] text-[#fcd34d]",
  Backend: "bg-[rgba(249,115,22,0.18)] text-[#fdba74]",
  API: "bg-[rgba(139,92,246,0.18)] text-[#c4b5fd]",
  Demo: "bg-[rgba(239,68,68,0.18)] text-[#fda4af]",
};

interface EventPillProps {
  event: CalendarEvent;
  onClick: () => void;
}

function EventPillComponent({ event, onClick }: EventPillProps) {
  return (
    <div className="group relative">
      <button
        type="button"
        onClick={onClick}
        className={`flex h-[22px] w-full items-center rounded px-2 text-left text-[12px] font-medium transition hover:brightness-115 ${eventColorMap[event.kind]}`}
        aria-label={`Open event ${event.title}`}
      >
        <span className="truncate">{event.title}</span>
      </button>
      <div className="pointer-events-none absolute left-0 top-7 z-20 hidden w-56 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-left shadow-[var(--shadow-soft)] group-hover:block">
        <p className="text-sm font-medium text-[var(--text-primary)]">{event.title}</p>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          {event.time} · {event.kind}
        </p>
      </div>
    </div>
  );
}

export const EventPill = memo(EventPillComponent);
