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
  Settings,
  BarChart3,
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

  const items = [
    { label: 'Members', href: '/dashboard/members', icon: Users },
    { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { label: 'Workspace Settings', href: '/dashboard/workspace-settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col flex-shrink-0 w-[196px] bg-white border-r border-[#E5E7EB] h-full py-6 px-4 z-10">
      {/* Logo & Workspace */}
      <div className="mb-6 px-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-[6px] bg-[#1565C0] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="font-bold text-[#111827] text-sm truncate">ProjectFlow</span>
        </div>
        <p className="text-[11px] text-[#6B7280] font-medium ml-11">Engineering Team</p>
      </div>

      <div className="h-px bg-[#E5E7EB] mb-6" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <button
                className={`w-full flex items-center gap-2.5 px-3 py-2 transition-all rounded-[6px] text-[13px] ${
                  isActive
                    ? 'bg-[#EFF6FF] text-[#1565C0] font-semibold'
                    : 'text-[#374151] hover:bg-[#F9FAFB]'
                }`}
              >
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-[#1565C0]' : 'text-[#374151]'}`} />
                <span>{item.label}</span>
              </button>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto pt-6 space-y-1">
        <div className="h-px bg-[#E5E7EB] mb-4" />
        <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[#374151] hover:bg-[#F9FAFB] rounded-[6px] text-[13px] transition-all">
          <HelpCircle size={18} className="text-[#374151]" />
          <span>Help Center</span>
        </button>

        <button
          onClick={handleLogoutClean}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-[#374151] hover:bg-[#F9FAFB] rounded-[6px] text-[13px] transition-all"
        >
          <LogOut size={18} className="text-[#374151]" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}


