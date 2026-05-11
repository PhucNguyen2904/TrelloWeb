
'use client';

import React from 'react';
import { HelpCircle, Book, MessageSquare, LifeBuoy, Search, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function HelpCenterPage() {
  return (
    <div className="flex-1 bg-white overflow-y-auto">
      {/* Hero Section */}
      <div className="bg-[#0079BF] py-16 px-8 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold text-white tracking-tight">How can we help?</h1>
          <p className="text-blue-100 text-lg">Search our documentation or contact our support team to get started.</p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search for articles, guides..." 
              className="w-full pl-12 pr-4 py-4 rounded-xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/20 transition-all text-slate-900 font-medium"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-12 space-y-16">
        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <CategoryCard 
            icon={<Book className="w-8 h-8 text-blue-600" />}
            title="Documentation"
            description="Detailed guides on how to use ProjectFlow features and workflows."
          />
          <CategoryCard 
            icon={<MessageSquare className="w-8 h-8 text-emerald-600" />}
            title="Community Forum"
            description="Connect with other users, share tips, and ask for advice."
          />
          <CategoryCard 
            icon={<LifeBuoy className="w-8 h-8 text-rose-600" />}
            title="Direct Support"
            description="Can't find what you need? Our team is here to help 24/7."
          />
        </div>

        {/* Featured Articles */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-[#0079BF] pl-4">Popular Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ArticleLink title="Getting started with Kanban boards" />
            <ArticleLink title="How to invite and manage team members" />
            <ArticleLink title="Understanding workspace permissions" />
            <ArticleLink title="Using filters to find tasks faster" />
            <ArticleLink title="Syncing with your calendar" />
            <ArticleLink title="Keyboard shortcuts for power users" />
          </div>
        </div>

        {/* Footer Contact */}
        <div className="bg-slate-50 rounded-3xl p-10 flex flex-col items-center text-center space-y-6 border border-slate-100">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Still have questions?</h3>
            <p className="text-slate-500 max-w-md">Our friendly support team is always ready to help you overcome any challenges.</p>
          </div>
          <button 
            className="text-white px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-200/50 hover:shadow-2xl hover:-translate-y-1 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)'
            }}
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all group cursor-pointer">
      <div className="mb-6 bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function ArticleLink({ title }: { title: string }) {
  return (
    <div className="p-4 flex items-center justify-between border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
      <span className="text-slate-700 font-medium group-hover:text-blue-600">{title}</span>
      <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-400" />
    </div>
  );
}
