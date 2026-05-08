import React from 'react';

interface CalendarGridProps {
  children: React.ReactNode;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ children }) => {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b border-outline-variant bg-surface-container-low">
        {weekDays.map((day) => (
          <div key={day} className="py-2 text-center text-label-sm font-label-sm text-outline uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>
      
      {/* Days Grid */}
      <div className="grid grid-cols-7 auto-rows-[minmax(120px,1fr)]">
        {children}
      </div>
    </div>
  );
};

export default CalendarGrid;
