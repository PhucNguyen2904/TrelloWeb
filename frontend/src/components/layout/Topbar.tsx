'use client';

import { Bell, Search, HelpCircle, LayoutGrid } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { AccountDropdown } from './AccountDropdown';
import Image from 'next/image';

export interface TopbarProps {
  title?: string;
  subtitle?: string;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
  onMobileMenuClick?: () => void;
}

export function Topbar({}: TopbarProps) {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB] h-16 px-6 flex items-center justify-between">
      {/* Left section: Logo & Nav Links */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0079BF] flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <h1 className="text-xl font-bold text-[#0079BF]">ProjectFlow</h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-1">
          <button className="px-3 py-2 text-sm font-medium text-[#374151] hover:bg-gray-100 rounded-md transition-colors">Workspaces</button>
          <button className="px-3 py-2 text-sm font-semibold text-[#0079BF] border-b-2 border-[#0079BF] rounded-none">Recent</button>
          <button className="px-3 py-2 text-sm font-medium text-[#374151] hover:bg-gray-100 rounded-md transition-colors">Starred</button>
        </nav>
      </div>

      {/* Center: Search & Create */}
      <div className="flex-1 flex items-center justify-end md:justify-center px-4 gap-4">
        <div className="relative w-full max-w-[240px] hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-white border border-[#E5E7EB] rounded-lg py-2 pl-10 pr-3 text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#0079BF] focus:ring-1 focus:ring-[#0079BF]"
          />
        </div>
        <button className="bg-[#0079BF] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#005a8e] transition-all whitespace-nowrap">
          Create
        </button>
      </div>

      {/* Right: Icons + Avatar */}
      <div className="flex items-center gap-1 md:gap-3">
        <button className="p-2 text-[#6B7280] hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} />
        </button>
        <button className="p-2 text-[#6B7280] hover:bg-gray-100 rounded-lg transition-colors">
          <HelpCircle size={20} />
        </button>
        <button className="p-2 text-[#6B7280] hover:bg-gray-100 rounded-lg transition-colors">
          <LayoutGrid size={20} />
        </button>
        
        {/* Account Dropdown */}
        <div className="ml-1">
          <AccountDropdown />
        </div>
      </div>
    </header>
  );
}

