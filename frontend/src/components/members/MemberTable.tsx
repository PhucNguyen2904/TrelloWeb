"use client";

import React from "react";
import MemberRow, { MemberData } from "./MemberRow";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MemberTableProps {
  members: MemberData[];
}

export default function MemberTable({ members }: MemberTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-[#E5E7EB] bg-white">
            <tr>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-[0.05em] text-[#6B7280]">
                Name
              </th>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-[0.05em] text-[#6B7280]">
                Role
              </th>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-[0.05em] text-[#6B7280]">
                Status
              </th>
              <th className="px-6 py-3 text-right text-[12px] font-medium uppercase tracking-[0.05em] text-[#6B7280]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <MemberRow key={member.id} member={member} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-top border-[#E5E7EB] bg-white px-6 py-[14px]">
        <span className="text-[13px] text-[#6B7280]">
          Showing {members.length} of 48 members
        </span>
        <div className="flex items-center gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#9CA3AF] hover:bg-[#F9FAFB]">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1565C0] text-[13px] font-medium text-white">
            1
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] text-[13px] font-medium text-[#374151] hover:bg-[#F9FAFB]">
            2
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] text-[13px] font-medium text-[#374151] hover:bg-[#F9FAFB]">
            3
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#9CA3AF] hover:bg-[#F9FAFB]">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
