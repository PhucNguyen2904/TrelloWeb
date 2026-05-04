'use client';

import React, { useEffect, useState } from 'react';
import {
  ListTodo,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
  Layout,
} from 'lucide-react';
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

function StatCard({
  label,
  value,
  icon,
  loading,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  loading: boolean;
  accent?: string;
}) {
  return (
    <div className="bg-surface-card border border-border rounded-xl p-5 shadow-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-text-body">{label}</p>
          {loading ? (
            <div className="mt-2 h-9 w-16 rounded-md bg-surface-muted animate-pulse" />
          ) : (
            <p className={`text-3xl font-bold mt-2 ${accent ?? 'text-text-heading'}`}>
              {value}
            </p>
          )}
        </div>
        <div className="text-text-muted mt-0.5">{icon}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    // Fetch stats
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const res = await api.get('/api/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setStats({ open_tasks: 0, in_progress: 0, completed_today: 0, overdue: 0, total_boards: 0, total_tasks: 0 });
      } finally {
        setStatsLoading(false);
      }
    };

    // Fetch activities
    const fetchActivities = async () => {
      try {
        setActivitiesLoading(true);
        const data = await getActivities();
        setActivities(data || []);
      } catch (err) {
        console.error('Failed to fetch activities:', err);
        setActivities([]);
      } finally {
        setActivitiesLoading(false);
      }
    };

    fetchStats();
    fetchActivities();
  }, []);

  const statCardDefs = [
    {
      label: 'Open Tasks',
      icon: <ListTodo className="w-4 h-4 text-text-muted" />,
      value: stats?.open_tasks ?? 0,
    },
    {
      label: 'In Progress',
      icon: <TrendingUp className="w-4 h-4 text-blue-500" />,
      value: stats?.in_progress ?? 0,
      accent: 'text-blue-600',
    },
    {
      label: 'Overdue',
      icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
      value: stats?.overdue ?? 0,
      accent: stats?.overdue ? 'text-amber-600' : 'text-text-heading',
    },
    {
      label: 'Completed Today',
      icon: <CheckCircle className="w-4 h-4 text-green-600" />,
      value: stats?.completed_today ?? 0,
      accent: 'text-green-600',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-heading">Dashboard</h1>
        <p className="text-sm text-text-body mt-1">
          Track delivery health and recent activity
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCardDefs.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            loading={statsLoading}
            accent={stat.accent}
          />
        ))}
      </div>

      {/* Secondary stats row */}
      {!statsLoading && stats && (stats.total_boards > 0 || stats.total_tasks > 0) && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-card border border-border rounded-xl p-4 shadow-card flex items-center gap-3">
            <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-brand-light">
              <Layout size={16} className="text-brand" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-heading">{stats.total_boards}</p>
              <p className="text-xs text-text-muted">Your Boards</p>
            </div>
          </div>
          <div className="bg-surface-card border border-border rounded-xl p-4 shadow-card flex items-center gap-3">
            <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-brand-light">
              <ListTodo size={16} className="text-brand" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-heading">{stats.total_tasks}</p>
              <p className="text-xs text-text-muted">Total Tasks</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activities */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-text-muted" />
          <h2 className="text-xs tracking-widest font-medium text-text-muted uppercase">
            Recent Activities
          </h2>
        </div>

        <div className="bg-surface-card border border-border rounded-xl overflow-hidden shadow-card">
          {/* Loading State */}
          {activitiesLoading && (
            <div className="divide-y divide-border">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="grid grid-cols-5 gap-4 px-6 py-4">
                  <div className="h-4 rounded bg-surface-muted animate-pulse col-span-2" />
                  <div className="h-4 rounded bg-surface-muted animate-pulse" />
                  <div className="h-4 rounded bg-surface-muted animate-pulse" />
                  <div className="h-4 rounded bg-surface-muted animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!activitiesLoading && activities.length === 0 && (
            <div className="px-6 py-12 flex flex-col items-center gap-3 text-center">
              <Activity className="w-8 h-8 text-text-muted opacity-40" />
              <p className="text-text-muted text-sm">No recent activities yet</p>
              <p className="text-text-muted text-xs">
                Create a board and add tasks to see activity here.
              </p>
            </div>
          )}

          {/* Table */}
          {!activitiesLoading && activities.length > 0 && (
            <>
              {/* Table Header */}
              <div className="bg-surface-app border-b border-border px-6 py-4 grid grid-cols-5 gap-4">
                <p className="text-xs uppercase font-medium text-text-muted tracking-wide">Activity</p>
                <p className="text-xs uppercase font-medium text-text-muted tracking-wide">Owner</p>
                <p className="text-xs uppercase font-medium text-text-muted tracking-wide">Board</p>
                <p className="text-xs uppercase font-medium text-text-muted tracking-wide">Status</p>
                <p className="text-xs uppercase font-medium text-text-muted tracking-wide">Time</p>
              </div>

              {/* Table Body */}
              <div>
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-border hover:bg-surface-muted transition-colors"
                  >
                    <p className="text-sm text-text-heading truncate">{activity.activity}</p>
                    <p className="text-sm text-text-body">{activity.owner}</p>
                    <p className="text-sm text-text-body truncate">{activity.team}</p>
                    <div>
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                          activity.status === 'In Review'
                            ? 'bg-brand-light text-brand'
                            : activity.status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-surface-muted text-text-body'
                        }`}
                      >
                        {activity.status}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted">{activity.time}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
