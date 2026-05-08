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
}

const BoardCard: React.FC<BoardCardProps> = ({
  title,
  coverImage,
  gradient,
  isStarred = false,
  memberAvatars = [],
  extraMembers = 0,
  isCreateNew = false,
}) => {
  if (isCreateNew) {
    return (
      <div className="group relative bg-slate-100/50 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-6 hover:bg-slate-100 hover:border-[#1976D2] transition-all cursor-pointer h-32 lg:h-40">
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center group-hover:bg-[#1976D2] group-hover:text-white transition-colors">
          <span className="text-2xl font-light">+</span>
        </div>
        <p className="text-xs font-semibold text-slate-600 mt-3 uppercase tracking-wider">Create new board</p>
      </div>
    );
  }

  return (
    <div className="group relative bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 hover:shadow-md transition-all cursor-pointer">
      {/* Cover Image or Gradient */}
      <div className={`h-24 lg:h-28 relative ${gradient || 'bg-slate-200'}`}>
        {coverImage && (
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-slate-900 group-hover:text-[#1976D2] transition-colors truncate">{title}</h3>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex -space-x-2">
            {memberAvatars.map((avatar, idx) => (
              <div key={idx} className="w-6 h-6 rounded-full border-2 border-white overflow-hidden bg-slate-100 relative">
                <Image src={avatar} alt="Member" fill className="object-cover" />
              </div>
            ))}
            {extraMembers > 0 && (
              <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                +{extraMembers}
              </div>
            )}
          </div>
          <button className={`transition-colors ${isStarred ? 'text-yellow-400' : 'text-slate-300 group-hover:text-slate-500'}`}>
            <Star className="w-5 h-5" fill={isStarred ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
