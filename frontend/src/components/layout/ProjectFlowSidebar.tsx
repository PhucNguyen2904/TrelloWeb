import React from 'react';

const ProjectFlowSidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-topbar bottom-0 z-40 w-sidebar_width border-r border-outline-variant bg-surface dark:bg-slate-950">
      <div className="p-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">E</div>
        <div>
          <h3 className="text-lg font-bold text-on-surface leading-none">Engineering Team</h3>
          <p className="text-[10px] text-outline uppercase tracking-wider font-bold">Premium Workspace</p>
        </div>
      </div>
      
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <NavItem icon="dashboard" label="Boards" active />
        <NavItem icon="group" label="Members" />
        <NavItem icon="settings" label="Workspace Settings" />
        <NavItem icon="analytics" label="Analytics" />
        <NavItem icon="calendar_month" label="Calendar" />
      </div>

      <div className="px-4 py-4">
        <button className="w-full py-2 bg-primary text-white rounded-sm text-sm font-medium hover:bg-primary-container transition-colors shadow-sm">
          Invite Members
        </button>
      </div>

      <div className="p-4 border-t border-outline-variant space-y-1">
        <NavItem icon="help" label="Help Center" />
        <NavItem icon="logout" label="Logout" />
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label, active = false }: { icon: string, label: string, active?: boolean }) => (
  <div className={`
    flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 active:scale-95
    ${active 
      ? 'bg-white dark:bg-slate-900 text-primary border-l-4 border-primary font-semibold' 
      : 'text-outline hover:bg-surface-container-low hover:translate-x-1'}
  `}>
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
    <span className="font-sans text-sm">{label}</span>
  </div>
);

export default ProjectFlowSidebar;
