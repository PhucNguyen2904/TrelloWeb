"use client";

import { eachDayOfInterval, endOfMonth, endOfWeek, isSameMonth, isToday, startOfMonth, startOfWeek } from "date-fns";
import type { CalendarEvent } from "@/lib/types";
import { EventPill } from "./EventPill";

interface CalendarGridProps {
  month: Date;
  events: CalendarEvent[];
  onSelectDay: (date: Date) => void;
  onSelectEvent: (event: CalendarEvent) => void;
}

const weekdayLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function CalendarGrid({ month, events, onSelectDay, onSelectEvent }: CalendarGridProps) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const days = eachDayOfInterval({
    start: startOfWeek(monthStart),
    end: endOfWeek(monthEnd),
  });

  return (
    <div className="overflow-x-auto rounded-[28px] border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_92%,transparent)] shadow-[var(--shadow-soft)]">
      <div className="min-w-[760px]">
        <div className="grid grid-cols-7 border-b border-[var(--border)]">
          {weekdayLabels.map((label) => (
            <div key={label} className="px-4 py-3">
              <span className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--text-secondary)]">{label}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const dayEvents = events.filter((event) => new Date(event.date).toDateString() === day.toDateString());
            const outsideMonth = !isSameMonth(day, month);
            const dayIsToday = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={`relative min-h-[100px] border-r border-b border-[var(--border)] px-3 py-3 align-top transition hover:bg-[var(--surface-2)] ${
                  outsideMonth ? "opacity-30" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectDay(day)}
                  className="absolute inset-0 z-0"
                  aria-label={`Create event on ${day.toDateString()}`}
                />
                <div className="mb-3 flex justify-end">
                  <span
                    className={`font-mono-ui inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-[13px] ${
                      dayIsToday
                        ? "border-t-2 border-[var(--accent)] bg-[rgba(99,102,241,0.2)] text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)]"
                    }`}
                  >
                    {day.getDate()}
                  </span>
                </div>
                <div className="relative z-10 space-y-1.5">
                  {dayEvents.slice(0, 3).map((event) => (
                    <EventPill key={event.id} event={event} onClick={() => onSelectEvent(event)} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
