import React from 'react';
import ProjectFlowNavbar from '@/components/layout/ProjectFlowNavbar';
import ProjectFlowSidebar from '@/components/layout/ProjectFlowSidebar';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarGrid from '@/components/calendar/CalendarGrid';
import CalendarDay from '@/components/calendar/CalendarDay';
import CalendarEvent from '@/components/calendar/CalendarEvent';
import FloatingActionButton from '@/components/ui/FloatingActionButton';

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-on-background">
      <ProjectFlowNavbar />
      
      <div className="flex">
        <ProjectFlowSidebar />
        
        <main className="flex-1 md:ml-sidebar_width p-4 lg:p-6 transition-all">
          {/* Board Info Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <h1 className="font-h1 text-h1 text-on-surface">Development Board</h1>
              <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors">star</span>
              <div className="h-6 w-px bg-outline-variant mx-2"></div>
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-label-sm">Public</span>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <div className="flex -space-x-2 mr-2">
                {[1, 2, 3].map((i) => (
                  <img 
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white" 
                    src={`https://i.pravatar.cc/100?img=${i + 20}`} 
                    alt="team member" 
                  />
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-high flex items-center justify-center text-xs font-bold">+5</div>
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 text-body-md font-body-md text-on-surface-variant bg-surface-container hover:bg-surface-container-high rounded transition-all">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                <span>Filters</span>
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 text-body-md font-body-md text-on-surface-variant bg-surface-container hover:bg-surface-container-high rounded transition-all">
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Calendar Controls */}
          <CalendarHeader currentMonth="October 2023" />

          {/* Calendar Grid */}
          <CalendarGrid>
            {/* Previous Month Days */}
            {[24, 25, 26, 27, 28, 29, 30].map((d) => (
              <CalendarDay key={`prev-${d}`} day={d} isCurrentMonth={false} />
            ))}

            {/* Current Month Days */}
            <CalendarDay day={1} />
            <CalendarDay day={2}>
              <CalendarEvent title="Critical: Bug Fixes" color="bg-[#EB5A46]" />
            </CalendarDay>
            <CalendarDay day={3}>
              <CalendarEvent title="Sprint Planning" color="bg-[#0079BF]" />
            </CalendarDay>
            <CalendarDay day={4} />
            <CalendarDay day={5} />
            <CalendarDay day={6}>
              <CalendarEvent title="Design Review" color="bg-[#51E898]" textColor="text-[#004A23]" />
            </CalendarDay>
            <CalendarDay day={7} />
            
            <CalendarDay day={8} />
            <CalendarDay day={9} />
            <CalendarDay day={10} isToday>
              <CalendarEvent title="UI Implementation" color="bg-[#0079BF]" />
              <CalendarEvent title="Content Audit" color="bg-[#F2D600]" textColor="text-[#514A00]" />
            </CalendarDay>
            <CalendarDay day={11} />
            <CalendarDay day={12}>
              <CalendarEvent title="Backend Sync" color="bg-[#FF9F1A]" />
            </CalendarDay>
            <CalendarDay day={13} />
            <CalendarDay day={14} isLastInRow />

            <CalendarDay day={15} />
            <CalendarDay day={16} />
            <CalendarDay day={17}>
              <CalendarEvent title="Mobile Prep" color="bg-[#C377E0]" />
            </CalendarDay>
            <CalendarDay day={18}>
              <CalendarEvent title="API Documentation" color="bg-[#0079BF]" />
            </CalendarDay>
            <CalendarDay day={19} />
            <CalendarDay day={20} />
            <CalendarDay day={21} isLastInRow />

            <CalendarDay day={22} />
            <CalendarDay day={23} />
            <CalendarDay day={24} />
            <CalendarDay day={25}>
              <CalendarEvent title="Client Demo" color="bg-[#EB5A46]" />
            </CalendarDay>
            <CalendarDay day={26} />
            <CalendarDay day={27} />
            <CalendarDay day={28} isLastInRow />
          </CalendarGrid>
        </main>
      </div>

      <FloatingActionButton />
    </div>
  );
}
