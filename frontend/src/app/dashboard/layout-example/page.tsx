'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function DashboardLayoutExamplePage() {
  return (
    <DashboardLayout topbarProps={{ title: 'Dashboard Layout Example' }}>
      <div className="space-y-6">
        <section className="rounded-xl border border-[var(--border)] bg-white p-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Overview</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Page nay dung de verify layout 2 cot: sidebar desktop ben trai, content ben phai, khong overlap.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-[var(--border)] bg-white p-5">
            <p className="text-sm text-[var(--text-muted)]">Boards</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">24</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-white p-5">
            <p className="text-sm text-[var(--text-muted)]">Tasks</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">128</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-white p-5">
            <p className="text-sm text-[var(--text-muted)]">Members</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">15</p>
          </div>
        </section>

        <section className="rounded-xl border border-[var(--border)] bg-white p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Recent Activity</h2>
          <ul className="mt-4 space-y-3 text-sm text-[var(--text-secondary)]">
            <li className="rounded-lg bg-gray-50 px-4 py-3">Created board "Product Roadmap"</li>
            <li className="rounded-lg bg-gray-50 px-4 py-3">Moved task "API refactor" to In Progress</li>
            <li className="rounded-lg bg-gray-50 px-4 py-3">Invited 2 new team members</li>
          </ul>
        </section>
      </div>
    </DashboardLayout>
  );
}
