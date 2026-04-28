'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
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
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const firstMenuItemRef = useRef<HTMLAnchorElement | null>(null);
  const { user, logout } = useAuthStore();
  const menuId = 'account-menu';

  const closeMenu = useCallback((focusTrigger = false) => {
    setOpen(false);
    if (focusTrigger) {
      buttonRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener('pointerdown', onClickOutside);
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu(true);
      }
    };

    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('pointerdown', onClickOutside);
      document.removeEventListener('keydown', onEscape);
    };
  }, [closeMenu]);

  useEffect(() => {
    if (!open) return;
    firstMenuItemRef.current?.focus();
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
    if (e.key === 'ArrowDown' && !open) {
      e.preventDefault();
      setOpen(true);
    }
  };

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
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className="group flex items-center gap-2 rounded-lg px-2 py-1.5 transition duration-200 ease-in-out hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-300"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-label="Account menu"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#0079BF] to-[#005f98] text-sm font-bold text-white">
          {avatarText}
        </div>
        <div className="hidden min-w-0 text-left xl:block">
          <p className="max-w-[150px] truncate text-sm font-medium text-slate-800">{user.email}</p>
          <p className="text-xs text-slate-500">{roleLabel}</p>
        </div>
        <ChevronDown
          size={16}
          className={`text-slate-500 transition duration-200 ease-in-out ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      <div
        id={menuId}
        className={`absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white p-2 shadow-lg transition duration-200 ease-in-out ${
          open ? 'scale-100 opacity-100' : 'pointer-events-none invisible scale-95 opacity-0'
        }`}
        role="menu"
        aria-hidden={!open}
      >
        <div className="mb-1 flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#0079BF] to-[#005f98] text-sm font-bold text-white">
            {avatarText}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">{user.email}</p>
            <p className="text-xs text-slate-500">{roleLabel}</p>
          </div>
        </div>

        <div className="mb-2 px-2 pb-1">
          <RoleBadge role={roleName} size="sm" />
        </div>

        <div className="my-2 border-t border-slate-200" />

        <Link
          ref={firstMenuItemRef}
          href="/dashboard/profile"
          className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-700 transition duration-200 ease-in-out hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-300"
          onClick={() => closeMenu()}
          role="menuitem"
          tabIndex={open ? 0 : -1}
        >
          <User size={16} />
          Profile
        </Link>
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-700 transition duration-200 ease-in-out hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-300"
          onClick={() => closeMenu()}
          role="menuitem"
          tabIndex={open ? 0 : -1}
        >
          <Settings size={16} />
          Settings
        </Link>

        <div className="my-2 border-t border-slate-200" />

        <button
          onClick={handleLogout}
          type="button"
          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-rose-600 transition duration-200 ease-in-out hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-rose-300"
          role="menuitem"
          tabIndex={open ? 0 : -1}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
