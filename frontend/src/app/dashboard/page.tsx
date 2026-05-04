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

interface StatCard {
  label: string;
  value: string;
  delta: string;
  deltaType: 'positive' | 'negative';
  icon: React.ReactNode;
}

const statCards: StatCard[] = [
  {
    label: 'Open Tasks',
    value: '142',
    delta: '+12 this week',
    deltaType: 'positive',
    icon: <ListTodo className="w-4 h-4 text-text-muted" />,
  },
  {
    label: 'Sprint Progress',
    value: '68%',
    delta: '+9% vs last sprint',
    deltaType: 'positive',
    icon: <TrendingUp className="w-4 h-4 text-green-500" />,
  },
  {
    label: 'Overdue Tasks',
    value: '7',
    delta: '-3 vs yesterday',
    deltaType: 'negative',
    icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
  },
  {
    label: 'Completed Today',
    value: '24',
    delta: 'Strong delivery pace',
    deltaType: 'positive',
    icon: <CheckCircle className="w-4 h-4 text-green-600" />,
  },
];

interface ActivityItem {
  id: string;
  activity: string;
  owner: string;
  team: string;
  status: string;
  time: string;
}

export default function Dashboard() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getActivities();
        setActivities(data || []);
      } catch (err) {
        console.error('Failed to fetch activities:', err);
        setError('Failed to load activities. Please try again later.');
        setActivities([]);
      } finally {
        setLoading(false);
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
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface-card border border-border rounded-xl p-5 shadow-card hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-text-body">{stat.label}</p>
                <p className="text-3xl font-bold text-text-heading mt-2">
                  {stat.value}
                </p>
                <p
                  className={`text-xs mt-2 ${
                    stat.deltaType === 'positive'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {stat.delta}
                </p>
              </div>
              <div className="text-text-muted">{stat.icon}</div>
            </div>
          </div>
        ))}
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
          {/* Loading State */}
          {loading && (
            <div className="px-6 py-8 text-center">
              <div className="inline-block">
                <div className="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full"></div>
              </div>
              <p className="text-text-muted text-sm mt-2">Loading activities...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="px-6 py-8 text-center">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && activities.length === 0 && (
            <div className="px-6 py-8 text-center">
              <p className="text-text-muted text-sm">No activities found</p>
            </div>
          )}

          {/* Table */}
          {!loading && !error && activities.length > 0 && (
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
