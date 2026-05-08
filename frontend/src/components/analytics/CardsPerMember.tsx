'use client';

import React from 'react';
import { MoreHorizontal } from 'lucide-react';

interface MemberStat {
  name: string;
  count: number;
  color: string;
  percentage: number;
}

const members: MemberStat[] = [
  { name: 'Alex Rivera', count: 42, color: 'bg-[#1565C0]', percentage: 100 },
  { name: 'Sarah Chen', count: 38, color: 'bg-[#1976D2]', percentage: 90 },
  { name: 'Michael K.', count: 24, color: 'bg-[#9E9E9E]', percentage: 57 },
  { name: 'Elena Rodriguez', count: 12, color: 'bg-[#BDBDBD]', percentage: 28 },
];

const CardsPerMember: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-slate-900">Cards per Member</h3>
        <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-8">
        {members.map((member) => (
          <div key={member.name} className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-slate-700">{member.name}</span>
              <span className="text-base font-bold text-slate-900">{member.count} cards</span>
            </div>
            <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden">
              <div 
                className={`${member.color} h-full transition-all duration-1000 ease-out`}
                style={{ width: `${member.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardsPerMember;
