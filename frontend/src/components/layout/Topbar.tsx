'use client';

import { Bell, Search, HelpCircle, LayoutGrid } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { AccountDropdown } from './AccountDropdown';

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
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB] h-14 px-6 flex items-center justify-between">
      {/* Left section: Logo & Team (Duplicate of sidebar in mobile or fixed header) */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-[6px] bg-[#1565C0] flex items-center justify-center lg:hidden">
          <span className="text-white font-bold text-lg">P</span>
        </div>
        <div className="hidden lg:block">
          <h2 className="text-sm font-bold text-[#111827]">ProjectFlow</h2>
          <p className="text-[11px] text-[#6B7280] font-medium">Engineering Team</p>
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 flex justify-center px-4">
        <div className="relative w-full max-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-white border border-[#E5E7EB] rounded-lg py-1.5 pl-9 pr-3 text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0]"
          />
        </div>
      </div>

      {/* Right: Icons + Avatar */}
      <div className="flex items-center gap-2 md:gap-4">
        <button className="p-2 text-[#6B7280] hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} />
        </button>
        <button className="p-2 text-[#6B7280] hover:bg-gray-100 rounded-lg transition-colors">
          <HelpCircle size={20} />
        </button>
        <button className="p-2 text-[#6B7280] hover:bg-gray-100 rounded-lg transition-colors">
          <LayoutGrid size={20} />
        </button>
        
        {/* Avatar */}
        <div className="ml-2">
          {user ? (
            <AccountDropdown />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#374151] flex items-center justify-center text-white text-xs font-bold">
              UN
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

