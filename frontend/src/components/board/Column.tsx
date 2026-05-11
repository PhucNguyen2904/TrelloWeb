'use client';

import React from 'react';
import { Plus, MoreHorizontal, Trash2 } from 'lucide-react';

interface ColumnProps {
  title: string;
  count?: number;
  icon?: string;
  color?: string;
  children?: React.ReactNode;
  onAddCard?: () => void;
  onDelete?: () => void;
}

const Column: React.FC<ColumnProps> = ({ title, count = 0, icon, children, onAddCard, onDelete }) => {
  return (
    <div className="w-[300px] shrink-0 bg-[#f1f3fa] rounded-lg flex flex-col max-h-full shadow-lg">
      <div className="p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <h2 className="text-sm font-black text-slate-800 px-1 uppercase tracking-tight">{title}</h2>
          <span className="bg-slate-200 text-slate-600 text-[10px] font-black px-1.5 py-0.5 rounded-full">{count}</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={onDelete}
            className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded text-slate-400 transition-all"
            title="Delete list"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-slate-200 rounded text-slate-400 transition-all">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-2 space-y-2 pb-2 custom-scrollbar">
        {children}
      </div>

      <div className="p-2 shrink-0">
        <button 
          onClick={onAddCard}
          className="w-full text-left px-2 py-2 text-slate-600 hover:bg-slate-200 rounded flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm font-medium">Add a card</span>
        </button>
      </div>
    </div>
  );
};

export default Column;
