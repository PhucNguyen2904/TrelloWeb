"use client";

import React, { useState } from "react";
import { Info, ArrowRight } from "lucide-react";

export default function GeneralSection() {
  const [workspaceName, setWorkspaceName] = useState("Engineering Team");
  const [website, setWebsite] = useState("https://example.com");
  const [description, setDescription] = useState(
    "Our primary workspace for engineering roadmaps, sprint planning, and architectural documentation."
  );

  const handleSave = () => {
    // In a real app, this would call an API
    alert("Settings saved!");
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF6FF]">
          <Info className="h-5 w-5 text-[#1565C0]" />
        </div>
        <h2 className="text-lg font-bold text-[#111827]">General</h2>
      </div>

      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="workspace-name"
              className="mb-1.5 block text-xs font-medium text-[#374151]"
            >
              Workspace name
            </label>
            <input
              type="text"
              id="workspace-name"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="w-full rounded-lg border border-[#D1D5DB] px-[14px] py-[10px] text-sm focus:border-[#1565C0] focus:outline-none focus:ring-4 focus:ring-[#1565C0]/10"
            />
          </div>
          <div>
            <label
              htmlFor="website"
              className="mb-1.5 block text-xs font-medium text-[#374151]"
            >
              Website (optional)
            </label>
            <input
              type="url"
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full rounded-lg border border-[#D1D5DB] px-[14px] py-[10px] text-sm focus:border-[#1565C0] focus:outline-none focus:ring-4 focus:ring-[#1565C0]/10"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="mt-6">
          <label
            htmlFor="description"
            className="mb-1.5 block text-xs font-medium text-[#374151]"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full resize-y rounded-lg border border-[#D1D5DB] px-[14px] py-[10px] text-sm focus:border-[#1565C0] focus:outline-none focus:ring-4 focus:ring-[#1565C0]/10"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-[#1565C0] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1976D2] focus:outline-none focus:ring-4 focus:ring-[#1565C0]/20"
          >
            Save Changes
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
