'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCalendarEvents } from '@/lib/api';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  format,
  addMonths,
  subMonths,
  isSameDay,
  getDay,
} from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  color: string;
}

const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getCalendarEvents();
        setEvents(data || []);
      } catch (err) {
        console.error('Failed to fetch calendar events:', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const firstDayOfWeek = getDay(monthStart);
  const previousMonthDays = Array.from({ length: firstDayOfWeek }).map((_, i) => {
    const date = new Date(monthStart);
    date.setDate(date.getDate() - (firstDayOfWeek - i));
    return date;
  });

  const totalCells = previousMonthDays.length + monthDays.length;
  const remainingCells = Math.ceil(totalCells / 7) * 7 - totalCells;
  const nextMonthDays = Array.from({ length: remainingCells }, (_, i) =>
    new Date(monthEnd.getFullYear(), monthEnd.getMonth() + 1, i + 1)
  );

  const allDays = [...previousMonthDays, ...monthDays, ...nextMonthDays];
  const weeks: Date[][] = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  const getEventsForDate = (date: Date) =>
    events.filter((e) => isSameDay(new Date(e.date), date));

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Task Calendar</h2>
            <p className="mt-1 text-sm text-slate-500">
              Your tasks displayed as calendar events — click a day to explore.
            </p>
          </div>

          {/* Stats pill */}
          {!loading && events.length > 0 && (
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
              {events.length} task{events.length !== 1 ? 's' : ''} this period
            </div>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        {/* Calendar controls */}
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-bold text-slate-800">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white shadow-sm">
              <button
                aria-label="Previous month"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2 text-slate-600 hover:bg-slate-100 transition rounded-l-lg"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="border-x border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Today
              </button>
              <button
                aria-label="Next month"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 text-slate-600 hover:bg-slate-100 transition rounded-r-lg"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 text-sm shadow-sm">
              {(['list', 'week', 'month'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  aria-pressed={viewMode === mode}
                  className={`rounded-lg px-3.5 py-2 font-medium transition ${
                    viewMode === mode
                      ? 'bg-[#0079BF] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-white'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="mt-4 overflow-x-auto">
          <div className="min-w-[680px]">
            {/* Day headers */}
            <div className="grid grid-cols-7 border border-slate-200 border-b-0">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="border-r border-slate-200 px-3 py-2 text-xs font-semibold tracking-wider text-slate-500 last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 border-l border-t border-slate-200">
              {weeks.map((week, wIdx) =>
                week.map((date, dIdx) => {
                  const isCurrentMonth = isSameMonth(date, currentMonth);
                  const isToday = isSameDay(date, new Date());
                  const dayEvents = isCurrentMonth ? getEventsForDate(date) : [];
                  const colIndex = dIdx % 7;
                  const isWeekend = colIndex === 0 || colIndex === 6;

                  return (
                    <div
                      key={`${wIdx}-${dIdx}`}
                      role="gridcell"
                      className={`min-h-[100px] border-b border-r border-slate-200 p-1.5 text-xs transition ${
                        isToday
                          ? 'bg-blue-50/70 ring-1 ring-inset ring-blue-200'
                          : isWeekend && isCurrentMonth
                          ? 'bg-slate-50'
                          : isCurrentMonth
                          ? 'bg-white hover:bg-slate-50'
                          : 'bg-slate-50/40'
                      }`}
                    >
                      {isCurrentMonth && (
                        <>
                          <p
                            className={`mb-1 w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold ${
                              isToday
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-600'
                            }`}
                          >
                            {loading ? (
                              <span className="w-4 h-3 rounded bg-slate-200 animate-pulse inline-block" />
                            ) : (
                              format(date, 'd')
                            )}
                          </p>

                          {!loading && dayEvents.length > 0 && (
                            <div className="space-y-0.5">
                              {dayEvents.slice(0, 3).map((event) => (
                                <p
                                  key={event.id}
                                  className="truncate rounded px-1.5 py-0.5 text-[10px] font-semibold text-white"
                                  style={{ backgroundColor: event.color }}
                                  title={event.title}
                                >
                                  {event.title}
                                </p>
                              ))}
                              {dayEvents.length > 3 && (
                                <p className="text-[10px] text-slate-500 px-1">
                                  +{dayEvents.length - 3} more
                                </p>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
