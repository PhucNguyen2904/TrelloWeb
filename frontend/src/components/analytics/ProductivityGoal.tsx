'use client';

import React from 'react';

const ProductivityGoal: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-[#1565C0] to-[#1976D2] rounded-xl p-8 text-white shadow-lg relative overflow-hidden group h-full flex flex-col justify-between">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full -ml-10 -mb-10 blur-2xl" />

      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-3 tracking-tight">Productivity Goal</h3>
        <p className="text-blue-100 text-sm leading-relaxed max-w-sm">
          You are <span className="font-bold text-white">8% away</span> from reaching this month's velocity milestone. Keep pushing!
        </p>
      </div>

      <div className="relative z-10 mt-8 flex items-end justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-black tracking-tighter">92%</span>
          {/* Circular Progress (Visual Only) */}
          <div className="w-12 h-12 rounded-full border-4 border-blue-400/30 border-t-white animate-spin-slow" />
        </div>
        
        <button className="px-6 py-2.5 border-2 border-white rounded-xl font-bold text-sm hover:bg-white hover:text-[#1565C0] transition-all active:scale-95">
          View Targets
        </button>
      </div>
    </div>
  );
};

export default ProductivityGoal;
