# Database Schema v2 - Visual Diagram

## Entity Relationship Diagram (Text Format)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TRELLO CLONE DATABASE v2                             │
│                   14 Tables • Fully Normalized • Indexed                     │
└─────────────────────────────────────────────────────────────────────────────┘

                                   ┌──────────┐
                                   │  ROLES   │
                                   ├──────────┤
                                   │ id (PK)  │
                                   │ name     │
                                   │ desc     │
                                   └────┬─────┘
                                        │ 1:N
                                        │
                    ┌───────────────────┴──────────────────┐
                    │                                      │
              ┌─────▼──────────┐              ┌───────────▼────────┐
              │     USERS      │              │  ACTIVITY_LOG (*)  │
              ├────────────────┤              ├────────────────────┤
              │ id (PK)        │◄─────┐       │ id (PK)            │
              │ email (UNIQUE) │      │       │ board_id (FK)      │
              │ hashed_pass    │      │       │ task_id (FK)       │
              │ first_name *   │      │       │ user_id (FK)       │
              │ last_name *    │      │       │ action             │
              │ avatar_color * │      │       │ entity_type        │
              │ role_id (FK)   │      │       │ changes (JSONB)    │
              │ created_at     │      │       │ created_at         │
              │ updated_at     │      │       └────────────────────┘
              └────┬───────────┘      │
                   │                   │
            1:N    │1          1:N    │
         ┌─────────┘            └─────┘
         │
    ┌────▼──────────────┐  ┌──────────────────┐
    │    BOARDS         │  │  BOARD_MEMBERS   │
    ├───────────────────┤  ├──────────────────┤
    │ id (PK)           │  │ id (PK)          │
    │ name              │  │ board_id (FK)◄───┼──┐
    │ owner_id (FK)────►│  │ user_id (FK)────►│  │
    │ cover_color *     │  │ role             │  │
    │ description *     │  │ joined_at        │  │
    │ is_archived *     │  └──────────────────┘  │
    │ created_at        │                        │
    │ updated_at        │                    USERS
    └────┬──────────────┘                    (recursive)
         │
    1:N  │
    ┌────┴────────────────┬──────────────────┐
    │                     │                  │
┌───▼──────────┐  ┌───────▼──────┐  ┌────────▼─────────┐
│   COLUMNS    │  │    LABELS    │  │    TASKS         │
├──────────────┤  ├──────────────┤  ├──────────────────┤
│ id (PK)      │  │ id (PK)      │  │ id (PK)          │
│ board_id(FK) │  │ board_id(FK) │  │ board_id (FK)───┐
│ name         │  │ name         │  │ column_id(FK)───┼──┐
│ position     │  │ color        │  │ title            │  │
│ color        │  │ description  │  │ description *    │  │
│ is_archived  │  │ created_at   │  │ status (todo)    │  │
│ created_at   │  │ updated_at   │  │ position *       │  │
│ updated_at   │  └──────────────┘  │ due_date *       │  │
└────┬─────────┘         │           │ cover_image *    │  │
     │            1:N    │           │ is_archived *    │  │
     │              │    │           │ created_at       │  │
     │              │    │           │ updated_at       │  │
     │          ┌───▼────▼──────┐    └────┬─────────────┘  │
1:N  │          │  CARD_LABELS  │         │                │
     │          ├───────────────┤         │            COLUMNS
     │          │ id (PK)       │         │
     │          │ task_id(FK) ─────┐      │
     │          │ label_id(FK)─────┼──┘   │
     │          └───────────────┘        │
     │                                   │
     └───────────────────────────────────┘
                      ▲
                      │ 1:N
                      │
             ┌────────┴──────────┐
             │                   │
        ┌────▼──────────┐  ┌─────▼──────────────┐
        │  CHECKLISTS   │  │ TASK_ASSIGNMENTS   │
        ├───────────────┤  ├────────────────────┤
        │ id (PK)       │  │ id (PK)            │
        │ task_id(FK)   │  │ task_id (FK)──┐    │
        │ name          │  │ user_id(FK)   │    │
        │ created_at    │  │ assigned_at   │    │
        │ updated_at    │  └────────────────────┤
        └────┬──────────┘         │              │
             │            1:N    │              │
             │              │    │          USERS
        ┌────▼────────────┐  │    │       (recursive)
        │ CHECKLIST_ITEMS │  │    │
        ├─────────────────┤  │    │
        │ id (PK)         │  │    │
        │ checklist(FK)   │  │    │
        │ text            │  │    │
        │ completed       │  │    │
        │ position        │  │    │
        │ created_at      │  │    │
        │ updated_at      │  │    │
        └─────────────────┘  │    │
                             │    │
                    ┌────────┴────▼───────┐
                    │                     │
            ┌───────▼────────┐  ┌────────▼──────────┐
            │    COMMENTS    │  │   ATTACHMENTS     │
            ├────────────────┤  ├───────────────────┤
            │ id (PK)        │  │ id (PK)           │
            │ task_id (FK)   │  │ task_id (FK)──┐   │
            │ user_id(FK)────┼──┼──┐ file_name   │   │
            │ content        │  │  │ file_url    │   │
            │ created_at     │  │  │ file_size   │   │
            │ updated_at     │  │  │ file_type   │   │
            └────────────────┘  │  │ uploaded_by(FK)─┤
                         1:N    │  │ created_at  │   │
                           │    │  └─────────────┐   │
                           │    │                │   │
                           │    │            USERS   │
                           │    │            (recursive)
                           │    │
                           └────┴─── Relationships back to USERS/TASKS
```

## Table Legend

| Symbol | Meaning |
|--------|---------|
| `*` | NEW in v2 (not in v1) |
| `PK` | Primary Key |
| `FK` | Foreign Key |
| `1:N` | One-to-Many relationship |
| `(*)` | Audit/Log table |

---

## Detailed Table Structure

### Core Tables (Extended from v1)

#### USERS (Extended)
```
┌─────────────────────────────┐
│         USERS               │
├─────────────────────────────┤
│ id: SERIAL (PK)             │
│ email: VARCHAR(255) UNIQUE  │
│ hashed_password: VARCHAR    │
│ first_name: VARCHAR(100) *  │◄─ NEW in v2
│ last_name: VARCHAR(100) *   │◄─ NEW in v2
│ avatar_color: VARCHAR(7) *  │◄─ NEW in v2
│ role_id: FK → ROLES         │
│ created_at: TIMESTAMP       │
│ updated_at: TIMESTAMP       │
└─────────────────────────────┘
     ▲
     │ 1:N Relationships
     ├─ boards (owner_id)
     ├─ board_members (user_id)
     ├─ task_assignments (user_id)
     ├─ comments (user_id)
     ├─ attachments (uploaded_by)
     └─ activity_log (user_id)
```

#### BOARDS (Extended)
```
┌──────────────────────────────┐
│         BOARDS               │
├──────────────────────────────┤
│ id: SERIAL (PK)              │
│ name: VARCHAR(255)           │
│ owner_id: FK → USERS         │
│ cover_color: VARCHAR(7) *    │◄─ NEW in v2
│ description: TEXT *          │◄─ NEW in v2
│ is_archived: BOOLEAN *       │◄─ NEW in v2
│ created_at: TIMESTAMP        │
│ updated_at: TIMESTAMP        │
└──────────────────────────────┘
     ▲
     │ 1:N Relationships
     ├─ columns
     ├─ labels
     ├─ tasks
     ├─ board_members
     └─ activity_log
```

#### TASKS (Extended)
```
┌───────────────────────────────────┐
│         TASKS                     │
├───────────────────────────────────┤
│ id: SERIAL (PK)                   │
│ board_id: FK → BOARDS             │
│ column_id: FK → COLUMNS *         │◄─ NEW in v2 (REQUIRED)
│ title: VARCHAR(255)               │
│ description: TEXT                 │
│ status: VARCHAR(50) default 'todo'│
│ position: INTEGER *               │◄─ NEW in v2
│ due_date: DATE *                  │◄─ NEW in v2
│ cover_image_url: VARCHAR(500) *   │◄─ NEW in v2
│ is_archived: BOOLEAN *            │◄─ NEW in v2
│ created_at: TIMESTAMP             │
│ updated_at: TIMESTAMP             │
└───────────────────────────────────┘
     ▲
     │ 1:N Relationships
     ├─ card_labels
     ├─ task_assignments
     ├─ checklists
     ├─ comments
     ├─ attachments
     └─ activity_log
```

### NEW Supporting Tables

#### COLUMNS
```
┌──────────────────────────────┐
│         COLUMNS              │ ◄─ NEW in v2
├──────────────────────────────┤
│ id: SERIAL (PK)              │
│ board_id: FK → BOARDS        │
│ name: VARCHAR(255)           │
│ position: INTEGER            │
│ color: VARCHAR(7)            │
│ is_archived: BOOLEAN         │
│ created_at: TIMESTAMP        │
│ updated_at: TIMESTAMP        │
└──────────────────────────────┘
```

#### LABELS
```
┌──────────────────────────────┐
│         LABELS               │ ◄─ NEW in v2
├──────────────────────────────┤
│ id: SERIAL (PK)              │
│ board_id: FK → BOARDS        │
│ name: VARCHAR(100)           │
│ color: VARCHAR(7)            │
│ description: TEXT            │
│ created_at: TIMESTAMP        │
│ updated_at: TIMESTAMP        │
└──────────────────────────────┘
```

#### CARD_LABELS (Junction)
```
┌──────────────────────────────┐
│      CARD_LABELS             │ ◄─ NEW in v2
├──────────────────────────────┤ (Junction Table)
│ id: SERIAL (PK)              │
│ task_id: FK → TASKS          │
│ label_id: FK → LABELS        │
│ UNIQUE(task_id, label_id)    │
└──────────────────────────────┘
```

#### BOARD_MEMBERS
```
┌──────────────────────────────┐
│     BOARD_MEMBERS            │ ◄─ NEW in v2
├──────────────────────────────┤
│ id: SERIAL (PK)              │
│ board_id: FK → BOARDS        │
│ user_id: FK → USERS          │
│ role: VARCHAR(50)            │
│   - 'owner'                  │
│   - 'admin'                  │
│   - 'member'                 │
│   - 'observer'               │
│ joined_at: TIMESTAMP         │
│ UNIQUE(board_id, user_id)    │
└──────────────────────────────┘
```

#### TASK_ASSIGNMENTS
```
┌──────────────────────────────┐
│    TASK_ASSIGNMENTS          │ ◄─ NEW in v2
├──────────────────────────────┤
│ id: SERIAL (PK)              │
│ task_id: FK → TASKS          │
│ user_id: FK → USERS          │
│ assigned_at: TIMESTAMP       │
│ UNIQUE(task_id, user_id)     │
└──────────────────────────────┘
```

#### CHECKLISTS & CHECKLIST_ITEMS
```
┌──────────────────────────────┐     ┌─────────────────────────┐
│      CHECKLISTS              │     │   CHECKLIST_ITEMS       │
├──────────────────────────────┤     ├─────────────────────────┤
│ id: SERIAL (PK)              │     │ id: SERIAL (PK)         │
│ task_id: FK → TASKS          │────►│ checklist_id: FK        │
│ name: VARCHAR(255)           │  1:N│ text: VARCHAR(500)      │
│ created_at: TIMESTAMP        │     │ completed: BOOLEAN      │
│ updated_at: TIMESTAMP        │     │ position: INTEGER       │
└──────────────────────────────┘     │ created_at: TIMESTAMP   │
                                      │ updated_at: TIMESTAMP   │
                                      └─────────────────────────┘
```

#### COMMENTS
```
┌──────────────────────────────┐
│       COMMENTS               │ ◄─ NEW in v2
├──────────────────────────────┤
│ id: SERIAL (PK)              │
│ task_id: FK → TASKS          │
│ user_id: FK → USERS          │
│ content: TEXT                │
│ created_at: TIMESTAMP        │
│ updated_at: TIMESTAMP        │
└──────────────────────────────┘
```

#### ATTACHMENTS
```
┌──────────────────────────────┐
│      ATTACHMENTS             │ ◄─ NEW in v2
├──────────────────────────────┤
│ id: SERIAL (PK)              │
│ task_id: FK → TASKS          │
│ file_name: VARCHAR(255)      │
│ file_url: VARCHAR(500)       │
│ file_size: INTEGER           │
│ file_type: VARCHAR(100)      │
│ uploaded_by: FK → USERS      │
│ created_at: TIMESTAMP        │
└──────────────────────────────┘
```

#### ACTIVITY_LOG
```
┌──────────────────────────────┐
│      ACTIVITY_LOG            │ ◄─ NEW in v2 (Audit)
├──────────────────────────────┤
│ id: SERIAL (PK)              │
│ board_id: FK → BOARDS        │
│ task_id: FK → TASKS          │
│ user_id: FK → USERS          │
│ action: VARCHAR(100)         │
│   - 'created'                │
│   - 'updated'                │
│   - 'moved'                  │
│   - 'deleted'                │
│ entity_type: VARCHAR(50)     │
│   - 'board', 'task', etc     │
│ changes: JSONB               │
│ created_at: TIMESTAMP        │
└──────────────────────────────┘
```

---

## Relationship Matrix

```
                Users  Boards Columns Tasks Labels Comments Attachments Checklists Assignments
                
Roles        1:N      -      -       -      -       -        -            -          -
Users        -        1:N    -       -      -       1:N      1:N          -          1:N
Boards       -        -      1:N     1:N    1:N     -        -            -          -
Columns      -        -      -       1:N    -       -        -            -          -
Tasks        -        -      -       -      N:N     1:N      1:N          1:N        N:N
Labels       -        -      -       N:N    -       -        -            -          -
Comments     1:N      -      -       1:N    -       -        -            -          -
Attachments  1:N      -      -       1:N    -       -        -            -          -
Checklists   -        -      -       1:N    -       -        -            -          -
ChkItems     -        -      -       -      -       -        -            1:N        -
BoardMembers 1:N      1:N    -       -      -       -        -            -          -
Assignments  1:N      -      -       1:N    -       -        -            -          -
ActivityLog  1:N      1:N    -       1:N    -       -        -            -          -

Legend: 1:N = One-to-Many, N:N = Many-to-Many
```

---

## Index Strategy

All tables include indexes on:
- ✓ Primary Keys (SERIAL auto-indexed)
- ✓ Foreign Keys (for JOIN performance)
- ✓ Unique columns (email, etc.)
- ✓ Frequently searched columns (created_at, status, completed)
- ✓ Sort columns (position, created_at)

Total: **30+ indexes** across 14 tables

---

## Cascade Rules

```
BOARDS (deleted)
  ├─ CASCADE → COLUMNS
  ├─ CASCADE → TASKS
  ├─ CASCADE → LABELS
  ├─ CASCADE → BOARD_MEMBERS
  ├─ CASCADE → ACTIVITY_LOG
  └─ RESTRICT ← Can't delete if tasks exist

COLUMNS (deleted)
  └─ RESTRICT ← Can't delete if tasks assigned

TASKS (deleted)
  ├─ CASCADE → CARD_LABELS
  ├─ CASCADE → TASK_ASSIGNMENTS
  ├─ CASCADE → CHECKLISTS (→ CHECKLIST_ITEMS)
  ├─ CASCADE → COMMENTS
  ├─ CASCADE → ATTACHMENTS
  └─ CASCADE → ACTIVITY_LOG

USERS (deleted)
  ├─ SET NULL → COMMENTS
  ├─ CASCADE → TASK_ASSIGNMENTS
  ├─ CASCADE → BOARD_MEMBERS
  └─ CASCADE → ATTACHMENTS
```

---

This visual diagram helps understand the complete data model and how all 14 tables relate to each other.
