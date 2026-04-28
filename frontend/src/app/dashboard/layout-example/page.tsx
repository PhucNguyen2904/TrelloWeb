'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function DashboardLayoutExamplePage() {
  return (
    <DashboardLayout
      topbarProps={{
        title: 'Dashboard Layout Example',
        subtitle: 'Reference page for spacing, hierarchy, and clean SaaS layout.',
      }}
    >
      <div className="space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Overview</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-800">Overview</h1>
          <p className="mt-1 text-sm text-slate-500">
            Page nay dung de verify layout 2 cot: sidebar desktop ben trai, content ben phai, khong overlap.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Boards</p>
            <p className="mt-2 text-2xl font-bold text-slate-800">24</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tasks</p>
            <p className="mt-2 text-2xl font-bold text-slate-800">128</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Members</p>
            <p className="mt-2 text-2xl font-bold text-slate-800">15</p>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <h2 className="text-2xl font-bold text-slate-800">Recent Activity</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-500">
            <li className="rounded-lg bg-gray-50 px-4 py-3">Created board &quot;Product Roadmap&quot;</li>
            <li className="rounded-lg bg-gray-50 px-4 py-3">Moved task &quot;API refactor&quot; to In Progress</li>
            <li className="rounded-lg bg-gray-50 px-4 py-3">Invited 2 new team members</li>
          </ul>
        </section>
      </div>
    </DashboardLayout>
  );
}
