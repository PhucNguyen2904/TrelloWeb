'use client';

import React from 'react';
import { Settings, MoreHorizontal, ChevronRight } from 'lucide-react';

interface MiniBoardProps {
  title: string;
  updatedAt: string;
  color: string;
}

const MiniBoard: React.FC<MiniBoardProps> = ({ title, updatedAt, color }) => (
  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-3 hover:border-blue-200 hover:bg-blue-50/30 cursor-pointer transition-all">
    <div 
      className={`w-1.5 h-8 rounded-full ${!color.startsWith('#') ? color : ''}`} 
      style={color.startsWith('#') ? { backgroundColor: color } : {}} 
    />
    <div className="min-w-0">
      <h4 className="text-sm font-semibold text-slate-800 truncate">{title}</h4>
      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">{updatedAt}</p>
    </div>
  </div>
);

interface WorkspaceCardProps {
  name: string;
  initial: string;
  boardsCount: number;
  membersCount?: number;
  type?: 'grid' | 'list';
  boards?: { title: string; updatedAt: string; color: string }[];
}

const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  name,
  initial,
  boardsCount,
  membersCount,
  type = 'grid',
  boards = [],
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-inner">
            {initial}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">{name}</h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              {boardsCount} Boards {membersCount !== undefined && `• ${membersCount} Members`}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {type === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {boards.slice(0, 4).map((board, idx) => (
            <MiniBoard key={idx} {...board} />
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {boards.slice(0, 3).map((board, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-lg cursor-pointer group transition-colors">
              <div className="flex items-center gap-3">
                <div 
                  className={`w-2 h-2 rounded-full ${!board.color.startsWith('#') ? board.color : ''}`} 
                  style={board.color.startsWith('#') ? { backgroundColor: board.color } : {}} 
                />
                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600">{board.title}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400" />
            </div>
          ))}
          <button className="w-full text-left p-2.5 text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all mt-2">
            See {boardsCount - 3} more boards
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkspaceCard;
