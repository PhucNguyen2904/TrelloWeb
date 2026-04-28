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
      <Topbar {...(topbarProps || {})} />

      <main
        className="flex-1 pt-[var(--topbar-height)] md:ml-[var(--sidebar-width)]"
        style={{ minHeight: '100vh' }}
      >
        <div className="px-4 py-6 md:px-6 md:py-6">
          <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
