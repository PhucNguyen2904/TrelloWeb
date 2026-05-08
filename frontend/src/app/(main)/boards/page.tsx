'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import RecentlyViewed from '@/components/boards/RecentlyViewed';
import WorkspaceSection from '@/components/boards/WorkspaceSection';
import FeaturedWorkspace from '@/components/boards/FeaturedWorkspace';
import CreateBoardModal from '@/components/boards/CreateBoardModal';
import { createBoard } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function BoardsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleSaveNewBoard = async (boardData: { name: string, description?: string }) => {
    try {
      const newBoard = await createBoard(boardData);
      // Refresh boards list
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      
      // Navigate to the new board
      if (newBoard && newBoard.id) {
        router.push(`/boards/${newBoard.id}`);
      }
      
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error("Failed to create board:", err);
      // Optional: Add toast notification here
    }
  };

  return (
    <div className="flex-1 bg-[#F0F2F5]">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Recently Viewed Section */}
        <RecentlyViewed onCreateClick={() => setIsCreateModalOpen(true)} />

        {/* Your Workspaces Section */}
        <WorkspaceSection />

        {/* Featured Workspace Banner */}
        <FeaturedWorkspace />
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#1565C0] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 hover:bg-[#1e40af] transition-all z-50 group"
        aria-label="Create new board"
      >
        <Plus size={28} className="transition-transform group-hover:rotate-90" />
      </button>

      {/* Create Board Modal */}
      <CreateBoardModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveNewBoard}
      />
    </div>
  );
}
