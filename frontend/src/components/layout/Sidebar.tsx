'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { LogOut, Menu, X, LayoutDashboard, Users, ShieldCheck, Settings, HelpCircle } from 'lucide-react';
import { RoleBadge } from '@/components/ui/Badge';

/* ── Nav item type ─────────────────────────────────────────── */
interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: Record<string, NavItem[]> = {
  superadmin: [
    { label: 'Users Management', href: '/dashboard/users', icon: <Users size={17} /> },
    { label: 'Roles', href: '/dashboard/roles', icon: <ShieldCheck size={17} /> },
    { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={17} /> },
  ],
  admin: [
    { label: 'Users Management', href: '/dashboard/users', icon: <Users size={17} /> },
    { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={17} /> },
  ],
  user: [
    { label: 'My Boards', href: '/dashboard', icon: <LayoutDashboard size={17} /> },
  ],
  guest: [
    { label: 'Boards', href: '/dashboard', icon: <LayoutDashboard size={17} /> },
  ],
};

/* ── ProjectFlow Logo SVG ──────────────────────────────────── */
function Logo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="5" rx="1.5" fill="currentColor" opacity="0.85"/>
      <rect x="13" y="3" width="8" height="9" rx="1.5" fill="currentColor"/>
      <rect x="3" y="10" width="8" height="11" rx="1.5" fill="currentColor"/>
      <rect x="13" y="14" width="8" height="7" rx="1.5" fill="currentColor" opacity="0.85"/>
    </svg>
  );
}

/* ── Avatar initials ───────────────────────────────────────── */
function Avatar({ email }: { email: string }) {
  const initials = email.charAt(0).toUpperCase();
  return (
    <div
      style={{
        width: 34, height: 34, borderRadius: '50%',
        background: 'linear-gradient(135deg, #0079bf, #005f98)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#ffffff', fontSize: 13, fontWeight: 700, flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

/* ── Sidebar ───────────────────────────────────────────────── */
export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  const roleKey = (user?.role?.name || 'guest') as keyof typeof NAV_ITEMS;
  const items = NAV_ITEMS[roleKey] ?? NAV_ITEMS.guest;

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  /* ── Shared sidebar content ──────────────────────────────── */
  const SidebarContent = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#f7f9ff',
        borderRight: '1px solid #e0e2e9',
        width: '100%',
      }}
    >
      {/* ── Logo ─────────────────────────────────────────── */}
      <div
        style={{
          padding: '18px 20px',
          borderBottom: '1px solid #e0e2e9',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div style={{ color: '#0079bf' }}>
          <Logo />
        </div>
        <span style={{ fontWeight: 800, fontSize: 17, color: '#005f98', letterSpacing: '-0.01em' }}>
          ProjectFlow
        </span>
      </div>

      {/* ── Navigation ───────────────────────────────────── */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
        {/* Section label */}
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#707882', textTransform: 'uppercase', padding: '6px 12px 10px' }}>
          Navigation
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {items.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  borderRadius: isActive ? '0 8px 8px 0' : '8px',
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#005f98' : '#404751',
                  background: isActive ? '#d4e0f8' : 'transparent',
                  boxShadow: isActive ? 'inset 3px 0 0 #0079bf' : 'none',
                  textDecoration: 'none',
                  transition: 'background 120ms ease, color 120ms ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#ebeef4';
                    e.currentTarget.style.color = '#181c20';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#404751';
                  }
                }}
              >
                <span style={{ color: isActive ? '#0079bf' : '#707882', display: 'flex', alignItems: 'center' }}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Footer ───────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid #e0e2e9' }}>
        {/* Help link */}
        <div style={{ padding: '8px' }}>
          <a
            href="#"
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
              borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#707882',
              textDecoration: 'none', transition: 'background 120ms ease, color 120ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#ebeef4'; e.currentTarget.style.color = '#181c20'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#707882'; }}
          >
            <HelpCircle size={17} />
            Help Center
          </a>
        </div>

        {/* User info + logout */}
        {user && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid #e0e2e9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <Avatar email={user.email} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#181c20', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </p>
                <div style={{ marginTop: 3 }}>
                  <RoleBadge role={user.role.name as 'superadmin' | 'admin' | 'user' | 'guest'} size="sm" />
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                padding: '8px 12px', background: 'transparent', border: '1px solid #e0e2e9',
                borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#404751',
                cursor: 'pointer', transition: 'background 120ms ease, border-color 120ms ease, color 120ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#ffdad6'; e.currentTarget.style.borderColor = '#ba1a1a'; e.currentTarget.style.color = '#ba1a1a'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#e0e2e9'; e.currentTarget.style.color = '#404751'; }}
            >
              <LogOut size={15} />
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed top-4 left-4 z-40 md:hidden"
        style={{
          padding: '8px', background: '#ffffff', border: '1px solid #e0e2e9',
          borderRadius: 8, color: '#404751', cursor: 'pointer',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        }}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Desktop sidebar (always visible, in normal flow) */}
      <aside className="hidden h-screen w-64 shrink-0 md:flex md:flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar (slide-in) */}
      <div
        className="md:hidden"
        style={{
          position: 'fixed', left: 0, top: 0, bottom: 0,
          width: '16rem', zIndex: 35,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 280ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <SidebarContent />
      </div>
    </>
  );
}
