'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { CalendarDays, ChevronLeft, ChevronRight, HelpCircle, LayoutDashboard, LogOut, Settings, ShieldCheck, Users, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

const NAV_ITEMS: Record<string, NavItem[]> = {
  superadmin: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Calendar', href: '/dashboard/calendar', icon: CalendarDays },
    { label: 'Users Management', href: '/dashboard/users', icon: Users },
    { label: 'Roles', href: '/dashboard/roles', icon: ShieldCheck },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ],
  admin: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Calendar', href: '/dashboard/calendar', icon: CalendarDays },
    { label: 'Users Management', href: '/dashboard/users', icon: Users },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ],
  user: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Calendar', href: '/dashboard/calendar', icon: CalendarDays },
  ],
  guest: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Calendar', href: '/dashboard/calendar', icon: CalendarDays },
  ],
};

function Logo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="5" rx="1.5" fill="currentColor" opacity="0.85" />
      <rect x="13" y="3" width="8" height="9" rx="1.5" fill="currentColor" />
      <rect x="3" y="10" width="8" height="11" rx="1.5" fill="currentColor" />
      <rect x="13" y="14" width="8" height="7" rx="1.5" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

interface SidebarProps {
  className?: string;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  className,
  mobileOpen = false,
  onCloseMobile,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  const roleKey = (user?.role?.name || 'guest') as keyof typeof NAV_ITEMS;
  const items = NAV_ITEMS[roleKey] ?? NAV_ITEMS.guest;

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const sidebarContent = (
    <div className="flex h-full flex-col border-r border-slate-200 bg-[#f7f9ff] transition-all duration-300 ease-in-out">
      <div className={cn('flex items-center border-b border-slate-200 px-5 py-5', collapsed ? 'justify-center' : 'gap-3')}>
        <div className="text-[#0079BF]">
          <Logo />
        </div>
        {!collapsed ? <span className="text-base font-bold tracking-tight text-slate-800">ProjectFlow</span> : null}
      </div>

      <div className="mx-4 mt-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        {!collapsed ? (
          <>
            <p className="text-xs text-slate-400">Workspace</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0079BF] text-sm font-bold text-white">
                PF
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">Engineering Team</p>
                <p className="text-xs text-slate-500">Premium Workspace</p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0079BF] text-sm font-bold text-white">
              PF
            </div>
          </div>
        )}
      </div>

      <nav className="mt-4 flex-1 overflow-y-auto px-3">
        {!collapsed ? (
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Navigation</p>
        ) : null}
        <div className="space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  'group flex items-center rounded-lg border-l-2 px-3 py-2.5 text-sm font-medium transition duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400',
                  collapsed ? 'justify-center' : 'gap-3',
                  isActive
                    ? 'border-[#0079BF] bg-blue-50 text-blue-600'
                    : 'border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
                aria-current={isActive ? 'page' : undefined}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  size={17}
                  className={cn('transition duration-200 ease-in-out', isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-700')}
                />
                {!collapsed ? item.label : null}
              </Link>
            );
          })}
        </div>
      </nav>

      <footer className="space-y-3 border-t border-slate-200 p-4">
        <button
          aria-label="Help Center"
          className={cn(
            'flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-slate-600 transition duration-200 ease-in-out hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400',
            collapsed ? 'justify-center' : 'gap-2'
          )}
          title={collapsed ? 'Help Center' : undefined}
        >
          <HelpCircle size={16} />
          {!collapsed ? 'Help Center' : null}
        </button>

        <button
          type="button"
          onClick={onToggleCollapse}
          className={cn(
            'hidden w-full items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition duration-200 ease-in-out hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400 md:flex',
            collapsed ? 'justify-center' : 'gap-2'
          )}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed ? 'Collapse Sidebar' : null}
        </button>

        {user ? (
          <button
            onClick={handleLogout}
            className={cn(
              'flex w-full items-center rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition duration-200 ease-in-out hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rose-400',
              collapsed ? 'justify-center' : 'justify-center gap-2'
            )}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut size={15} />
            {!collapsed ? 'Logout' : null}
          </button>
        ) : null}
      </footer>
    </div>
  );

  return (
    <>
      <aside className={cn('hidden h-screen shrink-0 md:sticky md:top-0 md:flex', className)}>{sidebarContent}</aside>

      <button
        type="button"
        className={cn(
          'fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition duration-300 ease-in-out md:hidden',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'pointer-events-none opacity-0'
        )}
        onClick={onCloseMobile}
        aria-label="Close sidebar overlay"
        aria-hidden={!mobileOpen}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] transform transition duration-300 ease-in-out md:hidden',
          mobileOpen ? 'pointer-events-auto translate-x-0 shadow-lg' : 'pointer-events-none -translate-x-full'
        )}
        aria-hidden={!mobileOpen}
      >
        <div className="relative h-full overflow-y-auto overscroll-contain">
          <button
            onClick={onCloseMobile}
            className="absolute right-3 top-3 z-10 rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 transition duration-200 ease-in-out hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-300"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>

          <div className="pt-2">{sidebarContent}</div>
        </div>
      </aside>
    </>
  );
}
