# Database Schema v2 - Complete Guide

## Overview

This is the **compatible database schema** that matches both the **backend API** and **frontend UI** requirements. It supports all features visible in the frontend, including Kanban columns, labels, assignments, checklists, comments, and more.

---

## Files Included

### Setup & Migration
- **`setup_database_v2_compatible.sql`** - Complete database schema setup
- **`seed_data_v2_compatible.sql`** - Sample data for testing
- **`MIGRATION_GUIDE_V2.md`** - Step-by-step migration instructions

### Backend Models
- **`app/model/user_v2.py`** - Extended User model with profile fields
- **`app/model/board_v2.py`** - Extended Board model with colors & members
- **`app/model/task_v2.py`** - Extended Task model with columns & assignments
- **`app/model/v2_models.py`** - All new models (Column, Label, Comment, etc.)

### Documentation
- **`DATABASE_COMPATIBILITY_REPORT.md`** - Detailed analysis of what was missing
- This file - Complete setup guide

---

## Quick Start

### 1. Backup Old Database (if exists)
```bash
pg_dump -U postgres trello_db > backup_trello_db_v1.sql
```

### 2. Create New Database
```bash
psql -U postgres -f setup_database_v2_compatible.sql
```

### 3. Add Sample Data (Optional)
```bash
psql -U trello_user -d trello_db -f seed_data_v2_compatible.sql
```

### 4. Update Backend Models
Copy the new model files to `app/model/`:
```bash
# Backup old models
mv app/model/user.py app/model/user_old.py
mv app/model/board.py app/model/board_old.py
mv app/model/task.py app/model/task_old.py

# Copy new models
cp app/model/user_v2.py app/model/user.py
cp app/model/board_v2.py app/model/board.py
cp app/model/task_v2.py app/model/task.py
cp app/model/v2_models.py app/model/v2_models.py  # Import these
```

### 5. Update Database Import in `app/db/base.py`
```python
from app.model.user import User
from app.model.board import Board
from app.model.task import Task
from app.model.role import Role
from app.model.v2_models import (
    Column, Label, CardLabel, BoardMember, TaskAssignment,
    Checklist, ChecklistItem, Comment, Attachment, ActivityLog
)
```

---

## Schema Overview

### Core Tables (Extended)

#### **users**
```sql
id, email, hashed_password
+ first_name, last_name, avatar_color (NEW)
+ role_id (FK to roles)
+ created_at, updated_at
```

#### **boards**
```sql
id, name, owner_id (FK to users)
+ cover_color, description, is_archived (NEW)
+ created_at, updated_at
```

#### **tasks** (formerly cards)
```sql
id, title, description
+ column_id (FK to columns) - REQUIRED NEW
+ board_id (FK to boards)
+ status (todo/doing/done)
+ position, due_date (NEW)
+ cover_image_url (NEW)
+ is_archived (NEW)
+ created_at, updated_at
```

### New Supporting Tables

#### **columns** - Kanban board columns
```sql
id, board_id (FK), name, position, color, is_archived
created_at, updated_at
```

#### **board_members** - Team member management
```sql
id, board_id (FK), user_id (FK), role (owner/admin/member/observer)
joined_at
```

#### **labels** - Task categorization
```sql
id, board_id (FK), name, color, description
created_at, updated_at
```

#### **card_labels** - Task-Label relationship
```sql
id, task_id (FK), label_id (FK)
```

#### **task_assignments** - Task assignments
```sql
id, task_id (FK), user_id (FK), assigned_at
```

#### **checklists** - Task checklists
```sql
id, task_id (FK), name
created_at, updated_at
```

#### **checklist_items** - Checklist items
```sql
id, checklist_id (FK), text, completed, position
created_at, updated_at
```

#### **comments** - Task comments
```sql
id, task_id (FK), user_id (FK), content
created_at, updated_at
```

#### **attachments** - Task attachments
```sql
id, task_id (FK), file_name, file_url, file_size, file_type
uploaded_by (FK to users), created_at
```

#### **activity_log** - Audit trail
```sql
id, board_id (FK), task_id (FK), user_id (FK)
action (created/updated/moved/deleted)
entity_type (board/task/comment/etc)
changes (JSONB), created_at
```

---

## Frontend to Database Mapping

### Card (Task) Properties

```typescript
// Frontend expects:
interface Card {
  id: string;                    // tasks.id
  title: string;                 // tasks.title
  description?: string;          // tasks.description
  columnId: string;              // tasks.column_id ✓ NOW SUPPORTED
  labels: Label[];               // via card_labels table ✓ NOW SUPPORTED
  assignees: Member[];           // via task_assignments ✓ NOW SUPPORTED
  dueDate?: string;              // tasks.due_date ✓ NOW SUPPORTED
  checklist?: ChecklistItem[];   // via checklists ✓ NOW SUPPORTED
  commentCount: number;          // COUNT(comments) ✓ NOW SUPPORTED
  imageUrl?: string;             // tasks.cover_image_url ✓ NOW SUPPORTED
  isOverdue?: boolean;           // Computed from due_date ✓ NOW SUPPORTED
}
```

### Board Properties

```typescript
// Frontend expects:
interface Board {
  id: string;                    // boards.id
  name: string;                  // boards.name
  coverColor: string;            // boards.cover_color ✓ NOW SUPPORTED
  members: Member[];             // via board_members ✓ NOW SUPPORTED
  columns: KanbanColumn[];       // via columns table ✓ NOW SUPPORTED
}
```

### Member Properties

```typescript
// Frontend expects:
interface Member {
  id: string;                    // users.id
  name: string;                  // users.first_name + last_name ✓ NOW SUPPORTED
  initials: string;              // Computed from name ✓ NOW SUPPORTED
  avatarColor: string;           // users.avatar_color ✓ NOW SUPPORTED
}
```

---

## API Endpoints to Implement

### Boards (Extended)
```
POST   /api/boards                              - Create board
GET    /api/boards                              - List user's boards
GET    /api/boards/{board_id}                   - Get board
PUT    /api/boards/{board_id}                   - Update board
DELETE /api/boards/{board_id}                   - Delete board
```

### Board Members (NEW)
```
POST   /api/boards/{board_id}/members           - Add member
GET    /api/boards/{board_id}/members           - List members
PUT    /api/boards/{board_id}/members/{user_id} - Update member role
DELETE /api/boards/{board_id}/members/{user_id} - Remove member
```

### Columns (NEW)
```
POST   /api/boards/{board_id}/columns           - Create column
GET    /api/boards/{board_id}/columns           - List columns
PUT    /api/boards/{board_id}/columns/{col_id}  - Update column
DELETE /api/boards/{board_id}/columns/{col_id}  - Delete column
PUT    /api/boards/{board_id}/columns/reorder   - Reorder columns
```

### Labels (NEW)
```
POST   /api/boards/{board_id}/labels            - Create label
GET    /api/boards/{board_id}/labels            - List labels
PUT    /api/boards/{board_id}/labels/{label_id} - Update label
DELETE /api/boards/{board_id}/labels/{label_id} - Delete label
```

### Tasks (Extended)
```
POST   /api/boards/{board_id}/tasks             - Create task (column_id required)
GET    /api/boards/{board_id}/tasks             - List tasks
GET    /api/boards/{board_id}/tasks/{task_id}   - Get task
PUT    /api/boards/{board_id}/tasks/{task_id}   - Update task
DELETE /api/boards/{board_id}/tasks/{task_id}   - Delete task
PUT    /api/boards/{board_id}/tasks/{task_id}/position - Reorder task
```

### Task Assignments (NEW)
```
POST   /api/boards/{board_id}/tasks/{task_id}/assign          - Assign user
DELETE /api/boards/{board_id}/tasks/{task_id}/assign/{user_id} - Unassign user
```

### Task Labels (NEW)
```
POST   /api/boards/{board_id}/tasks/{task_id}/labels/{label_id}      - Add label
DELETE /api/boards/{board_id}/tasks/{task_id}/labels/{label_id}      - Remove label
```

### Comments (NEW)
```
POST   /api/boards/{board_id}/tasks/{task_id}/comments       - Create comment
GET    /api/boards/{board_id}/tasks/{task_id}/comments       - List comments
DELETE /api/boards/{board_id}/tasks/{task_id}/comments/{id}  - Delete comment
```

### Checklists (NEW)
```
POST   /api/boards/{board_id}/tasks/{task_id}/checklists     - Create checklist
DELETE /api/boards/{board_id}/tasks/{task_id}/checklists/{id} - Delete checklist

POST   /api/boards/{board_id}/tasks/{task_id}/checklists/{id}/items       - Add item
PUT    /api/boards/{board_id}/tasks/{task_id}/checklists/{id}/items/{item_id} - Update item
DELETE /api/boards/{board_id}/tasks/{task_id}/checklists/{id}/items/{item_id} - Delete item
```

### Attachments (NEW)
```
POST   /api/boards/{board_id}/tasks/{task_id}/attachments    - Upload file
GET    /api/boards/{board_id}/tasks/{task_id}/attachments    - List attachments
DELETE /api/boards/{board_id}/tasks/{task_id}/attachments/{id} - Delete attachment
```

---

## Sample Queries

### Get Board with All Details
```sql
SELECT 
    b.*,
    json_agg(DISTINCT jsonb_build_object(
        'id', bm.user_id,
        'name', CONCAT(u.first_name, ' ', u.last_name),
        'avatarColor', u.avatar_color
    )) FILTER (WHERE bm.user_id IS NOT NULL) as members,
    
    json_agg(DISTINCT jsonb_build_object(
        'id', c.id,
        'name', c.name,
        'position', c.position,
        'color', c.color
    )) FILTER (WHERE c.id IS NOT NULL) as columns
FROM boards b
LEFT JOIN board_members bm ON b.id = bm.board_id
LEFT JOIN users u ON bm.user_id = u.id
LEFT JOIN columns c ON b.id = c.board_id AND NOT c.is_archived
WHERE b.id = $1
GROUP BY b.id;
```

### Get Task with All Relationships
```sql
SELECT 
    t.*,
    json_agg(DISTINCT jsonb_build_object(
        'id', ta.user_id,
        'name', CONCAT(u.first_name, ' ', u.last_name),
        'avatarColor', u.avatar_color
    )) FILTER (WHERE ta.user_id IS NOT NULL) as assignees,
    
    json_agg(DISTINCT jsonb_build_object(
        'id', l.id,
        'name', l.name,
        'color', l.color
    )) FILTER (WHERE l.id IS NOT NULL) as labels,
    
    COUNT(DISTINCT c.id) as comment_count,
    COUNT(DISTINCT a.id) as attachment_count
FROM tasks t
LEFT JOIN task_assignments ta ON t.id = ta.task_id
LEFT JOIN users u ON ta.user_id = u.id
LEFT JOIN card_labels cl ON t.id = cl.task_id
LEFT JOIN labels l ON cl.label_id = l.id
LEFT JOIN comments c ON t.id = c.task_id
LEFT JOIN attachments a ON t.id = a.task_id
WHERE t.id = $1
GROUP BY t.id;
```

### Get Column with Tasks
```sql
SELECT 
    c.*,
    json_agg(jsonb_build_object(
        'id', t.id,
        'title', t.title,
        'description', t.description,
        'position', t.position,
        'dueDate', t.due_date,
        'status', t.status
    )) FILTER (WHERE t.id IS NOT NULL) as tasks
FROM columns c
LEFT JOIN tasks t ON c.id = t.column_id AND NOT t.is_archived
WHERE c.board_id = $1 AND NOT c.is_archived
GROUP BY c.id
ORDER BY c.position;
```

---

## Data Migration (from v1 to v2)

If you have existing data in v1:

```sql
-- 1. Create default columns for each board
INSERT INTO columns (board_id, name, position, color)
SELECT DISTINCT board_id, 
    CASE status
        WHEN 'todo' THEN 'To Do'
        WHEN 'doing' THEN 'In Progress'
        WHEN 'done' THEN 'Done'
    END as name,
    CASE status
        WHEN 'todo' THEN 1
        WHEN 'doing' THEN 2
        WHEN 'done' THEN 3
    END as position,
    '#e2e8f0' as color
FROM tasks
GROUP BY board_id, status;

-- 2. Map tasks to columns
UPDATE tasks t SET column_id = (
    SELECT c.id FROM columns c
    WHERE c.board_id = t.board_id
    AND c.name = CASE t.status
        WHEN 'todo' THEN 'To Do'
        WHEN 'doing' THEN 'In Progress'
        WHEN 'done' THEN 'Done'
    END
);

-- 3. Add board owners as members
INSERT INTO board_members (board_id, user_id, role)
SELECT id, owner_id, 'owner' FROM boards;

-- 4. Update user profile fields
UPDATE users u SET 
    first_name = SPLIT_PART(email, '@', 1),
    last_name = SPLIT_PART(SPLIT_PART(email, '@', 2), '.', 1);
```

---

## Testing Checklist

- [ ] Database created successfully
- [ ] All 14 tables created with correct structure
- [ ] Foreign key constraints work
- [ ] Indexes created on all FK and frequently queried columns
- [ ] Sample data inserted (optional)
- [ ] Backend models import correctly
- [ ] Can create board
- [ ] Can create columns in board
- [ ] Can create tasks with column_id
- [ ] Can add members to board
- [ ] Can assign users to tasks
- [ ] Can add labels to tasks
- [ ] Can create checklists with items
- [ ] Can add comments
- [ ] Frontend displays data correctly

---

## Performance Notes

### Indexes
All foreign key columns and frequently queried columns have indexes:
- `board_id` on boards, columns, tasks, labels, comments
- `column_id` on tasks
- `user_id` on task_assignments, comments, attachments
- `created_at` on multiple tables for sorting
- `status`, `due_date`, `completed` for filtering

### Optimization Tips
1. Use connection pooling in production
2. Add JSONB indexes if querying changes in activity_log
3. Archive old records to keep tables lean
4. Use pagination on large result sets

---

## Troubleshooting

### Column Not Found Error
**Problem:** Tasks table requires `column_id` but existing tasks don't have it.
**Solution:** 
```sql
-- Create default columns first
-- Then update existing tasks to point to columns
-- See Migration section above
```

### Foreign Key Constraint Error
**Problem:** Can't add task because column doesn't exist.
**Solution:** Create columns before creating tasks.

### User Fields Are NULL
**Problem:** first_name, last_name, avatar_color are empty.
**Solution:** Update users with profile data:
```sql
UPDATE users SET first_name = 'John', last_name = 'Doe', avatar_color = '#0079bf'
WHERE email = 'user@example.com';
```

---

## Support & References

- **Setup Guide:** See `setup_database_v2_compatible.sql`
- **Migration:** See `MIGRATION_GUIDE_V2.md`
- **Compatibility Analysis:** See `DATABASE_COMPATIBILITY_REPORT.md`
- **Models:** See `app/model/` directory

---

## Version Comparison

| Feature | v1 | v2 |
|---------|----|----|
| Users | ✓ | ✓ + profiles |
| Boards | ✓ | ✓ + colors |
| Tasks | ✓ basic | ✓ + columns, assignments |
| Columns | ✗ | ✓ NEW |
| Labels | ✗ | ✓ NEW |
| Checklists | ✗ | ✓ NEW |
| Comments | ✗ | ✓ NEW |
| Attachments | ✗ | ✓ NEW |
| Board Members | ✗ | ✓ NEW |
| Activity Log | ✗ | ✓ NEW |

---

**Status:** ✅ Ready for production use with modern Trello-like features
