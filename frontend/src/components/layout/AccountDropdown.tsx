'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { RoleBadge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/useAuthStore';

function getRoleLabel(roleName?: string) {
  if (!roleName) return 'Guest';
  return roleName.charAt(0).toUpperCase() + roleName.slice(1);
}

export function AccountDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  if (!user) return null;

  const roleName = user.role?.name as 'superadmin' | 'admin' | 'user' | 'guest';
  const roleLabel = getRoleLabel(user.role?.name);
  const avatarText = user.email.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="group flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-slate-100 active:scale-[0.99]"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-700 text-sm font-bold text-white">
          {avatarText}
        </div>
        <div className="hidden min-w-0 text-left lg:block">
          <p className="truncate text-sm font-medium text-slate-900">{user.email}</p>
          <p className="text-xs text-slate-500">{roleLabel}</p>
        </div>
        <ChevronDown
          size={16}
          className={`text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className={`absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white p-2 shadow-lg transition-all duration-200 ${
          open ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
        }`}
        role="menu"
      >
        <div className="mb-2 flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-700 text-sm font-bold text-white">
            {avatarText}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{user.email}</p>
            <p className="text-xs text-slate-500">{roleLabel}</p>
          </div>
        </div>

        <div className="mb-2 px-2">
          <RoleBadge role={roleName} size="sm" />
        </div>

        <div className="my-2 border-t border-slate-200" />

        <Link
          href="/dashboard/profile"
          className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
          onClick={() => setOpen(false)}
        >
          <User size={16} />
          Profile
        </Link>
        <Link
          href="/dashboard/settings"
          className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
          onClick={() => setOpen(false)}
        >
          <Settings size={16} />
          Settings
        </Link>

        <div className="my-2 border-t border-slate-200" />

        <button
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
