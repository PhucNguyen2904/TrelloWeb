'use client';

import { Bell, Menu, Plus, Search, Settings } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { AccountDropdown } from './AccountDropdown';

export interface TopbarProps {
  title?: string;
  subtitle?: string;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
  onMobileMenuClick?: () => void;
}

export function Topbar({
  title = 'Dashboard',
  subtitle,
  showCreateButton = false,
  onCreateClick,
  onMobileMenuClick,
}: TopbarProps) {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="flex min-h-[60px] items-center gap-2 px-3 py-2 sm:px-4 md:min-h-[72px] md:gap-3 md:py-3 md:px-6">
        <button
          onClick={onMobileMenuClick}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition duration-200 ease-in-out hover:bg-slate-100 active:scale-95 focus-visible:ring-2 focus-visible:ring-slate-300 md:hidden"
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
          <label className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-500 transition duration-200 ease-in-out focus-within:ring-2 focus-within:ring-[#0079BF]/20">
            <Search size={16} className="text-slate-400 flex-shrink-0" />
            <input
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              placeholder="Search boards, tasks, members..."
              aria-label="Search"
            />
          </label>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:gap-3">
          {showCreateButton && (
            <button
              onClick={onCreateClick}
              aria-label="Create new board"
              className="hidden items-center gap-1 rounded-lg bg-[#0079BF] px-3 py-2 text-sm font-semibold text-white transition duration-200 ease-in-out hover:bg-[#0068a8] focus-visible:ring-2 focus-visible:ring-[#0079BF]/50 focus-visible:ring-offset-2 active:scale-95 md:inline-flex"
            >
              <Plus size={15} />
              Create
            </button>
          )}

          <button
            aria-label="Notifications"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition duration-200 ease-in-out hover:bg-slate-100 hover:text-slate-800 active:scale-95 focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            <Bell size={17} />
          </button>
          <button
            aria-label="Settings"
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition duration-200 ease-in-out hover:bg-slate-100 hover:text-slate-800 active:scale-95 focus-visible:ring-2 focus-visible:ring-slate-300 md:inline-flex"
          >
            <Settings size={17} />
          </button>

          {user ? <AccountDropdown /> : null}
        </div>
      </div>

      <div className="border-t border-slate-200 px-3 pb-3 sm:px-4 xl:hidden">
        <label className="mt-2 flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-500 transition duration-200 ease-in-out focus-within:ring-2 focus-within:ring-[#0079BF]/20">
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
