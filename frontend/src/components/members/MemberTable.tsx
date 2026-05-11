"use client";

import React from "react";
import MemberRow, { MemberData } from "./MemberRow";
import { ChevronLeft, ChevronRight, UserPlus } from "lucide-react";

interface MemberTableProps {
  members: MemberData[];
  totalMembers?: number;
  onAddMember?: () => void;
  hasManagementAccess?: boolean;
  canInvite?: boolean;
}

export default function MemberTable({ 
  members, 
  totalMembers = members.length,
  onAddMember,
  hasManagementAccess = false,
  canInvite = hasManagementAccess
}: MemberTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(members.length / pageSize);

  // Get current members for the page
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedMembers = members.slice(startIndex, startIndex + pageSize);

  // Reset to page 1 if search changes and current page becomes invalid
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [members.length, totalPages, currentPage]);

  return (
    <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
      {/* Table Header with Actions */}
      <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-white px-6 py-4">
        <div>
          <h3 className="text-lg font-bold text-[#111827]">Team Members</h3>
          <p className="text-xs text-[#6B7280]">A list of all users in your workspace.</p>
        </div>
        {canInvite && onAddMember && (
          <button
            onClick={onAddMember}
            className="flex items-center gap-2 rounded-lg bg-[#1565C0] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#1976D2] active:scale-95 shadow-sm"
          >
            <UserPlus className="h-4 w-4" />
            Add Member
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
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
            {paginatedMembers.map((member) => (
              <MemberRow key={member.id} member={member} />
            ))}
            {paginatedMembers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-sm text-[#6B7280]">
                  No members found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-[#E5E7EB] bg-white px-6 py-[14px]">
        <span className="text-[13px] text-[#6B7280]">
          Showing {startIndex + 1} to {Math.min(startIndex + pageSize, members.length)} of {totalMembers} members
        </span>
        <div className="flex items-center gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#9CA3AF] hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => {
                setCurrentPage(page);
                // Optional: scroll table to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition-all duration-200 ${
                currentPage === page 
                  ? "text-white shadow-lg shadow-blue-200/50 scale-110 z-10" 
                  : "border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB] hover:border-[#D1D5DB]"
              }`}
              style={currentPage === page ? {
                background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)'
              } : {}}
            >
              {page}
            </button>
          ))}

          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#9CA3AF] hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
