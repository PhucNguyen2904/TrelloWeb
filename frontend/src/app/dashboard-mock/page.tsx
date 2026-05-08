import React from 'react';
import ProjectFlowNavbar from '@/components/layout/ProjectFlowNavbar';
import ProjectFlowSidebar from '@/components/layout/ProjectFlowSidebar';
import DashboardBoardCard from '@/components/dashboard/DashboardBoardCard';
import WorkspaceCard from '@/components/dashboard/WorkspaceCard';
import WorkspaceSidebarCard from '@/components/dashboard/WorkspaceSidebarCard';
import FeaturedWorkspace from '@/components/dashboard/FeaturedWorkspace';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-on-background">
      <ProjectFlowNavbar />
      
      <div className="flex">
        <ProjectFlowSidebar />
        
        <main className="md:ml-sidebar_width w-full p-6 lg:p-10">
          {/* Recently Viewed */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-outline">schedule</span>
              <h2 className="font-h2 text-h2 text-on-surface">Recently viewed</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardBoardCard 
                title="Website Redesign" 
                bgGradient="bg-gradient-to-br from-[#0079BF] to-[#5067C5]"
                bgImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=500"
                members={['https://i.pravatar.cc/100?img=31', 'https://i.pravatar.cc/100?img=32']}
              />
              <DashboardBoardCard 
                title="Marketing Q4" 
                bgGradient="bg-gradient-to-br from-[#519839] to-[#86BC25]"
                isStarred
                members={['https://i.pravatar.cc/100?img=33']}
              />
              <DashboardBoardCard 
                title="User Research" 
                bgGradient="bg-gradient-to-br from-[#D29034] to-[#F1B15E]"
                members={['https://i.pravatar.cc/100?img=34', 'https://i.pravatar.cc/100?img=35']}
              />
              
              {/* Create New Board Card */}
              <div className="group relative bg-surface-container-low/50 rounded-lg border-2 border-dashed border-outline-variant flex flex-col items-center justify-center p-6 hover:bg-surface-container-low hover:border-primary transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">add</span>
                </div>
                <p className="font-label-sm text-label-sm text-outline mt-3">Create new board</p>
              </div>
            </div>
          </section>

          {/* Workspaces Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-outline">workspaces</span>
                <h2 className="font-h2 text-h2 text-on-surface uppercase tracking-wider text-xs font-bold text-outline">Your Workspaces</h2>
              </div>
              <button className="text-primary font-semibold text-sm flex items-center gap-1 hover:underline transition-all">
                View all workspaces
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </button>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Workspace 1: Engineering */}
              <WorkspaceCard 
                name="Engineering Team"
                initials="ET"
                stats="12 Boards • 24 Members"
                boards={[
                  { title: "Sprint Backlog", updatedAt: "Updated 2h ago", color: "bg-blue-500" },
                  { title: "CI/CD Pipeline", updatedAt: "Updated 1d ago", color: "bg-green-500" },
                  { title: "Bug Tracking", updatedAt: "Updated 4h ago", color: "bg-purple-500" },
                  { title: "Infrastructure", updatedAt: "Updated 5d ago", color: "bg-orange-500" }
                ]}
              />

              {/* Workspace 2: Marketing */}
              <WorkspaceSidebarCard 
                name="Marketing"
                initials="M"
                boardCount={8}
                featuredBoards={["Social Media Plan", "Q4 Ad Campaigns", "Content Calendar"]}
              />

              {/* Workspace 3: Product Design */}
              <FeaturedWorkspace 
                tag="Featured Workspace"
                name="Product Design Team"
                description="Centralize your design systems, user flows, and high-fidelity mockups in one unified workspace."
                ctaText="Go to Workspace"
                image="https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?auto=format&fit=crop&q=80&w=1000"
                avatars={['https://i.pravatar.cc/100?img=36', 'https://i.pravatar.cc/100?img=37', 'https://i.pravatar.cc/100?img=38']}
              />
            </div>
          </section>
        </main>
      </div>

      {/* FAB */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>
    </div>
  );
}
