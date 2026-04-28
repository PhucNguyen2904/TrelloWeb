'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Kanban,
  Calendar,
  Clock,
  HelpCircle,
  ChevronLeft,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Boards', href: '/dashboard/boards', icon: Kanban },
  { label: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
  { label: 'Recent', href: '/dashboard/recent', icon: Clock },
];

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarWidth = isCollapsed ? 'w-14' : 'w-60';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-topbar h-[calc(100vh-52px)] bg-surface-card border-r border-border overflow-y-auto transition-all duration-300 z-40 lg:relative lg:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${sidebarWidth}`}
      >
        {/* Workspace block */}
        {!isCollapsed && (
          <div className="p-4 border-b border-border">
            <div className="bg-surface-muted rounded-lg p-3 flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: '#0079BF' }}
              >
                ET
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-heading truncate">
                  Engineering
                </p>
                <p className="text-xs text-text-muted truncate">
                  Premium Workspace
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          <p className="text-xs tracking-widest font-medium text-text-muted px-3 mb-3 uppercase">
            {!isCollapsed ? 'Navigation' : ''}
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg h-9 text-sm font-medium transition-colors relative ${
                    isActive
                      ? 'bg-brand-light text-brand'
                      : 'text-text-body hover:bg-surface-muted'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand rounded-r" />
                  )}
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-brand' : ''}`} />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-3 space-y-2">
          {!isCollapsed && (
            <>
              <button className="w-full text-left text-sm text-text-body hover:bg-surface-muted rounded-lg px-3 py-2 flex items-center gap-3 h-9">
                <HelpCircle className="w-4 h-4 flex-shrink-0" />
                Help Center
              </button>
              <button
                onClick={toggleCollapse}
                className="w-full text-left text-sm text-text-body hover:bg-surface-muted rounded-lg px-3 py-2 flex items-center gap-3 h-9"
              >
                <ChevronLeft className="w-4 h-4 flex-shrink-0" />
                Collapse
              </button>
            </>
          )}

          <button className="w-full text-left text-sm text-red-600 hover:bg-red-50 rounded-lg px-3 py-2 flex items-center gap-3 h-9">
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && 'Logout'}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
