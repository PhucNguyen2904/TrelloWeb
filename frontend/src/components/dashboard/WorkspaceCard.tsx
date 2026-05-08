import React from 'react';
import WorkspaceMiniCard from './WorkspaceMiniCard';

interface WorkspaceCardProps {
  name: string;
  initials: string;
  stats: string;
  boards: { title: string; updatedAt: string; color: string }[];
}

const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ name, initials, stats, boards }) => {
  return (
    <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-outline-variant p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-container rounded-lg flex items-center justify-center text-white font-bold text-xl">
            {initials}
          </div>
          <div>
            <h3 className="font-h2 text-h2 text-on-surface">{name}</h3>
            <p className="font-body-md text-body-md text-outline">{stats}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-surface-container-low rounded transition-colors">
            <span className="material-symbols-outlined text-outline">settings</span>
          </button>
          <button className="p-2 hover:bg-surface-container-low rounded transition-colors">
            <span className="material-symbols-outlined text-outline">more_horiz</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {boards.map((board, i) => (
          <WorkspaceMiniCard key={i} {...board} />
        ))}
      </div>
    </div>
  );
};

export default WorkspaceCard;
