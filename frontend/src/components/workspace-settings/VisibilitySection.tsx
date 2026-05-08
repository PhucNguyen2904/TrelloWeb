"use client";

import React, { useState } from "react";
import { Eye, Lightbulb } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";

export default function VisibilitySection() {
  const [isPrivate, setIsPrivate] = useState(true);

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF6FF]">
          <Eye className="h-5 w-5 text-[#1565C0]" />
        </div>
        <h2 className="text-lg font-bold text-[#111827]">Visibility</h2>
      </div>

      <div className="space-y-4 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold text-[#111827]">
              Private Workspace
            </h3>
            <p className="text-xs text-[#6B7280]">
              Only invited members can see and access this workspace.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold ${isPrivate ? "text-[#1565C0]" : "text-gray-400"}`}>
              {isPrivate ? "ON" : "OFF"}
            </span>
            <ToggleSwitch enabled={isPrivate} onChange={setIsPrivate} />
          </div>
        </div>

        <div className="flex gap-3 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] p-4">
          <Lightbulb className="h-5 w-5 flex-shrink-0 text-[#B45309]" />
          <p className="text-[13px] leading-relaxed text-[#92400E]">
            Public workspaces are indexed by search engines and can be viewed by
            anyone with the link. Use this for open-source or community
            projects.
          </p>
        </div>
      </div>
    </section>
  );
}
