'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
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
  assignees?: any[];
}

const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export default function CalendarPageView() {
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
        // Silently fail — show empty calendar grid, never show error to user
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

  // Get first day of month to know padding
  const firstDayOfWeek = getDay(monthStart);
  const previousMonthDays = Array.from({ length: firstDayOfWeek }).map(
    (_, i) => {
      const date = new Date(monthStart);
      date.setDate(date.getDate() - (firstDayOfWeek - i));
      return date;
    }
  );

  // Add remaining days to fill the grid
  const nextMonthDays = [];
  const totalCells = previousMonthDays.length + monthDays.length;
  const remainingCells = 42 - totalCells; // 6 weeks * 7 days
  for (let i = 1; i <= remainingCells; i++) {
    nextMonthDays.push(
      new Date(monthEnd.getFullYear(), monthEnd.getMonth() + 1, i)
    );
  }

  const allDays = [...previousMonthDays, ...monthDays, ...nextMonthDays];
  const weeks = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  // Returns events for a date
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.date), date));
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const handleCreateTask = () => {
    // TODO: Open create task modal
    console.log('Create task clicked');
  };

  return (
    <div className="h-full flex flex-col gap-4 relative">
      {/* Calendar Card */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm flex flex-col overflow-hidden flex-1">
        {/* Calendar Toolbar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e2e8f0]">
          {/* Left: Month/year title */}
          <h2 className="text-xl font-bold text-slate-800">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>

          {/* Center: Navigation group */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={goToPreviousMonth}
              className="w-8 h-8 rounded-md hover:bg-white text-slate-500 transition-colors flex items-center justify-center"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-1 text-sm font-medium text-slate-700 hover:bg-white rounded-md transition-colors"
            >
              Today
            </button>
            <button
              onClick={goToNextMonth}
              className="w-8 h-8 rounded-md hover:bg-white text-slate-500 transition-colors flex items-center justify-center"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Right: View toggles */}
          <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden">
            {(['List', 'Week', 'Month'] as const).map((mode) => {
              const modeKey = mode.toLowerCase() as 'month' | 'week' | 'list';
              return (
                <button
                  key={mode}
                  onClick={() => setViewMode(modeKey)}
                  className={`px-4 py-1.5 text-sm transition-colors ${
                    viewMode === modeKey
                      ? 'bg-[#0079BF] text-white font-medium'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {mode}
                </button>
              );
            })}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Day Headers row */}
          <div className="grid grid-cols-7 border-b border-[#e2e8f0]">
            {weekDays.map((day) => (
              <div
                key={day}
                className="py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wide"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Grid Body */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-7 min-h-full">
              {weeks.map((week, weekIdx) =>
                week.map((date, dayIdx) => {
                  const isCurrentMonth = isSameMonth(date, currentMonth);
                  const isToday = isSameDay(date, new Date());
                  const dayEvents = getEventsForDate(date);

                  return (
                    <div
                      key={`${weekIdx}-${dayIdx}`}
                      className={`min-h-[120px] border-r border-b border-[#e2e8f0] p-2 flex flex-col gap-1 transition-colors ${
                        isCurrentMonth
                          ? 'bg-white hover:bg-slate-50'
                          : 'bg-slate-50/50'
                      }`}
                    >
                      {isCurrentMonth && (
                        <>
                          {/* Date number */}
                          <div
                            className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                              isToday
                                ? 'bg-[#0079BF] text-white font-bold'
                                : 'text-slate-700'
                            }`}
                          >
                            {loading ? (
                              <span className="w-4 h-3 rounded bg-slate-200 animate-pulse inline-block" />
                            ) : (
                              format(date, 'd')
                            )}
                          </div>

                          {/* Event pills */}
                          {!loading && dayEvents.length > 0 && (
                            <div className="space-y-0.5">
                              {dayEvents.slice(0, 2).map((event) => (
                                <div
                                  key={event.id}
                                  className="px-2 py-0.5 rounded text-[11px] font-semibold text-white truncate w-full cursor-pointer hover:opacity-80 transition-opacity mb-0.5"
                                  style={{ backgroundColor: event.color }}
                                  title={event.title}
                                >
                                  {event.title}
                                </div>
                              ))}
                              {dayEvents.length > 2 && (
                                <div className="text-xs text-slate-400 px-2">
                                  +{dayEvents.length - 2} more
                                </div>
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
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={handleCreateTask}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#0079BF] hover:bg-[#005c91] text-white shadow-lg flex items-center justify-center text-2xl hover:scale-105 transition-all z-50"
        aria-label="Create task"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
