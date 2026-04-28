'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { CalendarDays, HelpCircle, LayoutDashboard, LogOut, Settings, ShieldCheck, Users, X } from 'lucide-react';
import { RoleBadge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

const NAV_ITEMS: Record<string, NavItem[]> = {
  superadmin: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Calendar', href: '/dashboard', icon: CalendarDays },
    { label: 'Users Management', href: '/dashboard/users', icon: Users },
    { label: 'Roles', href: '/dashboard/roles', icon: ShieldCheck },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ],
  admin: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Calendar', href: '/dashboard', icon: CalendarDays },
    { label: 'Users Management', href: '/dashboard/users', icon: Users },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ],
  user: [
    { label: 'My Boards', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Calendar', href: '/dashboard', icon: CalendarDays },
  ],
  guest: [
    { label: 'Boards', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Calendar', href: '/dashboard', icon: CalendarDays },
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

function Avatar({ email }: { email: string }) {
  const initials = email.charAt(0).toUpperCase();
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0079BF] to-[#005f98] text-sm font-bold text-white">
      {initials}
    </div>
  );
}

interface SidebarProps {
  className?: string;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ className, mobileOpen = false, onCloseMobile }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  const roleKey = (user?.role?.name || 'guest') as keyof typeof NAV_ITEMS;
  const items = NAV_ITEMS[roleKey] ?? NAV_ITEMS.guest;

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const sidebarContent = (
    <div className="flex h-full flex-col border-r border-[#e2e8f0] bg-[#f7f9ff]">
      <div className="flex items-center gap-3 border-b border-[#e2e8f0] px-5 py-5">
        <div className="text-[#0079BF]">
          <Logo />
        </div>
        <span className="text-base font-bold tracking-tight text-slate-800">ProjectFlow</span>
      </div>

      <div className="mx-4 mt-4 rounded-xl border border-[#e2e8f0] bg-white p-3 shadow-sm">
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
      </div>

      <nav className="mt-4 flex-1 overflow-y-auto px-3">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Navigation</p>
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
                  'group flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 text-sm font-medium transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-400',
                  isActive
                    ? 'border-[#0079BF] bg-blue-50 text-blue-600'
                    : 'border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                <Icon
                  size={17}
                  className={cn('transition duration-200 ease-in-out', isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-700')}
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <footer className="space-y-3 border-t border-[#e2e8f0] p-4">
        <button
          aria-label="Help Center"
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-600 transition duration-200 ease-in-out hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-400"
        >
          <HelpCircle size={16} />
          Help Center
        </button>

        {user ? (
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-3 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <Avatar email={user.email} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">{user.email}</p>
                <div className="mt-1">
                  <RoleBadge role={user.role.name as 'superadmin' | 'admin' | 'user' | 'guest'} size="sm" />
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition duration-200 ease-in-out hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-400"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        ) : null}
      </footer>
    </div>
  );

  return (
    <>
      <aside className={cn('hidden shrink-0 md:flex', className)}>{sidebarContent}</aside>

      <div
        className={cn(
          'fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition duration-300 ease-in-out md:hidden',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'pointer-events-none opacity-0'
        )}
        onClick={onCloseMobile}
        role="button"
        aria-label="Close sidebar overlay"
        tabIndex={-1}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] transform transition duration-300 ease-in-out md:hidden',
          mobileOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full'
        )}
      >
        <div className="relative h-full overflow-y-auto overscroll-contain">
          <button
            onClick={onCloseMobile}
            className="absolute right-3 top-3 z-10 rounded-lg border border-[#e2e8f0] bg-white p-1.5 text-slate-600 transition duration-200 ease-in-out hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200"
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
