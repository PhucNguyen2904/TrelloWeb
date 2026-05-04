'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { calendarEvents } from '@/lib/mock-data';
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

export default function CalendarPageView() {
  const [currentMonth, setCurrentMonth] = useState(new Date('2023-10-01'));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter((event) => isSameDay(new Date(event.date), date));
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

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Calendar Header */}
      <div className="bg-surface-card border border-border rounded-xl p-4 flex items-center justify-between relative">
        <button
          onClick={goToPreviousMonth}
          className="p-1.5 border border-border rounded-lg hover:bg-surface-muted transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold text-text-heading">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>

        <button
          onClick={goToNextMonth}
          className="p-1.5 border border-border rounded-lg hover:bg-surface-muted transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-surface-muted transition-colors"
          >
            Today
          </button>

          <div className="flex gap-2 bg-surface-muted rounded-lg p-1">
            {['List', 'Week', 'Month'].map((view) => (
              <button
                key={view}
                className={`px-3 py-1.5 text-sm rounded font-medium transition-colors ${
                  view === 'Month'
                    ? 'bg-brand text-white'
                    : 'text-text-body hover:bg-white'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-surface-card border border-border rounded-xl overflow-hidden flex-1 flex flex-col">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-surface-app border-b border-border">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
            <div
              key={day}
              className="p-3 text-center text-xs uppercase font-medium text-text-muted border-r border-border last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
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
                    className={`border-r border-b border-border p-2 min-h-[110px] flex flex-col ${
                      isCurrentMonth
                        ? 'bg-surface-card'
                        : 'bg-surface-muted'
                    }`}
                  >
                    {isCurrentMonth && (
                      <>
                        {/* Date number */}
                        <div className="flex justify-start mb-1">
                          <div
                            className={`w-7 h-7 flex items-center justify-center text-sm font-medium rounded-full ${
                              isToday
                                ? 'bg-brand text-white'
                                : 'text-text-body'
                            }`}
                          >
                            {format(date, 'd')}
                          </div>
                        </div>

                        {/* Events */}
                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map((event) => (
                            <div
                              key={event.id}
                              className="h-6 rounded px-2 text-xs font-medium text-white truncate cursor-pointer hover:opacity-90 transition-opacity"
                              style={{ backgroundColor: event.color }}
                              title={event.title}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="text-xs text-text-muted px-1">
                              +{dayEvents.length - 3} more
                            </div>
                          )}
                        </div>
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
  );
}
