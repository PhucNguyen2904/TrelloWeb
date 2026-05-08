'use client';

import React from 'react';
import { 
  Star, 
  ChevronDown, 
  Plus, 
  Filter, 
  ArrowUpDown, 
  Zap, 
  Settings, 
  UserPlus,
  Layout as LayoutIcon,
  List as ListIcon,
  Calendar as CalendarIcon,
  Clock,
  BarChart3,
  MoreHorizontal
} from 'lucide-react';

interface BoardHeaderProps {
  workspaceName?: string;
  boardName: string;
  isStarred?: boolean;
}

const BoardHeader: React.FC<BoardHeaderProps> = ({ workspaceName, boardName, isStarred = false }) => {
  return (
    <div className="bg-white border-b border-slate-200 flex flex-col shrink-0">
      {/* Top Row: Title, Members, Actions */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer group">
            <h1 className="text-xl font-bold text-slate-900 leading-none">{boardName}</h1>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
          </div>
          
          <button className={`p-1.5 rounded-md hover:bg-slate-100 transition-colors ${isStarred ? 'text-yellow-400' : 'text-slate-400'}`}>
            <Star className="w-5 h-5" fill={isStarred ? "currentColor" : "none"} />
          </button>

          <div className="h-6 w-px bg-slate-200 mx-2" />

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2].map((i) => (
                <img 
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm" 
                  src={`https://lh3.googleusercontent.com/aida-public/AB6AXuDBQCs1z3NjFpaQncW8ZtK5dJYpdJ4dI1WulnsTvgqOLhNjC8Xu4_K95WyoKlI5cBBcvQG6Uat_kVUpvx_ihAxh0XSDb6rneXiJLXOfAtsh7Wl8ld32hmNolrEJqni7OrBiYWK11a46HRswk6BnFXKSF1F2KmrWVNbjKjjM9KTJoGX8o5WWez1svuuGA2d-aVfKcszuPBLGyg63oqHv1dqdQMDrWShxEaLhEJ7HksZ7QNP8KkrYvQjRONTyK5sCkptcwLo_O7fWjeI`} 
                  alt="Member"
                />
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">+3</div>
            </div>
            <button className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-all">
              <UserPlus className="w-4 h-4" />
              <span>Invite</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 mr-2">
            <button className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
              <ArrowUpDown className="w-4 h-4" />
              <span>Sort</span>
            </button>
            <button className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
              <Zap className="w-4 h-4" />
              <span>Automation</span>
            </button>
            <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
          
          <button className="bg-[#1976D2] hover:bg-[#1565C0] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all">
            <Plus className="w-4 h-4" />
            <span>Add List</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: View Tabs */}
      <div className="px-6 flex items-center gap-6 overflow-x-auto no-scrollbar">
        <ViewTab icon={<LayoutIcon className="w-4 h-4" />} label="Board" active />
        <ViewTab icon={<ListIcon className="w-4 h-4" />} label="List" />
        <ViewTab icon={<Clock className="w-4 h-4" />} label="Timeline" />
        <ViewTab icon={<CalendarIcon className="w-4 h-4" />} label="Calendar" />
        <ViewTab icon={<BarChart3 className="w-4 h-4" />} label="Dashboard" />
      </div>
    </div>
  );
};

const ViewTab = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <button className={`flex items-center gap-2 py-3 px-1 border-b-2 transition-all whitespace-nowrap ${active ? 'border-[#1976D2] text-[#1976D2] font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
    {icon}
    <span className="text-sm">{label}</span>
  </button>
);

export default BoardHeader;
