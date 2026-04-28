'use client';

import { ReactNode, useEffect, useState } from 'react';
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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);

  // Client-side auth guard
  useEffect(() => {
    if (!user || !token) {
      router.replace('/login');
    }
  }, [user, token, router]);

  useEffect(() => {
    if (!mobileSidebarOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', onEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onEscape);
    };
  }, [mobileSidebarOpen]);

  // Don't render dashboard content while redirecting
  if (!user || !token) {
    return (
      <div className="editorial-shell flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-secondary)] shadow-[var(--shadow-soft)]">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--border-hover)] border-t-[var(--accent)]" />
          Loading workspace
        </div>
      </div>
    );
  }

  return (
    <div className="editorial-shell relative flex min-h-screen overflow-x-clip">
      <Sidebar
        className={desktopSidebarCollapsed ? 'w-20' : 'w-64'}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        collapsed={desktopSidebarCollapsed}
        onToggleCollapse={() => setDesktopSidebarCollapsed((prev) => !prev)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          {...(topbarProps || {})}
          onMobileMenuClick={() => setMobileSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-5 lg:px-8 lg:py-6">
          <div className="mx-auto w-full max-w-[1440px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
