'use client';

import React from 'react';
import { 
  MessageSquare, 
  Paperclip, 
  CheckSquare, 
  Clock, 
  Zap, 
  GripVertical 
} from 'lucide-react';

interface TaskCardProps {
  title: string;
  labels?: { name: string, color: string, textColor: string }[];
  dueDate?: string;
  commentsCount?: number;
  assignees?: string[];
  isCompleted?: boolean;
  coverImage?: string;
  isOverdue?: boolean;
  checklists?: { done: number; total: number };
  attachments?: number;
  priority?: 'High' | 'Medium' | 'Low';
  onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  labels,
  dueDate,
  commentsCount,
  assignees,
  isCompleted,
  coverImage,
  isOverdue,
  checklists,
  attachments,
  priority,
  onClick
}) => {
  const getPriorityInfo = (p?: string) => {
    switch (p) {
      case 'High': return { icon: <Zap className="w-3.5 h-3.5" fill="currentColor" />, color: 'text-red-600 bg-red-50', label: 'High' };
      case 'Medium': return { icon: <Zap className="w-3.5 h-3.5" />, color: 'text-amber-600 bg-amber-50', label: 'Medium' };
      case 'Low': return { icon: <Zap className="w-3.5 h-3.5" />, color: 'text-slate-500 bg-slate-50', label: 'Low' };
      default: return null;
    }
  };

  const priorityInfo = getPriorityInfo(priority);

  return (
    <div 
      className={`bg-white rounded-xl border border-slate-200 cursor-pointer group transition-all relative overflow-hidden active:rotate-1 active:scale-[0.98] shadow-sm hover:shadow-md hover:border-slate-300 ${isCompleted ? 'opacity-75' : ''}`}
      onClick={onClick}
    >
      {/* Drag Handle */}
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300">
        <GripVertical className="w-4 h-4" />
      </div>

      {coverImage && (
        <img src={coverImage} alt="Cover" className="w-full h-32 object-cover" />
      )}
      
      <div className="p-4">
        {/* Labels */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {labels?.map((label, idx) => (
            <span 
              key={idx} 
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${label.color} ${label.textColor}`}
            >
              {label.name}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className={`text-sm font-medium text-slate-800 mb-4 leading-relaxed group-hover:text-[#1976D2] transition-colors ${isCompleted ? 'line-through decoration-slate-400' : ''}`}>
          {title}
        </h3>

        {/* Metadata Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {priorityInfo && (
              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${priorityInfo.color}`}>
                {priorityInfo.icon}
                <span>{priorityInfo.label}</span>
              </div>
            )}

            {dueDate && (
              <div className={`flex items-center gap-1 text-[10px] font-bold uppercase ${isCompleted ? 'text-green-600' : isOverdue ? 'text-red-600 bg-red-50 px-1.5 py-0.5 rounded' : 'text-slate-500'}`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{dueDate}</span>
              </div>
            )}

            {checklists && (
              <div className={`flex items-center gap-1 text-[10px] font-bold ${checklists.done === checklists.total ? 'text-green-600' : 'text-slate-500'}`}>
                <CheckSquare className="w-3.5 h-3.5" />
                <span>{checklists.done}/{checklists.total}</span>
              </div>
            )}

            {commentsCount !== undefined && commentsCount > 0 && (
              <div className="flex items-center gap-1 text-slate-400">
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold">{commentsCount}</span>
              </div>
            )}
          </div>

          {/* Assignees */}
          {assignees && assignees.length > 0 && (
            <div className="flex -space-x-1.5">
              {assignees.map((src, i) => (
                <img key={i} src={src} alt="user" className="w-6 h-6 rounded-full border-2 border-white shadow-sm" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
