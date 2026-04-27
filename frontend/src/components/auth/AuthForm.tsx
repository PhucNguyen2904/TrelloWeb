'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  agreeToTerms: z.boolean().refine((v) => v === true, 'You must agree to the Terms of Service'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

interface AuthFormProps { mode: 'login' | 'register'; }

const strengthColors = ['#ba1a1a', '#b05f01', '#005f98', '#1a7a4a'];
const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

function getStrength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^a-zA-Z0-9]/.test(pw)) s++;
  return s;
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 mt-1" style={{ fontSize: 12, color: '#ba1a1a' }}>
      <AlertCircle size={12} />{msg}
    </p>
  );
}

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: '100%', padding: '10px 14px', fontSize: 14, color: '#181c20',
  background: '#ffffff', border: `1px solid ${hasError ? '#ba1a1a' : '#c0c7d2'}`,
  borderRadius: 8, outline: 'none', fontFamily: 'inherit',
  transition: 'border-color 120ms ease, box-shadow 120ms ease',
});

const focusHandlers = (hasError: boolean) => ({
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#0079bf';
    e.target.style.boxShadow = '0 0 0 3px rgba(0,121,191,0.15)';
  },
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = hasError ? '#ba1a1a' : '#c0c7d2';
    e.target.style.boxShadow = 'none';
  },
});

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { login } = useAuthStore();
  const addToast = useToastStore((s) => s.addToast);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isLogin = mode === 'login';

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    defaultValues: isLogin
      ? { email: '', password: '', rememberMe: false }
      : { fullName: '', email: '', password: '', agreeToTerms: false },
  });

  const pw = (watch('password') as string) || '';
  const strength = getStrength(pw);

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      if (isLogin) {
        // Step 1: Login và lấy token
        const fd = new URLSearchParams();
        fd.append('username', (data as LoginFormData).email);
        fd.append('password', (data as LoginFormData).password);
        const res = await api.post('/api/auth/login', fd, { 
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' } 
        });
        
        // Step 2: Extract token từ response
        const token = res.data.access_token;
        
        // Step 3: Gọi /me với token explicit trong Authorization header
        // (Không rely vào store vì chưa update)
        const userRes = await api.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const user = userRes.data;
        
        // Step 4: Update store với user data và token
        login(user, token);
        addToast({ type: 'success', title: 'Login successful!' });
        
        // Step 5: Redirect theo role
        const role = user.role?.name;
        const dest = role === 'superadmin' || role === 'admin' ? '/dashboard/users' : '/dashboard';
        router.replace(dest);
      } else {
        const { email, password } = data as RegisterFormData;
        await api.post('/api/auth/register', { email, password });
        addToast({ type: 'success', title: 'Registration successful! Please log in.' });
        router.replace('/login');
      }
    } catch (err: any) {
      addToast({ type: 'error', title: isLogin ? 'Login failed' : 'Registration failed', description: err.response?.data?.detail || 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {!isLogin && (
        <div>
          <label className="block mb-1.5 font-medium" style={{ fontSize: 13, color: '#404751' }}>Full Name</label>
          <input type="text" {...register('fullName')} disabled={isLoading} placeholder="John Doe"
            style={inputStyle(!!(errors as any).fullName)} {...focusHandlers(!!(errors as any).fullName)} />
          <FieldError msg={(errors as any).fullName?.message} />
        </div>
      )}

      <div>
        <label className="block mb-1.5 font-medium" style={{ fontSize: 13, color: '#404751' }}>
          {isLogin ? 'Email' : 'Work Email'}
        </label>
        <input type="email" {...register('email')} disabled={isLoading}
          placeholder={isLogin ? 'you@example.com' : 'work@company.com'}
          style={inputStyle(!!errors.email)} {...focusHandlers(!!errors.email)} />
        <FieldError msg={errors.email?.message} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="font-medium" style={{ fontSize: 13, color: '#404751' }}>Password</label>
        </div>
        <div className="relative">
          <input type={showPassword ? 'text' : 'password'} {...register('password')} disabled={isLoading}
            placeholder={isLogin ? '••••••••' : 'Min. 8 characters'}
            style={{ ...inputStyle(!!errors.password), paddingRight: 44 }} {...focusHandlers(!!errors.password)} />
          <button type="button" onClick={() => setShowPassword((v) => !v)} disabled={isLoading}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#707882', display: 'flex', alignItems: 'center', padding: 0 }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <FieldError msg={errors.password?.message} />
        {!isLogin && pw.length > 0 && (
          <div className="mt-2">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4].map((l) => (
                <div key={l} style={{ flex: 1, height: 3, borderRadius: 9999, background: strength >= l ? (strengthColors[strength - 1] || '#c0c7d2') : '#e0e2e9', transition: 'background 200ms ease' }} />
              ))}
            </div>
            <p style={{ fontSize: 11, color: strengthColors[strength - 1] || '#707882' }}>
              {strength > 0 ? `${strengthLabels[strength - 1]} password` : 'Enter a password'}
            </p>
          </div>
        )}
      </div>

      {isLogin && (
        <label className="flex items-center gap-2 cursor-pointer" style={{ fontSize: 13 }}>
          <input type="checkbox" {...register('rememberMe')} disabled={isLoading} style={{ accentColor: '#0079bf', width: 14, height: 14 }} />
          <span style={{ color: '#404751' }}>Keep me signed in</span>
        </label>
      )}

      {!isLogin && (
        <div>
          <label className="flex items-start gap-2 cursor-pointer" style={{ fontSize: 13 }}>
            <input type="checkbox" {...register('agreeToTerms')} disabled={isLoading} style={{ accentColor: '#0079bf', width: 14, height: 14, marginTop: 2, flexShrink: 0 }} />
            <span style={{ color: '#404751', lineHeight: 1.5 }}>
              I agree to the <a href="#" style={{ color: '#005f98' }} className="hover:underline">Terms of Service</a> and <a href="#" style={{ color: '#005f98' }} className="hover:underline">Privacy Policy</a>
            </span>
          </label>
          <FieldError msg={(errors as any).agreeToTerms?.message} />
        </div>
      )}

      <button type="submit" disabled={isLoading}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '11px 16px', marginTop: 8, background: isLoading ? '#7fb3d4' : '#0079bf', color: '#ffffff', fontSize: 14, fontWeight: 600, border: 'none', borderRadius: 8, cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'background 120ms ease, box-shadow 120ms ease' }}
        onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.background = '#005f98'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,95,152,0.35)'; } }}
        onMouseLeave={(e) => { if (!isLoading) { e.currentTarget.style.background = '#0079bf'; e.currentTarget.style.boxShadow = 'none'; } }}>
        {isLoading && <LoadingSpinner size="sm" />}
        {isLogin ? 'Sign in' : 'Get Started'}
      </button>

      <div className="relative my-2">
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '100%', height: 1, background: '#e0e2e9' }} />
        </div>
        {/* <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <span style={{ padding: '0 12px', background: '#ffffff', fontSize: 12, color: '#707882', fontWeight: 500, letterSpacing: '0.04em' }}>OR</span>
        </div> */}
      </div>

      {/* <div className="space-y-3">
        {[
          { label: 'Continue with Google', icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )},
          { label: 'Continue with Microsoft', icon: (
            <svg width="16" height="16" viewBox="0 0 24 24">
              <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
              <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
              <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
              <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
            </svg>
          )},
        ].map(({ label, icon }) => (
          <button key={label} type="button" disabled={isLoading}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '10px 16px', background: '#ffffff', color: '#181c20', fontSize: 13, fontWeight: 500, border: '1px solid #c0c7d2', borderRadius: 8, cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'background 120ms ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f3fa'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}>
            {icon}{label}
          </button>
        ))}
      </div> */}
    </form>
  );
}
