'use client';

import React from 'react';
import { Star, Filter, MoreHorizontal } from 'lucide-react';

interface BoardHeaderProps {
  boardName: string;
  isStarred?: boolean;
}

const BoardHeader: React.FC<BoardHeaderProps> = ({ boardName, isStarred = false }) => {
  return (
    <header className="bg-black/30 backdrop-blur-xl px-6 py-3 flex items-center justify-between text-white border-b border-white/10 sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight drop-shadow-sm">{boardName}</h1>
        <button className={`p-1 hover:bg-white/10 rounded transition-colors ${isStarred ? 'text-yellow-400' : 'text-white/80'}`}>
          <Star className="w-5 h-5" fill={isStarred ? "currentColor" : "none"} />
        </button>
        
        <div className="h-6 w-px bg-white/20 mx-2" />
        
        <div className="flex items-center -space-x-2">
          {[1, 2, 3].map((i) => (
            <img 
              key={i}
              className="w-7 h-7 rounded-full border-2 border-slate-800 shadow-sm" 
              src={`https://i.pravatar.cc/100?img=${i + 10}`} 
              alt="Member"
            />
          ))}
          <div className="w-7 h-7 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-[10px] font-bold">+5</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors text-sm font-medium">
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>
        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors text-sm font-medium">
          <MoreHorizontal className="w-4 h-4" />
          <span>Show menu</span>
        </button>
      </div>
    </header>
  );
};

export default BoardHeader;
