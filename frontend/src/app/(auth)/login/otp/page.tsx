'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';

export default function OTPLoginPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const setAuthUser = useAuthStore((s) => s.login);
  const { success: showSuccess, error: showError } = (() => {
    const addToast = useToastStore((s) => s.addToast);
    return {
      success: (message: string) => addToast({ type: 'success', title: message }),
      error: (message: string) => addToast({ type: 'error', title: message }),
    };
  })();

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [cooldown, setCooldown] = useState(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && token) {
      const role = user.role?.name;
      router.replace(role === 'superadmin' ? '/superadmin' : (role === 'admin' ? '/users' : '/boards'));
    }
  }, [user, token, router]);

  // Countdown timer for OTP expiration
  useEffect(() => {
    if (!expiresAt || step !== 'otp') return;

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = expiresAt - now;

      if (remaining <= 0) {
        setExpiresAt(null);
        setOtp('');
        setStep('email');
        setError('OTP code has expired. Please request a new one.');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, step]);

  // Cooldown timer for resend button
  useEffect(() => {
    if (cooldown <= 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/auth/otp/request', { email });
      setExpiresAt(Math.floor(Date.now() / 1000) + response.data.expires_in);
      setStep('otp');
      setOtp('');
      setRemainingAttempts(3);
      setCooldown(60);
      showSuccess('OTP code sent to your email');
    } catch (err: any) {
      const message = err?.response?.data?.detail || 'Failed to send OTP';
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/auth/otp/verify', { email, otp_code: otp });
      
      // Set auth store
      setAuthUser(
        {
          id: response.data.user_id,
          email: response.data.email,
          role: { id: 0, name: 'user' }, // Basic role, will be updated on next fetch
        },
        response.data.access_token,
        '' // No refresh token from OTP
      );

      showSuccess('Authentication successful!');
      const role = response.data.role?.name;
      setTimeout(() => {
        router.replace(role === 'superadmin' ? '/superadmin' : (role === 'admin' ? '/users' : '/boards'));
      }, 500);
    } catch (err: any) {
      const message = err?.response?.data?.detail || 'Invalid OTP code';
      setError(message);
      setOtp('');
      
      const attempts = err?.response?.data?.attempts_remaining;
      if (attempts !== undefined) {
        setRemainingAttempts(attempts);
      }
      
      if (message.includes('Too many')) {
        setStep('email');
      }
      
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/auth/otp/request', { email });
      setExpiresAt(Math.floor(Date.now() / 1000) + response.data.expires_in);
      setOtp('');
      setRemainingAttempts(3);
      setCooldown(60);
      showSuccess('New OTP code sent');
    } catch (err: any) {
      const message = err?.response?.data?.detail || 'Failed to resend OTP';
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeRemaining = (seconds: number | null) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const now = Math.floor(Date.now() / 1000);
  const timeRemaining = expiresAt ? Math.max(0, expiresAt - now) : null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left Column */}
      <div
        style={{
          background: 'linear-gradient(135deg, #003f6b 0%, #005f98 40%, #0079bf 70%, #0091d9 100%)',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px',
          position: 'relative',
          overflow: 'hidden',
          width: '50%',
          flexShrink: 0,
          display: 'none',
        }}
        className="hidden sm:flex"
      >
        <div style={{ position: 'absolute', top: -96, right: -96, width: 384, height: 384, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -128, left: -80, width: 480, height: 480, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ color: '#ffffff', fontSize: 32, fontWeight: 600, margin: '0 0 16px 0' }}>
            TrelloWeb
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, margin: 0, lineHeight: 1.6 }}>
            Secure authentication with One-Time Password
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 1, color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
          <p>© 2026 TrelloWeb. All rights reserved.</p>
        </div>
      </div>

      {/* Right Column */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 20px',
          background: '#ffffff',
        }}
      >
        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <Link
              href="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                color: '#0079bf',
                textDecoration: 'none',
                fontSize: 14,
                marginBottom: '16px',
              }}
              className="hover:underline"
            >
              <ArrowLeft size={16} />
              Back to login
            </Link>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: '#181c20', margin: '0 0 8px 0' }}>
              {step === 'email' ? 'Sign In with OTP' : 'Enter Code'}
            </h1>
            <p style={{ fontSize: 14, color: '#626f86', margin: 0 }}>
              {step === 'email'
                ? 'We will send you a one-time code via email'
                : `We sent a code to ${email}`}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                background: '#ffebee',
                border: '1px solid #ef5350',
                borderRadius: 8,
                padding: '12px 14px',
                marginBottom: '20px',
                display: 'flex',
                gap: 12,
                fontSize: 13,
                color: '#c62828',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          {step === 'email' ? (
            <form onSubmit={handleRequestOTP} style={{ width: '100%' }}>
              <div style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#181c20',
                    marginBottom: '8px',
                  }}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: 14,
                    border: '1px solid #c0c7d2',
                    borderRadius: 8,
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#ffffff',
                  background: loading || !email ? '#c0c7d2' : '#0079bf',
                  border: 'none',
                  borderRadius: 8,
                  cursor: loading || !email ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'background-color 120ms ease',
                }}
                className="hover:bg-blue-700"
              >
                {loading && <LoadingSpinner size="small" />}
                {loading ? 'Sending...' : 'Send Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} style={{ width: '100%' }}>
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#181c20',
                    marginBottom: '8px',
                  }}
                >
                  6-Digit Code
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[...Array(6)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[i] || ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val) {
                          const newOtp = otp.split('');
                          newOtp[i] = val;
                          const newOtpStr = newOtp.join('');
                          setOtp(newOtpStr);

                          // Auto-focus next input
                          if (i < 5 && val) {
                            const nextInput = e.currentTarget.nextElementSibling as HTMLInputElement;
                            nextInput?.focus();
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otp[i] && i > 0) {
                          const prevInput = e.currentTarget.previousElementSibling as HTMLInputElement;
                          prevInput?.focus();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pastedText = e.clipboardData.getData('text').replace(/\D/g, '');
                        if (pastedText.length >= 6) {
                          setOtp(pastedText.slice(0, 6));
                        }
                      }}
                      disabled={loading}
                      style={{
                        flex: 1,
                        width: '100%',
                        padding: '12px',
                        fontSize: 18,
                        fontWeight: 600,
                        border: '1px solid #c0c7d2',
                        borderRadius: 8,
                        textAlign: 'center',
                        outline: 'none',
                        fontFamily: 'monospace',
                        transition: 'border-color 120ms ease',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Timer and Attempts */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 12,
                  marginBottom: '20px',
                  color: '#626f86',
                }}
              >
                <span>
                  {timeRemaining !== null
                    ? timeRemaining > 0
                      ? `⏱️ Expires in ${formatTimeRemaining(timeRemaining)}`
                      : '⚠️ Code expired'
                    : ''}
                </span>
                <span>Attempts: {remainingAttempts}/3</span>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#ffffff',
                  background: loading || otp.length !== 6 ? '#c0c7d2' : '#0079bf',
                  border: 'none',
                  borderRadius: 8,
                  cursor: loading || otp.length !== 6 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  marginBottom: '12px',
                  transition: 'background-color 120ms ease',
                }}
                className="hover:bg-blue-700"
              >
                {loading && <LoadingSpinner size="small" />}
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>

              <button
                type="button"
                onClick={handleResendOTP}
                disabled={cooldown > 0 || loading}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  fontSize: 13,
                  fontWeight: 500,
                  color: cooldown > 0 ? '#c0c7d2' : '#0079bf',
                  background: 'transparent',
                  border: `1px solid ${cooldown > 0 ? '#c0c7d2' : '#0079bf'}`,
                  borderRadius: 8,
                  cursor: cooldown > 0 || loading ? 'not-allowed' : 'pointer',
                  transition: 'all 120ms ease',
                }}
                className="hover:bg-blue-50"
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
              </button>
            </form>
          )}

          {/* Alternative */}
          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: 13, color: '#626f86' }}>
            <p style={{ margin: 0 }}>
              Don't have an account?{' '}
              <Link
                href="/register"
                style={{ color: '#0079bf', textDecoration: 'none', fontWeight: 500 }}
                className="hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
