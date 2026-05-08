'use client';

import React from 'react';

const TaskDistribution: React.FC = () => {
  const data = [
    { label: 'Done', value: 60, color: '#1565C0' },
    { label: 'Doing', value: 25, color: '#B45309' },
    { label: 'To Do', value: 15, color: '#6B7280' },
  ];

  // CSS Conic Gradient for the Donut
  const conicGradient = `conic-gradient(
    ${data[0].color} 0% ${data[0].value}%, 
    ${data[1].color} ${data[0].value}% ${data[0].value + data[1].value}%, 
    ${data[2].color} ${data[0].value + data[1].value}% 100%
  )`;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-900 mb-8">Task Distribution</h3>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Donut Chart */}
        <div className="relative w-48 h-48 mb-10">
          <div 
            className="w-full h-full rounded-full flex items-center justify-center"
            style={{ background: conicGradient }}
          >
            {/* Inner Circle (The Hole) */}
            <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
              <span className="text-3xl font-extrabold text-slate-900 leading-none">100%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Active tasks</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full space-y-3">
          {data.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-semibold text-slate-600">{item.label}</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskDistribution;
