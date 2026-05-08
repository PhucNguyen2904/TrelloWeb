import React from 'react';

interface WorkspaceMiniCardProps {
  title: string;
  updatedAt: string;
  color: string;
}

const WorkspaceMiniCard: React.FC<WorkspaceMiniCardProps> = ({ title, updatedAt, color }) => {
  return (
    <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/30 flex items-center gap-4 hover:border-primary/50 cursor-pointer transition-all">
      <div className={`w-2 h-10 ${color} rounded-full`}></div>
      <div>
        <h4 className="font-h3 text-h3 text-sm font-semibold">{title}</h4>
        <p className="text-xs text-outline">{updatedAt}</p>
      </div>
    </div>
  );
};

export default WorkspaceMiniCard;
