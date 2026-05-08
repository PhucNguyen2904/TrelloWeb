"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface MemberStatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  metaText: string;
  iconBg: string;
  iconColor: string;
  metaColor: string;
}

export default function MemberStatsCard({
  label,
  value,
  icon: Icon,
  metaText,
  iconBg,
  iconColor,
  metaColor,
}: MemberStatsCardProps) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-[10px]"
          style={{ backgroundColor: iconBg }}
        >
          <Icon className="h-5 w-5" style={{ color: iconColor }} />
        </div>
        <span
          className="text-[13px] font-medium"
          style={{ color: metaColor }}
        >
          {metaText}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#9CA3AF]">
          {label}
        </p>
        <p className="mt-1 text-[2rem] font-bold text-[#111827]">{value}</p>
      </div>
    </div>
  );
}
