'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function Home() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!token || !user) {
      router.replace('/login');
    } else {
      const role = user.role?.name;
      router.replace(role === 'superadmin' ? '/superadmin/users' : '/dashboard');
    }
  }, [token, user, router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f7f9ff',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          border: '3px solid #c0c7d2',
          borderTopColor: '#0079bf',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }}
      />
    </div>
  );
}
