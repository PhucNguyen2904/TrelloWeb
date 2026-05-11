'use client';

import React, { useState } from 'react';
import { Star, Filter, MoreHorizontal, Users, Trash2, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { deleteBoard } from '@/lib/api';
import { useToast } from '@/store/useToastStore';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';

interface BoardHeaderProps {
  boardId: string | number;
  workspaceName?: string;
  boardName: string;
  isStarred?: boolean;
  ownerId?: number;
}

const BoardHeader: React.FC<BoardHeaderProps> = ({ boardId, boardName, workspaceName, isStarred = false, ownerId }) => {
  const router = useRouter();
  const toast = useToast();
  const { user: currentUser } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = ownerId === currentUser?.id || currentUser?.role?.name === 'admin' || currentUser?.role?.name === 'superadmin';

  const handleDeleteBoard = async () => {
    setIsDeleting(true);
    try {
      await deleteBoard(boardId);
      toast.success('Board deleted successfully');
      router.push('/boards');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to delete board');
    } finally {
      setIsDeleting(false);
      setIsConfirmDeleteOpen(false);
    }
  };

  return (
    <header className="bg-black/30 backdrop-blur-xl px-6 py-3 flex items-center justify-between text-white border-b border-white/10 sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          {workspaceName && <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">{workspaceName}</span>}
          <h1 className="text-2xl font-bold tracking-tight drop-shadow-sm leading-tight">{boardName}</h1>
        </div>
        <button className={`p-1 hover:bg-white/10 rounded transition-colors mt-auto ${isStarred ? 'text-yellow-400' : 'text-white/80'}`}>
          <Star className="w-5 h-5" fill={isStarred ? "currentColor" : "none"} />
        </button>
        
        <div className="h-6 w-px bg-white/20 mx-2" />
        
        <Link 
          href={`/boards/${boardId}/members`}
          className="flex items-center -space-x-2 hover:opacity-80 transition-opacity"
        >
          {[1, 2, 3].map((i) => (
            <img 
              key={i}
              className="w-7 h-7 rounded-full border-2 border-slate-800 shadow-sm" 
              src={`https://i.pravatar.cc/100?img=${i + 10}`} 
              alt="Member"
            />
          ))}
          <div className="w-7 h-7 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-[10px] font-bold">+5</div>
        </Link>
      </div>

      <div className="flex items-center gap-4 relative">
        <Link 
          href={`/boards/${boardId}/members`}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors text-sm font-medium"
        >
          <Users className="w-4 h-4" />
          <span>Members</span>
        </Link>

        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors text-sm font-medium">
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>

        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors text-sm font-medium ${isMenuOpen ? 'bg-white/20' : ''}`}
          >
            <MoreHorizontal className="w-4 h-4" />
            <span>Show menu</span>
          </button>

          {isMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-slate-50 mb-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Board Menu</p>
                </div>
                
                <Link 
                  href={`/boards/${boardId}/members`}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>Manage Members</span>
                </Link>

                {isOwner && (
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsConfirmDeleteOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Board</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsConfirmDeleteOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Board?</h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to delete <span className="font-bold text-slate-800">"{boardName}"</span>? 
              This action is permanent and will remove all tasks, lists, and data associated with this board.
            </p>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmDeleteOpen(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBoard}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all shadow-md shadow-red-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : 'Yes, Delete Board'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default BoardHeader;
