import React from 'react';

interface CalendarHeaderProps {
  currentMonth: string;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentMonth }) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant mb-4 p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="font-h2 text-h2">{currentMonth}</h2>
          <div className="flex items-center bg-surface-container rounded-lg p-1">
            <button className="p-1.5 hover:bg-surface-container-highest rounded-md transition-all">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="px-3 py-1 text-label-sm font-label-sm hover:bg-surface-container-highest rounded-md transition-all">Today</button>
            <button className="p-1.5 hover:bg-surface-container-highest rounded-md transition-all">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-surface-container rounded-lg p-1">
            <button className="px-4 py-1.5 text-body-md font-body-md text-on-surface-variant hover:bg-surface-container-highest rounded transition-all">List</button>
            <button className="px-4 py-1.5 text-body-md font-body-md text-on-surface-variant hover:bg-surface-container-highest rounded transition-all">Week</button>
            <button className="px-4 py-1.5 text-body-md font-body-md text-on-primary-container bg-primary-container rounded shadow-sm">Month</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
