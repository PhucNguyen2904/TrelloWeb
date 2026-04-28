'use client';

import { CalendarView } from '@/components/dashboard/CalendarView';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function CalendarPage() {
  return (
    <DashboardLayout
      topbarProps={{
        title: 'Calendar',
        subtitle: 'Plan sprint milestones, releases, and delivery checkpoints.',
        showCreateButton: true,
      }}
    >
      <CalendarView />
    </DashboardLayout>
  );
}
