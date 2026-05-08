"use client";

import React from "react";
import { MoreHorizontal } from "lucide-react";
import StatusBadge, { MemberStatus } from "./StatusBadge";
import RoleDropdown, { MemberRole } from "./RoleDropdown";
import Image from "next/image";

export interface MemberData {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  avatarUrl?: string;
  initials?: string;
}

interface MemberRowProps {
  member: MemberData;
}

export default function MemberRow({ member }: MemberRowProps) {
  return (
    <tr className="group border-b border-[#F3F4F6] transition-colors hover:bg-[#FAFAFA]">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#1565C0] flex items-center justify-center text-white font-bold text-sm">
            {member.avatarUrl ? (
              <Image
                src={member.avatarUrl}
                alt={member.name}
                fill
                className="object-cover"
              />
            ) : (
              member.initials || member.name.charAt(0)
            )}
          </div>
          <div>
            <div className="text-[15px] font-semibold text-[#111827]">
              {member.name}
            </div>
            <div className="text-[13px] text-[#6B7280]">{member.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <RoleDropdown role={member.role} />
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={member.status} />
      </td>
      <td className="px-6 py-4 text-right">
        <button className="rounded-md p-1.5 text-[#9CA3AF] transition-colors hover:bg-[#F3F4F6] hover:text-[#374151]">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
}
