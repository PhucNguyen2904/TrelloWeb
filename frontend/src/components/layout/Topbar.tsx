'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { RoleBadge } from '@/components/ui/Badge';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export interface TopbarProps {
  title?: string;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
}

export function Topbar({ title = 'Dashboard', showCreateButton = false, onCreateClick }: TopbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 h-[var(--topbar-height)] border-b z-20"
      style={{ backgroundColor: 'var(--surface-0)', borderColor: 'var(--border)' }}
    >
      {/* Desktop Layout */}
      <div className="hidden md:flex h-full items-center justify-between px-6 ml-[var(--sidebar-width)]">
        {/* Left: Title */}
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h2>
        </div>

        {/* Right: Actions & User Menu */}
        <div className="flex items-center gap-4">
          {user && <RoleBadge role={user.role.name as 'superadmin' | 'admin' | 'user' | 'guest'} size="sm" />}

          {showCreateButton && (
            <button
              onClick={onCreateClick}
              className="px-4 py-2 text-sm font-medium text-white rounded-md transition-all hover:brightness-110"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              + Create
            </button>
          )}

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-md transition-colors"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: 'var(--primary)' }}>
                {user?.email.charAt(0).toUpperCase()}
              </div>
              <ChevronDown size={16} />
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-lg shadow-md border py-2 z-40"
                style={{ backgroundColor: 'var(--surface-0)', borderColor: 'var(--border)' }}
              >
                <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                    ACCOUNT
                  </p>
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex h-full items-center justify-between px-6">
        <div className="ml-12">
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h2>
        </div>
        {showCreateButton && (
          <button
            onClick={onCreateClick}
            className="px-3 py-1.5 text-xs font-medium text-white rounded-md transition-all hover:brightness-110"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            + Create
          </button>
        )}
      </div>
    </header>
  );
}
