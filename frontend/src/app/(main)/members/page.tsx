"use client";

import React, { useState, useEffect } from "react";
import { Search, UserPlus, Users, Shield, Timer } from "lucide-react";
import { useSearchParams } from "next/navigation";
import MemberTable from "@/components/members/MemberTable";
import MemberStatsCard from "@/components/members/MemberStatsCard";
import InviteMemberModal from "@/components/members/InviteMemberModal";
import { MemberData } from "@/components/members/MemberRow";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, inviteMember } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

import { useToast } from "@/store/useToastStore";

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const toast = useToast();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('invite') === 'true') {
      setIsInviteModalOpen(true);
    }
  }, [searchParams]);

  const userRole = currentUser?.role?.name?.toLowerCase() || '';
  const isSuperAdmin = userRole === 'superadmin';
  const isAdmin = userRole === 'admin';
  const hasManagementAccess = isSuperAdmin || isAdmin;
  const canInvite = hasManagementAccess || userRole === 'user';

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      // Allow all authenticated users to see the member list
      // If superadmin, use super-admin endpoint, otherwise use admin endpoint
      const endpoint = isSuperAdmin ? '/api/super-admin/users' : '/api/admin/users';
      try {
        const res = await api.get(endpoint);
        return Array.isArray(res.data) ? res.data : [];
      } catch (err: any) {
        if (err.response?.status === 403) {
          // Fallback if the user really doesn't have access to the list
          return [currentUser];
        }
        console.error("Failed to fetch members:", err);
        throw err;
      }
    },
    enabled: !!currentUser,
    retry: false,
  });

  const handleInviteMember = async (email: string, role: string) => {
    // Role mapping: admin -> 2, user -> 3
    const roleId = role === 'admin' ? 2 : 3; 
    try {
      await inviteMember(email, roleId, isSuperAdmin);
      toast.success(`Successfully invited ${email}`);
      queryClient.invalidateQueries({ queryKey: ['members'] });
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to invite member";
      toast.error(msg);
      throw err; // Re-throw to be caught by the modal
    }
  };

  const members: MemberData[] = users.map((u: any) => ({
    id: String(u.id),
    name: u.email.split('@')[0],
    email: u.email,
    role: u.role?.name || 'User',
    status: u.is_active !== false ? 'Active' : 'Inactive',
    avatarUrl: `https://i.pravatar.cc/100?img=${u.id % 70}`,
  }));

  const filteredMembers = members.filter(
    (m) => {
      const roleName = m.role.toLowerCase();
      const isTeamMember = roleName !== 'admin' && roleName !== 'superadmin';
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           m.email.toLowerCase().includes(searchQuery.toLowerCase());
      return isTeamMember && matchesSearch;
    }
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
            {canInvite && (
              <button 
                onClick={() => setIsInviteModalOpen(true)}
                className="flex items-center gap-2 rounded-[10px] bg-[#1565C0] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1976D2]"
              >
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
        <MemberTable 
          members={filteredMembers} 
          totalMembers={members.length} 
          onAddMember={() => setIsInviteModalOpen(true)}
          canInvite={canInvite}
          hasManagementAccess={hasManagementAccess}
        />
      </div>

      <InviteMemberModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteMember}
      />
    </div>
  );
}
