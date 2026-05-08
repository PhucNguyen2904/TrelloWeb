"use client";

import React from "react";
import GeneralSection from "@/components/workspace-settings/GeneralSection";
import VisibilitySection from "@/components/workspace-settings/VisibilitySection";
import AdvancedSection from "@/components/workspace-settings/AdvancedSection";

export default function WorkspaceSettingsPage() {
  return (
    <div className="h-full overflow-y-auto bg-[#F0F2F5] px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="text-[1.75rem] font-bold tracking-tight text-[#111827]">
            Workspace Settings
          </h1>
          <p className="text-sm text-[#6B7280]">
            Manage your workspace configuration, visibility, and administrative controls.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          <GeneralSection />
          <VisibilitySection />
          <AdvancedSection />
        </div>
      </div>
    </div>
  );
}
