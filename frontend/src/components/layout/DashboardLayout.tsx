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

  // Client-side auth guard
  useEffect(() => {
    if (!user || !token) {
      router.replace('/login');
    }
  }, [user, token, router]);

  // Don't render dashboard content while redirecting
  if (!user || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f9ff]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-[#0079BF]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f7f9ff]">
      <Sidebar
        className="w-64"
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          {...(topbarProps || {})}
          onMobileMenuClick={() => setMobileSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
