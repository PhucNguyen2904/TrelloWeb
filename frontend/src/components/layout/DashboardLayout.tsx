'use client';

import React, { useState } from 'react';
import { TopBar } from './Topbar';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-surface-app">
      <TopBar
        onMobileMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onCreateClick={() => {
          // TODO: Open create modal
          console.log('Create clicked');
        }}
      />

      <div className="flex flex-1 overflow-hidden pt-topbar">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 overflow-y-auto px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
