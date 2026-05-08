'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, Moon, Settings, Sun, User } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/Button';
import { handleLogoutClean } from '@/lib/logout';

function getRoleLabel(roleName?: string) {
  if (!roleName) return 'Guest';
  return roleName.charAt(0).toUpperCase() + roleName.slice(1);
}

function getCompactName(email: string) {
  return email.split('@')[0];
}

export function AccountDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const firstMenuItemRef = useRef<HTMLAnchorElement | null>(null);
  const { user } = useAuthStore();
  const { resolvedTheme, setTheme } = useTheme();
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
  const compactName = getCompactName(user.email);
  const avatarText = user.email.charAt(0).toUpperCase();

  const handleLogout = () => {
    handleLogoutClean();
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className="group flex items-center gap-3 rounded-full border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_78%,transparent)] px-2 py-1.5 transition-all duration-150 ease-out hover:border-[var(--border-hover)] hover:bg-[var(--surface-2)]"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-label="Account menu"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] via-[var(--accent-blue)] to-[var(--accent-purple)] text-sm font-semibold text-white">
          {avatarText}
        </div>
        <div className="hidden min-w-0 text-left lg:block">
          <p className="max-w-[120px] truncate text-sm font-medium text-slate-800">{compactName}</p>
        </div>
        <ChevronDown
          size={16}
          className={`text-[var(--text-secondary)] transition duration-200 ease-in-out ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      <div
        id={menuId}
        className={`absolute right-0 z-[9999] mt-3 w-72 origin-top-right rounded-[24px] border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_92%,transparent)] p-3 shadow-[var(--shadow-soft)] backdrop-blur transition duration-200 ease-in-out ${
          open ? 'scale-100 opacity-100' : 'pointer-events-none invisible scale-95 opacity-0'
        }`}
        role="menu"
        aria-hidden={!open}
      >
        <div className="mb-1 flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] via-[var(--accent-blue)] to-[var(--accent-purple)] text-sm font-semibold text-white">
            {avatarText}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{user.email}</p>
            <p className="text-xs text-[var(--text-secondary)]">{roleLabel}</p>
          </div>
        </div>

        <div className="mb-2 flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Role</span>
          <span className="rounded-full border border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.12)] px-2.5 py-1 text-[11px] font-medium text-[var(--accent-warm)]">
            {roleName}
          </span>
        </div>

        <div className="my-3 border-t border-[var(--border)]" />

        <Link
          ref={firstMenuItemRef}
          href="/profile"
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-[var(--text-secondary)] transition duration-200 ease-in-out hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]"
          onClick={() => closeMenu()}
          role="menuitem"
          tabIndex={open ? 0 : -1}
        >
          <User size={16} />
          Profile
        </Link>
        <Link
          href="/workspace-settings"
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-[var(--text-secondary)] transition duration-200 ease-in-out hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]"
          onClick={() => closeMenu()}
          role="menuitem"
          tabIndex={open ? 0 : -1}
        >
          <Settings size={16} />
          Settings
        </Link>

        <div className="my-3 border-t border-[var(--border)]" />

        <div className="mb-3 flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5">
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            {resolvedTheme === 'light' ? <Sun size={15} /> : <Moon size={15} />}
            Theme
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 rounded-full px-3 text-xs"
            onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
          >
            {resolvedTheme === 'light' ? 'Dark' : 'Light'}
          </Button>
        </div>

        <button
          onClick={handleLogout}
          type="button"
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--accent-danger)] transition duration-200 ease-in-out hover:bg-[rgba(239,68,68,0.08)]"
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
