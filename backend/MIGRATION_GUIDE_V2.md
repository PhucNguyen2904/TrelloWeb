# Database Migration Guide v2
**From v1 (Basic) to v2 (Frontend-Compatible)**

## Overview
This guide explains how to migrate from the original database schema to the new v2 schema that fully supports frontend UI features.

---

## What's New in v2

### Extended Tables
1. **users** - Added `first_name`, `last_name`, `avatar_color`
2. **boards** - Added `cover_color`, `description`, `is_archived`
3. **tasks** - Added `column_id`, `due_date`, `position`, `cover_image_url`, `is_archived`

### New Tables (7 new tables)
1. **board_members** - Team member management per board
2. **columns** - Kanban columns (replaces simple status values)
3. **labels** - Task labels/tags for categorization
4. **card_labels** - Task-to-label relationship
5. **task_assignments** - Task-to-user assignments
6. **checklists** - Checklist groups within tasks
7. **checklist_items** - Individual checklist items
8. **comments** - Discussion on tasks
9. **attachments** - Files attached to tasks
10. **activity_log** - Audit trail for all changes

## Migration Steps

### Step 1: Backup Old Database
```bash
pg_dump -U postgres trello_db > backup_trello_db_v1.sql
```

### Step 2: Run New Setup Script
```bash
psql -U postgres -f setup_database_v2_compatible.sql
```

### Step 3: Data Migration (if existing data)
If you have existing data, use migration script:
```bash
psql -U trello_user -d trello_db -f migrate_v1_to_v2.sql
```

### Step 4: Update Backend Models
Replace your model files in `app/model/` with v2 versions:
- `user.py` - Add profile fields
- `board.py` - Add relationships, color field
- `task.py` (formerly `task.py`) - Add column, due_date, assignments
- **NEW:** `column.py` - Kanban column model
- **NEW:** `label.py` - Label model
- **NEW:** `checklist.py` - Checklist model
- **NEW:** `comment.py` - Comment model
- **NEW:** `attachment.py` - Attachment model

### Step 5: Update Backend Schemas
Add new Pydantic schemas for:
- Column CRUD
- Label CRUD
- BoardMember management
- Task assignments
- Checklists & checklist items
- Comments
- Attachments

### Step 6: Update Backend API Endpoints
Create new endpoints:

#### Board Members
- `POST /api/boards/{board_id}/members` - Add member
- `GET /api/boards/{board_id}/members` - List members
- `DELETE /api/boards/{board_id}/members/{user_id}` - Remove member

#### Columns
- `POST /api/boards/{board_id}/columns` - Create column
- `GET /api/boards/{board_id}/columns` - List columns
- `PUT /api/boards/{board_id}/columns/{column_id}` - Update column
- `DELETE /api/boards/{board_id}/columns/{column_id}` - Delete column
- `PUT /api/boards/{board_id}/columns/{column_id}/position` - Reorder columns

#### Labels
- `POST /api/boards/{board_id}/labels` - Create label
- `GET /api/boards/{board_id}/labels` - List labels
- `PUT /api/boards/{board_id}/labels/{label_id}` - Update label
- `DELETE /api/boards/{board_id}/labels/{label_id}` - Delete label

#### Tasks (Extended)
- `POST /api/boards/{board_id}/tasks` - Create task (now requires column_id)
- `PUT /api/boards/{board_id}/tasks/{task_id}/assign` - Assign member
- `DELETE /api/boards/{board_id}/tasks/{task_id}/assign/{user_id}` - Remove assignee
- `PUT /api/boards/{board_id}/tasks/{task_id}/labels` - Add/remove labels

#### Comments
- `POST /api/boards/{board_id}/tasks/{task_id}/comments` - Add comment
- `GET /api/boards/{board_id}/tasks/{task_id}/comments` - List comments
- `DELETE /api/boards/{board_id}/tasks/{task_id}/comments/{comment_id}` - Delete comment

#### Checklists
- `POST /api/boards/{board_id}/tasks/{task_id}/checklists` - Create checklist
- `POST /api/boards/{board_id}/tasks/{task_id}/checklists/{checklist_id}/items` - Add item
- `PUT /api/boards/{board_id}/tasks/{task_id}/checklists/{checklist_id}/items/{item_id}` - Update item
- `DELETE /api/boards/{board_id}/tasks/{task_id}/checklists/{checklist_id}/items/{item_id}` - Delete item

#### Attachments
- `POST /api/boards/{board_id}/tasks/{task_id}/attachments` - Upload file
- `GET /api/boards/{board_id}/tasks/{task_id}/attachments` - List attachments
- `DELETE /api/boards/{board_id}/tasks/{task_id}/attachments/{attachment_id}` - Delete attachment

### Step 7: Update Frontend
The frontend is already built for v2 schema features. Once API endpoints are ready:
1. Remove mock data dependencies
2. Connect components to real API endpoints
3. Implement real-time features if needed

---

## Data Migration Details

### User Profile Fields
```sql
-- Set default names from email
UPDATE users 
SET first_name = SPLIT_PART(email, '@', 1),
    last_name = SPLIT_PART(email, '.', 2),
    avatar_color = '#' || SUBSTRING(MD5(email) FROM 1 FOR 6);
```

### Board Color
```sql
-- Set random colors to existing boards
UPDATE boards 
SET cover_color = (ARRAY['#0079bf', '#61bd4f', '#f2d600', '#ff9f1a', '#eb5a46', '#c377e0'])[floor(random() * 6) + 1];
```

### Task Status → Columns
```sql
-- Create default columns for each board
INSERT INTO columns (board_id, name, position, color)
SELECT DISTINCT board_id, 'To Do', 1, '#e2e8f0' FROM tasks WHERE status = 'todo'
UNION ALL
SELECT DISTINCT board_id, 'Doing', 2, '#e2e8f0' FROM tasks WHERE status = 'doing'
UNION ALL
SELECT DISTINCT board_id, 'Done', 3, '#e2e8f0' FROM tasks WHERE status = 'done';

-- Map existing tasks to columns (Todo column)
UPDATE tasks SET column_id = (
    SELECT id FROM columns 
    WHERE columns.board_id = tasks.board_id 
    AND columns.name = 'To Do'
) WHERE status = 'todo';

-- Map existing tasks to columns (Doing column)
UPDATE tasks SET column_id = (
    SELECT id FROM columns 
    WHERE columns.board_id = tasks.board_id 
    AND columns.name = 'Doing'
) WHERE status = 'doing';

-- Map existing tasks to columns (Done column)
UPDATE tasks SET column_id = (
    SELECT id FROM columns 
    WHERE columns.board_id = tasks.board_id 
    AND columns.name = 'Done'
) WHERE status = 'done';
```

### Board Members (Owner as member)
```sql
-- Add board owners as board members
INSERT INTO board_members (board_id, user_id, role)
SELECT id, owner_id, 'owner' FROM boards
ON CONFLICT DO NOTHING;
```

---

## Rollback Plan

If you need to rollback to v1:

```bash
# Restore from backup
psql -U postgres < backup_trello_db_v1.sql
```

---

## Performance Considerations

### New Indexes
All tables include appropriate indexes on:
- Foreign keys
- Frequently queried columns
- Sort columns (created_at, position)

### Query Optimization Tips

1. **Get board with all data:**
```sql
SELECT 
    b.*,
    jsonb_agg(DISTINCT c.id) as column_ids,
    jsonb_agg(DISTINCT bm.user_id) as member_ids,
    jsonb_agg(DISTINCT l.id) as label_ids
FROM boards b
LEFT JOIN columns c ON b.id = c.board_id AND NOT c.is_archived
LEFT JOIN board_members bm ON b.id = bm.board_id
LEFT JOIN labels l ON b.id = l.board_id
WHERE b.id = $1
GROUP BY b.id;
```

2. **Get task with all relationships:**
```sql
SELECT 
    t.*,
    jsonb_agg(DISTINCT ta.user_id) as assignee_ids,
    jsonb_agg(DISTINCT cl.label_id) as label_ids,
    COUNT(DISTINCT c.id) as comment_count,
    COUNT(DISTINCT a.id) as attachment_count
FROM tasks t
LEFT JOIN task_assignments ta ON t.id = ta.task_id
LEFT JOIN card_labels cl ON t.id = cl.task_id
LEFT JOIN comments c ON t.id = c.task_id
LEFT JOIN attachments a ON t.id = a.task_id
WHERE t.id = $1
GROUP BY t.id;
```

---

## Testing Checklist

- [ ] Database setup runs without errors
- [ ] All tables created with correct columns
- [ ] Foreign key constraints work
- [ ] Indexes created successfully
- [ ] User can login with updated schema
- [ ] Can create board
- [ ] Can create columns in board
- [ ] Can create task in column
- [ ] Can add members to board
- [ ] Can assign users to tasks
- [ ] Can add labels to tasks
- [ ] Can create checklists
- [ ] Can add comments
- [ ] Can upload attachments

---

## Frontend Integration Status

| Feature | Status | Notes |
|---------|--------|-------|
| User Auth | ✓ Ready | No changes needed |
| Boards | ✓ Ready | Add cover_color support |
| Columns | ⏳ Ready API | Implement endpoints |
| Tasks | ⏳ Ready API | Extend endpoints |
| Labels | ⏳ Ready API | Implement endpoints |
| Assignees | ⏳ Ready API | Implement endpoints |
| Checklists | ⏳ Ready API | Implement endpoints |
| Comments | ⏳ Ready API | Implement endpoints |
| Attachments | ⏳ Ready API | Implement endpoints |

---

## Support
For issues with migration, refer to:
- `DATABASE_COMPATIBILITY_REPORT.md` - Detailed incompatibility analysis
- `setup_database_v2_compatible.sql` - Complete schema definition
- Backend model files - SQLAlchemy examples
