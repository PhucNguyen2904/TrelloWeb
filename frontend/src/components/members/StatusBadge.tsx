"use client";

import React from "react";

export type MemberStatus = "Active" | "Pending";

interface StatusBadgeProps {
  status: MemberStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    Active: {
      bg: "bg-[#FEF3C7]",
      text: "text-[#92400E]",
      dot: "bg-[#F59E0B]",
    },
    Pending: {
      bg: "bg-[#F0F9FF]",
      text: "text-[#0369A1]",
      dot: "bg-[#60A5FA]",
    },
  };

  const current = styles[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[13px] font-medium ${current.bg} ${current.text}`}
    >
      <span className={`mr-1.5 h-2 w-2 rounded-full ${current.dot}`} />
      {status}
    </span>
  );
}
