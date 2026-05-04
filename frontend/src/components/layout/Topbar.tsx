'use client';

import { Bell, Search, Settings, HelpCircle } from 'lucide-react';
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
  onCreateClick,
}: TopbarProps) {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e2e8f0] h-14 px-5 flex items-center justify-between gap-4">
      {/* Left: Logo + Nav Links */}
      <div className="flex items-center gap-6">
        {/* ProjectFlow Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-sm bg-[#0079BF] flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-bold text-[#0079BF] text-sm hidden sm:inline">ProjectFlow</span>
        </div>

        {/* Nav Links */}
        <nav className="hidden sm:flex items-center gap-4 ml-4">
          {['Workspaces', 'Recent', 'Starred'].map((link) => (
            <button
              key={link}
              className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              {link}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          ))}
        </nav>
      </div>

      {/* Center: Search */}
      <div className="hidden lg:flex flex-1 max-w-sm">
        <label className="bg-slate-100 rounded-full px-4 py-1.5 text-sm w-72 flex items-center gap-2 text-slate-400">
          <Search size={16} className="text-slate-400" />
          <input
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            placeholder="Search..."
            aria-label="Search"
          />
        </label>
      </div>

      {/* Right: Buttons + Icons + Avatar */}
      <div className="flex items-center gap-4">
        {/* Create Button */}
        <button
          onClick={onCreateClick}
          className="bg-[#0079BF] hover:bg-[#005c91] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
        >
          Create
        </button>

        {/* Icon Buttons */}
        <button
          aria-label="Notifications"
          className="w-8 h-8 rounded-md hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors"
        >
          <Bell size={18} />
        </button>

        <button
          aria-label="Help"
          className="w-8 h-8 rounded-md hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors"
        >
          <HelpCircle size={18} />
        </button>

        <button
          aria-label="Settings"
          className="w-8 h-8 rounded-md hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors"
        >
          <Settings size={18} />
        </button>

        {/* Avatar */}
        {user ? <AccountDropdown /> : null}
      </div>
    </header>
  );
}
