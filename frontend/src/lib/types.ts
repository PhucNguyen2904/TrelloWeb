export interface Member {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  labels: Label[];
  assignees: Member[];
  dueDate?: string;
  checklist?: ChecklistItem[];
  commentCount: number;
  imageUrl?: string;
  isOverdue?: boolean;
}

export interface KanbanColumn {
  id: string;
  name: string;
  cardIds: string[];
}

export interface Board {
  id: string;
  name: string;
  coverColor: string;
  members: Member[];
  columns: KanbanColumn[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  color: string;
  assignees: Member[];
}

export interface Workspace {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  boardCount: number;
  memberCount: number;
  boards: {
    id: string;
    name: string;
    color: string;
    updatedAt: string;
  }[];
}

export interface Activity {
  id: string;
  activity: string;
  owner: string;
  team: string;
  status: "In Review" | "Completed" | "Backlog";
  time: string;
}
