"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

export type MemberRole = "Admin" | "Member" | "Guest";

interface RoleDropdownProps {
  role: MemberRole;
  onChange?: (role: MemberRole) => void;
}

export default function RoleDropdown({ role, onChange }: RoleDropdownProps) {
  const canChange = role === "Admin" || role === "Guest";

  return (
    <div className="relative inline-block">
      <button
        disabled={!canChange}
        className={`flex items-center gap-1.5 rounded-lg border border-[#D1D5DB] px-2.5 py-1 text-[13px] text-[#374151] transition-colors ${
          canChange ? "hover:bg-[#F9FAFB] cursor-pointer" : "bg-gray-50 cursor-default"
        }`}
      >
        {role}
        {canChange && <ChevronDown className="h-3.5 w-3.5 text-[#6B7280]" />}
      </button>
    </div>
  );
}
