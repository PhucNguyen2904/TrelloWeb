import { addDays, formatISO, isSameDay, startOfMonth } from "date-fns";

export type Member = {
  id: number;
  name: string;
  initials: string;
  color: string;
};

export type BoardSummary = {
  id: number;
  name: string;
  slug: string;
  description: string;
  members: Member[];
  lastUpdated: string;
  theme: string;
  starred?: boolean;
};

export type Workspace = {
  id: number;
  name: string;
  color: string;
  members: Member[];
  description: string;
  boards: BoardSummary[];
};

export type KanbanStatus = "todo" | "in-progress" | "testing" | "done";
export type KanbanPriority = "critical" | "high" | "medium" | "low";

export type KanbanCardData = {
  id: string;
  boardId: number;
  title: string;
  status: KanbanStatus;
  priority: KanbanPriority;
  dueDate: string;
  comments: number;
  assignee: Member;
  cover?: string;
  tag: string;
};

export type CalendarEventKind =
  | "Critical"
  | "Sprint"
  | "Planning"
  | "Design"
  | "UI/Dev"
  | "Content"
  | "Backend"
  | "API"
  | "Demo";

export type CalendarEvent = {
  id: string;
  title: string;
  kind: CalendarEventKind;
  date: string;
  time: string;
  description: string;
  attendees: Member[];
};

export const teamMembers: Member[] = [
  { id: 1, name: "An Nguyen", initials: "AN", color: "#6366F1" },
  { id: 2, name: "Binh Tran", initials: "BT", color: "#10B981" },
  { id: 3, name: "Chi Le", initials: "CL", color: "#F59E0B" },
  { id: 4, name: "Duy Pham", initials: "DP", color: "#3B82F6" },
  { id: 5, name: "Linh Vo", initials: "LV", color: "#8B5CF6" },
];

const boardMembers = (...indexes: number[]) => indexes.map((index) => teamMembers[index]);

export const workspaces: Workspace[] = [
  {
    id: 1,
    name: "Product Studio",
    color: "#6366F1",
    description: "Cross-functional roadmap, launches, and editorial planning.",
    members: boardMembers(0, 1, 2, 3),
    boards: [
      {
        id: 11,
        name: "Q2 Launch Sequence",
        slug: "q2-launch-sequence",
        description: "Coordinate positioning, release notes, and beta rollout.",
        members: boardMembers(0, 1, 2),
        lastUpdated: "18m ago",
        theme: "from-indigo-500/45 via-fuchsia-500/25 to-sky-400/25",
        starred: true,
      },
      {
        id: 12,
        name: "Website Refresh",
        slug: "website-refresh",
        description: "Homepage narrative, pricing polish, and support assets.",
        members: boardMembers(0, 2, 4),
        lastUpdated: "2h ago",
        theme: "from-emerald-500/30 via-cyan-400/20 to-indigo-500/30",
      },
      {
        id: 13,
        name: "Growth Experiments",
        slug: "growth-experiments",
        description: "Acquisition ideas and copy experiments.",
        members: boardMembers(1, 3, 4),
        lastUpdated: "Yesterday",
        theme: "from-amber-400/35 via-rose-400/18 to-orange-500/28",
      },
      {
        id: 14,
        name: "Mobile Rewrite",
        slug: "mobile-rewrite",
        description: "Foundation for gesture-heavy mobile surfaces.",
        members: boardMembers(0, 3, 4),
        lastUpdated: "3d ago",
        theme: "from-slate-200/10 via-blue-500/20 to-indigo-500/35",
      },
    ],
  },
  {
    id: 2,
    name: "Client Delivery",
    color: "#F59E0B",
    description: "Delivery cadence, support handoffs, and demos.",
    members: boardMembers(1, 2, 3, 4),
    boards: [
      {
        id: 21,
        name: "Enterprise Onboarding",
        slug: "enterprise-onboarding",
        description: "Templates, integrations, and weekly checkpoints.",
        members: boardMembers(1, 3, 4),
        lastUpdated: "35m ago",
        theme: "from-orange-400/35 via-amber-300/25 to-yellow-500/20",
      },
      {
        id: 22,
        name: "Support Ops",
        slug: "support-ops",
        description: "Escalation playbooks and inbox automation.",
        members: boardMembers(1, 2),
        lastUpdated: "4h ago",
        theme: "from-teal-400/28 via-cyan-400/15 to-indigo-400/25",
      },
      {
        id: 23,
        name: "Executive Reviews",
        slug: "executive-reviews",
        description: "Prep decks, notes, and quarterly goals.",
        members: boardMembers(0, 2, 4),
        lastUpdated: "Today",
        theme: "from-violet-500/26 via-slate-400/10 to-pink-500/24",
      },
      {
        id: 24,
        name: "Migration Sprint",
        slug: "migration-sprint",
        description: "Data mapping and API parity cleanup.",
        members: boardMembers(0, 1, 3),
        lastUpdated: "2d ago",
        theme: "from-blue-500/30 via-cyan-500/20 to-emerald-500/18",
      },
    ],
  },
  {
    id: 3,
    name: "Creative Lab",
    color: "#10B981",
    description: "Brand systems, motion passes, and content production.",
    members: boardMembers(0, 2, 4),
    boards: [
      {
        id: 31,
        name: "Editorial System",
        slug: "editorial-system",
        description: "Fraunces-led typography and motion studies.",
        members: boardMembers(0, 2, 4),
        lastUpdated: "1h ago",
        theme: "from-emerald-400/26 via-lime-300/15 to-cyan-500/20",
      },
      {
        id: 32,
        name: "Brand Motion Kit",
        slug: "brand-motion-kit",
        description: "Reusable motion presets and reveal choreography.",
        members: boardMembers(2, 4),
        lastUpdated: "5h ago",
        theme: "from-purple-500/30 via-indigo-500/22 to-blue-500/16",
      },
      {
        id: 33,
        name: "Case Studies",
        slug: "case-studies",
        description: "Interviews, screenshots, and launch-ready drafts.",
        members: boardMembers(1, 2, 4),
        lastUpdated: "Yesterday",
        theme: "from-amber-300/28 via-orange-500/18 to-rose-400/18",
      },
      {
        id: 34,
        name: "Illustration Queue",
        slug: "illustration-queue",
        description: "Hero scenes, icons, and social crops.",
        members: boardMembers(0, 2),
        lastUpdated: "4d ago",
        theme: "from-sky-400/18 via-indigo-500/24 to-violet-500/26",
      },
    ],
  },
];

export const recentBoards = workspaces.flatMap((workspace) => workspace.boards).slice(0, 6);
export const featuredWorkspace = workspaces[0];

export const statusColumns: Array<{ id: KanbanStatus; label: string }> = [
  { id: "todo", label: "To Do" },
  { id: "in-progress", label: "In Progress" },
  { id: "testing", label: "Testing" },
  { id: "done", label: "Done" },
];

export const kanbanCards: KanbanCardData[] = [
  {
    id: "k1",
    boardId: 11,
    title: "Draft product launch narrative for hero and changelog",
    status: "todo",
    priority: "high",
    dueDate: formatISO(addDays(new Date(), 1)),
    comments: 4,
    assignee: teamMembers[0],
    tag: "Content",
  },
  {
    id: "k2",
    boardId: 11,
    title: "Refine release illustration treatment with editorial shadows",
    status: "todo",
    priority: "medium",
    dueDate: formatISO(addDays(new Date(), 3)),
    comments: 1,
    assignee: teamMembers[2],
    tag: "Design",
    cover: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "k3",
    boardId: 11,
    title: "Implement analytics events for activation funnel",
    status: "in-progress",
    priority: "critical",
    dueDate: formatISO(addDays(new Date(), -1)),
    comments: 8,
    assignee: teamMembers[3],
    tag: "API",
  },
  {
    id: "k4",
    boardId: 11,
    title: "QA handoff for beta invite journey",
    status: "in-progress",
    priority: "high",
    dueDate: formatISO(addDays(new Date(), 2)),
    comments: 3,
    assignee: teamMembers[1],
    tag: "Sprint",
  },
  {
    id: "k5",
    boardId: 11,
    title: "Validate email templates across dark mode clients",
    status: "testing",
    priority: "medium",
    dueDate: formatISO(addDays(new Date(), 4)),
    comments: 6,
    assignee: teamMembers[4],
    tag: "UI/Dev",
  },
  {
    id: "k6",
    boardId: 11,
    title: "Lock final rollout checklist for production deploy",
    status: "testing",
    priority: "low",
    dueDate: formatISO(addDays(new Date(), 6)),
    comments: 2,
    assignee: teamMembers[0],
    tag: "Planning",
  },
  {
    id: "k7",
    boardId: 11,
    title: "Ship release notes layout and archive process",
    status: "done",
    priority: "medium",
    dueDate: formatISO(addDays(new Date(), -2)),
    comments: 5,
    assignee: teamMembers[2],
    tag: "Content",
  },
  {
    id: "k8",
    boardId: 11,
    title: "Record walkthrough video for sales enablement",
    status: "done",
    priority: "low",
    dueDate: formatISO(addDays(new Date(), -4)),
    comments: 0,
    assignee: teamMembers[1],
    tag: "Demo",
  },
  {
    id: "k9",
    boardId: 11,
    title: "Prepare migration notes for support team handoff",
    status: "todo",
    priority: "high",
    dueDate: formatISO(addDays(new Date(), 5)),
    comments: 7,
    assignee: teamMembers[4],
    tag: "Backend",
  },
  {
    id: "k10",
    boardId: 11,
    title: "Tune loading states and skeleton choreography",
    status: "in-progress",
    priority: "medium",
    dueDate: formatISO(addDays(new Date(), 2)),
    comments: 2,
    assignee: teamMembers[0],
    tag: "UI/Dev",
  },
  {
    id: "k11",
    boardId: 11,
    title: "Cross-browser pass for sticky board header",
    status: "testing",
    priority: "high",
    dueDate: formatISO(addDays(new Date(), 1)),
    comments: 4,
    assignee: teamMembers[3],
    tag: "Critical",
  },
  {
    id: "k12",
    boardId: 11,
    title: "Archive legacy sprint checklist into handbook",
    status: "done",
    priority: "low",
    dueDate: formatISO(addDays(new Date(), -6)),
    comments: 1,
    assignee: teamMembers[2],
    tag: "Planning",
  },
];

const monthStart = startOfMonth(new Date());
const calendarEventSeeds: [string, string, CalendarEventKind, number, string][] = [
  ["e1", "Sprint planning: launch wave 2", "Planning", 1, "09:00"],
  ["e2", "Critical blocker review", "Critical", 2, "11:30"],
  ["e3", "Design critique for editorial cards", "Design", 4, "14:00"],
  ["e4", "Backend sync on migration tasks", "Backend", 5, "10:00"],
  ["e5", "API readiness checkpoint", "API", 7, "16:30"],
  ["e6", "UI implementation pairing", "UI/Dev", 8, "13:00"],
  ["e7", "Content review with growth team", "Content", 10, "15:00"],
  ["e8", "Sprint demo rehearsal", "Demo", 12, "17:00"],
  ["e9", "Design handoff review", "Design", 14, "10:30"],
  ["e10", "Platform sprint kickoff", "Sprint", 16, "09:30"],
  ["e11", "Executive roadmap review", "Planning", 18, "11:00"],
  ["e12", "Critical QA triage", "Critical", 20, "08:45"],
  ["e13", "Backend incident drill", "Backend", 22, "15:30"],
  ["e14", "API partner demo", "API", 24, "12:00"],
  ["e15", "Content publish window", "Content", 27, "09:15"],
];

export const calendarEvents: CalendarEvent[] = calendarEventSeeds.map(([id, title, kind, dayOffset, time], index) => ({
  id,
  title,
  kind,
  date: formatISO(addDays(monthStart, dayOffset)),
  time,
  description: `${title} keeps the team aligned on the current launch sequence and unblocks the next milestone.`,
  attendees: [teamMembers[index % 5], teamMembers[(index + 1) % 5]],
}));

export function getBoardById(boardId: number) {
  return workspaces.flatMap((workspace) => workspace.boards).find((board) => board.id === boardId) ?? recentBoards[0];
}

export function getCalendarEventsForDate(date: Date) {
  return calendarEvents.filter((event) => isSameDay(new Date(event.date), date));
}
