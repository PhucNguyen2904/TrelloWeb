'use client';

import { Activity, AlertTriangle, CheckCircle2, ListTodo, TrendingUp } from 'lucide-react';

const summaryCards = [
  {
    label: 'Open Tasks',
    value: '142',
    trend: '+12 this week',
    icon: ListTodo,
    tone: 'text-blue-600 bg-blue-50',
  },
  {
    label: 'Sprint Progress',
    value: '68%',
    trend: '+9% vs last sprint',
    icon: TrendingUp,
    tone: 'text-emerald-600 bg-emerald-50',
  },
  {
    label: 'Overdue Tasks',
    value: '7',
    trend: '-3 vs yesterday',
    icon: AlertTriangle,
    tone: 'text-amber-600 bg-amber-50',
  },
  {
    label: 'Completed Today',
    value: '24',
    trend: 'Strong delivery pace',
    icon: CheckCircle2,
    tone: 'text-violet-600 bg-violet-50',
  },
];

const recentActivities = [
  {
    id: 1,
    action: 'Moved "Payment retries" to In Review',
    actor: 'An Nguyen',
    team: 'Backend',
    time: '8 minutes ago',
    status: 'In Review',
  },
  {
    id: 2,
    action: 'Closed incident PF-241',
    actor: 'Minh Tran',
    team: 'Platform',
    time: '26 minutes ago',
    status: 'Completed',
  },
  {
    id: 3,
    action: 'Created task "Refactor release notes parser"',
    actor: 'Linh Pham',
    team: 'Frontend',
    time: '1 hour ago',
    status: 'Backlog',
  },
  {
    id: 4,
    action: 'Updated sprint goal confidence',
    actor: 'ProjectFlow Bot',
    team: 'Automation',
    time: '2 hours ago',
    status: 'Updated',
  },
];

export function DashboardOverview() {
  return (
    <div className="space-y-6 md:space-y-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <div className={`rounded-lg p-2 ${card.tone}`}>
                  <Icon size={16} />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-800">{card.value}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">{card.trend}</p>
            </article>
          );
        })}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-[#0079BF]" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">Recent Activities</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold md:px-6">Activity</th>
                <th className="px-4 py-3 font-semibold">Owner</th>
                <th className="px-4 py-3 font-semibold">Team</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 text-slate-700">
                  <td className="px-4 py-3 font-medium md:px-6">{item.action}</td>
                  <td className="px-4 py-3">{item.actor}</td>
                  <td className="px-4 py-3">{item.team}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
