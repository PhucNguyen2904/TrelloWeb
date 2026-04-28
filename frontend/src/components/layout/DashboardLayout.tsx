'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Topbar, type TopbarProps } from './Topbar';
import { useAuthStore } from '@/store/useAuthStore';

interface DashboardLayoutProps {
  children: ReactNode;
  topbarProps?: TopbarProps;
}

export function DashboardLayout({ children, topbarProps }: DashboardLayoutProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  // Client-side auth guard
  useEffect(() => {
    if (!user || !token) {
      router.replace('/login');
    }
  }, [user, token, router]);

  // Don't render dashboard content while redirecting
  if (!user || !token) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--background)',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: '3px solid var(--outline-variant)',
            borderTopColor: 'var(--primary-container)',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />
      <main className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar {...(topbarProps || {})} />
        <div className="w-full flex-1 p-4 md:p-6 lg:p-8 bg-gray-50">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </div>
      </main>
    </div>
  );
}
