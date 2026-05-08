'use client';

import React from 'react';
import { MessageSquare, Paperclip, CheckSquare, Clock } from 'lucide-react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  id: string | number;
  title: string;
  labels?: { name: string, color: string, textColor?: string }[];
  dueDate?: string;
  commentsCount?: number;
  assignees?: { id: string; name: string; avatarUrl: string }[];
  isCompleted?: boolean;
  coverImage?: string;
  isOverdue?: boolean;
  checklists?: { done: number; total: number };
  attachments?: number;
  priority?: string;
  onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
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
  onClick
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-3 rounded-lg shadow-sm border border-transparent hover:border-[#0079BF] cursor-pointer group transition-all select-none ${isCompleted ? 'opacity-80' : ''}`}
      onClick={(e) => {
        // Prevent click if dragging
        if (transform) return;
        onClick?.();
      }}
    >
      {/* Label Bars */}
      {labels && labels.length > 0 && (
        <div className="flex gap-1 mb-2">
          {labels.map((label, idx) => (
            <span 
              key={idx} 
              className={`h-2 w-10 rounded-full ${label.color}`}
              title={label.name}
            />
          ))}
        </div>
      )}

      {coverImage && (
        <img src={coverImage} alt="Card Cover" className="w-full h-32 object-cover rounded mb-3 pointer-events-none" />
      )}

      <p className={`text-sm font-medium text-slate-900 mb-3 leading-snug ${isCompleted ? 'line-through' : ''}`}>
        {title}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-slate-500">
          {dueDate && (
            <span className={`flex items-center gap-1 text-[11px] ${isOverdue ? 'bg-red-100 text-red-700 px-1 rounded' : ''}`}>
              <Clock className="w-3.5 h-3.5" />
              {dueDate}
            </span>
          )}
          {checklists && (
            <span className="flex items-center gap-1 text-[11px]">
              <CheckSquare className="w-3.5 h-3.5" />
              {checklists.done}/{checklists.total}
            </span>
          )}
          {commentsCount !== undefined && commentsCount > 0 && (
            <span className="flex items-center gap-1 text-[11px]">
              <MessageSquare className="w-3.5 h-3.5" />
              {commentsCount}
            </span>
          )}
          {attachments !== undefined && attachments > 0 && (
            <span className="flex items-center gap-1 text-[11px]">
              <Paperclip className="w-3.5 h-3.5" />
              {attachments}
            </span>
          )}
        </div>

        {/* Assignees */}
        <div className="flex -space-x-1.5">
          {assignees?.map((assignee, i) => (
            <img 
              key={i} 
              src={assignee.avatarUrl} 
              alt={assignee.name} 
              title={assignee.name}
              className="w-6 h-6 rounded-full border border-white bg-slate-200" 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
