-- ============================================
-- Seed Data: Roles and Superadmin User
-- ============================================

-- ============================================
-- 1. Insert Roles
-- ============================================
INSERT INTO roles (name, description) VALUES
('superadmin', 'Super Administrator - Full system access'),
('admin', 'Administrator - Can manage users and boards'),
('user', 'Regular User - Can create and manage own boards'),
('guest', 'Guest User - Read-only access')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 2. Insert Superadmin User
-- ============================================
-- Email: admin@example.com
-- Password: SuperAdmin@2024
-- Note: Use bcrypt hash generated from password
INSERT INTO users (email, hashed_password, role_id, created_at, updated_at) VALUES
(
    'admin@example.com',
    '$2b$12$I2JeuhK.pb1FNVeBZCsfwO.9L3CO9kgYRhA2tRvn.Ba4EcJmRa3/W',
    (SELECT id FROM roles WHERE name = 'superadmin'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO UPDATE SET 
    hashed_password = '$2b$12$I2JeuhK.pb1FNVeBZCsfwO.9L3CO9kgYRhA2tRvn.Ba4EcJmRa3/W',
    updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- 3. Insert Additional Test Users
-- ============================================
INSERT INTO users (email, hashed_password, role_id, created_at, updated_at) VALUES
(
    'test@example.com',
    '$2b$12$4QsjGW8ZQIUbbBQwBOb4X.yFLvWXTTqp6hJVpqEKlYh0Y8ZR0rKhi',
    (SELECT id FROM roles WHERE name = 'user'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'admin2@example.com',
    '$2b$12$D9.fR0Z8K.LK0.dYy0bJbuMwG8UfCZAqvDKx9nH5UPKlV8Z.3j4Ni',
    (SELECT id FROM roles WHERE name = 'admin'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 4. Verify Data
-- ============================================
SELECT '=== ROLES ===' AS info;
SELECT id, name, description FROM roles ORDER BY id;

SELECT '=== USERS ===' AS info;
SELECT u.id, u.email, r.name as role FROM users u 
LEFT JOIN roles r ON u.role_id = r.id 
ORDER BY u.id;
