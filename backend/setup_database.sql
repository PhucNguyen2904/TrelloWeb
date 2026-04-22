-- PostgreSQL Setup Script for FastAPI Trello Clone
-- Execute this script to setup the database and tables
-- Usage: psql -U postgres -f setup_database.sql

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

-- Roles Table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255)
);

-- Create index on name for faster lookups
CREATE INDEX idx_roles_name ON roles(name);

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Create index on role_id for faster lookups
CREATE INDEX idx_users_role_id ON users(role_id);

-- Boards Table
CREATE TABLE boards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on owner_id for faster lookups
CREATE INDEX idx_boards_owner_id ON boards(owner_id);

-- Tasks Table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo',
    board_id INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on board_id for faster lookups
CREATE INDEX idx_tasks_board_id ON tasks(board_id);

-- Create index on status for faster lookups
CREATE INDEX idx_tasks_status ON tasks(status);

-- ============================================
-- 5. Grant Table Privileges to User
-- ============================================
GRANT ALL ON SCHEMA public TO trello_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO trello_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO trello_user;

-- ============================================
-- 6. Verify Setup
-- ============================================
\echo '========== DATABASE SETUP COMPLETE =========='
\echo 'Database: trello_db'
\echo 'User: trello_user'
\echo 'Password: trello_pass123'
\echo 'Tables created: roles, users, boards, tasks'
\echo '==========================================='

-- Show tables
\dt

-- Show users
SELECT 'Current Users:' AS info;
SELECT usename, usecanlogin FROM pg_user WHERE usename = 'trello_user';
