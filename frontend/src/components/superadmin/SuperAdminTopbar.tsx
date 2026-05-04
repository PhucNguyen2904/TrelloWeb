'use client';

import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { handleLogoutClean } from '@/lib/logout';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, User } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/superadmin': 'Platform Overview',
  '/users': 'User Management',
  '/roles': 'Role Management',
};

function getTitle(pathname: string): string {
  for (const [prefix, title] of Object.entries(PAGE_TITLES)) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) return title;
  }
  return 'Admin Panel';
}

export function SuperAdminTopbar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const title = getTitle(pathname);
  const avatarText = user?.email?.charAt(0).toUpperCase() ?? 'S';

  const closeMenu = useCallback((focusTrigger = false) => {
    setOpen(false);
    if (focusTrigger) buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu(true);
    };
    document.addEventListener('pointerdown', onClickOutside);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('pointerdown', onClickOutside);
      document.removeEventListener('keydown', onEscape);
    };
  }, [closeMenu]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface-card/90 backdrop-blur-xl">
      <div className="flex h-[52px] items-center gap-4 px-4 pl-14 lg:pl-6">
        {/* Page title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-text-heading truncate">{title}</h1>
        </div>

        {/* Admin avatar + dropdown */}
        <div ref={dropdownRef} className="relative shrink-0">
          <button
            ref={buttonRef}
            type="button"
            id="sa-account-btn"
            onClick={() => setOpen((p) => !p)}
            className="group flex items-center gap-2 rounded-full border border-border bg-surface-muted px-2 py-1.5 transition-all duration-150 hover:border-border hover:bg-surface-muted/80"
            aria-expanded={open}
            aria-haspopup="menu"
            aria-controls="sa-account-menu"
            aria-label="Account menu"
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}
            >
              {avatarText}
            </div>
            <ChevronDown
              size={14}
              className={`text-text-muted transition duration-200 ${open ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>

          {/* Dropdown panel */}
          <div
            id="sa-account-menu"
            role="menu"
            aria-hidden={!open}
            className={`absolute right-0 z-[9999] mt-2 w-56 origin-top-right rounded-2xl border border-border bg-surface-card p-2 shadow-modal transition duration-200 ease-in-out ${
              open
                ? 'scale-100 opacity-100'
                : 'pointer-events-none invisible scale-95 opacity-0'
            }`}
          >
            {/* User info */}
            <div className="mb-2 rounded-xl border border-border bg-surface-muted px-3 py-2.5">
              <p className="truncate text-xs font-semibold text-text-heading">
                {user?.email ?? 'Super Admin'}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mt-0.5">
                Super Admin
              </p>
            </div>

            <button
              type="button"
              role="menuitem"
              tabIndex={open ? 0 : -1}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-text-body transition hover:bg-surface-muted hover:text-text-heading"
              onClick={() => closeMenu()}
            >
              <User size={14} />
              Profile
            </button>

            <div className="my-1.5 border-t border-border" />

            <button
              type="button"
              role="menuitem"
              tabIndex={open ? 0 : -1}
              onClick={handleLogoutClean}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
