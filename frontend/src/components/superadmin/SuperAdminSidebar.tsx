'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Shield, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { handleLogoutClean } from '@/lib/logout';

const navItems = [
  { label: 'Users', href: '/superadmin/users', icon: Users },
  { label: 'Roles', href: '/superadmin/roles', icon: Shield },
];

export function SuperAdminSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  const avatarText = user?.email?.charAt(0).toUpperCase() ?? 'S';

  return (
    <aside className="hidden lg:flex lg:flex-col flex-shrink-0 w-[240px] bg-surface-card border-r border-border h-full">
      {/* Brand / Logo block */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 px-1">
          {/* Logo mark */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}
          >
            PF
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-text-heading truncate">ProjectFlow</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted truncate">
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <p className="text-xs tracking-widest font-semibold text-text-muted px-3 mb-3 uppercase">
          Management
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link key={item.href} href={item.href}>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg h-9 text-sm font-medium transition-colors relative ${
                  isActive
                    ? 'bg-brand-light text-brand'
                    : 'text-text-body hover:bg-surface-muted'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand rounded-r" />
                )}
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-brand' : ''}`}
                />
                <span>{item.label}</span>
              </button>
            </Link>
          );
        })}
      </nav>

      {/* Bottom – admin info + logout */}
      <div className="border-t border-border p-3 space-y-2">
        {/* Admin email chip */}
        <div className="flex items-center gap-3 rounded-lg bg-surface-muted px-3 py-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}
          >
            {avatarText}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-text-heading truncate">
              {user?.email ?? 'Super Admin'}
            </p>
            <p className="text-[10px] text-text-muted">Super Admin</p>
          </div>
        </div>

        <button
          onClick={handleLogoutClean}
          type="button"
          className="w-full text-left text-sm text-red-600 hover:bg-red-50 rounded-lg px-3 py-2 flex items-center gap-3 h-9 transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}
