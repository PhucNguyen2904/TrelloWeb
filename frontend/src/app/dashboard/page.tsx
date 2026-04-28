'use client';

import {
  Bell,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Plus,
  Search,
  Settings,
  Star,
  Users,
} from 'lucide-react';

const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const eventColors = {
  critical: 'bg-red-500',
  sprint: 'bg-blue-600',
  ui: 'bg-sky-500',
  audit: 'bg-yellow-500',
  prep: 'bg-violet-500',
  sync: 'bg-orange-500',
  review: 'bg-green-500',
  demo: 'bg-rose-400',
} as const;

const eventsByDate: Record<number, Array<{ label: string; color: keyof typeof eventColors }>> = {
  3: [{ label: 'Critical Bug Fix', color: 'critical' }],
  6: [{ label: 'Sprint Planning', color: 'sprint' }],
  10: [
    { label: 'UI Polish', color: 'ui' },
    { label: 'Audit Review', color: 'audit' },
  ],
  14: [{ label: 'Release Prep', color: 'prep' }],
  18: [{ label: 'Team Sync', color: 'sync' }],
  23: [{ label: 'Code Review', color: 'review' }],
  28: [{ label: 'Feature Demo', color: 'demo' }],
};

export default function DashboardPage() {
  const cells = Array.from({ length: 35 }, (_, index) => {
    const date = index + 1;
    return date <= 31 ? date : null;
  });

  return (
    <div className="min-h-screen bg-[#f7f9ff] font-['Inter'] text-slate-700">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[#0079BF]">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-[#0079BF] text-sm font-bold text-white">
                PF
              </div>
              <span className="text-base font-bold">ProjectFlow</span>
            </div>
            <nav className="hidden items-center gap-2 md:flex">
              {['Workspaces', 'Recent', 'Starred'].map((item) => (
                <button
                  key={item}
                  className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  {item}
                  <ChevronDown size={14} />
                </button>
              ))}
            </nav>
          </div>

          <div className="hidden max-w-md flex-1 lg:flex">
            <label className="flex w-full items-center gap-2 rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500 focus-within:border-slate-300 focus-within:bg-white">
              <Search size={16} />
              <input
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                placeholder="Search projects, tasks, members..."
              />
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-md bg-[#0079BF] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0068a5]">
              Create
            </button>
            <button className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800">
              <Bell size={18} />
            </button>
            <button className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800">
              <HelpCircle size={18} />
            </button>
            <button className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800">
              <Settings size={18} />
            </button>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-sky-500 to-blue-700 text-sm font-bold text-white">
              N
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">
        <aside className="hidden w-64 flex-col border-r border-slate-200 bg-[#f7f9ff] p-4 lg:flex">
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="mb-2 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#0079BF] text-sm font-bold text-white">
                ET
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Engineering Team</p>
                <p className="text-xs text-slate-500">Premium Workspace</p>
              </div>
            </div>
          </div>

          <nav className="mt-4 space-y-1">
            {[
              { label: 'Boards', icon: Calendar },
              { label: 'Members', icon: Users },
              { label: 'Workspace Settings', icon: Settings },
              { label: 'Analytics', icon: Star },
              { label: 'Calendar', icon: Calendar, active: true },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-all ${
                    item.active
                      ? 'bg-blue-50 font-semibold text-blue-700 shadow-[inset_3px_0_0_0_#0079BF]'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <button className="mt-4 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100">
            Invite Members
          </button>

          <div className="mt-auto space-y-1 border-t border-slate-200 pt-4">
            <button className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
              Help Center
            </button>
            <button className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-800">Development Board</h1>
                <Star size={18} className="text-amber-400" />
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  Public
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Plan sprints, sync tasks, and track releases in one calendar.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['A', 'M', 'J', 'L'].map((avatar) => (
                  <div
                    key={avatar}
                    className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-slate-300 text-xs font-bold text-white"
                  >
                    {avatar}
                  </div>
                ))}
                <div className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-slate-200 text-xs font-semibold text-slate-600">
                  +5
                </div>
              </div>
              <button className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100">
                Filters
              </button>
              <button className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100">
                Share
              </button>
            </div>
          </div>

          <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4">
              <h2 className="text-lg font-bold text-slate-800">October 2023</h2>
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center rounded-md border border-slate-300">
                  <button className="rounded-l-md p-2 text-slate-600 transition-colors hover:bg-slate-100">
                    <ChevronLeft size={16} />
                  </button>
                  <button className="border-x border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100">
                    Today
                  </button>
                  <button className="rounded-r-md p-2 text-slate-600 transition-colors hover:bg-slate-100">
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="inline-flex rounded-md border border-slate-300 bg-slate-50 p-0.5 text-sm">
                  <button className="rounded px-2.5 py-1 text-slate-600 hover:bg-white">List</button>
                  <button className="rounded px-2.5 py-1 text-slate-600 hover:bg-white">Week</button>
                  <button className="rounded bg-[#0079BF] px-2.5 py-1 font-semibold text-white">Month</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-7 border-b border-slate-200">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="border-r border-slate-200 px-3 py-2 text-xs font-semibold tracking-wider text-slate-500 last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {cells.map((date, index) => {
                const isToday = date === 10;
                const events = date ? eventsByDate[date] ?? [] : [];

                return (
                  <div
                    key={`${date ?? 'empty'}-${index}`}
                    className="min-h-[120px] border-r border-b border-slate-200 bg-white p-2 transition-colors hover:bg-slate-50"
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
                        <div className="space-y-1">
                          {events.map((event) => (
                            <p
                              key={event.label}
                              className={`mb-1 truncate rounded px-2 py-0.5 text-[10px] font-bold text-white ${eventColors[event.color]}`}
                            >
                              {event.label}
                            </p>
                          ))}
                        </div>
                      </>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>

          <button className="fixed bottom-6 right-6 grid h-14 w-14 place-items-center rounded-full bg-[#0079BF] text-white shadow-lg transition-colors hover:bg-[#0068a5]">
            <Plus size={24} />
          </button>
        </main>
      </div>
    </div>
  );
}
