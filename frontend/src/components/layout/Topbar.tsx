'use client';

import { Bell, Menu, Search, Settings } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { AccountDropdown } from './AccountDropdown';
import { Button } from '@/components/ui/Button';
import { useTheme } from 'next-themes';
import { Moon, SunMedium } from 'lucide-react';

export interface TopbarProps {
  title?: string;
  subtitle?: string;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
  onMobileMenuClick?: () => void;
}

export function Topbar({
  onMobileMenuClick,
}: TopbarProps) {
  const user = useAuthStore((s) => s.user);
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[rgba(10,10,15,0.85)] backdrop-blur-xl">
      <div className="flex h-[52px] items-center gap-2 px-3 sm:px-4 lg:px-6">
        <button
          onClick={onMobileMenuClick}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition duration-150 ease-out hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold text-slate-800 transition duration-200 ease-in-out sm:text-2xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-0.5 truncate text-sm text-slate-500 transition duration-200 ease-in-out">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="hidden max-w-sm flex-1 xl:block">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-slate-50/80 px-3 py-2 text-sm text-slate-500 shadow-sm transition duration-200 ease-in-out focus-within:border-[#0079BF]/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0079BF]/20">
            <Search size={16} className="text-slate-400 flex-shrink-0" />
            <input
              className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
              placeholder="Search boards, tasks, members..."
              aria-label="Search"
            />
          </label>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-2)] md:inline-flex"
            onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'light' ? <Moon size={16} /> : <SunMedium size={16} />}
          </Button>
          <button
            aria-label="Notifications"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition duration-150 ease-out hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]"
          >
            <Bell size={17} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--accent-danger)]" aria-hidden="true" />
          </button>
          <button
            aria-label="Settings"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition duration-150 ease-out hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] md:inline-flex"
          >
            <Settings size={17} />
          </button>

          {user ? <AccountDropdown /> : null}
        </div>
      </div>

      <div className="border-t border-slate-200 px-3 pb-3 sm:px-4 xl:hidden">
        <label className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200/90 bg-slate-50/80 px-3 py-2 text-sm text-slate-500 shadow-sm transition duration-200 ease-in-out focus-within:border-[#0079BF]/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0079BF]/20">
          <Search size={16} className="text-slate-400 flex-shrink-0" />
          <input
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            placeholder="Search..."
            aria-label="Search"
          />
        </label>
      </div>
    </header>
  );
}
