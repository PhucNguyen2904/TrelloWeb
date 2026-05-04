-- ============================================
-- Seed Data for Trello Clone v2
-- Compatible with Frontend UI
-- ============================================
-- This script populates sample data for testing
-- Usage: psql -U trello_user -d trello_db -f seed_data_v2_compatible.sql

-- ============================================
-- 1. Insert Sample Roles (if not already present)
-- ============================================
INSERT INTO roles (name, description) VALUES
    ('super_admin', 'System administrator with full access'),
    ('admin', 'Board administrator'),
    ('user', 'Regular user'),
    ('guest', 'Guest user with limited access')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 2. Insert Sample Users
-- ============================================
INSERT INTO users (email, hashed_password, first_name, last_name, avatar_color, role_id, created_at, updated_at) VALUES
    (
        'john.doe@example.com',
        '$2b$12$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jKMUG', -- password: password123
        'John',
        'Doe',
        '#0079bf',
        (SELECT id FROM roles WHERE name = 'user'),
        NOW(),
        NOW()
    ),
    (
        'jane.smith@example.com',
        '$2b$12$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jKMUG', -- password: password123
        'Jane',
        'Smith',
        '#61bd4f',
        (SELECT id FROM roles WHERE name = 'user'),
        NOW(),
        NOW()
    ),
    (
        'bob.wilson@example.com',
        '$2b$12$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jKMUG', -- password: password123
        'Bob',
        'Wilson',
        '#f2d600',
        (SELECT id FROM roles WHERE name = 'user'),
        NOW(),
        NOW()
    ),
    (
        'alice.johnson@example.com',
        '$2b$12$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jKMUG', -- password: password123
        'Alice',
        'Johnson',
        '#ff9f1a',
        (SELECT id FROM roles WHERE name = 'user'),
        NOW(),
        NOW()
    ),
    (
        'admin@example.com',
        '$2b$12$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jKMUG', -- password: password123
        'Admin',
        'User',
        '#eb5a46',
        (SELECT id FROM roles WHERE name = 'admin'),
        NOW(),
        NOW()
    )
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 3. Insert Sample Boards
-- ============================================
INSERT INTO boards (name, owner_id, cover_color, description, is_archived, created_at, updated_at) VALUES
    (
        'Project Alpha',
        (SELECT id FROM users WHERE email = 'john.doe@example.com'),
        '#0079bf',
        'Main project board for Q1 deliverables',
        FALSE,
        NOW(),
        NOW()
    ),
    (
        'Marketing Campaign',
        (SELECT id FROM users WHERE email = 'jane.smith@example.com'),
        '#61bd4f',
        'Campaign planning and execution',
        FALSE,
        NOW(),
        NOW()
    ),
    (
        'Website Redesign',
        (SELECT id FROM users WHERE email = 'bob.wilson@example.com'),
        '#f2d600',
        'Complete website UI/UX overhaul',
        FALSE,
        NOW(),
        NOW()
    )
ON CONFLICT DO NOTHING;

-- ============================================
-- 4. Insert Board Members
-- ============================================
INSERT INTO board_members (board_id, user_id, role, joined_at) VALUES
    ((SELECT id FROM boards WHERE name = 'Project Alpha'), (SELECT id FROM users WHERE email = 'john.doe@example.com'), 'owner', NOW()),
    ((SELECT id FROM boards WHERE name = 'Project Alpha'), (SELECT id FROM users WHERE email = 'jane.smith@example.com'), 'member', NOW()),
    ((SELECT id FROM boards WHERE name = 'Project Alpha'), (SELECT id FROM users WHERE email = 'bob.wilson@example.com'), 'member', NOW()),
    ((SELECT id FROM boards WHERE name = 'Project Alpha'), (SELECT id FROM users WHERE email = 'alice.johnson@example.com'), 'observer', NOW()),
    
    ((SELECT id FROM boards WHERE name = 'Marketing Campaign'), (SELECT id FROM users WHERE email = 'jane.smith@example.com'), 'owner', NOW()),
    ((SELECT id FROM boards WHERE name = 'Marketing Campaign'), (SELECT id FROM users WHERE email = 'john.doe@example.com'), 'member', NOW()),
    ((SELECT id FROM boards WHERE name = 'Marketing Campaign'), (SELECT id FROM users WHERE email = 'alice.johnson@example.com'), 'member', NOW()),
    
    ((SELECT id FROM boards WHERE name = 'Website Redesign'), (SELECT id FROM users WHERE email = 'bob.wilson@example.com'), 'owner', NOW()),
    ((SELECT id FROM boards WHERE name = 'Website Redesign'), (SELECT id FROM users WHERE email = 'jane.smith@example.com'), 'member', NOW()),
    ((SELECT id FROM boards WHERE name = 'Website Redesign'), (SELECT id FROM users WHERE email = 'alice.johnson@example.com'), 'member', NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. Insert Columns (Kanban)
-- ============================================
INSERT INTO columns (board_id, name, position, color, is_archived, created_at, updated_at) VALUES
    -- Project Alpha columns
    ((SELECT id FROM boards WHERE name = 'Project Alpha'), 'To Do', 1, '#e2e8f0', FALSE, NOW(), NOW()),
    ((SELECT id FROM boards WHERE name = 'Project Alpha'), 'In Progress', 2, '#e2e8f0', FALSE, NOW(), NOW()),
    ((SELECT id FROM boards WHERE name = 'Project Alpha'), 'In Review', 3, '#e2e8f0', FALSE, NOW(), NOW()),
    ((SELECT id FROM boards WHERE name = 'Project Alpha'), 'Done', 4, '#e2e8f0', FALSE, NOW(), NOW()),
    
    -- Marketing Campaign columns
    ((SELECT id FROM boards WHERE name = 'Marketing Campaign'), 'Planning', 1, '#e2e8f0', FALSE, NOW(), NOW()),
    ((SELECT id FROM boards WHERE name = 'Marketing Campaign'), 'Creating', 2, '#e2e8f0', FALSE, NOW(), NOW()),
    ((SELECT id FROM boards WHERE name = 'Marketing Campaign'), 'Publishing', 3, '#e2e8f0', FALSE, NOW(), NOW()),
    
    -- Website Redesign columns
    ((SELECT id FROM boards WHERE name = 'Website Redesign'), 'Backlog', 1, '#e2e8f0', FALSE, NOW(), NOW()),
    ((SELECT id FROM boards WHERE name = 'Website Redesign'), 'Designing', 2, '#e2e8f0', FALSE, NOW(), NOW()),
    ((SELECT id FROM boards WHERE name = 'Website Redesign'), 'Development', 3, '#e2e8f0', FALSE, NOW(), NOW()),
    ((SELECT id FROM boards WHERE name = 'Website Redesign'), 'Testing', 4, '#e2e8f0', FALSE, NOW(), NOW()),
    ((SELECT id FROM boards WHERE name = 'Website Redesign'), 'Deployed', 5, '#e2e8f0', FALSE, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 6. Insert Labels
-- ============================================
INSERT INTO labels (board_id, name, color, description, created_at, updated_at) VALUES
    -- Project Alpha labels
    ((SELECT id FROM boards WHERE name = 'Project Alpha'), 'Bug', '#eb5a46', 'Bug fixes and issues', NOW(), NOW()),
    ((SELECT id FROM boards WHERE name = 'Project Alpha'), 'Feature', '#61bd4f', 'New feature development', NOW(), NOW()),
    ((SELECT id FROM boards WHERE name = 'Project Alpha'), 'Enhancement', '#0079bf', 'Improvements to existing features', NOW(), NOW()),
    ((SELECT id FROM boards WHERE name = 'Project Alpha'), 'Documentation', '#f2d600', 'Documentation tasks', NOW(), NOW()),
    ((SELECT id FROM boards WHERE name = 'Project Alpha'), 'Urgent', '#ff9f1a', 'Urgent/High priority', NOW(), NOW()),
    
    -- Marketing Campaign labels
    ((SELECT id FROM boards WHERE name = 'Marketing Campaign'), 'Social Media', '#0079bf', 'Social media content', NOW(), NOW()),
    ((SELECT id FROM boards WHERE name = 'Marketing Campaign'), 'Email', '#61bd4f', 'Email marketing', NOW(), NOW()),
    ((SELECT id FROM boards WHERE name = 'Marketing Campaign'), 'Content', '#f2d600', 'Content creation', NOW(), NOW()),
    
    -- Website Redesign labels
    ((SELECT id FROM boards WHERE name = 'Website Redesign'), 'Frontend', '#0079bf', 'Frontend development', NOW(), NOW()),
    ((SELECT id FROM boards WHERE name = 'Website Redesign'), 'Backend', '#61bd4f', 'Backend development', NOW(), NOW()),
    ((SELECT id FROM boards WHERE name = 'Website Redesign'), 'UI/UX', '#f2d600', 'UI/UX design', NOW(), NOW()),
    ((SELECT id FROM boards WHERE name = 'Website Redesign'), 'Mobile', '#ff9f1a', 'Mobile responsiveness', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 7. Insert Tasks
-- ============================================
INSERT INTO tasks (board_id, column_id, title, description, status, position, due_date, is_archived, created_at, updated_at) VALUES
    -- Project Alpha - To Do
    (
        (SELECT id FROM boards WHERE name = 'Project Alpha'),
        (SELECT id FROM columns WHERE board_id = (SELECT id FROM boards WHERE name = 'Project Alpha') AND position = 1),
        'Setup development environment',
        'Configure all development tools and dependencies',
        'todo',
        1,
        '2026-05-15',
        FALSE,
        NOW(),
        NOW()
    ),
    (
        (SELECT id FROM boards WHERE name = 'Project Alpha'),
        (SELECT id FROM columns WHERE board_id = (SELECT id FROM boards WHERE name = 'Project Alpha') AND position = 1),
        'Create database schema',
        'Design and implement database tables',
        'todo',
        2,
        '2026-05-20',
        FALSE,
        NOW(),
        NOW()
    ),
    
    -- Project Alpha - In Progress
    (
        (SELECT id FROM boards WHERE name = 'Project Alpha'),
        (SELECT id FROM columns WHERE board_id = (SELECT id FROM boards WHERE name = 'Project Alpha') AND position = 2),
        'Implement user authentication',
        'Add login/registration functionality',
        'doing',
        1,
        '2026-05-12',
        FALSE,
        NOW(),
        NOW()
    ),
    (
        (SELECT id FROM boards WHERE name = 'Project Alpha'),
        (SELECT id FROM columns WHERE board_id = (SELECT id FROM boards WHERE name = 'Project Alpha') AND position = 2),
        'Build API endpoints',
        'Create RESTful API for CRUD operations',
        'doing',
        2,
        '2026-05-18',
        FALSE,
        NOW(),
        NOW()
    ),
    
    -- Project Alpha - In Review
    (
        (SELECT id FROM boards WHERE name = 'Project Alpha'),
        (SELECT id FROM columns WHERE board_id = (SELECT id FROM boards WHERE name = 'Project Alpha') AND position = 3),
        'Code review process',
        'Review and approve pull requests',
        'todo',
        1,
        '2026-05-14',
        FALSE,
        NOW(),
        NOW()
    ),
    
    -- Project Alpha - Done
    (
        (SELECT id FROM boards WHERE name = 'Project Alpha'),
        (SELECT id FROM columns WHERE board_id = (SELECT id FROM boards WHERE name = 'Project Alpha') AND position = 4),
        'Project kickoff meeting',
        'Initial project planning and scope definition',
        'done',
        1,
        '2026-04-01',
        FALSE,
        NOW(),
        NOW()
    ),
    
    -- Marketing Campaign tasks
    (
        (SELECT id FROM boards WHERE name = 'Marketing Campaign'),
        (SELECT id FROM columns WHERE board_id = (SELECT id FROM boards WHERE name = 'Marketing Campaign') AND position = 1),
        'Define target audience',
        'Research and define target customer segments',
        'todo',
        1,
        '2026-05-10',
        FALSE,
        NOW(),
        NOW()
    ),
    (
        (SELECT id FROM boards WHERE name = 'Marketing Campaign'),
        (SELECT id FROM columns WHERE board_id = (SELECT id FROM boards WHERE name = 'Marketing Campaign') AND position = 2),
        'Create campaign visuals',
        'Design graphics and promotional materials',
        'doing',
        1,
        '2026-05-15',
        FALSE,
        NOW(),
        NOW()
    ),
    
    -- Website Redesign tasks
    (
        (SELECT id FROM boards WHERE name = 'Website Redesign'),
        (SELECT id FROM columns WHERE board_id = (SELECT id FROM boards WHERE name = 'Website Redesign') AND position = 1),
        'Gather requirements',
        'Collect stakeholder requirements and feedback',
        'todo',
        1,
        '2026-05-08',
        FALSE,
        NOW(),
        NOW()
    ),
    (
        (SELECT id FROM boards WHERE name = 'Website Redesign'),
        (SELECT id FROM columns WHERE board_id = (SELECT id FROM boards WHERE name = 'Website Redesign') AND position = 2),
        'Create wireframes',
        'Design page layouts and user flows',
        'doing',
        1,
        '2026-05-15',
        FALSE,
        NOW(),
        NOW()
    ),
    (
        (SELECT id FROM boards WHERE name = 'Website Redesign'),
        (SELECT id FROM columns WHERE board_id = (SELECT id FROM boards WHERE name = 'Website Redesign') AND position = 5),
        'Update domain settings',
        'Configure DNS and SSL certificates',
        'done',
        1,
        '2026-01-15',
        FALSE,
        NOW(),
        NOW()
    )
ON CONFLICT DO NOTHING;

-- ============================================
-- 8. Assign Labels to Tasks
-- ============================================
INSERT INTO card_labels (task_id, label_id) VALUES
    -- Add labels to Project Alpha tasks
    ((SELECT id FROM tasks WHERE title = 'Setup development environment'),
     (SELECT id FROM labels WHERE board_id = (SELECT id FROM boards WHERE name = 'Project Alpha') AND name = 'Feature')),
    
    ((SELECT id FROM tasks WHERE title = 'Create database schema'),
     (SELECT id FROM labels WHERE board_id = (SELECT id FROM boards WHERE name = 'Project Alpha') AND name = 'Feature')),
    
    ((SELECT id FROM tasks WHERE title = 'Implement user authentication'),
     (SELECT id FROM labels WHERE board_id = (SELECT id FROM boards WHERE name = 'Project Alpha') AND name = 'Feature')),
    ((SELECT id FROM tasks WHERE title = 'Implement user authentication'),
     (SELECT id FROM labels WHERE board_id = (SELECT id FROM boards WHERE name = 'Project Alpha') AND name = 'Urgent')),
    
    ((SELECT id FROM tasks WHERE title = 'Build API endpoints'),
     (SELECT id FROM labels WHERE board_id = (SELECT id FROM boards WHERE name = 'Project Alpha') AND name = 'Feature')),
    
    -- Add labels to Marketing Campaign tasks
    ((SELECT id FROM tasks WHERE title = 'Define target audience'),
     (SELECT id FROM labels WHERE board_id = (SELECT id FROM boards WHERE name = 'Marketing Campaign') AND name = 'Content')),
    
    ((SELECT id FROM tasks WHERE title = 'Create campaign visuals'),
     (SELECT id FROM labels WHERE board_id = (SELECT id FROM boards WHERE name = 'Marketing Campaign') AND name = 'Social Media')),
    
    -- Add labels to Website Redesign tasks
    ((SELECT id FROM tasks WHERE title = 'Create wireframes'),
     (SELECT id FROM labels WHERE board_id = (SELECT id FROM boards WHERE name = 'Website Redesign') AND name = 'UI/UX')),
    
    ((SELECT id FROM tasks WHERE title = 'Update domain settings'),
     (SELECT id FROM labels WHERE board_id = (SELECT id FROM boards WHERE name = 'Website Redesign') AND name = 'Backend'))
ON CONFLICT DO NOTHING;

-- ============================================
-- 9. Assign Tasks to Users
-- ============================================
INSERT INTO task_assignments (task_id, user_id, assigned_at) VALUES
    -- Project Alpha assignments
    ((SELECT id FROM tasks WHERE title = 'Setup development environment'),
     (SELECT id FROM users WHERE email = 'john.doe@example.com'), NOW()),
    
    ((SELECT id FROM tasks WHERE title = 'Create database schema'),
     (SELECT id FROM users WHERE email = 'bob.wilson@example.com'), NOW()),
    
    ((SELECT id FROM tasks WHERE title = 'Implement user authentication'),
     (SELECT id FROM users WHERE email = 'john.doe@example.com'), NOW()),
    ((SELECT id FROM tasks WHERE title = 'Implement user authentication'),
     (SELECT id FROM users WHERE email = 'bob.wilson@example.com'), NOW()),
    
    ((SELECT id FROM tasks WHERE title = 'Build API endpoints'),
     (SELECT id FROM users WHERE email = 'bob.wilson@example.com'), NOW()),
    
    ((SELECT id FROM tasks WHERE title = 'Code review process'),
     (SELECT id FROM users WHERE email = 'jane.smith@example.com'), NOW()),
    
    -- Marketing Campaign assignments
    ((SELECT id FROM tasks WHERE title = 'Define target audience'),
     (SELECT id FROM users WHERE email = 'jane.smith@example.com'), NOW()),
    
    ((SELECT id FROM tasks WHERE title = 'Create campaign visuals'),
     (SELECT id FROM users WHERE email = 'alice.johnson@example.com'), NOW()),
    
    -- Website Redesign assignments
    ((SELECT id FROM tasks WHERE title = 'Gather requirements'),
     (SELECT id FROM users WHERE email = 'bob.wilson@example.com'), NOW()),
    
    ((SELECT id FROM tasks WHERE title = 'Create wireframes'),
     (SELECT id FROM users WHERE email = 'jane.smith@example.com'), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 10. Add Comments to Tasks
-- ============================================
INSERT INTO comments (task_id, user_id, content, created_at, updated_at) VALUES
    ((SELECT id FROM tasks WHERE title = 'Implement user authentication'),
     (SELECT id FROM users WHERE email = 'john.doe@example.com'),
     'Started implementation with JWT tokens',
     NOW(),
     NOW()),
    
    ((SELECT id FROM tasks WHERE title = 'Implement user authentication'),
     (SELECT id FROM users WHERE email = 'jane.smith@example.com'),
     'Great! Don''t forget to add password hashing',
     NOW() + INTERVAL '5 minutes',
     NOW() + INTERVAL '5 minutes'),
    
    ((SELECT id FROM tasks WHERE title = 'Build API endpoints'),
     (SELECT id FROM users WHERE email = 'bob.wilson@example.com'),
     'Completed basic CRUD endpoints',
     NOW(),
     NOW()),
    
    ((SELECT id FROM tasks WHERE title = 'Create wireframes'),
     (SELECT id FROM users WHERE email = 'jane.smith@example.com'),
     'Initial wireframes ready for review',
     NOW(),
     NOW()),
    
    ((SELECT id FROM tasks WHERE title = 'Create wireframes'),
     (SELECT id FROM users WHERE email = 'bob.wilson@example.com'),
     'Looks good! Let''s discuss the navigation flow',
     NOW() + INTERVAL '1 day',
     NOW() + INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- ============================================
-- 11. Add Checklists to Tasks
-- ============================================
INSERT INTO checklists (task_id, name, created_at, updated_at) VALUES
    ((SELECT id FROM tasks WHERE title = 'Implement user authentication'),
     'Implementation Checklist',
     NOW(),
     NOW()),
    
    ((SELECT id FROM tasks WHERE title = 'Create wireframes'),
     'Design Review Checklist',
     NOW(),
     NOW()),
    
    ((SELECT id FROM tasks WHERE title = 'Build API endpoints'),
     'Testing Checklist',
     NOW(),
     NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 12. Add Checklist Items
-- ============================================
INSERT INTO checklist_items (checklist_id, text, completed, position, created_at, updated_at) VALUES
    -- Authentication checklist
    ((SELECT id FROM checklists WHERE task_id = (SELECT id FROM tasks WHERE title = 'Implement user authentication') AND name = 'Implementation Checklist'),
     'Implement login endpoint', TRUE, 1, NOW(), NOW()),
    
    ((SELECT id FROM checklists WHERE task_id = (SELECT id FROM tasks WHERE title = 'Implement user authentication') AND name = 'Implementation Checklist'),
     'Implement registration endpoint', TRUE, 2, NOW(), NOW()),
    
    ((SELECT id FROM checklists WHERE task_id = (SELECT id FROM tasks WHERE title = 'Implement user authentication') AND name = 'Implementation Checklist'),
     'Add password hashing', FALSE, 3, NOW(), NOW()),
    
    ((SELECT id FROM checklists WHERE task_id = (SELECT id FROM tasks WHERE title = 'Implement user authentication') AND name = 'Implementation Checklist'),
     'Add JWT token generation', FALSE, 4, NOW(), NOW()),
    
    ((SELECT id FROM checklists WHERE task_id = (SELECT id FROM tasks WHERE title = 'Implement user authentication') AND name = 'Implementation Checklist'),
     'Add token validation middleware', FALSE, 5, NOW(), NOW()),
    
    -- Wireframes checklist
    ((SELECT id FROM checklists WHERE task_id = (SELECT id FROM tasks WHERE title = 'Create wireframes') AND name = 'Design Review Checklist'),
     'Mobile layout', TRUE, 1, NOW(), NOW()),
    
    ((SELECT id FROM checklists WHERE task_id = (SELECT id FROM tasks WHERE title = 'Create wireframes') AND name = 'Design Review Checklist'),
     'Tablet layout', TRUE, 2, NOW(), NOW()),
    
    ((SELECT id FROM checklists WHERE task_id = (SELECT id FROM tasks WHERE title = 'Create wireframes') AND name = 'Design Review Checklist'),
     'Desktop layout', FALSE, 3, NOW(), NOW()),
    
    ((SELECT id FROM checklists WHERE task_id = (SELECT id FROM tasks WHERE title = 'Create wireframes') AND name = 'Design Review Checklist'),
     'Accessibility review', FALSE, 4, NOW(), NOW()),
    
    -- API endpoints checklist
    ((SELECT id FROM checklists WHERE task_id = (SELECT id FROM tasks WHERE title = 'Build API endpoints') AND name = 'Testing Checklist'),
     'Create endpoint tests', FALSE, 1, NOW(), NOW()),
    
    ((SELECT id FROM checklists WHERE task_id = (SELECT id FROM tasks WHERE title = 'Build API endpoints') AND name = 'Testing Checklist'),
     'Update endpoint tests', FALSE, 2, NOW(), NOW()),
    
    ((SELECT id FROM checklists WHERE task_id = (SELECT id FROM tasks WHERE title = 'Build API endpoints') AND name = 'Testing Checklist'),
     'Delete endpoint tests', FALSE, 3, NOW(), NOW()),
    
    ((SELECT id FROM checklists WHERE task_id = (SELECT id FROM tasks WHERE title = 'Build API endpoints') AND name = 'Testing Checklist'),
     'Error handling tests', FALSE, 4, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 13. Activity Log
-- ============================================
INSERT INTO activity_log (board_id, task_id, user_id, action, entity_type, changes, created_at) VALUES
    ((SELECT id FROM boards WHERE name = 'Project Alpha'),
     NULL,
     (SELECT id FROM users WHERE email = 'john.doe@example.com'),
     'created',
     'board',
     '{"name": "Project Alpha"}'::jsonb,
     NOW() - INTERVAL '7 days'),
    
    ((SELECT id FROM boards WHERE name = 'Project Alpha'),
     (SELECT id FROM tasks WHERE title = 'Implement user authentication'),
     (SELECT id FROM users WHERE email = 'john.doe@example.com'),
     'created',
     'task',
     '{"title": "Implement user authentication"}'::jsonb,
     NOW() - INTERVAL '3 days'),
    
    ((SELECT id FROM boards WHERE name = 'Project Alpha'),
     (SELECT id FROM tasks WHERE title = 'Implement user authentication'),
     (SELECT id FROM users WHERE email = 'john.doe@example.com'),
     'moved',
     'task',
     '{"from_column": "To Do", "to_column": "In Progress"}'::jsonb,
     NOW() - INTERVAL '2 days')
ON CONFLICT DO NOTHING;

-- ============================================
-- 14. Verify Seed Data
-- ============================================
\echo '========== SEED DATA INSERTED =========='
\echo 'Users created:' 
SELECT COUNT(*) FROM users;

\echo 'Boards created:'
SELECT COUNT(*) FROM boards;

\echo 'Board members:' 
SELECT COUNT(*) FROM board_members;

\echo 'Columns created:'
SELECT COUNT(*) FROM columns;

\echo 'Tasks created:'
SELECT COUNT(*) FROM tasks;

\echo 'Labels created:'
SELECT COUNT(*) FROM labels;

\echo 'Task assignments:'
SELECT COUNT(*) FROM task_assignments;

\echo 'Comments:'
SELECT COUNT(*) FROM comments;

\echo 'Checklists:'
SELECT COUNT(*) FROM checklists;

\echo 'Checklist items:'
SELECT COUNT(*) FROM checklist_items;

\echo 'Activity logs:'
SELECT COUNT(*) FROM activity_log;

\echo '========================================'
\echo 'Sample data ready for testing!'
\echo 'Test User: john.doe@example.com'
\echo 'Password: password123'
\echo '========================================'
