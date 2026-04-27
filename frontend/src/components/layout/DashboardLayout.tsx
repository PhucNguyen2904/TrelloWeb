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
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <Sidebar />
      <Topbar {...(topbarProps || {})} />

      {/* Main Content — offset by sidebar width on desktop */}
      <main
        style={{
          marginTop: 'var(--topbar-height)',
          minHeight: 'calc(100vh - var(--topbar-height))',
          background: 'var(--background)',
          width: '100%',
        }}
      >
        <div className="content-offset dashboard-content-shell">
          <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', minWidth: 0 }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
