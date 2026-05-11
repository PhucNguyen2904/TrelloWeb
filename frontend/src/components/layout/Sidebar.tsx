'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { handleLogoutClean } from '@/lib/logout';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Users, 
  BarChart2, 
  Settings, 
  HelpCircle, 
  LogOut,
  LayoutGrid,
  ShieldCheck,
  UserCog
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const role = user?.role?.name;
  
  let navItems = [
    { label: 'Boards', href: '/boards', icon: LayoutGrid },
    { label: 'Members', href: '/members', icon: Users },
    { label: 'Workspace Settings', href: '/workspace-settings', icon: Settings },
    { label: 'Analytics', href: '/analytics', icon: BarChart2 },
  ];

  if (role === 'superadmin') {
    navItems = [
      { label: 'User Management', href: '/superadmin/users', icon: UserCog },
      { label: 'Role Management', href: '/superadmin/roles', icon: ShieldCheck },
      { label: 'System Analytics', href: '/superadmin/analytics', icon: BarChart2 },
      { label: 'Global Settings', href: '/superadmin/settings', icon: Settings },
    ];
  }

  return (
    <aside className="hidden lg:flex lg:flex-col flex-shrink-0 w-[240px] bg-slate-50 border-r border-[#E5E7EB] h-full py-6 px-4 z-10 sticky top-0">
      {/* Logo block */}
      <div className="mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0079BF] flex items-center justify-center text-white font-bold text-xl shadow-sm">
            P
          </div>
          <div>
            <h1 className="font-bold text-[#111827] text-[15px]">ProjectFlow</h1>
            <p className="text-[12px] text-[#6B7280]">Engineering Team</p>
          </div>
        </div>
      </div>

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
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-[#0079BF]' : 'text-slate-500'} />
                <span>{item.label}</span>
              </button>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto pt-6 border-t border-[#E5E7EB] space-y-1">
        <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[#374151] hover:bg-slate-100 rounded-lg text-[14px] transition-all">
          <HelpCircle size={18} className="text-slate-500" />
          <span>Help Center</span>
        </button>
        <button 
          onClick={handleLogoutClean}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[#374151] hover:bg-slate-100 rounded-lg text-[14px] transition-all"
        >
          <LogOut size={18} className="text-slate-500" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

