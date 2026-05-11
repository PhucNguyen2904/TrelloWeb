'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tag, Shield, Search, Info } from 'lucide-react';
import { api } from '@/lib/api';

interface Permission {
  id: number;
  name: string;
  description?: string;
}

export default function PermissionsPage() {
  const { data: permissions = [], isLoading } = useQuery<Permission[]>({
    queryKey: ['sa-permissions'],
    queryFn: async () => {
      const res = await api.get('/api/super-admin/permissions');
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  return (
    <div className="flex-1 bg-[#F0F2F5] min-h-full">
      <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-text-heading">System Permissions</h1>
          <p className="mt-1 text-sm text-text-muted">
            View all available permissions that can be assigned to roles.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl border border-border bg-surface-muted" />
            ))
          ) : permissions.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-surface-card rounded-2xl border border-dashed border-border">
              <Tag size={40} className="text-text-muted/30 mb-3" />
              <p className="text-sm font-medium text-text-muted">No permissions defined in system</p>
            </div>
          ) : (
            permissions.map((perm) => (
              <div
                key={perm.id}
                className="group rounded-2xl border border-border bg-surface-card p-5 shadow-card hover:border-brand/30 transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-light text-brand">
                    <Tag size={16} />
                  </div>
                  <p className="text-sm font-bold text-text-heading">{perm.name}</p>
                </div>
                {perm.description ? (
                  <p className="text-xs text-text-muted leading-relaxed">{perm.description}</p>
                ) : (
                  <p className="text-xs text-text-muted italic">No description</p>
                )}
              </div>
            ))
          )}
        </div>

        <div className="rounded-xl bg-blue-50 p-4 border border-blue-100 flex gap-3">
          <Info className="text-blue-500 shrink-0" size={18} />
          <p className="text-xs text-blue-700 leading-relaxed">
            Permissions are hard-coded in the system logic. You can assign these permissions to different roles in the 
            <strong> Role Management</strong> section to control what users can do across the platform.
          </p>
        </div>
      </div>
    </div>
  );
}
