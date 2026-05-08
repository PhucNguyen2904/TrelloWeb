import React from 'react';
import { ChevronRight, Settings, MoreHorizontal, Hexagon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getWorkspaces } from '@/lib/api';
import Link from 'next/link';

const WorkspaceSection: React.FC = () => {
  const [mounted, setMounted] = React.useState(false);
  const { data: workspaces = [], isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
    enabled: mounted,
  });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Hexagon className="w-5 h-5 text-[#9CA3AF]" />
            <h2 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest">Your Workspaces</h2>
          </div>
        </div>
        <div className="h-64 rounded-xl bg-slate-200 animate-pulse" />
      </section>
    );
  }

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Hexagon className="w-5 h-5 text-[#9CA3AF]" />
          <h2 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest">Your Workspaces</h2>
        </div>
        <button className="text-sm font-medium text-[#1565C0] hover:underline flex items-center gap-1">
          View all workspaces <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {workspaces.map((ws: any, idx: number) => {
          // Alternative layout for every 2nd workspace if exists
          const isLarge = idx % 2 === 0;
          
          return (
            <div key={ws.id} className={`${isLarge ? 'lg:col-span-3' : 'lg:col-span-2'} bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm hover:shadow-md transition-all`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#1565C0] flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: ws.avatarColor }}>
                    {ws.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#111827]">{ws.name}</h3>
                    <p className="text-xs text-[#6B7280]">{ws.boardCount} Boards • {ws.memberCount} Members</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#6B7280]">
                  <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors"><Settings size={18} /></button>
                  <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors"><MoreHorizontal size={18} /></button>
                </div>
              </div>

              {isLarge ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ws.boards.map((board: any) => (
                    <Link key={board.id} href={`/boards/${board.id}`}>
                      <WorkspaceBoardItem 
                        title={board.name} 
                        color="bg-[#3B82F6]" 
                        time={`Updated ${board.updatedAt || 'recently'}`} 
                      />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {ws.boards.map((board: any) => (
                    <Link key={board.id} href={`/boards/${board.id}`} className="block">
                      <MarketingBoardItem title={board.name} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        
        {workspaces.length === 0 && (
           <div className="lg:col-span-5 py-20 text-center border-2 border-dashed border-gray-200 rounded-xl">
             <p className="text-gray-400 font-medium">No workspaces found</p>
             <button className="mt-2 text-[#1565C0] font-bold">Create your first workspace</button>
           </div>
        )}
      </div>
    </section>
  );
};

const WorkspaceBoardItem = ({ title, color, time }: { title: string; color: string; time: string }) => (
  <div className="group flex items-center gap-3 p-3 rounded-lg border border-transparent hover:border-[#E5E7EB] hover:bg-[#F9FAFB] transition-all cursor-pointer">
    <div className={`w-1 h-10 rounded-full ${color}`} />
    <div className="overflow-hidden">
      <h4 className="font-semibold text-sm text-[#111827] truncate">{title}</h4>
      <p className="text-[11px] text-[#6B7280]">{time}</p>
    </div>
  </div>
);

const MarketingBoardItem = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F9FAFB] transition-all cursor-pointer group">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-[#D1D5DB]" />
      <span className="text-sm font-medium text-[#374151]">{title}</span>
    </div>
    <ChevronRight size={16} className="text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
);

export default WorkspaceSection;
