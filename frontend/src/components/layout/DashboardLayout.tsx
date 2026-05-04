'use client';

import React from 'react';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{
      background: `
        linear-gradient(135deg, #f7f9ff 0%, #e8f4f8 25%, #e0f2f1 50%, #f1f8f7 75%, #f7f9ff 100%),
        radial-gradient(circle at 20% 50%, rgba(100, 200, 200, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(100, 180, 220, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 50% 0%, rgba(150, 210, 220, 0.04) 0%, transparent 60%)
      `,
      backgroundAttachment: 'fixed',
    }}>
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
