"use client";

import React, { useState } from "react";
import { Search, UserPlus, Users, Shield, Timer } from "lucide-react";
import MemberTable from "@/components/members/MemberTable";
import MemberStatsCard from "@/components/members/MemberStatsCard";
import { MemberData } from "@/components/members/MemberRow";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user: currentUser } = useAuthStore();

  const isSuperAdmin = currentUser?.role?.name === 'superadmin';
  const isAdmin = currentUser?.role?.name === 'admin';
  const hasManagementAccess = isSuperAdmin || isAdmin;

  // Fetch real users from backend
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      // Only admins can access these endpoints
      if (!hasManagementAccess) {
        // Fallback for regular users: just return the current user info as the only member
        return [currentUser];
      }

      const endpoint = isSuperAdmin ? '/api/super-admin/users' : '/api/admin/users';
      try {
        const res = await api.get(endpoint);
        return Array.isArray(res.data) ? res.data : [];
      } catch (err: any) {
        // If 403, it means the role check failed on backend
        if (err.response?.status === 403) {
           return [currentUser]; // Fallback
        }
        console.error("Failed to fetch members:", err);
        throw err;
      }
    },
    enabled: !!currentUser,
    retry: false, // Don't retry on 403
  });

  // Map backend users to MemberData structure
  const members: MemberData[] = users.map((u: any) => ({
    id: String(u.id),
    name: u.email.split('@')[0],
    email: u.email,
    role: u.role?.name || 'User',
    status: u.is_active !== false ? 'Active' : 'Inactive',
    avatarUrl: `https://i.pravatar.cc/100?img=${u.id % 70}`,
  }));

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#F0F2F5]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#1565C0]/30 border-t-[#1565C0] rounded-full animate-spin" />
          <p className="font-bold text-[#1565C0]">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-[#F0F2F5] px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Page Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <h1 className="text-[2rem] font-bold tracking-tight text-[#111827]">
              Members
            </h1>
            <p className="text-sm text-[#6B7280]">
              Manage your team members and their workspace permissions.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Find members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-[10px] border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-4 text-sm placeholder-[#6B7280] focus:border-[#1565C0] focus:outline-none focus:ring-4 focus:ring-[#1565C0]/10 sm:w-[240px]"
              />
            </div>
            {hasManagementAccess && (
              <button className="flex items-center gap-2 rounded-[10px] bg-[#1565C0] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1976D2]">
                <UserPlus className="h-4 w-4" />
                Invite Members
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <MemberStatsCard
            label="Total Members"
            value={String(members.length)}
            icon={Users}
            metaText="Active in workspace"
            iconBg="#EFF6FF"
            iconColor="#1565C0"
            metaColor="#1565C0"
          />
          <MemberStatsCard
            label="Admins"
            value={String(members.filter(m => m.role.toLowerCase().includes('admin')).length)}
            icon={Shield}
            metaText="Managing permissions"
            iconBg="#FFF7ED"
            iconColor="#EA580C"
            metaColor="#EA580C"
          />
          <MemberStatsCard
            label="Active Now"
            value={String(members.filter(m => m.status === 'Active').length)}
            icon={Timer}
            metaText="Currently logged in"
            iconBg="#F8FAFC"
            iconColor="#64748B"
            metaColor="#64748B"
          />
        </div>

        {/* Table Section */}
        <MemberTable members={filteredMembers} />
      </div>
    </div>
  );
}
