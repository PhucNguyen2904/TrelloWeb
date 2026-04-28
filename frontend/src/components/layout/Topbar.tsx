'use client';

import React from "react";
import { Bell, Search, Settings, Plus, Menu } from 'lucide-react';
import Link from 'next/link';

interface TopBarProps {
  onCreateClick?: () => void;
  onMobileMenuClick?: () => void;
}

export function TopBar({ onCreateClick, onMobileMenuClick }: TopBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-topbar bg-surface-card border-b border-border flex items-center px-6 z-40">
      {/* Left: Logo + Nav */}
      <div className="flex items-center gap-8 flex-1">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-brand flex items-center justify-center">
            <span className="text-xs text-white font-bold">PF</span>
          </div>
          <span className="text-sm font-bold text-brand">ProjectFlow</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {["Workspaces", "Recent", "Starred"].map((item) => (
            <button
              key={item}
              className="text-sm text-text-body hover:text-text-heading transition-colors"
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex flex-1 max-w-xs mx-4">
        <div className="w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search boards, tasks, members..."
            className="w-full bg-surface-muted border border-border rounded-full h-9 pl-10 pr-4 text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-0"
          />
        </div>
      </div>

      {/* Right: Actions + Avatar */}
      <div className="flex items-center gap-4">
        <button
          onClick={onCreateClick}
          className="hidden lg:flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-darker transition"
        >
          <Plus className="w-4 h-4" />
          Create
        </button>

        <button className="relative p-2 hover:bg-surface-muted rounded-lg transition">
          <Bell className="w-5 h-5 text-text-body" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button className="p-2 hover:bg-surface-muted rounded-lg transition">
          <Settings className="w-5 h-5 text-text-body" />
        </button>

        <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-semibold">
          AN
        </div>

        <button onClick={onMobileMenuClick} className="lg:hidden p-2 hover:bg-surface-muted rounded-lg transition">
          <Menu className="w-5 h-5 text-text-body" />
        </button>
      </div>
    </div>
  );
}