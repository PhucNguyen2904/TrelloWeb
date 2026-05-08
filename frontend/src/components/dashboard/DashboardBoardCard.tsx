import React from 'react';

interface DashboardBoardCardProps {
  title: string;
  bgGradient: string;
  bgImage?: string;
  isStarred?: boolean;
  members: string[];
}

const DashboardBoardCard: React.FC<DashboardBoardCardProps> = ({ 
  title, 
  bgGradient, 
  bgImage, 
  isStarred = false, 
  members 
}) => {
  return (
    <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden border border-outline-variant hover:shadow-md transition-all cursor-pointer">
      <div className={`h-24 ${bgGradient} relative`}>
        {bgImage && (
          <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}></div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-h3 text-h3 text-on-surface group-hover:text-primary transition-colors">{title}</h3>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex -space-x-2">
            {members.map((src, i) => (
              <img key={i} src={src} alt="Avatar" className="w-6 h-6 rounded-full border-2 border-white" />
            ))}
            <div className="w-6 h-6 rounded-full border-2 border-white bg-surface-container-low flex items-center justify-center text-[10px] font-bold text-outline">+3</div>
          </div>
          <span 
            className={`material-symbols-outlined transition-colors ${isStarred ? 'text-yellow-400' : 'text-outline-variant group-hover:text-outline'}`}
            style={isStarred ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            star
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardBoardCard;
