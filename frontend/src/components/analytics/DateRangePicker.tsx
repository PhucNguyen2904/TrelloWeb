'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronDown, Check } from 'lucide-react';

const options = [
  'Last 7 days',
  'Last 30 days',
  'Last 3 months',
  'Last 6 months',
  'Custom range...',
];

const DateRangePicker: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('Last 30 days');

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
      >
        <CalendarIcon className="w-4 h-4 text-[#1976D2]" />
        <span>{selected}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-2 animate-in fade-in zoom-in duration-200">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setSelected(option);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-blue-50 hover:text-[#1976D2] transition-colors"
              >
                <span className={selected === option ? 'font-bold text-[#1976D2]' : 'text-slate-600'}>
                  {option}
                </span>
                {selected === option && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DateRangePicker;
