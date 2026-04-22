# Master Frontend Implementation Prompt: ProjectFlow (Trello-style Application)

## 1. Project Overview
Build a high-fidelity, responsive project management application named "ProjectFlow". The application follows a Kanban-style workflow similar to Trello, including authentication, dashboards, boards, task details, and calendar views.

## 2. Global Design Specifications (Design System: Clarity & Momentum)
- **Primary Color:** #0079BF (ProjectFlow Blue)
- **Surface Colors:** 
  - Background: #f7f9ff
  - Surface-low: #f1f3fa
  - Surface-container: #ffffff
- **Typography:** Inter (Sans-serif). 
- **Radius:** 8px (Standard for cards, buttons, and inputs).
- **Shadows:** Subtle elevation (shadow-sm) for cards and modals.
- **Framework Recommendation:** React/Vue with Tailwind CSS.

## 3. Shared Components
### TopNavBar (Main App)
- **Logo:** ProjectFlow (Icon + Text, font-black, text-[#0079BF]).
- **Links:** Workspaces, Recent, Starred.
- **Actions:** Search bar, "Create" button, Notifications, Help, Settings, User Profile.

### SideNavBar (Main App Shell)
- **Navigation:** Boards, Members, Workspace Settings, Analytics, Calendar.
- **Footer:** Help Center, Logout.
- **Style:** Fixed width (256px), border-right, subtle background (#f7f9ff).

---

## 4. Screen-Specific Requirements

### Screen 1: Login & Sign Up (Split Layout)
- **Layout:** 50/50 split on desktop.
- **Left Column (Visual):** 
    - Background: ProjectFlow Blue Gradient.
    - Content: Large marketing heading (e.g., "Manage your projects with ease.") and a subtle UI mock-up illustration.
- **Right Column (Form):**
    - Clean white background, centered form.
    - **Login Form:** Email, Password (with "Forgot?"), "Keep me signed in" checkbox, Primary Login button, Social Auth (Google/Microsoft).
    - **Sign Up Form:** Full Name, Work Email, Password, Terms agreement checkbox, Primary "Get Started" button.

### Screen 2: Dashboard (Overview)
- **Recently Viewed Section:** Horizontal grid of board cards with cover images.
- **Your Workspaces Section:** List of teams and boards with colored status indicators.
- **Sidebar Feature:** "Featured Workspace" highlight card with a CTA "Go to Workspace".

### Screen 3: Board View (Kanban)
- **Board Header:** Title, Star, Public/Private badge, Member avatars, Filters, Share.
- **Kanban Columns:** Horizontal scroll. "Add a card" button at the bottom.
- **Task Cards:** Title, Labels (pills), Avatars, Due dates, Attachment/Comment icons.

### Screen 4: Card Detail (Modal)
- **Main Column:** Editable title, Labels, Description (Markdown), Checklist with progress bar, Activity feed.
- **Sidebar:** "Add to card" (Members, Labels, Checklist, Dates) and "Actions" (Move, Copy, Archive).

### Screen 5: Calendar View
- **Controls:** Month/Week/Day toggle, Today, Navigation.
- **Grid:** Standard calendar grid with color-coded task bars spanning dates.

---

## 5. Technical Implementation Details
- **Drag & Drop:** Implement using `dnd-kit` or `react-beautiful-dnd`.
- **Responsiveness:** On mobile (<768px), hide the SideNavBar (use hamburger) and hide the Left Visual Column on Auth screens.
- **Transitions:** Smooth CSS transitions for modal opening and hover states.