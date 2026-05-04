from fastapi import APIRouter

from app.api.v1.endpoints import user, board, task, admin, super_admin, dashboard

router = APIRouter()

router.include_router(user.router)
router.include_router(board.router)
router.include_router(task.router)
router.include_router(admin.router)
router.include_router(super_admin.router)
router.include_router(dashboard.router)
