'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { handleLogoutClean } from '@/lib/logout';
import { useAuthStore } from '@/store/useAuthStore';
import {
  LayoutDashboard,
  Kanban,
  Calendar,
  HelpCircle,
  LogOut,
  Users,
  UserPlus,
} from 'lucide-react';

interface SidebarProps {
  // Sidebar props placeholder for future extensibility
}

const navItems = [
  { label: 'Boards', href: '/dashboard/boards', icon: Kanban },
  { label: 'Members', href: '/dashboard/members', icon: Users },
  { label: 'Workspace Settings', href: '/dashboard/workspace-settings', icon: LayoutDashboard },
  { label: 'Analytics', href: '/dashboard/analytics', icon: LayoutDashboard },
  { label: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
];

const adminNavItems = [
  { label: 'User Management', href: '/dashboard/users', icon: Users },
];

export function Sidebar({}: SidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const role = user?.role?.name;
  const isAdminOrSuperAdmin = role === 'admin' || role === 'superadmin';

  return (
    <aside className="hidden lg:flex lg:flex-col flex-shrink-0 w-60 bg-[#f7f9ff] border-r border-[#e2e8f0] h-full py-4 px-3 gap-1">
      {/* Workspace Header */}
      <div className="flex items-center gap-3 px-3 py-2 mb-2">
        <div
          className="w-8 h-8 rounded-md bg-[#0079BF] text-white text-xs font-bold flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#0079BF' }}
        >
          ET
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">
            Engineering Team
          </p>
          <p className="text-[10px] uppercase text-slate-400 truncate">
            Premium Workspace
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link key={item.href} href={item.href}>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors relative ${
                  isActive
                    ? 'bg-blue-50 text-[#0079BF] border-l-4 border-[#0079BF] font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            </Link>
          );
        })}

        {/* Admin / Superadmin only section */}
        {isAdminOrSuperAdmin && (
          <>
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <Link key={item.href} href={item.href}>
                  <button
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors relative ${
                      isActive
                        ? 'bg-blue-50 text-[#0079BF] border-l-4 border-[#0079BF] font-semibold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#e2e8f0] pt-3 space-y-2">
        <button className="w-full border border-slate-300 hover:bg-slate-100 text-slate-700 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors">
          <UserPlus size={16} />
          Invite Members
        </button>

        <button className="w-full text-left text-sm text-slate-500 hover:bg-slate-100 rounded-lg px-3 py-2 flex items-center gap-3 transition-colors">
          <HelpCircle size={16} className="flex-shrink-0" />
          Help Center
        </button>

        <button
          onClick={handleLogoutClean}
          type="button"
          className="w-full text-left text-sm text-slate-500 hover:bg-slate-100 rounded-lg px-3 py-2 flex items-center gap-3 transition-colors"
        >
          <LogOut size={16} className="flex-shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}
