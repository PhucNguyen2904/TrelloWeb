'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Layout, CheckSquare, Shield, Activity, TrendingUp, UserCheck } from 'lucide-react';
import { api } from '@/lib/api';
import Link from 'next/link';

interface Stats {
  total_users: number;
  active_users: number;
  total_boards: number;
  total_tasks: number;
  total_roles: number;
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  href,
  sub,
}: {
  label: string;
  value?: number;
  icon: React.ElementType;
  color: string;
  href?: string;
  sub?: string;
}) {
  const inner = (
    <div
      className={`group relative flex flex-col gap-4 rounded-2xl border border-border bg-surface-card p-5 shadow-card transition-all hover:shadow-md hover:border-brand/30 ${href ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ background: color + '20' }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        {href && (
          <span className="text-xs font-medium text-brand opacity-0 group-hover:opacity-100 transition-opacity">
            View →
          </span>
        )}
      </div>
      <div>
        {value === undefined ? (
          <div className="h-8 w-20 animate-pulse rounded-lg bg-surface-muted" />
        ) : (
          <p className="text-3xl font-bold text-text-heading tabular-nums">{value.toLocaleString()}</p>
        )}
        <p className="mt-1 text-sm font-medium text-text-muted">{label}</p>
        {sub && <p className="mt-0.5 text-xs text-text-muted/70">{sub}</p>}
      </div>
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default function SuperAdminDashboardPage() {
  const { data: stats } = useQuery<Stats>({
    queryKey: ['sa-stats'],
    queryFn: async () => {
      const res = await api.get('/api/super-admin/stats');
      return res.data;
    },
    refetchInterval: 30_000,
  });

  const activePercent =
    stats && stats.total_users > 0
      ? Math.round((stats.active_users / stats.total_users) * 100)
      : 0;

  return (
    <div className="flex-1 bg-[#F0F2F5] min-h-full">
      <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-8 animate-fade-in">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-text-heading">Platform Overview</h1>
          <p className="mt-1 text-sm text-text-muted">
            Real-time statistics across the entire ProjectFlow platform.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Users"
            value={stats?.total_users}
            icon={Users}
            color="#6366f1"
            href="/superadmin/users"
          />
          <StatCard
            label="Active Users"
            value={stats?.active_users}
            icon={UserCheck}
            color="#22c55e"
            sub={stats ? `${activePercent}% of all users` : undefined}
          />
          <StatCard
            label="Total Boards"
            value={stats?.total_boards}
            icon={Layout}
            color="#0079bf"
          />
          <StatCard
            label="Total Tasks"
            value={stats?.total_tasks}
            icon={CheckSquare}
            color="#f59e0b"
          />
        </div>

        {/* Secondary row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label="Roles Defined"
            value={stats?.total_roles}
            icon={Shield}
            color="#8b5cf6"
            href="/superadmin/roles"
          />

          {/* Active ratio card */}
          <div className="col-span-1 sm:col-span-1 xl:col-span-2 rounded-2xl border border-border bg-surface-card p-5 shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light">
                <Activity size={20} className="text-brand" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-heading">User Activity Rate</p>
                <p className="text-xs text-text-muted">Active vs total registered users</p>
              </div>
            </div>

            <div className="flex items-end justify-between mb-2">
              <span className="text-xs font-medium text-text-muted">
                {stats?.active_users ?? '—'} active / {stats?.total_users ?? '—'} total
              </span>
              <span className="text-sm font-bold text-brand">{activePercent}%</span>
            </div>

            <div className="h-3 w-full rounded-full bg-surface-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${activePercent}%`,
                  background: 'linear-gradient(90deg, #6366f1, #818cf8)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
            Quick Actions
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                label: 'Manage Users',
                desc: 'View, edit roles, and delete accounts',
                href: '/superadmin/users',
                icon: Users,
                color: '#6366f1',
              },
              {
                label: 'Manage Roles',
                desc: 'Create and edit permission roles',
                href: '/superadmin/roles',
                icon: Shield,
                color: '#8b5cf6',
              },
              {
                label: 'Invite New User',
                desc: 'Create an account and assign a role',
                href: '/superadmin/users',
                icon: TrendingUp,
                color: '#22c55e',
              },
            ].map((action) => (
              <Link
                key={action.href + action.label}
                href={action.href}
                className="group flex items-start gap-3 rounded-xl border border-border bg-surface-card p-4 shadow-card hover:border-brand/30 hover:shadow-md transition-all"
              >
                <div
                  className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                  style={{ background: action.color + '18' }}
                >
                  <action.icon size={16} style={{ color: action.color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-heading group-hover:text-brand transition-colors">
                    {action.label}
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
