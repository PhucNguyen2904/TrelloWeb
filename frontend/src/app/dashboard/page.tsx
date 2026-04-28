'use client';

import React from 'react';
import {
  ListTodo,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
} from 'lucide-react';
import { activities } from '@/lib/mock-data';

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

export default function Dashboard() {
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
        </div>
      </div>
    </div>
  );
}
