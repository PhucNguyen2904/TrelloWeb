import type { ReactNode } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export const metadata = {
  title: 'Admin Panel – ProjectFlow',
  description: 'Super administrator control panel',
};

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
