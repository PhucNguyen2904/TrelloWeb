'use client';

import { Activity, AlertTriangle, CheckCircle2, Layout, ListTodo, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api, getActivities } from '@/lib/api';

interface ActivityItem {
  id: string;
  activity: string;
  owner: string;
  team: string;
  status: string;
  time: string;
}

interface UserStats {
  open_tasks: number;
  in_progress: number;
  completed_today: number;
  overdue: number;
  total_boards: number;
  total_tasks: number;
}

function SkeletonCard() {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
        <div className="h-8 w-8 rounded-lg bg-slate-200 animate-pulse" />
      </div>
      <div className="mt-3 h-8 w-16 rounded bg-slate-200 animate-pulse" />
      <div className="mt-1 h-3 w-28 rounded bg-slate-100 animate-pulse" />
    </article>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {[2, 1, 1, 1, 1].map((span, i) => (
        <td key={i} className="px-4 py-3">
          <div className={`h-4 rounded bg-slate-100 animate-pulse`} style={{ width: `${span * 60}px` }} />
        </td>
      ))}
    </tr>
  );
}

export function DashboardOverview() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/dashboard/stats');
        setStats(res.data);
      } catch {
        setStats({ open_tasks: 0, in_progress: 0, completed_today: 0, overdue: 0, total_boards: 0, total_tasks: 0 });
      } finally {
        setStatsLoading(false);
      }
    };

    const fetchActivities = async () => {
      try {
        const data = await getActivities();
        setActivities(data || []);
      } catch {
        setActivities([]);
      } finally {
        setActivitiesLoading(false);
      }
    };

    fetchStats();
    fetchActivities();
  }, []);

  const summaryCards = [
    {
      label: 'Open Tasks',
      value: stats?.open_tasks ?? 0,
      sub: stats?.total_tasks ? `out of ${stats.total_tasks} total` : 'No tasks yet',
      icon: ListTodo,
      tone: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'In Progress',
      value: stats?.in_progress ?? 0,
      sub: 'Currently active',
      icon: TrendingUp,
      tone: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Overdue',
      value: stats?.overdue ?? 0,
      sub: stats?.overdue ? 'Needs attention' : 'Nothing overdue 🎉',
      icon: AlertTriangle,
      tone: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Completed Today',
      value: stats?.completed_today ?? 0,
      sub: stats?.total_boards ? `across ${stats.total_boards} board${stats.total_boards !== 1 ? 's' : ''}` : 'No boards yet',
      icon: CheckCircle2,
      tone: 'text-violet-600 bg-violet-50',
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Stat cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : summaryCards.map((card) => {
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
                  <p className="mt-1 text-xs font-medium text-slate-500">{card.sub}</p>
                </article>
              );
            })}
      </section>

      {/* Activities table */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-[#0079BF]" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">Recent Activities</h2>
          </div>
          {!activitiesLoading && activities.length > 0 && (
            <span className="text-xs text-slate-400">{activities.length} recent tasks</span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold md:px-6">Activity</th>
                <th className="px-4 py-3 font-semibold">Owner</th>
                <th className="px-4 py-3 font-semibold">Board</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody>
              {activitiesLoading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <Activity className="mx-auto mb-2 w-8 h-8 text-slate-300" />
                    <p className="text-sm text-slate-400">No activities yet</p>
                    <p className="text-xs text-slate-300 mt-1">Create tasks in a board to see them here</p>
                  </td>
                </tr>
              ) : (
                activities.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100 text-slate-700 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium md:px-6 max-w-[200px] truncate">{item.activity}</td>
                    <td className="px-4 py-3">{item.owner}</td>
                    <td className="px-4 py-3 max-w-[120px] truncate">{item.team}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          item.status === 'In Review'
                            ? 'bg-blue-100 text-blue-700'
                            : item.status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{item.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
