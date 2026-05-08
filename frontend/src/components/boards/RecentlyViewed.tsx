'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getBoards } from '@/lib/api';
import Link from 'next/link';
import BoardCard from './BoardCard';

interface RecentlyViewedProps {
  onCreateClick?: () => void;
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ onCreateClick }) => {
  const [mounted, setMounted] = React.useState(false);
  const { data: boards = [], isLoading } = useQuery({
    queryKey: ['boards'],
    queryFn: getBoards,
    enabled: mounted,
  });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-[#9CA3AF]" />
          <h2 className="text-lg font-bold text-[#111827]">Recently viewed</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[180px] rounded-xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  // Pick top 3 for recently viewed (or just all if list is short)
  const recentBoards = boards.slice(0, 3);

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-[#9CA3AF]" />
        <h2 className="text-lg font-bold text-[#111827]">Recently viewed</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {recentBoards.map((board: any) => (
          <Link key={board.id} href={`/boards/${board.id}`}>
            <BoardCard 
              title={board.name}
              gradient={board.coverColor === '#0079bf' ? 'bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6]' : undefined}
              isStarred={false} // Backend doesn't support starred yet
              memberAvatars={[]} // Backend doesn't support avatars yet
            />
          </Link>
        ))}
        <BoardCard title="Create" isCreateNew onClick={onCreateClick} />
      </div>
    </section>
  );
};

export default RecentlyViewed;
