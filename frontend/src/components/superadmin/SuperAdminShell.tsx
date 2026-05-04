'use client';

import React from 'react';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { SuperAdminTopbar } from './SuperAdminTopbar';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface SuperAdminShellProps {
  children: React.ReactNode;
}

export function SuperAdminShell({ children }: SuperAdminShellProps) {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  // Client-side guard — redirect non-superadmins away
  useEffect(() => {
    if (user && user.role?.name !== 'superadmin') {
      router.replace('/dashboard');
    }
    // If user is null (not yet hydrated from localStorage), we wait.
  }, [user, router]);

  // Don't render the admin panel shell for non-superadmins
  if (user && user.role?.name !== 'superadmin') return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-surface-app">
      <SuperAdminTopbar />
      <div className="flex flex-1 overflow-hidden">
        <SuperAdminSidebar />
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
