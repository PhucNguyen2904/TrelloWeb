'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && token) {
      const role = user.role?.name;
      router.replace(role === 'superadmin' ? '/superadmin' : (role === 'admin' ? '/users' : '/boards'));
    }
  }, [user, token, router]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* ── Left Column: Visual / Marketing ─────────────────── */}
      <div
        className="auth-left-col"
        style={{
          background: 'linear-gradient(135deg, #003f6b 0%, #005f98 40%, #0079bf 70%, #0091d9 100%)',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px',
          position: 'relative',
          overflow: 'hidden',
          width: '50%',
          flexShrink: 0,
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute', top: -96, right: -96,
            width: 384, height: 384, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }}
        />
        <div
          style={{
            position: 'absolute', bottom: -128, left: -80,
            width: 480, height: 480, borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
          }}
        />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="8" height="5" rx="1.5" fill="white" opacity="0.9"/>
                <rect x="13" y="3" width="8" height="9" rx="1.5" fill="white"/>
                <rect x="3" y="10" width="8" height="11" rx="1.5" fill="white"/>
                <rect x="13" y="14" width="8" height="7" rx="1.5" fill="white" opacity="0.9"/>
              </svg>
            </div>
            <span style={{ color: '#ffffff', fontWeight: 800, fontSize: 20, letterSpacing: '-0.01em' }}>
              ProjectFlow
            </span>
          </div>
        </div>

        {/* Main content */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 440 }}>
          <h1
            style={{
              color: '#ffffff', fontWeight: 700, fontSize: 42,
              lineHeight: '50px', letterSpacing: '-0.02em', marginBottom: 24,
            }}
          >
            Manage your projects with clarity and momentum.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 18, lineHeight: '28px', marginBottom: 40 }}>
            Organize tasks, track progress, and collaborate with your team — all in one place.
          </p>

          {/* Mini Kanban mockup */}
          <div
            style={{
              borderRadius: 16, padding: 16,
              background: 'rgba(255,255,255,0.10)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {[
                { label: 'To Do', count: 4, color: '#7ea6c4' },
                { label: 'In Progress', count: 2, color: '#f0a860' },
                { label: 'Done', count: 7, color: '#60c08a' },
              ].map((col) => (
                <div
                  key={col.label}
                  style={{ borderRadius: 10, padding: '10px 8px', background: 'rgba(255,255,255,0.08)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 600 }}>{col.label}</span>
                    <span
                      style={{
                        background: col.color, color: '#fff',
                        borderRadius: 9999, padding: '1px 6px',
                        fontSize: 10, fontWeight: 700,
                      }}
                    >{col.count}</span>
                  </div>
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        height: 20, borderRadius: 6, marginBottom: 4,
                        background: 'rgba(255,255,255,0.15)',
                        width: i === 1 ? '100%' : '75%',
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer quote */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
            &ldquo;The best tool is the one that gets out of your way.&rdquo;
          </p>
        </div>
      </div>

      {/* ── Right Column: Form ───────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
          background: '#ffffff',
          minHeight: '100vh',
        }}
      >
        {/* Mobile Logo */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}
          className="lg:hidden"
        >
          <div
            style={{
              width: 36, height: 36, borderRadius: 8,
              background: '#0079bf',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="8" height="5" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="13" y="3" width="8" height="9" rx="1.5" fill="white"/>
              <rect x="3" y="10" width="8" height="11" rx="1.5" fill="white"/>
              <rect x="13" y="14" width="8" height="7" rx="1.5" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: 20, color: '#005f98' }}>ProjectFlow</span>
        </div>

        <div style={{ width: '100%', maxWidth: 360 }}>
          {/* Heading */}
          <div style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontWeight: 700, fontSize: 28, lineHeight: '36px',
                letterSpacing: '-0.01em', color: '#181c20', marginBottom: 6,
              }}
            >
              Welcome back
            </h2>
            <p style={{ fontSize: 14, color: '#707882', lineHeight: '20px' }}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <AuthForm mode="login" />

          {/* OTP Login Link */}
          <div style={{ textAlign: 'center', marginTop: 20, paddingTop: 20, borderTop: '1px solid #e0e0e0' }}>
            <p style={{ fontSize: 13, color: '#707882', marginBottom: 12 }}>
              Or use passwordless authentication:
            </p>
            <Link
              href="/login/otp"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 500,
                color: '#0079bf',
                border: '1px solid #0079bf',
                borderRadius: 8,
                textDecoration: 'none',
                transition: 'all 120ms ease',
              }}
              className="hover:bg-blue-50"
            >
              Sign in with OTP
            </Link>
          </div>

          {/* Footer */}
          <p style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: '#707882' }}>
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              style={{ color: '#005f98', fontWeight: 600, textDecoration: 'none' }}
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
