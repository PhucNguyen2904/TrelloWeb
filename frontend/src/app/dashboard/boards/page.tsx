'use client';

import React from 'react';
import { Clock, ChevronRight, Workcase } from 'lucide-react';
import BoardCard from '@/components/boards/BoardCard';
import WorkspaceCard from '@/components/boards/WorkspaceCard';
import FeaturedWorkspace from '@/components/boards/FeaturedWorkspace';

export default function BoardsOverviewPage() {
  const recentBoards = [
    {
      id: '1',
      title: 'Website Redesign',
      gradient: 'bg-gradient-to-br from-[#0079BF] to-[#5067C5]',
      memberAvatars: ['https://i.pravatar.cc/100?img=11', 'https://i.pravatar.cc/100?img=12'],
      extraMembers: 3,
      isStarred: false,
    },
    {
      id: '2',
      title: 'Marketing Q4',
      gradient: 'bg-gradient-to-br from-[#519839] to-[#86BC25]',
      memberAvatars: ['https://i.pravatar.cc/100?img=13'],
      extraMembers: 1,
      isStarred: true,
    },
    {
      id: '3',
      title: 'User Research',
      gradient: 'bg-gradient-to-br from-[#D29034] to-[#F1B15E]',
      memberAvatars: ['https://i.pravatar.cc/100?img=14', 'https://i.pravatar.cc/100?img=15'],
      extraMembers: 0,
      isStarred: false,
    }
  ];

  const engineeringBoards = [
    { title: 'Sprint Backlog', updatedAt: 'Updated 2h ago', color: 'bg-blue-500' },
    { title: 'CI/CD Pipeline', updatedAt: 'Updated 1d ago', color: 'bg-green-500' },
    { title: 'Bug Tracking', updatedAt: 'Updated 4h ago', color: 'bg-purple-500' },
    { title: 'Infrastructure', updatedAt: 'Updated 5d ago', color: 'bg-orange-500' },
  ];

  const marketingBoards = [
    { title: 'Social Media Plan', color: 'bg-pink-500', updatedAt: '' },
    { title: 'Q4 Ad Campaigns', color: 'bg-sky-500', updatedAt: '' },
    { title: 'Content Calendar', color: 'bg-amber-500', updatedAt: '' },
  ];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar bg-[#f8f9fa] p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section 1: Recently Viewed */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Clock className="w-5 h-5 text-slate-400" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recently viewed</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentBoards.map((board) => (
              <BoardCard key={board.id} {...board} />
            ))}
            <BoardCard title="" isCreateNew={true} />
          </div>
        </section>

        {/* Section 2: Your Workspaces */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">Your Workspaces</span>
            </div>
            <button className="text-[#1976D2] font-bold text-sm flex items-center gap-1 hover:underline transition-all">
              View all workspaces
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <WorkspaceCard 
                name="Engineering Team" 
                initial="E" 
                boardsCount={12} 
                membersCount={24} 
                type="grid"
                boards={engineeringBoards}
              />
            </div>
            <div>
              <WorkspaceCard 
                name="Marketing" 
                initial="M" 
                boardsCount={8} 
                type="list"
                boards={marketingBoards}
              />
            </div>
          </div>
        </section>

        {/* Section 3: Featured Workspace */}
        <section className="pb-12">
          <FeaturedWorkspace />
        </section>

      </div>
    </div>
  );
}
