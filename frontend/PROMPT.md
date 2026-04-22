# Complete Trello UI Redesign - Phases 8-10

## Context
- Project: Trello Clone (Next.js 16, React 19, TypeScript, Tailwind CSS)
- Status: 50% complete, build passing
- Already done: design system, API client, stores, middleware, UI components, layout, auth pages

## Phase 8: Dashboard Boards

### Create: `src/components/board/BoardCard.tsx`
Card component displaying a board with title, date, 3-dot menu (rename/delete), and click to navigate.

### Create: `src/components/board/CreateBoardModal.tsx`
Modal for creating boards with text input (max 100 chars), create/cancel buttons, loading state.

### Rewrite: `src/app/dashboard/page.tsx`
- Use DashboardLayout wrapper
- Topbar with "My Boards" title and "+ Create" button
- Fetch boards from GET /api/boards
- Display in grid (3 cols desktop, 2 tablet, 1 mobile)
- Use BoardCard component
- Implement create/delete/rename mutations
- Show empty state when no boards
- Only for regular users (not admin/superadmin)

## Phase 9: Users Management

### Create: `src/app/dashboard/users/page.tsx`
- Accessible to admin/superadmin only
- Fetch users from /api/admin/users or /api/super-admin/users
- Fetch roles from /api/super-admin/roles (superadmin only)
- Use DashboardLayout
- Pass users and roles to UsersTable

### Create: `src/components/admin/UsersTable.tsx`
Table component with:
- Columns: ID, Email, Role (badge), Created, Actions
- Search by email (client-side)
- Sortable columns (click headers)
- Pagination (10 per page)
- Edit role dropdown (superadmin only)
- Delete button (can't delete self or higher roles)

## Phase 10: Kanban Board

### Create: `src/components/board/KanbanColumn.tsx`
Column component with header (name + task count), scrollable task list, "+ Add Task" button.

### Create: `src/components/board/TaskCard.tsx`
Task card with title, description preview, relative timestamp, 3-dot menu (edit/move/delete).

### Create: `src/components/board/TaskModal.tsx`
Modal for create/edit tasks with title input, description textarea, status select.

### Rewrite: `src/app/board/[id]/page.tsx`
- Fetch board and tasks
- Display 3 columns (Todo, In Progress, Done)
- Implement task CRUD mutations
- Implement move task between columns
- Confirmation before delete

## Requirements

1. Use CSS variables for colors (var(--primary), var(--surface-0), etc.)
2. Wrap all API calls in try/catch
3. Show loading spinner on buttons
4. Show error toast on failures
5. Confirmation dialog before delete
6. Empty state when no data
7. Responsive: 375px, 768px, 1440px
8. Add 'use client' at top of components
9. Use DashboardLayout for pages
10. Export as named exports

## API Endpoints

### Boards
- GET /api/boards
- POST /api/boards {name: string}
- PUT /api/boards/{id} {name: string}
- DELETE /api/boards/{id}

### Tasks
- GET /api/tasks?board_id={id}
- POST /api/tasks {title, description, status, board_id}
- PUT /api/tasks/{id} {title, description, status}
- DELETE /api/tasks/{id}

### Users
- GET /api/admin/users
- GET /api/super-admin/users
- GET /api/super-admin/roles
- PUT /api/super-admin/users/{id}/role {role_id: number}
- DELETE /api/super-admin/users/{id}
- DELETE /api/admin/users/{id}

## Implementation Order

1. Phase 8: Dashboard redesign (2-3 hours)
2. Phase 9: Users management (2-3 hours)
3. Phase 10: Kanban board (3-4 hours)

Test after each: `npm run build`

## Checklist

- [ ] All components use 'use client'
- [ ] All API calls have error handling
- [ ] All buttons show loading state
- [ ] All deletes have confirmation
- [ ] All pages use DashboardLayout
- [ ] All colors use CSS variables
- [ ] Responsive on all sizes
- [ ] Build passes
- [ ] No TypeScript errors
- [ ] No console errors

---

Ready to implement!
