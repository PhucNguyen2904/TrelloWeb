import { addDays, formatISO, isSameDay, startOfMonth } from "date-fns";

import type {
  Member,
  Label,
  Card,
  KanbanColumn,
  Board,
  CalendarEvent,
  Workspace,
  Activity,
} from "./types";

export type { Member, Label, Card, KanbanColumn, Board, CalendarEvent, Workspace, Activity };

// Members
export const members: Member[] = [
  { id: "1", name: "An Nguyen", initials: "AN", avatarColor: "#6366F1" },
  { id: "2", name: "Minh Tran", initials: "MT", avatarColor: "#10B981" },
  { id: "3", name: "Linh Pham", initials: "LP", avatarColor: "#F59E0B" },
  { id: "4", name: "Duc Le", initials: "DL", avatarColor: "#3B82F6" },
  { id: "5", name: "Nam Vu", initials: "NV", avatarColor: "#8B5CF6" },
];

// Labels
export const labels: Label[] = [
  { id: "1", name: "Backend", color: "#3B82F6" },
  { id: "2", name: "Frontend", color: "#10B981" },
  { id: "3", name: "Critical", color: "#EF4444" },
  { id: "4", name: "Enhancement", color: "#8B5CF6" },
  { id: "5", name: "Documentation", color: "#F59E0B" },
];

// Cards
export const cards: Card[] = [
  {
    id: "card-1",
    title: "Refactor the API authentication middleware for Node.js",
    columnId: "col-1",
    labels: [labels[0], labels[1]],
    assignees: [members[0]],
    dueDate: "2024-10-24",
    commentCount: 3,
    checklist: [
      { id: "check-1", text: "Review OAuth flow", completed: true },
      { id: "check-2", text: "Update JWT validation", completed: true },
      { id: "check-3", text: "Add rate limiting", completed: false },
    ],
  },
  {
    id: "card-2",
    title: "Design System: Update Typography Tokens in Tailwind Config",
    columnId: "col-1",
    labels: [labels[4]],
    assignees: [members[2], members[3]],
    dueDate: "2024-10-20",
    isOverdue: true,
    commentCount: 2,
  },
  {
    id: "card-3",
    title: "Fix race condition in payment processing module",
    columnId: "col-2",
    labels: [labels[2]],
    assignees: [members[1]],
    commentCount: 4,
    checklist: [
      { id: "check-4", text: "Identify race condition", completed: true },
      { id: "check-5", text: "Write unit tests", completed: true },
      { id: "check-6", text: "Deploy to staging", completed: false },
      { id: "check-7", text: "Performance testing", completed: false },
    ],
  },
  {
    id: "card-4",
    title: "Database Migration: PostgreSQL v15 to v16",
    columnId: "col-2",
    labels: [labels[0]],
    assignees: [members[4]],
    commentCount: 2,
  },
  {
    id: "card-5",
    title: "UAT: Mobile App Dark Mode Toggle",
    columnId: "col-3",
    labels: [labels[3]],
    assignees: [members[2]],
    commentCount: 0,
  },
  {
    id: "card-6",
    title: "Implement new onboarding flow",
    columnId: "col-4",
    labels: [labels[1]],
    assignees: [members[0], members[3]],
    commentCount: 5,
  },
  {
    id: "card-7",
    title: "Update Terms of Service",
    columnId: "col-4",
    labels: [labels[4]],
    assignees: [members[1]],
    commentCount: 1,
  },
];

// Kanban Columns
export const kanbanColumns: KanbanColumn[] = [
  {
    id: "col-1",
    name: "To Do",
    cardIds: ["card-1", "card-2"],
  },
  {
    id: "col-2",
    name: "In Progress",
    cardIds: ["card-3", "card-4"],
  },
  {
    id: "col-3",
    name: "Testing",
    cardIds: ["card-5"],
  },
  {
    id: "col-4",
    name: "Done",
    cardIds: ["card-6", "card-7"],
  },
];

// Boards
export const boards: Board[] = [
  {
    id: "board-1",
    name: "Development",
    coverColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    members: members.slice(0, 4),
    columns: kanbanColumns,
  },
];

// Recent Boards (for home page)
export const recentBoards: Board[] = boards.slice(0, 6).length < 6
  ? [...boards.slice(0, 6), ...boards.slice(0, 6 - boards.length)]
  : boards.slice(0, 6);

// Workspaces
export const workspaces: Workspace[] = [
  {
    id: "ws-1",
    name: "Engineering Team",
    initials: "ET",
    avatarColor: "#0079BF",
    boardCount: 12,
    memberCount: 24,
    boards: [
      {
        id: "ws1-b1",
        name: "Sprint Backlog",
        color: "#0079BF",
        updatedAt: "2 hours ago",
      },
      {
        id: "ws1-b2",
        name: "CI/CD Pipeline",
        color: "#10B981",
        updatedAt: "4 hours ago",
      },
      {
        id: "ws1-b3",
        name: "Bug Tracking",
        color: "#EF4444",
        updatedAt: "1 day ago",
      },
      {
        id: "ws1-b4",
        name: "Infrastructure",
        color: "#3B82F6",
        updatedAt: "2 days ago",
      },
    ],
  },
  {
    id: "ws-2",
    name: "Marketing",
    initials: "MK",
    avatarColor: "#F59E0B",
    boardCount: 8,
    memberCount: 12,
    boards: [
      {
        id: "ws2-b1",
        name: "Social Media Plan",
        color: "#8B5CF6",
        updatedAt: "1 hour ago",
      },
      {
        id: "ws2-b2",
        name: "Q4 Ad Campaigns",
        color: "#EC4899",
        updatedAt: "3 hours ago",
      },
      {
        id: "ws2-b3",
        name: "Content Calendar",
        color: "#F59E0B",
        updatedAt: "5 hours ago",
      },
      {
        id: "ws2-b4",
        name: "Analytics Tracking",
        color: "#06B6D4",
        updatedAt: "1 day ago",
      },
    ],
  },
];

// Activities
export const activities: Activity[] = [
  {
    id: "act-1",
    activity: "Moved 'Payment retries' to In Review",
    owner: "An Nguyen",
    team: "Backend",
    status: "In Review",
    time: "8 minutes ago",
  },
  {
    id: "act-2",
    activity: "Closed incident PF-241",
    owner: "Minh Tran",
    team: "Platform",
    status: "Completed",
    time: "26 minutes ago",
  },
  {
    id: "act-3",
    activity: "Created task 'Refactor release notes parser'",
    owner: "Linh Pham",
    team: "Frontend",
    status: "Backlog",
    time: "1 hour ago",
  },
  {
    id: "act-4",
    activity: "Deployed v2.4.1 to production",
    owner: "Duc Le",
    team: "DevOps",
    status: "Completed",
    time: "2 hours ago",
  },
  {
    id: "act-5",
    activity: "Opened PR: Fix pagination edge case",
    owner: "Nam Vu",
    team: "Backend",
    status: "In Review",
    time: "3 hours ago",
  },
];

// Calendar Events
const monthStart = startOfMonth(new Date("2023-10-01"));
export const calendarEvents: CalendarEvent[] = [
  {
    id: "event-1",
    title: "Critical: Bug Fixes",
    date: "2023-10-05",
    color: "#EF4444",
    assignees: [members[0], members[1]],
  },
  {
    id: "event-2",
    title: "Sprint Planning",
    date: "2023-10-09",
    color: "#0079BF",
    assignees: [members[2], members[3], members[4]],
  },
  {
    id: "event-3",
    title: "Design Review",
    date: "2023-10-12",
    color: "#10B981",
    assignees: [members[2]],
  },
  {
    id: "event-4",
    title: "UI Implementation",
    date: "2023-10-15",
    color: "#3B82F6",
    assignees: [members[1], members[3]],
  },
  {
    id: "event-5",
    title: "Content Audit",
    date: "2023-10-18",
    color: "#F59E0B",
    assignees: [members[0], members[2]],
  },
  {
    id: "event-6",
    title: "Backend Sync",
    date: "2023-10-20",
    color: "#F97316",
    assignees: [members[4]],
  },
  {
    id: "event-7",
    title: "Mobile Prep",
    date: "2023-10-22",
    color: "#8B5CF6",
    assignees: [members[1], members[3]],
  },
  {
    id: "event-8",
    title: "API Documentation",
    date: "2023-10-25",
    color: "#7C3AED",
    assignees: [members[0], members[4]],
  },
  {
    id: "event-9",
    title: "Client Demo",
    date: "2023-10-28",
    color: "#EF4444",
    assignees: [members[2], members[3]],
  },
];
