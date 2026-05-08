'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const FeaturedWorkspace: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group">
      <div className="flex flex-col lg:flex-row">
        {/* Left Content */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-[#1976D2] text-[10px] font-bold uppercase tracking-widest mb-6">
            Featured Workspace
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
            Product Design Team
          </h2>
          <p className="text-slate-500 text-base lg:text-lg mb-8 leading-relaxed max-w-lg">
            Centralize your design systems, user flows, and high-fidelity mockups in one unified workspace. Collaborate with designers in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <button className="w-full sm:w-auto bg-[#1976D2] hover:bg-[#1565C0] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
              Go to Workspace
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-4 border-white overflow-hidden bg-slate-100 relative">
                    <Image src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="Member" fill className="object-cover" />
                  </div>
                ))}
                <div className="w-9 h-9 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                  +18
                </div>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Active Members</span>
            </div>
          </div>
        </div>

        {/* Right Preview */}
        <div className="flex-1 bg-gradient-to-br from-pink-500 via-rose-500 to-amber-500 p-8 lg:p-12 relative min-h-[300px]">
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
          
          {/* Mock UI Element */}
          <div className="relative h-full bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 p-6 shadow-2xl transform lg:rotate-3 group-hover:rotate-0 transition-transform duration-700 ease-out">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-white/30 rounded-lg w-3/4 animate-pulse" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-white/40 rounded-xl" />
                <div className="h-24 bg-white/20 rounded-xl" />
              </div>
              <div className="h-20 bg-white/10 rounded-xl" />
            </div>
            
            <div className="absolute bottom-6 right-6 px-4 py-2 bg-white/90 rounded-full shadow-lg">
              <span className="text-xs font-bold text-rose-600">Main Design System v2.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedWorkspace;
