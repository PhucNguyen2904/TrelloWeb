import type { ReactNode } from 'react';
import { SuperAdminShell } from '@/components/superadmin/SuperAdminShell';

export const metadata = {
  title: 'Admin Panel – ProjectFlow',
  description: 'Super administrator control panel',
};

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return <SuperAdminShell>{children}</SuperAdminShell>;
}
