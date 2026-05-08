import React from 'react';

interface CalendarDayProps {
  day: number | string;
  isCurrentMonth?: boolean;
  isToday?: boolean;
  isLastInRow?: boolean;
  children?: React.ReactNode;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ 
  day, 
  isCurrentMonth = true, 
  isToday = false, 
  isLastInRow = false,
  children 
}) => {
  return (
    <div className={`
      border-b border-outline-variant p-2 min-h-[120px] transition-colors
      ${!isLastInRow ? 'border-r' : ''}
      ${!isCurrentMonth ? 'bg-surface-container-low' : 'bg-white'}
      ${isToday ? 'bg-primary/5' : ''}
    `}>
      <span className={`
        text-caption font-caption 
        ${!isCurrentMonth ? 'text-outline' : 'font-bold'}
        ${isToday ? 'text-primary' : ''}
      `}>
        {day}
      </span>
      <div className="mt-1 space-y-1">
        {children}
      </div>
    </div>
  );
};

export default CalendarDay;
