'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { handleLogoutClean } from '@/lib/logout';
import { useAuthStore } from '@/store/useAuthStore';
import {
  LayoutGrid,
  Calendar,
  HelpCircle,
  LogOut,
  Users,
  Settings,
  BarChart2,
  UserPlus,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getWorkspaces } from '@/lib/api';

interface SidebarProps {
  // Sidebar props placeholder for future extensibility
}

export function Sidebar({}: SidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const role = user?.role?.name;
  
  const { data: workspaces = [], isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
    enabled: !!user,
  });

  const featured = workspaces[0];

  const navItems = [
    { label: 'Boards', href: '/boards', icon: LayoutGrid },
    { label: 'Members', href: '/members', icon: Users },
    { label: 'Workspace Settings', href: '/workspace-settings', icon: Settings },
    { label: 'Analytics', href: '/analytics', icon: BarChart2 },
    { label: 'Calendar', href: '/calendar', icon: Calendar },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col flex-shrink-0 w-[240px] bg-slate-50 border-r border-[#E5E7EB] h-full py-6 px-4 z-10">
      {/* Workspace Header */}
      <div className="mb-6 px-2">
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="w-9 h-9 rounded-lg bg-slate-100 animate-pulse shrink-0" />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-[#1565C0] flex items-center justify-center text-white font-bold text-lg shrink-0">
              {featured?.initials || 'W'}
            </div>
          )}
          <div className="overflow-hidden">
            {isLoading ? (
              <div className="h-4 w-24 bg-slate-100 animate-pulse rounded" />
            ) : (
              <h2 className="font-bold text-[#111827] text-[15px] truncate">
                {featured?.name || 'My Workspace'}
              </h2>
            )}
            <p className="text-[12px] text-[#6B7280]">Premium Workspace</p>
          </div>
        </div>
      </div>

      <div className="h-px bg-[#E5E7EB] mb-6" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <button
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 transition-all rounded-lg text-[14px] ${
                  isActive
                    ? 'bg-white text-[#0079BF] font-semibold border-l-4 border-[#0079BF] shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:translate-x-1'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-[#0079BF]' : 'text-slate-500'} />
                <span>{item.label}</span>
              </button>
            </Link>
          );
        })}
      </nav>

      {/* Invite Button */}
      <div className="mt-4 px-2">
        <button className="w-full py-2.5 bg-[#1565C0] text-white rounded-lg text-sm font-semibold hover:bg-[#1e40af] transition-all flex items-center justify-center gap-2">
          <UserPlus size={16} />
          Invite Members
        </button>
      </div>

      {/* Bottom section */}
      <div className="mt-auto pt-6 space-y-1">
        <div className="h-px bg-[#E5E7EB] mb-4" />
        <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[#374151] hover:bg-[#F9FAFB] rounded-lg text-[14px] transition-all">
          <HelpCircle size={18} />
          <span>Help Center</span>
        </button>

        <button
          onClick={handleLogoutClean}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[#374151] hover:bg-[#F9FAFB] rounded-lg text-[14px] transition-all"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

