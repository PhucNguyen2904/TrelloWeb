'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { AccountDropdown } from './AccountDropdown';

export interface TopbarProps {
  title?: string;
  subtitle?: string;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
}

export function Topbar({ title = 'Dashboard', subtitle, showCreateButton = false, onCreateClick }: TopbarProps) {
  const user = useAuthStore((s) => s.user);

  return (
    <header
      className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-sm"
    >
      {/* Desktop Layout */}
      <div className="hidden min-h-[72px] items-center justify-between px-6 py-3 md:flex">
        {/* Left: Title */}
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold text-slate-900">{title}</h1>
          {subtitle ? (
            <p className="mt-0.5 truncate text-sm text-slate-500">{subtitle}</p>
          ) : null}
        </div>

        {/* Right: Actions & User Menu */}
        <div className="flex items-center gap-4">
          {showCreateButton && (
            <button
              onClick={onCreateClick}
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-110 active:scale-[0.99]"
            >
              + Create
            </button>
          )}

          {user ? <AccountDropdown /> : null}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex min-h-[56px] items-center justify-between px-4 py-2 md:hidden">
        <div className="ml-14 min-w-0">
          <h2 className="truncate text-base font-semibold text-slate-900">
            {title}
          </h2>
          {subtitle ? (
            <p className="truncate text-xs text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        {showCreateButton && (
          <button
            onClick={onCreateClick}
            className="rounded-md bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-white transition-all hover:brightness-110 active:scale-[0.99]"
          >
            + Create
          </button>
        )}
      </div>
    </header>
  );
}
