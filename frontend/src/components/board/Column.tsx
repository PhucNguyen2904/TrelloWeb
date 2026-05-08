'use client';

import React from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';

interface ColumnProps {
  title: string;
  icon?: React.ReactNode;
  count?: number;
  color?: string;
  children?: React.ReactNode;
  onAddCard?: () => void;
}

const Column: React.FC<ColumnProps> = ({ title, icon, count = 0, color = 'bg-slate-500', children, onAddCard }) => {
  return (
    <div className="flex flex-col min-w-[300px] max-w-[300px] max-h-full">
      <div className="flex items-center justify-between mb-4 px-1 shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
          <h2 className="font-bold text-slate-700 flex items-center gap-2">
            {title}
            <span className="text-slate-400 font-medium">({count})</span>
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={onAddCard}
            className="p-1.5 hover:bg-white/50 rounded-md text-slate-500 hover:text-[#1976D2] transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-white/50 rounded-md text-slate-500 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-3 pb-4">
        {children}
        
        {/* Empty state / Add card button at bottom if needed */}
        {count === 0 ? (
          <button 
            onClick={onAddCard}
            className="w-full py-8 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-[#1976D2] hover:border-[#1976D2] hover:bg-white/50 transition-all group"
          >
            <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Add a card</span>
          </button>
        ) : (
           <button 
            onClick={onAddCard}
            className="w-full p-3 flex items-center gap-2 text-slate-500 hover:text-[#1976D2] hover:bg-white/50 rounded-xl border border-transparent hover:border-slate-200 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add a card</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Column;
