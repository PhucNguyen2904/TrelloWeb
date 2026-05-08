'use client';

import React from 'react';
import { Lock } from 'lucide-react';

const ResourceAllocation: React.FC = () => {
  return (
    <div className="bg-[#F8F9FA] border border-slate-200 rounded-xl p-8 shadow-sm h-full flex flex-col relative overflow-hidden">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Resource Allocation</h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          Insights on how your team is distributed across high-impact features and maintenance.
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="flex items-center gap-1 mt-2">
          {[1, 2, 3].map((i) => (
            <img 
              key={i}
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm" 
              src={`https://i.pravatar.cc/100?img=${i + 10}`} 
              alt="Team member"
            />
          ))}
          <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm">
            +8
          </div>
        </div>

        {/* Locked Preview / Blur Area */}
        <div className="relative mt-8 group cursor-pointer">
          <div className="space-y-3 opacity-20 blur-[2px] select-none">
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-5/6" />
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2 group-hover:scale-105 transition-transform">
              <Lock className="w-4 h-4 text-[#1976D2]" />
              <span className="text-sm font-bold text-slate-700">Upgrade to Premium</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceAllocation;
