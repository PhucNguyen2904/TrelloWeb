"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

export default function AdvancedSection() {
  const handleTransfer = () => {
    const confirmed = window.confirm("Are you sure you want to transfer ownership?");
    if (confirmed) {
      alert("Transfer flow initiated.");
    }
  };

  const handleDelete = () => {
    const workspaceName = "Engineering Team";
    const input = window.prompt(`To delete this workspace, please type "${workspaceName}" below:`);
    if (input === workspaceName) {
      alert("Workspace deleted successfully.");
    } else if (input !== null) {
      alert("Incorrect workspace name. Deletion cancelled.");
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FEF2F2]">
          <AlertTriangle className="h-5 w-5 text-[#DC2626]" />
        </div>
        <h2 className="text-lg font-bold text-[#DC2626]">Advanced</h2>
      </div>

      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <h3 className="text-[15px] font-semibold text-[#111827]">
            Transfer Ownership
          </h3>
          <p className="text-[13px] text-[#6B7280]">
            Transfer this workspace to another user or organization account.
          </p>
          <button
            onClick={handleTransfer}
            className="rounded-lg border-[1.5px] border-[#D1D5DB] bg-white px-4 py-2 text-sm font-medium text-[#374151] transition-colors hover:bg-[#F9FAFB] hover:border-[#9CA3AF]"
          >
            Transfer Workspace
          </button>
        </div>

        <div className="my-6 border-t border-[#E5E7EB]" />

        <div className="space-y-3">
          <h3 className="text-[15px] font-semibold text-[#DC2626]">
            Delete this workspace
          </h3>
          <p className="text-[13px] leading-relaxed text-[#6B7280]">
            Once you delete a workspace, there is no going back.
            <br />
            All projects, tasks, and data will be permanently removed.
          </p>
          <button
            onClick={handleDelete}
            className="rounded-lg bg-[#DC2626] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#B91C1C] focus:outline-none focus:ring-4 focus:ring-[#DC2626]/20"
          >
            Delete This Workspace
          </button>
        </div>
      </div>
    </section>
  );
}
