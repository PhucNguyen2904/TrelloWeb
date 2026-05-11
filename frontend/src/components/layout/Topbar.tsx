'use client';

import { Bell, HelpCircle, Grid, Search, Menu } from 'lucide-react';
import { AccountDropdown } from './AccountDropdown';

export interface TopbarProps {
  onMobileMenuClick?: () => void;
}

export function Topbar({ onMobileMenuClick }: TopbarProps) {
  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      {/* Mobile Menu Button */}
      <button 
        onClick={onMobileMenuClick}
        className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg mr-2"
      >
        <Menu size={20} />
      </button>

      {/* Center: Search (Visible on large screens) */}
      <div className="hidden md:flex flex-1 max-w-xl relative group">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0079BF] transition-colors" />
        <input 
          placeholder="Search for anything..." 
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-[#E5E7EB] rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#0079BF]/20 focus:border-[#0079BF] outline-none transition-all"
          type="text" 
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all">
          <Bell size={20} />
        </button>
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all">
          <HelpCircle size={20} />
        </button>
        <div className="h-8 w-[1px] bg-[#E5E7EB] mx-2" />
        <AccountDropdown />
      </div>
    </header>
  );
}

