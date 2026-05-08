'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFirstBoard } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const firstBoard = await getFirstBoard();
        if (firstBoard && firstBoard.id) {
          router.replace(`/dashboard/boards/${firstBoard.id}`);
        } else {
          router.replace('/dashboard/boards');
        }
      } catch (error) {
        console.error("Failed to redirect to first board:", error);
        router.replace('/dashboard/boards');
      }
    };

    handleRedirect();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#1976D2] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Redirecting to your workspace...</p>
      </div>
    </div>
  );
}
