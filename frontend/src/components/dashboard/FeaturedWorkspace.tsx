import React from 'react';

interface FeaturedWorkspaceProps {
  tag: string;
  name: string;
  description: string;
  ctaText: string;
  image: string;
  avatars: string[];
}

const FeaturedWorkspace: React.FC<FeaturedWorkspaceProps> = ({ 
  tag, 
  name, 
  description, 
  ctaText, 
  image, 
  avatars 
}) => {
  return (
    <div className="md:col-span-3 bg-surface-container-low/50 rounded-xl border border-outline-variant p-8 flex flex-col md:flex-row items-center gap-8">
      <div className="flex-1 text-center md:text-left">
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 inline-block">
          {tag}
        </span>
        <h2 className="font-h1 text-h1 text-on-surface mb-2">{name}</h2>
        <p className="font-body-lg text-body-lg text-outline max-w-lg mb-6">
          {description}
        </p>
        <div className="flex items-center gap-4 justify-center md:justify-start">
          <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold hover:shadow-lg transition-all">
            {ctaText}
          </button>
          <div className="flex items-center -space-x-2">
            {avatars.map((src, i) => (
              <img key={i} src={src} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-white" />
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-outline">+18</div>
          </div>
        </div>
      </div>
      
      <div className="relative w-full md:w-96 aspect-video rounded-xl overflow-hidden shadow-2xl border-4 border-white">
        <img src={image} alt="Workspace Preview" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
          <p className="text-white font-semibold text-sm">Workspace Overview</p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedWorkspace;
