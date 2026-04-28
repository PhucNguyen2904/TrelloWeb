'use client';

import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function DashboardPage() {
  return (
    <DashboardLayout
      topbarProps={{
        title: 'Dashboard',
        subtitle: 'Track delivery health and recent execution signals in one place.',
        showCreateButton: true,
      }}
    >
      <DashboardOverview />
    </DashboardLayout>
  );
}
