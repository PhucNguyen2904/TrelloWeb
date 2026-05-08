'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subtext?: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
  progress?: {
    value: number;
    label: string;
  };
  sparkline?: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  icon: Icon,
  subtext,
  trend,
  progress,
  sparkline,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">
          {label}
        </span>
        <div className="text-[#1976D2] bg-blue-50 p-1.5 rounded-lg">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{value}</h3>

        {trend && (
          <div className="flex items-center gap-1.5">
            <span className={`text-[13px] font-bold ${trend.isUp ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isUp ? '↑' : '↓'} {trend.value}
            </span>
            <span className="text-[13px] text-slate-400 font-medium">from last month</span>
          </div>
        )}

        {progress && (
          <div className="space-y-2">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#1976D2] h-full transition-all duration-1000" 
                style={{ width: `${progress.value}%` }}
              />
            </div>
            <p className="text-[13px] text-slate-500 font-medium">
              <span className="text-slate-900 font-bold">{progress.value}%</span> {progress.label}
            </p>
          </div>
        )}

        {subtext && (
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-sm">{subtext}</span>
          </div>
        )}

        {sparkline && (
          <div className="pt-2">
            {sparkline}
          </div>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
