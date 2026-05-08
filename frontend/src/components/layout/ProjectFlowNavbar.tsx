import React from 'react';

const ProjectFlowNavbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between px-4 h-topbar w-full sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-outline-variant shadow-sm">
      <div className="flex items-center gap-6">
        <span className="text-xl font-black text-primary tracking-tight font-h2">ProjectFlow</span>
        <div className="hidden md:flex items-center gap-1">
          <a className="px-3 py-2 text-primary border-b-2 border-primary pb-4 font-sans text-sm font-medium transition-all duration-200" href="#">Workspaces</a>
          <a className="px-3 py-2 text-outline hover:text-on-surface font-sans text-sm font-medium transition-all duration-200" href="#">Recent</a>
          <a className="px-3 py-2 text-outline hover:text-on-surface font-sans text-sm font-medium transition-all duration-200" href="#">Starred</a>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
          <input 
            className="pl-9 pr-4 py-1.5 bg-surface-container-low border-none rounded-md text-sm w-64 focus:ring-2 focus:ring-primary outline-none transition-all" 
            placeholder="Search" 
            type="text"
          />
        </div>
        <button className="bg-primary text-white px-4 py-1.5 rounded-sm font-medium text-sm hover:bg-primary-container transition-all">
          Create
        </button>
        <div className="flex items-center gap-1 text-outline">
          <span className="material-symbols-outlined p-2 hover:bg-surface-container-low rounded-full cursor-pointer">notifications</span>
          <span className="material-symbols-outlined p-2 hover:bg-surface-container-low rounded-full cursor-pointer">help</span>
          <span className="material-symbols-outlined p-2 hover:bg-surface-container-low rounded-full cursor-pointer">settings</span>
        </div>
        <img 
          alt="User profile" 
          className="w-8 h-8 rounded-full ml-2 border border-outline-variant" 
          src="https://i.pravatar.cc/100?img=12" 
        />
      </div>
    </nav>
  );
};

export default ProjectFlowNavbar;
