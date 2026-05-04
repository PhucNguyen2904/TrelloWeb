'use client';

import React from 'react';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f7f9ff] flex flex-col">
      <Topbar
        onMobileMenuClick={() => {
          // TODO: Handle mobile menu for future mobile sidebar implementation
          console.log('Mobile menu clicked');
        }}
        onCreateClick={() => {
          // TODO: Open create modal
          console.log('Create clicked');
        }}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
