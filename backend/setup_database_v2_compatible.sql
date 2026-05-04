-- ============================================
-- PostgreSQL Setup Script for Trello Clone
-- Version 2: Compatible with Frontend UI
-- ============================================
-- This script creates a complete database schema
-- that matches both backend API and frontend UI requirements
-- Usage: psql -U postgres -f setup_database_v2_compatible.sql

-- ============================================
-- 1. Create Database
-- ============================================
DROP DATABASE IF EXISTS trello_db;
CREATE DATABASE trello_db;

-- ============================================
-- 2. Create User
-- ============================================
DROP USER IF EXISTS trello_user;
CREATE USER trello_user WITH PASSWORD 'trello_pass123';

-- ============================================
-- 3. Grant Privileges
-- ============================================
GRANT ALL PRIVILEGES ON DATABASE trello_db TO trello_user;

-- Connect to the new database
\c trello_db;

-- ============================================
-- 4. Create Tables
-- ============================================

-- ========== ROLES TABLE ==========
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255)
);

CREATE INDEX idx_roles_name ON roles(name);

-- ========== USERS TABLE (Extended) ==========
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_color VARCHAR(7) DEFAULT '#0079bf',
    role_id INTEGER REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);

-- ========== BOARDS TABLE (Extended) ==========
CREATE TABLE boards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cover_color VARCHAR(7) DEFAULT '#0079bf',
    description TEXT,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_boards_owner_id ON boards(owner_id);
CREATE INDEX idx_boards_created_at ON boards(created_at);

-- ========== BOARD MEMBERS TABLE (NEW) ==========
CREATE TABLE board_members (
    id SERIAL PRIMARY KEY,
    board_id INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member', -- 'owner', 'admin', 'member', 'observer'
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(board_id, user_id)
);

CREATE INDEX idx_board_members_board_id ON board_members(board_id);
CREATE INDEX idx_board_members_user_id ON board_members(user_id);

-- ========== COLUMNS TABLE (NEW - Kanban Columns) ==========
CREATE TABLE columns (
    id SERIAL PRIMARY KEY,
    board_id INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    position INTEGER NOT NULL,
    color VARCHAR(7) DEFAULT '#e2e8f0',
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(board_id, position)
);

CREATE INDEX idx_columns_board_id ON columns(board_id);

-- ========== LABELS TABLE (NEW) ==========
CREATE TABLE labels (
    id SERIAL PRIMARY KEY,
    board_id INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_labels_board_id ON labels(board_id);

-- ========== TASKS TABLE (Extended - formerly Cards) ==========
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    board_id INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    column_id INTEGER NOT NULL REFERENCES columns(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo', -- 'todo', 'doing', 'done'
    position INTEGER DEFAULT 0,
    due_date DATE,
    is_archived BOOLEAN DEFAULT FALSE,
    cover_image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_board_id ON tasks(board_id);
CREATE INDEX idx_tasks_column_id ON tasks(column_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);

-- ========== CARD LABELS JUNCTION TABLE (NEW) ==========
CREATE TABLE card_labels (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    label_id INTEGER NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
    UNIQUE(task_id, label_id)
);

CREATE INDEX idx_card_labels_task_id ON card_labels(task_id);
CREATE INDEX idx_card_labels_label_id ON card_labels(label_id);

-- ========== TASK ASSIGNMENTS TABLE (NEW) ==========
CREATE TABLE task_assignments (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(task_id, user_id)
);

CREATE INDEX idx_task_assignments_task_id ON task_assignments(task_id);
CREATE INDEX idx_task_assignments_user_id ON task_assignments(user_id);

-- ========== CHECKLISTS TABLE (NEW) ==========
CREATE TABLE checklists (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_checklists_task_id ON checklists(task_id);

-- ========== CHECKLIST ITEMS TABLE (NEW) ==========
CREATE TABLE checklist_items (
    id SERIAL PRIMARY KEY,
    checklist_id INTEGER NOT NULL REFERENCES checklists(id) ON DELETE CASCADE,
    text VARCHAR(500) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_checklist_items_checklist_id ON checklist_items(checklist_id);
CREATE INDEX idx_checklist_items_completed ON checklist_items(completed);

-- ========== COMMENTS TABLE (NEW) ==========
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_task_id ON comments(task_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);

-- ========== ATTACHMENTS TABLE (NEW) ==========
CREATE TABLE attachments (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(100),
    uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attachments_task_id ON attachments(task_id);
CREATE INDEX idx_attachments_uploaded_by ON attachments(uploaded_by);

-- ========== ACTIVITY LOG TABLE (NEW) ==========
CREATE TABLE activity_log (
    id SERIAL PRIMARY KEY,
    board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- 'created', 'updated', 'moved', 'deleted', etc.
    entity_type VARCHAR(50) NOT NULL, -- 'board', 'task', 'comment', etc.
    changes JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_log_board_id ON activity_log(board_id);
CREATE INDEX idx_activity_log_task_id ON activity_log(task_id);
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at);

-- ============================================
-- 5. Grant Table Privileges to User
-- ============================================
GRANT ALL ON SCHEMA public TO trello_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO trello_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO trello_user;

-- ============================================
-- 6. Insert Initial Roles
-- ============================================
INSERT INTO roles (name, description) VALUES
    ('super_admin', 'System administrator with full access'),
    ('admin', 'Board administrator'),
    ('user', 'Regular user'),
    ('guest', 'Guest user with limited access');

-- ============================================
-- 7. Verify Setup
-- ============================================
\echo '========== DATABASE SETUP COMPLETE =========='
\echo 'Database: trello_db'
\echo 'User: trello_user'
\echo 'Password: trello_pass123'
\echo ''
\echo 'Tables created:'
\echo '  - roles'
\echo '  - users (extended)'
\echo '  - board_members (new)'
\echo '  - boards (extended)'
\echo '  - columns (new - Kanban columns)'
\echo '  - labels (new)'
\echo '  - tasks (extended)'
\echo '  - card_labels (new)'
\echo '  - task_assignments (new)'
\echo '  - checklists (new)'
\echo '  - checklist_items (new)'
\echo '  - comments (new)'
\echo '  - attachments (new)'
\echo '  - activity_log (new)'
\echo ''
\echo 'Total: 14 tables'
\echo '==========================================='

-- Show tables
\dt

-- ============================================
-- 8. Schema Documentation Comments
-- ============================================
COMMENT ON TABLE roles IS 'User roles and permissions';
COMMENT ON TABLE users IS 'User accounts with profile info';
COMMENT ON COLUMN users.avatar_color IS 'Hex color for avatar display (e.g., #0079bf)';
COMMENT ON TABLE boards IS 'Project boards';
COMMENT ON COLUMN boards.cover_color IS 'Board cover color for UI display';
COMMENT ON TABLE board_members IS 'Board team members and their roles';
COMMENT ON TABLE columns IS 'Kanban columns within a board';
COMMENT ON TABLE labels IS 'Task labels/tags for categorization';
COMMENT ON TABLE tasks IS 'Cards/tasks within a board column';
COMMENT ON COLUMN tasks.status IS 'Task status: todo, doing, done';
COMMENT ON COLUMN tasks.column_id IS 'Kanban column ID for task placement';
COMMENT ON COLUMN tasks.cover_image_url IS 'Optional cover image for card';
COMMENT ON TABLE card_labels IS 'Relationship between tasks and labels';
COMMENT ON TABLE task_assignments IS 'Task assignments to team members';
COMMENT ON TABLE checklists IS 'Checklist groups within a task';
COMMENT ON TABLE checklist_items IS 'Individual items in a checklist';
COMMENT ON TABLE comments IS 'Comments on tasks for discussion';
COMMENT ON TABLE attachments IS 'Files attached to tasks';
COMMENT ON TABLE activity_log IS 'Activity history for audit trail';
