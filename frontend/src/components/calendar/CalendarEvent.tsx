import React from 'react';

interface CalendarEventProps {
  title: string;
  color?: string;
  textColor?: string;
}

const CalendarEvent: React.FC<CalendarEventProps> = ({ 
  title, 
  color = 'bg-primary', 
  textColor = 'text-white' 
}) => {
  return (
    <div className={`${color} ${textColor} text-[10px] px-1.5 py-0.5 rounded truncate font-medium cursor-pointer hover:opacity-90 transition-opacity`}>
      {title}
    </div>
  );
};

export default CalendarEvent;
