import React from 'react';
import { Star, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface BoardCardProps {
  title: string;
  coverImage?: string;
  gradient?: string;
  color?: string;
  isStarred?: boolean;
  memberAvatars?: string[];
  extraMembers?: number;
  isCreateNew?: boolean;
  onClick?: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}

const gradientPresets: Record<string, string> = {
  navyBlue:       'linear-gradient(135deg,#0f1f6e 0%,#1a3a8f 45%,#2563eb 100%)',
  burntAmber:     'linear-gradient(135deg,#7c3a00 0%,#b85c00 45%,#d4820a 100%)',
  forestDeep:     'linear-gradient(135deg,#1a3a0f 0%,#2d6a1f 45%,#3d8b2e 100%)',
  deepRust:       'linear-gradient(135deg,#7f1d1d 0%,#b91c1c 45%,#f97316 100%)',
  midnightPurple: 'linear-gradient(135deg,#1e0533 0%,#581c87 45%,#a855f8 100%)',
  roseDark:       'linear-gradient(135deg,#4a0522 0%,#9f1239 45%,#f43f5e 100%)',
  jungleMoss:     'linear-gradient(135deg,#1a2e05 0%,#365314 45%,#84cc16 100%)',
  arcticMint:     'linear-gradient(135deg,#082f49 0%,#0369a1 45%,#22d3ee 100%)',
  slateMetal:     'linear-gradient(135deg,#0f172a 0%,#334155 45%,#64748b 100%)',
};

const BoardCard: React.FC<BoardCardProps> = ({
  title,
  coverImage,
  gradient,
  color,
  isStarred = false,
  memberAvatars = [],
  extraMembers = 0,
  isCreateNew = false,
  onClick,
  onDelete
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

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(e);
    }
  };

  // Determine final gradient: prop > preset from color key > none
  const finalGradient = gradient || (color ? gradientPresets[color] : undefined);
  // Only use color as background if it's NOT a preset key (i.e. it's likely a hex code)
  const isHexColor = color && !gradientPresets[color];

  return (
    <div className="group relative bg-white rounded-xl shadow-sm overflow-hidden border border-[#E5E7EB] hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer h-[180px] flex flex-col">
      {/* Cover Image or Gradient */}
      <div 
        className={`h-[100px] w-full relative shrink-0 ${!isHexColor && !finalGradient ? 'bg-slate-200' : ''}`}
        style={{ 
          backgroundColor: isHexColor ? color : undefined,
          background: finalGradient ? finalGradient : undefined 
        }}
      >
        {coverImage && (
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
        )}
        
        {/* Delete Button - Visible on Hover */}
        {onDelete && (
          <button 
            onClick={handleDelete}
            className="absolute top-2 right-2 p-1.5 bg-black/20 hover:bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-all z-10"
            title="Delete board"
          >
            <Trash2 size={16} />
          </button>
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
