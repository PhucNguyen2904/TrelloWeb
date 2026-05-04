from datetime import datetime, timezone, timedelta
from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.crud.board import get_user_boards
from app.crud.task import get_board_tasks
from app.db.session import get_db
from app.deps.auth import get_current_user
from app.model.task import Task
from app.model.user import User

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


# ─── Response schemas ───────────────────────────────────────────────────────


class ActivityItem(BaseModel):
    id: str
    activity: str
    owner: str
    team: str
    status: str
    time: str

    class Config:
        from_attributes = True


class CalendarEventItem(BaseModel):
    id: str
    title: str
    date: str          # ISO date string YYYY-MM-DD
    color: str
    assignees: list = []

    class Config:
        from_attributes = True


class WorkspaceBoardItem(BaseModel):
    id: str
    name: str
    color: str
    updatedAt: str

    class Config:
        from_attributes = True


class WorkspaceItem(BaseModel):
    id: str
    name: str
    initials: str
    avatarColor: str
    boardCount: int
    memberCount: int
    boards: list[WorkspaceBoardItem]

    class Config:
        from_attributes = True


class BoardColumnCard(BaseModel):
    id: str
    title: str
    columnId: str
    labels: list = []
    assignees: list = []
    commentCount: int = 0
    description: Optional[str] = None

    class Config:
        from_attributes = True


class BoardColumn(BaseModel):
    id: str
    name: str
    cardIds: list[str]

    class Config:
        from_attributes = True


class BoardDetailResponse(BaseModel):
    id: str
    name: str
    coverColor: str
    members: list = []
    columns: list[BoardColumn]
    cards: list[BoardColumnCard]

    class Config:
        from_attributes = True


# ─── Status → colour mapping ────────────────────────────────────────────────

_STATUS_COLOR: dict[str, str] = {
    "todo":  "#94a3b8",   # slate
    "doing": "#0079bf",   # brand blue
    "done":  "#22c55e",   # green
}

_COLUMN_ORDER = ["todo", "doing", "done"]
_COLUMN_LABELS = {
    "todo":  "To Do",
    "doing": "In Progress",
    "done":  "Done",
}


def _relative_time(dt: datetime) -> str:
    """Return a human-readable relative time string."""
    now = datetime.now(timezone.utc)
    # Make dt timezone-aware if naive
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    diff = now - dt
    seconds = int(diff.total_seconds())
    if seconds < 60:
        return "just now"
    if seconds < 3600:
        m = seconds // 60
        return f"{m} minute{'s' if m > 1 else ''} ago"
    if seconds < 86400:
        h = seconds // 3600
        return f"{h} hour{'s' if h > 1 else ''} ago"
    d = seconds // 86400
    return f"{d} day{'s' if d > 1 else ''} ago"


def _status_label(status: str) -> str:
    mapping = {"todo": "Backlog", "doing": "In Review", "done": "Completed"}
    return mapping.get(status, status.capitalize())


# ─── Endpoints ──────────────────────────────────────────────────────────────


class UserStats(BaseModel):
    open_tasks: int
    in_progress: int
    completed_today: int
    overdue: int
    total_boards: int
    total_tasks: int

    class Config:
        from_attributes = True


@router.get("/stats", response_model=UserStats)
async def get_user_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Return task statistics for the current user's boards:
    - open_tasks: tasks with status 'todo'
    - in_progress: tasks with status 'doing'
    - completed_today: tasks with status 'done' updated today (UTC)
    - overdue: tasks not 'done' whose updated_at is older than 7 days (proxy)
    - total_boards: number of boards owned by the user
    - total_tasks: total task count across all boards
    """
    boards = get_user_boards(db, current_user.id)
    all_tasks: list[Task] = []
    for board in boards:
        all_tasks.extend(get_board_tasks(db, board.id))

    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

    open_tasks = 0
    in_progress = 0
    completed_today = 0
    overdue = 0

    for task in all_tasks:
        if task.status == "todo":
            open_tasks += 1
        elif task.status == "doing":
            in_progress += 1
        elif task.status == "done":
            updated = task.updated_at or task.created_at
            if updated.tzinfo is None:
                updated = updated.replace(tzinfo=timezone.utc)
            if updated >= today_start:
                completed_today += 1
        # Overdue: not done & last touched more than 7 days ago
        if task.status != "done":
            updated = task.updated_at or task.created_at
            if updated.tzinfo is None:
                updated = updated.replace(tzinfo=timezone.utc)
            if (now - updated) > timedelta(days=7):
                overdue += 1

    return UserStats(
        open_tasks=open_tasks,
        in_progress=in_progress,
        completed_today=completed_today,
        overdue=overdue,
        total_boards=len(boards),
        total_tasks=len(all_tasks),
    )


@router.get("/activities", response_model=list[ActivityItem])
async def get_activities(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Return the 20 most recently updated tasks across all boards
    of the current user, formatted as an activity feed.
    """
    boards = get_user_boards(db, current_user.id)
    all_tasks: list[Task] = []
    for board in boards:
        all_tasks.extend(get_board_tasks(db, board.id))

    # Sort by updated_at descending, take top 20
    all_tasks.sort(key=lambda t: t.updated_at or t.created_at, reverse=True)
    recent = all_tasks[:20]

    owner_name = current_user.email.split("@")[0]
    board_map = {b.id: b.name for b in boards}

    return [
        ActivityItem(
            id=str(task.id),
            activity=task.title,
            owner=owner_name,
            team=board_map.get(task.board_id, "—"),
            status=_status_label(task.status),
            time=_relative_time(task.updated_at or task.created_at),
        )
        for task in recent
    ]


@router.get("/calendar-events", response_model=list[CalendarEventItem])
async def get_calendar_events(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Return all tasks for the current user formatted as calendar events.
    Tasks without a due_date use their created_at date.
    Each task status maps to a distinct colour chip.
    """
    boards = get_user_boards(db, current_user.id)
    all_tasks: list[Task] = []
    for board in boards:
        all_tasks.extend(get_board_tasks(db, board.id))

    events = []
    for task in all_tasks:
        # Use updated_at as the "event date" (closest to a deadline we have)
        date_obj = task.updated_at or task.created_at
        events.append(
            CalendarEventItem(
                id=str(task.id),
                title=task.title,
                date=date_obj.strftime("%Y-%m-%d"),
                color=_STATUS_COLOR.get(task.status, "#94a3b8"),
            )
        )
    return events


@router.get("/workspaces", response_model=list[WorkspaceItem])
async def get_workspaces(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Return the current user's boards grouped as a single workspace.
    Since the DB has no Workspace model yet, we treat the user's
    collection of boards as one workspace.
    """
    boards = get_user_boards(db, current_user.id)
    if not boards:
        return []

    owner_name = current_user.email.split("@")[0]
    initials = owner_name[:2].upper() if len(owner_name) >= 2 else owner_name.upper()

    board_items = [
        WorkspaceBoardItem(
            id=str(b.id),
            name=b.name,
            color="#0079bf",
            updatedAt=b.updated_at.strftime("%Y-%m-%d") if b.updated_at else "",
        )
        for b in boards[:6]   # cap at 6 for UI
    ]

    return [
        WorkspaceItem(
            id=str(current_user.id),
            name=f"{owner_name}'s Workspace",
            initials=initials,
            avatarColor="#0079bf",
            boardCount=len(boards),
            memberCount=1,
            boards=board_items,
        )
    ]


@router.get("/boards", response_model=list[BoardDetailResponse])
async def get_boards_with_columns(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Return all boards of the current user with tasks already grouped
    into synthetic Kanban columns (todo / doing / done).
    This endpoint is consumed by the Recent page board card grid.
    """
    boards = get_user_boards(db, current_user.id)
    result = []

    for board in boards:
        tasks = get_board_tasks(db, board.id)

        # Group tasks by status into columns
        columns = []
        cards = []
        for status in _COLUMN_ORDER:
            col_tasks = [t for t in tasks if t.status == status]
            col_id = f"{board.id}-{status}"
            columns.append(
                BoardColumn(
                    id=col_id,
                    name=_COLUMN_LABELS[status],
                    cardIds=[str(t.id) for t in col_tasks],
                )
            )
            for t in col_tasks:
                cards.append(
                    BoardColumnCard(
                        id=str(t.id),
                        title=t.title,
                        columnId=col_id,
                        description=t.description,
                    )
                )

        result.append(
            BoardDetailResponse(
                id=str(board.id),
                name=board.name,
                coverColor="#0079bf",
                members=[],
                columns=columns,
                cards=cards,
            )
        )
    return result


@router.get("/boards/{board_id}", response_model=BoardDetailResponse)
async def get_board_detail(
    board_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Return a single board (by integer ID) with tasks grouped into
    synthetic Kanban columns. Consumed by the Boards Kanban page.
    """
    from app.crud.board import get_board
    from fastapi import HTTPException, status as http_status

    board = get_board(db, board_id)
    if not board or board.owner_id != current_user.id:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Board not found",
        )

    tasks = get_board_tasks(db, board.id)

    columns = []
    cards = []
    for status in _COLUMN_ORDER:
        col_tasks = [t for t in tasks if t.status == status]
        col_id = f"{board.id}-{status}"
        columns.append(
            BoardColumn(
                id=col_id,
                name=_COLUMN_LABELS[status],
                cardIds=[str(t.id) for t in col_tasks],
            )
        )
        for t in col_tasks:
            cards.append(
                BoardColumnCard(
                    id=str(t.id),
                    title=t.title,
                    columnId=col_id,
                    description=t.description,
                )
            )

    return BoardDetailResponse(
        id=str(board.id),
        name=board.name,
        coverColor="#0079bf",
        members=[],
        columns=columns,
        cards=cards,
    )
