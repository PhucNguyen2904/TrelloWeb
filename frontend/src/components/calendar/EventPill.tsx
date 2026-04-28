"use client";

import { memo } from "react";
import type { CalendarEvent } from "@/lib/types";

interface EventPillProps {
  event: CalendarEvent;
  onClick: () => void;
}

function EventPillComponent({ event, onClick }: EventPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full px-2 py-1 rounded text-xs font-medium text-white truncate transition hover:opacity-90"
      style={{ backgroundColor: event.color }}
      aria-label={`Event: ${event.title}`}
    >
      {event.title}
    </button>
  );
}

export const EventPill = memo(EventPillComponent);

