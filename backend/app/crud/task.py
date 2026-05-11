from sqlalchemy.orm import Session
from app.model.task import Task
from app.schemas.Task import TaskCreate, TaskUpdate


def create_task(db: Session, task_data: TaskCreate, board_id: int) -> Task:
    """Create a new task"""
    db_task = Task(
        title=task_data.title,
        description=task_data.description,
        status=task_data.status,
        labels=task_data.labels,
        checklists=task_data.checklists,
        board_id=board_id
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def get_task(db: Session, task_id: int) -> Task | None:
    """Get task by id"""
    return db.query(Task).filter(Task.id == task_id).first()


def get_board_tasks(db: Session, board_id: int) -> list[Task]:
    """Get all tasks for a board"""
    return db.query(Task).filter(Task.board_id == board_id).all()


def update_task(db: Session, task_id: int, task_data: TaskUpdate) -> Task | None:
    """Update a task"""
    db_task = get_task(db, task_id)
    if not db_task:
        return None
    if task_data.title is not None:
        db_task.title = task_data.title
    if task_data.description is not None:
        db_task.description = task_data.description
    if task_data.status is not None:
        db_task.status = task_data.status
    if task_data.labels is not None:
        db_task.labels = task_data.labels
    if task_data.checklists is not None:
        db_task.checklists = task_data.checklists
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int) -> bool:
    """Delete a task"""
    db_task = get_task(db, task_id)
    if not db_task:
        return False
    db.delete(db_task)
    db.commit()
    return True