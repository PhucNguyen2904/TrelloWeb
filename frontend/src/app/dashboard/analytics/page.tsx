'use client';

import React from 'react';
import { 
  SquareDashed, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Activity 
} from 'lucide-react';
import KpiCard from '@/components/analytics/KpiCard';
import CardsPerMember from '@/components/analytics/CardsPerMember';
import TaskDistribution from '@/components/analytics/TaskDistribution';
import ProductivityGoal from '@/components/analytics/ProductivityGoal';
import ResourceAllocation from '@/components/analytics/ResourceAllocation';
import DateRangePicker from '@/components/analytics/DateRangePicker';

const VelocitySparkline = () => (
  <svg viewBox="0 0 100 30" className="w-full h-8 overflow-visible">
    <path
      d="M 0 25 L 10 20 L 25 22 L 40 10 L 55 18 L 70 8 L 85 15 L 100 5"
      fill="none"
      stroke="#1976D2"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 0 25 L 10 20 L 25 22 L 40 10 L 55 18 L 70 8 L 85 15 L 100 5 L 100 30 L 0 30 Z"
      fill="url(#gradient)"
      className="opacity-20"
    />
    <defs>
      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1976D2" />
        <stop offset="100%" stopColor="#FFFFFF" />
      </linearGradient>
    </defs>
  </svg>
);

export default function AnalyticsPage() {
  return (
    <div className="min-h-full bg-[#f8f9fa] p-8 lg:p-12 overflow-y-auto custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-[#1976D2]" />
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Analytics</h1>
            </div>
            <p className="text-base text-slate-500 font-medium ml-11">
              Real-time performance insights for <span className="text-[#1976D2] font-bold">Engineering Team</span>
            </p>
          </div>
          <DateRangePicker />
        </div>

        {/* Section 1: KPI Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard 
            label="Total Cards" 
            value="1,248" 
            icon={SquareDashed} 
            trend={{ value: '12%', isUp: true }}
          />
          <KpiCard 
            label="Completed" 
            value="842" 
            icon={CheckCircle2} 
            progress={{ value: 67.5, label: 'completion rate' }}
          />
          <KpiCard 
            label="In Progress" 
            value="156" 
            icon={Clock} 
            subtext="⏳ 24 cards added today"
          />
          <KpiCard 
            label="Team Velocity" 
            value="42.5" 
            icon={TrendingUp} 
            subtext="Average points per sprint"
            sparkline={<VelocitySparkline />}
          />
        </div>

        {/* Section 2: Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CardsPerMember />
          </div>
          <div className="lg:col-span-1">
            <TaskDistribution />
          </div>
        </div>

        {/* Section 3: Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          <div className="lg:col-span-6">
            <ProductivityGoal />
          </div>
          <div className="lg:col-span-4">
            <ResourceAllocation />
          </div>
        </div>

      </div>
    </div>
  );
}
