import React from 'react';
import { Clock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBoards, deleteBoard } from '@/lib/api';
import Link from 'next/link';
import BoardCard from './BoardCard';

interface RecentlyViewedProps {
  onCreateClick?: () => void;
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ onCreateClick }) => {
  const [mounted, setMounted] = React.useState(false);
  const queryClient = useQueryClient();

  const { data: boards = [], isLoading } = useQuery({
    queryKey: ['boards'],
    queryFn: getBoards,
    enabled: mounted,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleDeleteBoard = (boardId: number, boardName: string) => {
    if (window.confirm(`Are you sure you want to delete the board "${boardName}"?`)) {
      deleteMutation.mutate(boardId);
    }
  };

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

  // Sort by last_viewed_at (descending), fallback to created_at or id
  const recentBoards = [...boards]
    .sort((a, b) => {
      const timeA = a.last_viewed_at ? new Date(a.last_viewed_at).getTime() : 0;
      const timeB = b.last_viewed_at ? new Date(b.last_viewed_at).getTime() : 0;
      
      if (timeA !== timeB) return timeB - timeA;
      // Fallback to ID descending (newest first) if no view history
      return b.id - a.id;
    })
    .slice(0, 4);

  if (boards.length === 0) return null;

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
              color={board.color}
              gradient={board.gradient}
              isStarred={false}
              memberAvatars={[]}
              onDelete={() => handleDeleteBoard(board.id, board.name)}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
