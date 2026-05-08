import React from 'react';

interface WorkspaceSidebarCardProps {
  name: string;
  initials: string;
  boardCount: number;
  featuredBoards: string[];
}

const WorkspaceSidebarCard: React.FC<WorkspaceSidebarCardProps> = ({ 
  name, 
  initials, 
  boardCount, 
  featuredBoards 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-outline-variant p-6 flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-outline-variant rounded-lg flex items-center justify-center text-white font-bold text-xl">
          {initials}
        </div>
        <div>
          <h3 className="font-h3 text-h3 text-on-surface">{name}</h3>
          <p className="font-body-md text-body-md text-outline text-xs">{boardCount} Boards</p>
        </div>
      </div>
      
      <div className="space-y-4 flex-1">
        {featuredBoards.map((board, i) => (
          <div key={i} className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xs text-outline-variant group-hover:text-primary">radio_button_checked</span>
              <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">{board}</span>
            </div>
            <span className="material-symbols-outlined text-sm text-outline-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-4 border-t border-surface-container-low">
        <button className="w-full py-2 bg-surface-container-low text-outline rounded font-semibold text-xs hover:bg-surface-container-highest hover:text-on-surface transition-colors">
          See more boards
        </button>
      </div>
    </div>
  );
};

export default WorkspaceSidebarCard;
