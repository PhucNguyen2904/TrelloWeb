'use client';

import { CalendarView } from '@/components/dashboard/CalendarView';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function DashboardPage() {
  return (
    <DashboardLayout
      topbarProps={{
        title: 'Dashboard',
        subtitle: 'Track releases, sprint milestones, and team capacity in one place.',
        showCreateButton: true,
      }}
    >
      <CalendarView />
    </DashboardLayout>
  );
}
