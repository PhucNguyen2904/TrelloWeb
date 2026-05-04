'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Shield, LogOut, LayoutDashboard, X, Menu } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { handleLogoutClean } from '@/lib/logout';

const navItems = [
  { label: 'Dashboard', href: '/superadmin', icon: LayoutDashboard },
  { label: 'User Management', href: '/users', icon: Users },
  { label: 'Role Management', href: '/roles', icon: Shield },
];

/* ── Shared nav list ──────────────────────────────────────────────────────── */

function NavList({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
      <p className="text-[10px] tracking-widest font-semibold text-text-muted px-3 mb-2 mt-1 uppercase">
        Management
      </p>

      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + '/');

        return (
          <Link key={item.href} href={item.href} onClick={onNavigate}>
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
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-brand' : ''}`}
              />
              <span>{item.label}</span>
            </button>
          </Link>
        );
      })}
    </nav>
  );
}

/* ── Brand block ──────────────────────────────────────────────────────────── */

function Brand() {
  return (
    <div className="p-4 border-b border-border">
      <div className="flex items-center gap-3 px-1">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm"
          style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}
        >
          PF
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-text-heading truncate">ProjectFlow</p>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted truncate">
            Admin Panel
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Bottom user + logout ─────────────────────────────────────────────────── */

function BottomBar({ user }: { user: { email?: string } | null }) {
  const avatarText = user?.email?.charAt(0).toUpperCase() ?? 'S';

  return (
    <div className="border-t border-border p-3 space-y-2">
      <div className="flex items-center gap-3 rounded-lg bg-surface-muted px-3 py-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}
        >
          {avatarText}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-text-heading truncate">
            {user?.email ?? 'Super Admin'}
          </p>
          <p className="text-[10px] text-text-muted">Super Admin</p>
        </div>
      </div>

      <button
        onClick={handleLogoutClean}
        type="button"
        className="w-full text-left text-sm text-red-600 hover:bg-red-50 rounded-lg px-3 py-2 flex items-center gap-3 h-9 transition-colors"
      >
        <LogOut className="w-4 h-4 flex-shrink-0" />
        Logout
      </button>
    </div>
  );
}

/* ── Desktop sidebar ──────────────────────────────────────────────────────── */

export function SuperAdminSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Desktop (lg+) ─────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex lg:flex-col flex-shrink-0 w-[240px] bg-surface-card border-r border-border h-full">
        <Brand />
        <NavList pathname={pathname} />
        <BottomBar user={user} />
      </aside>

      {/* ── Mobile: hamburger trigger (injected into topbar via portal-like) ─ */}
      {/* The topbar already takes care of this button — see SuperAdminTopbar  */}
      {/* But we also export the toggle fn via a global so the topbar can use  */}

      {/* ── Mobile drawer overlay ──────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[9990] bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile drawer panel ────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-[9991] flex flex-col w-[260px] bg-surface-card border-r border-border shadow-modal transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm"
              style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}
            >
              PF
            </div>
            <div>
              <p className="text-sm font-bold text-text-heading">ProjectFlow</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                Admin Panel
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-text-muted hover:bg-surface-muted transition"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        <NavList pathname={pathname} onNavigate={() => setMobileOpen(false)} />
        <BottomBar user={user} />
      </aside>

      {/* ── Mobile hamburger button (floats in top-left) ───────────────────── */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed top-3 left-3 z-[9989] flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-surface-card shadow-card text-text-muted hover:bg-surface-muted transition lg:hidden"
        aria-label="Open navigation menu"
        aria-expanded={mobileOpen}
      >
        <Menu size={18} />
      </button>
    </>
  );
}
