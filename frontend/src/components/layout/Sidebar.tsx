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
    <aside className="hidden lg:flex lg:flex-col flex-shrink-0 w-[230px] bg-white border-r border-slate-200 h-full py-6 px-4 gap-2 shadow-[4px_0_12px_rgba(0,0,0,0.03)] z-10">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <span className="text-white font-extrabold text-lg">P</span>
        </div>
        <span className="font-bold text-slate-800 text-xl tracking-tight">ProjectFlow</span>
      </div>

      {/* Workspace Header */}
      <div className="flex items-center gap-3 px-2 py-3 mb-4 bg-slate-50 rounded-xl border border-slate-100">
        <div
          className="w-10 h-10 rounded-lg bg-blue-500 text-white text-base font-bold flex items-center justify-center flex-shrink-0 shadow-sm"
        >
          E
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate leading-tight">
            Engineering Team
          </p>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider mt-1">
            Premium
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto space-y-1.5">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.05em] px-2 mb-2">Main Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link key={item.href} href={item.href}>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200 font-semibold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            </Link>
          );
        })}

        {/* Admin / Superadmin only section */}
        {isAdminOrSuperAdmin && (
          <div className="pt-4 mt-4 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.05em] px-2 mb-2">Admin</p>
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <Link key={item.href} href={item.href}>
                  <button
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200 font-semibold'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="pt-4 space-y-2">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md">
          <UserPlus size={16} />
          Invite Members
        </button>

        <div className="pt-2">
          <button className="w-full text-left text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-800 rounded-xl px-3 py-2 flex items-center gap-3 transition-all">
            <HelpCircle size={16} className="text-slate-400" />
            Help Center
          </button>

          <button
            onClick={handleLogoutClean}
            type="button"
            className="w-full text-left text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-800 rounded-xl px-3 py-2 flex items-center gap-3 transition-all"
          >
            <LogOut size={16} className="text-slate-400" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

