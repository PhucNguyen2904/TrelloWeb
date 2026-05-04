'use client';

import React, { useEffect, useState } from 'react';
import {
  ListTodo,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
} from 'lucide-react';
import { getActivities } from '@/lib/api';

interface ActivityItem {
  id: string;
  activity: string;
  owner: string;
  team: string;
  status: string;
  time: string;
}

const statCardDefs = [
  {
    label: 'Open Tasks',
    icon: <ListTodo className="w-4 h-4 text-text-muted" />,
    key: 'openTasks' as const,
  },
  {
    label: 'Sprint Progress',
    icon: <TrendingUp className="w-4 h-4 text-green-500" />,
    key: 'sprintProgress' as const,
  },
  {
    label: 'Overdue Tasks',
    icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    key: 'overdueTasks' as const,
  },
  {
    label: 'Completed Today',
    icon: <CheckCircle className="w-4 h-4 text-green-600" />,
    key: 'completedToday' as const,
  },
];

export default function Dashboard() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  // Stat data — always 0, no hardcoded numbers
  const statsLoading = false; // swap to true while fetching stats if you add that API
  const statsData = {
    openTasks: 0,
    sprintProgress: 0,
    overdueTasks: 0,
    completedToday: 0,
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setActivitiesLoading(true);
        const data = await getActivities();
        setActivities(data || []);
      } catch (err) {
        // Silently fail — show empty state, never show error to user
        console.error('Failed to fetch activities:', err);
        setActivities([]);
      } finally {
        setActivitiesLoading(false);
      }
    };

    fetchActivities();
  }, []);

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
        {statCardDefs.map((stat) => {
          const value = statsData[stat.key] ?? 0;
          return (
            <div
              key={stat.label}
              className="bg-surface-card border border-border rounded-xl p-5 shadow-card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-text-body">{stat.label}</p>
                  {statsLoading ? (
                    /* Skeleton pulse on the number only */
                    <div className="mt-2 h-9 w-16 rounded-md bg-surface-muted animate-pulse" />
                  ) : (
                    <p className="text-3xl font-bold text-text-heading mt-2">
                      {value}
                    </p>
                  )}
                  {/* No subtitle/delta — no real data to back it up */}
                </div>
                <div className="text-text-muted">{stat.icon}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-text-muted" />
          <h2 className="text-xs tracking-widest font-medium text-text-muted uppercase">
            Recent Activities
          </h2>
        </div>

        <div className="bg-surface-card border border-border rounded-xl overflow-hidden shadow-card">
          {/* Loading State — skeleton rows */}
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

          {/* Empty State — no error message, just a clean placeholder */}
          {!activitiesLoading && activities.length === 0 && (
            <div className="px-6 py-12 flex flex-col items-center gap-3 text-center">
              <Activity className="w-8 h-8 text-text-muted opacity-40" />
              <p className="text-text-muted text-sm">No recent activities yet</p>
            </div>
          )}

          {/* Table — only rendered when there is real data */}
          {!activitiesLoading && activities.length > 0 && (
            <>
              {/* Table Header */}
              <div className="bg-surface-app border-b border-border px-6 py-4 grid grid-cols-5 gap-4">
                <p className="text-xs uppercase font-medium text-text-muted tracking-wide">
                  Activity
                </p>
                <p className="text-xs uppercase font-medium text-text-muted tracking-wide">
                  Owner
                </p>
                <p className="text-xs uppercase font-medium text-text-muted tracking-wide">
                  Team
                </p>
                <p className="text-xs uppercase font-medium text-text-muted tracking-wide">
                  Status
                </p>
                <p className="text-xs uppercase font-medium text-text-muted tracking-wide">
                  Time
                </p>
              </div>

              {/* Table Body */}
              <div>
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-border hover:bg-surface-muted transition-colors"
                  >
                    <p className="text-sm text-text-heading">{activity.activity}</p>
                    <p className="text-sm text-text-body">{activity.owner}</p>
                    <p className="text-sm text-text-body">{activity.team}</p>
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
