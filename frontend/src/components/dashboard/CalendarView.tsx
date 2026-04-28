'use client';

import { ChevronLeft, ChevronRight, Filter, Plus, Share2, Star } from 'lucide-react';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type EventTone = 'critical' | 'sprint' | 'review' | 'audit' | 'prep' | 'sync';

interface CalendarEvent {
  label: string;
  tone: EventTone;
}

const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const eventPillTone: Record<EventTone, string> = {
  critical: 'bg-red-500',
  sprint: 'bg-blue-600',
  review: 'bg-green-500',
  audit: 'bg-yellow-500 text-slate-900',
  prep: 'bg-purple-500',
  sync: 'bg-orange-500',
};

const eventsByDate: Record<number, CalendarEvent[]> = {
  3: [{ label: 'Critical Bug', tone: 'critical' }],
  6: [{ label: 'Sprint Plan', tone: 'sprint' }],
  10: [
    { label: 'Audit', tone: 'audit' },
    { label: 'Review', tone: 'review' },
  ],
  14: [{ label: 'Release Prep', tone: 'prep' }],
  18: [{ label: 'Team Sync', tone: 'sync' }],
  23: [{ label: 'Code Review', tone: 'review' }],
  28: [{ label: 'Sprint Handoff', tone: 'sprint' }],
};

export function CalendarView() {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const reduceMotion = useReducedMotion();

  const sectionAnimation = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, ease: 'easeInOut' as const },
      };

  const gridContainerAnimation = reduceMotion
    ? {}
    : {
        initial: 'hidden',
        animate: 'show',
        variants: {
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.015,
              delayChildren: 0.05,
            },
          },
        },
      };

  const cellAnimation = reduceMotion
    ? {}
    : {
        variants: {
          hidden: { opacity: 0, y: 6 },
          show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeInOut' as const } },
        },
      };

  const cells = Array.from({ length: 35 }, (_, index) => {
    const date = index + 1;
    return date <= 31 ? date : null;
  });

  return (
    <div className="space-y-5">
      <motion.section
        {...sectionAnimation}
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-wrap sm:items-start sm:justify-between lg:flex-row">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-800">Development Calendar</h2>
              <Star size={16} className="text-amber-500" aria-hidden="true" />
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600" aria-label="Active Sprint indicator">
                Active Sprint
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Plan milestones, ship faster, and keep cross-team work visible.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex -space-x-2">
              {['AL', 'MN', 'JD', 'LK'].map((avatar) => (
                <div
                  key={avatar}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-300 text-[10px] font-bold text-white"
                  title={`Team member ${avatar}`}
                  aria-label={`Team member ${avatar}`}
                >
                  {avatar}
                </div>
              ))}
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[10px] font-bold text-slate-600"
                aria-label="6 more team members"
              >
                +6
              </div>
            </div>

            <button
              aria-label="Filter calendar events"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition duration-200 ease-in-out hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <Filter size={14} aria-hidden="true" />
              Filter
            </button>
            <button
              aria-label="Share calendar"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition duration-200 ease-in-out hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              <Share2 size={14} aria-hidden="true" />
              Share
            </button>
          </div>
        </div>
      </motion.section>

      <motion.section
        {...sectionAnimation}
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 0.3,
                delay: 0.08,
                ease: 'easeInOut',
              }
        }
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6"
      >
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <h3 className="text-lg font-bold text-slate-800">October 2023</h3>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white shadow-sm">
              <button
                aria-label="Previous month"
                className="p-2 text-slate-600 transition duration-200 ease-in-out hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-300"
              >
                <ChevronLeft size={16} aria-hidden="true" />
              </button>
              <button
                aria-current="date"
                className="border-x border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition duration-200 ease-in-out hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-300"
              >
                Today
              </button>
              <button
                aria-label="Next month"
                className="p-2 text-slate-600 transition duration-200 ease-in-out hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-300"
              >
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>

            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-sm">
              {(['list', 'week', 'month'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  aria-pressed={viewMode === mode}
                  aria-label={`View as ${mode}`}
                  className={`rounded-md px-3 py-1.5 font-medium transition duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-300 ${
                    viewMode === mode
                      ? 'bg-[#0079BF] text-white'
                      : 'text-slate-600 hover:bg-white'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <p className="mb-2 text-xs text-slate-400 sm:hidden">Swipe horizontally to view the full week grid.</p>
          <div className="min-w-[680px] sm:min-w-[760px]">
            <div className="grid grid-cols-7 border border-slate-200 border-b-0">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="border-r border-slate-200 px-1 sm:px-3 py-2 text-[10px] sm:text-xs font-semibold tracking-wider text-slate-500 last:border-r-0"
                  role="columnheader"
                >
                  {day}
                </div>
              ))}
            </div>

            <motion.div
              {...gridContainerAnimation}
              className="grid grid-cols-7 border-l border-slate-200 border-t border-slate-200"
            >
              {cells.map((date, index) => {
                const isToday = date === 10;
                const events = date ? eventsByDate[date] ?? [] : [];

                return (
                  <motion.div
                    {...cellAnimation}
                    key={`${date ?? 'empty'}-${index}`}
                    role="gridcell"
                    aria-label={
                      date
                        ? `${date} October${events.length > 0 ? `, ${events.length} events` : ''}`
                        : 'Empty'
                    }
                    className={`min-h-[80px] sm:min-h-[118px] border-b border-r border-slate-200 bg-white p-1 sm:p-2 text-xs sm:text-base transition duration-200 ease-in-out hover:bg-slate-50 ${
                      date ? 'cursor-pointer hover:shadow-sm' : ''
                    }`}
                  >
                    {date ? (
                      <>
                        <p
                          className={`mb-1 text-xs font-semibold ${
                            isToday ? 'text-[#0079BF]' : 'text-slate-600'
                          }`}
                        >
                          {date}
                        </p>

                        <div className="space-y-0.5 hidden sm:block">
                          {events.map((event, idx) => (
                            <p
                              key={`${date}-${event.label}-${idx}`}
                              className={`truncate rounded px-2 py-0.5 text-[10px] font-bold text-white ${eventPillTone[event.tone]}`}
                              title={event.label}
                            >
                              {event.label}
                            </p>
                          ))}
                        </div>

                        <div className="sm:hidden">
                          {events.length > 0 && (
                            <div className="mt-1 inline-block rounded-full bg-blue-100 px-1.5 py-0.5 text-[8px] font-bold text-blue-600">
                              {events.length}
                            </div>
                          )}
                        </div>
                      </>
                    ) : null}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </motion.section>

      <button
        className="fixed bottom-6 right-6 z-20 inline-flex items-center justify-center rounded-full bg-blue-600 p-4 text-white shadow-lg transition duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl active:translate-y-0 active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2"
        aria-label="Create new event"
      >
        <Plus size={22} aria-hidden="true" />
      </button>
    </div>
  );
}
