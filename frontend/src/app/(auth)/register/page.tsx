'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && token) {
      const role = user.role?.name;
      router.replace(role === 'superadmin' || role === 'admin' ? '/dashboard/users' : '/dashboard');
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
            Join thousands of teams already thriving.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 18, lineHeight: '28px', marginBottom: 40 }}>
            Set up your workspace in minutes. No credit card required.
          </p>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              'Unlimited boards and task lists',
              'Real-time collaboration with your team',
              'Visual progress tracking with Kanban',
            ].map((text) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <span style={{ color: '#ffffff', fontSize: 12, fontWeight: 700 }}>✓</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
            Free forever for small teams. Upgrade anytime.
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
          className="lg:hidden"
          style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}
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
              Create your account
            </h2>
            <p style={{ fontSize: 14, color: '#707882', lineHeight: '20px' }}>
              Join ProjectFlow and streamline your teamwork
            </p>
          </div>

          {/* Form */}
          <AuthForm mode="register" />

          {/* Footer */}
          <p style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: '#707882' }}>
            Already have an account?{' '}
            <Link
              href="/login"
              style={{ color: '#005f98', fontWeight: 600, textDecoration: 'none' }}
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
