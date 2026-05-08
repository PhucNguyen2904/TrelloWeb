'use client';

import React from 'react';
import { Star } from 'lucide-react';
import Image from 'next/image';

interface BoardCardProps {
  title: string;
  coverImage?: string;
  gradient?: string;
  isStarred?: boolean;
  memberAvatars?: string[];
  extraMembers?: number;
  isCreateNew?: boolean;
  onClick?: () => void;
}

const BoardCard: React.FC<BoardCardProps> = ({
  title,
  coverImage,
  gradient,
  isStarred = false,
  memberAvatars = [],
  extraMembers = 0,
  isCreateNew = false,
  onClick
}) => {
  if (isCreateNew) {
    return (
      <div 
        onClick={onClick}
        className="group relative bg-transparent rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 hover:bg-[#EFF6FF] hover:border-[#1565C0] hover:text-[#1565C0] transition-all cursor-pointer h-[180px]"
      >
        <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 group-hover:border-[#1565C0] group-hover:text-[#1565C0] transition-colors mb-2">
          <span className="text-xl font-light">+</span>
        </div>
        <p className="text-sm font-medium text-gray-400 group-hover:text-[#1565C0]">Create new board</p>
      </div>
    );
  }

  return (
    <div className="group relative bg-white rounded-xl shadow-sm overflow-hidden border border-[#E5E7EB] hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer h-[180px] flex flex-col">
      {/* Cover Image or Gradient */}
      <div className={`h-[100px] w-full relative shrink-0 ${gradient || 'bg-slate-200'}`}>
        {coverImage && (
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <h3 className="font-semibold text-[#111827] text-[15px] truncate">{title}</h3>
        <div className="flex items-center justify-between mt-1">
          <div className="flex -space-x-2">
            {memberAvatars.map((avatar, idx) => (
              <div key={idx} className="w-6 h-6 rounded-full border-2 border-white overflow-hidden bg-slate-100 relative">
                <Image 
                  src={avatar} 
                  alt="Member" 
                  fill 
                  sizes="24px"
                  className="object-cover" 
                />
              </div>
            ))}
            {extraMembers > 0 && (
              <div className="w-6 h-6 rounded-full border-2 border-white bg-[#F3F4F6] flex items-center justify-center text-[10px] font-bold text-[#6B7280]">
                +{extraMembers}
              </div>
            )}
          </div>
          <button className={`transition-colors ${isStarred ? 'text-[#F59E0B]' : 'text-gray-300 hover:text-gray-400'}`}>
            <Star className="w-5 h-5" fill={isStarred ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
