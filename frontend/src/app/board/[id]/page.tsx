'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BoardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to new boards structure
    router.replace('/dashboard/boards');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse">Redirecting...</div>
    </div>
  );
}
