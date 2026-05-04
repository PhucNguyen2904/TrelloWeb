'use client';

import React, { useEffect, useState } from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { getWorkspaces, getBoards } from '@/lib/api';

interface Member {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
}

interface Board {
  id: string;
  name: string;
  coverColor?: string;
  members: Member[];
}

interface Workspace {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  boardCount: number;
  memberCount: number;
  boards: Array<{
    id: string;
    name: string;
    color: string;
    updatedAt: string;
  }>;
}

export default function RecentPage() {
  const [recentBoards, setRecentBoards] = useState<Board[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [boardsData, workspacesData] = await Promise.all([
          getBoards(),
          getWorkspaces(),
        ]);
        setRecentBoards((boardsData || []).slice(0, 6));
        setWorkspaces(workspacesData || []);
      } catch (err) {
        // Silently fail — show empty sections, never show error to user
        console.error('Failed to fetch data:', err);
        setRecentBoards([]);
        setWorkspaces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-brand border-t-transparent rounded-full mx-auto"></div>
          <p className="text-text-muted text-sm mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Recently Viewed Section */}
      <div>
        <h2 className="text-xl font-bold text-text-heading mb-4">Recently Viewed</h2>
        {recentBoards.length === 0 ? (
          <p className="text-text-muted text-sm">No recent boards found</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentBoards.map((board) => (
              <div
                key={board.id}
                className="rounded-xl overflow-hidden border border-border shadow-card hover:shadow-md transition-all cursor-pointer group"
              >
                {/* Cover */}
                <div
                  className="h-24 bg-gradient-to-br"
                  style={{
                    backgroundImage: board.coverColor?.startsWith('linear')
                      ? board.coverColor
                      : undefined,
                    backgroundColor: board.coverColor && !board.coverColor.startsWith('linear')
                      ? board.coverColor
                      : '#667eea',
                  }}
                />

                {/* Info */}
                <div className="bg-surface-card p-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-text-heading truncate">
                    {board.name}
                  </p>
                  <div className="flex items-center gap-1 -space-x-2">
                    {board.members.slice(0, 2).map((member) => (
                      <div
                        key={member.id}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white border border-surface-card"
                        style={{ backgroundColor: member.avatarColor }}
                        title={member.name}
                      >
                        {member.initials[0]}
                      </div>
                    ))}
                    <button className="p-0.5 text-text-muted hover:text-amber-500 transition-colors">
                      <Star className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Workspaces Section */}
      <div>
        <h2 className="text-xl font-bold text-text-heading mb-4">Your Workspaces</h2>
        {workspaces.length === 0 ? (
          <p className="text-text-muted text-sm">No workspaces found</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                className="bg-surface-card border border-border rounded-xl p-4 shadow-card hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-4 pb-4 border-b border-border">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: workspace.avatarColor }}
                  >
                    {workspace.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-heading">
                      {workspace.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {workspace.boardCount} boards · {workspace.memberCount} members
                    </p>
                  </div>
                </div>

                {/* Boards Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {workspace.boards.map((wsBoard) => (
                    <button
                      key={wsBoard.id}
                      className="text-left p-2 rounded-lg border-l-4 hover:bg-surface-muted transition-colors"
                      style={{ borderColor: wsBoard.color }}
                    >
                      <p className="text-sm font-medium text-text-heading truncate">
                        {wsBoard.name}
                      </p>
                      <p className="text-xs text-text-muted truncate">
                        Updated {wsBoard.updatedAt}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Featured Workspace Banner */}
      {workspaces.length > 0 && (
        <div className="bg-surface-card border border-border rounded-xl p-6 shadow-card flex items-center justify-between">
          <div className="flex-1">
            <span className="inline-block bg-brand-light text-brand text-xs rounded-full px-3 py-1 font-medium mb-3">
              FEATURED WORKSPACE
            </span>
            <h3 className="text-2xl font-bold text-text-heading mb-2">
              {workspaces[0].name}
            </h3>
            <p className="text-sm text-text-body mb-4">
              A central hub for cross-functional collaboration on product roadmap and delivery
              coordination.
            </p>
            <button className="flex items-center gap-2 bg-brand text-white rounded-lg px-4 py-2 hover:bg-brand-dark transition-colors text-sm font-medium">
              Go to Workspace
              <ExternalLink className="w-4 h-4" />
            </button>

            {/* Member avatars */}
            <div className="flex items-center gap-2 mt-4">
              {workspaces[0].boards.map((_, idx) => (
                <div
                  key={idx}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCharCode(65 + idx)}
                </div>
              ))}
            </div>
          </div>

          {/* Preview Box */}
          <div className="hidden lg:block w-60 h-32 rounded-xl bg-gradient-to-br from-pink-100 to-rose-200" />
        </div>
      )}
    </div>
  );
}
