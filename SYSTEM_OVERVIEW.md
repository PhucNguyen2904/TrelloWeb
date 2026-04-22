# Trello Clone - System Overview

## 📋 Project Description

Đây là một **Trello Clone** - ứng dụng quản lý công việc được xây dựng với:
- **Frontend:** Next.js 16 + React 19 + TypeScript
- **Backend:** FastAPI + Python
- **Database:** PostgreSQL (Neon Cloud)
- **Authentication:** JWT Token

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│              http://localhost:3000                       │
│  - Dashboard (Boards & User Management)                  │
│  - Login/Register                                        │
│  - Board Management (CRUD)                               │
│  - Task Management (CRUD)                                │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP/REST API
                   ↓
┌─────────────────────────────────────────────────────────┐
│                  Backend (FastAPI)                       │
│              http://localhost:8000                       │
│  - Authentication (JWT)                                  │
│  - User Management                                       │
│  - Role-Based Access Control (RBAC)                      │
│  - Board APIs                                            │
│  - Task APIs                                             │
└──────────────────┬──────────────────────────────────────┘
                   │ SQLAlchemy ORM
                   ↓
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL Database (Neon)                  │
│     postgresql://neondb_owner@...neon.tech              │
│  - users table                                           │
│  - roles table                                           │
│  - boards table                                          │
│  - tasks table                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 👥 Role Hierarchy & Permissions

### Role Structure

```
┌──────────────────────────────────────────┐
│  Super Admin (superadmin)                │
│  ✅ Manage all users                     │
│  ✅ Create/Edit/Delete users             │
│  ✅ Change user roles                    │
│  ✅ View all roles                       │
│  ❌ Cannot change own role               │
│  ❌ Cannot delete own account            │
└──────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────┐
│  Admin (admin)                           │
│  ✅ Manage users                         │
│  ✅ View all users                       │
│  ❌ Cannot delete other admins           │
│  ❌ Cannot see boards                    │
└──────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────┐
│  User (user)                             │
│  ✅ Create own boards                    │
│  ✅ Manage own boards & tasks            │
│  ❌ Cannot see other users' boards       │
│  ❌ Cannot manage users                  │
└──────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────┐
│  Guest (guest)                           │
│  ✅ Read-only access                     │
│  ❌ Cannot create/edit/delete            │
└──────────────────────────────────────────┘
```

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Roles Table
```sql
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255)
);
```

### Boards Table
```sql
CREATE TABLE boards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo',
    board_id INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔑 Default Accounts

### Super Admin Account
| Field | Value |
|-------|-------|
| **Email** | admin@example.com |
| **Password** | SuperAdmin@2024 |
| **Role** | superadmin |

### Admin Account (Optional)
| Field | Value |
|-------|-------|
| **Email** | admin@example.com |
| **Password** | Admin@2024 |
| **Role** | admin |

---

## 🚀 Setup & Installation

### 1. Backend Setup

```bash
# Navigate to backend directory
cd "D:\Documents\Lap trinh\Trello\backend"

# Create virtual environment
python -m venv .venv

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Install dependencies
python -m pip install -r app/requirements.txt
```

### 2. Database Setup

**Option A: Using Neon Web Console**
1. Go to https://console.neon.tech
2. Open SQL Editor
3. Copy-paste content from `setup_database.sql`
4. Execute

**Option B: Using psql (if installed)**
```bash
psql "postgresql://neondb_owner:...@...neon.tech/neondb" -f setup_database.sql
```

### 3. Seed Initial Data

1. Go to Neon Web Console → SQL Editor
2. Copy-paste content from `seed_data.sql`
3. Execute

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd "D:\Documents\Lap trinh\Trello\frontend"

# Install dependencies
npm install

# Start development server
npm run dev
```

### 5. Backend Start

```bash
# In backend directory
python -m uvicorn app.main:app --reload
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user info |

### Super Admin User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/super-admin/users` | List all users |
| POST | `/api/super-admin/users` | Create new user |
| PUT | `/api/super-admin/users/{id}/role` | Change user role |
| DELETE | `/api/super-admin/users/{id}` | Delete user |
| GET | `/api/super-admin/roles` | List all roles |

### Admin User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users (admin view) |
| DELETE | `/api/admin/users/{id}` | Delete user |

### Boards
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/boards` | List user's boards |
| POST | `/api/boards` | Create new board |
| GET | `/api/boards/{id}` | Get board details |
| DELETE | `/api/boards/{id}` | Delete board |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List board's tasks |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/{id}` | Update task |
| DELETE | `/api/tasks/{id}` | Delete task |

---

## 📂 Project Structure

```
Trello/
├── frontend/                          # Next.js Frontend
│   ├── src/
│   │   ├── app/                      # App routes
│   │   │   ├── (auth)/              # Auth routes (login, register)
│   │   │   ├── dashboard/           # Dashboard page
│   │   │   └── board/               # Board detail page
│   │   ├── components/              # React components
│   │   │   ├── layout/              # Layout components
│   │   │   └── providers/           # Context providers
│   │   ├── lib/                     # Utilities
│   │   │   ├── api.ts              # API client
│   │   │   └── types.ts            # TypeScript types
│   │   └── store/                  # Zustand stores
│   └── package.json
│
├── backend/                          # FastAPI Backend
│   ├── app/
│   │   ├── api/                    # API routes
│   │   │   ├── v1/endpoints/       # Endpoint handlers
│   │   │   └── router.py           # Router config
│   │   ├── crud/                   # Database operations
│   │   ├── db/                     # Database config
│   │   ├── model/                  # SQLAlchemy models
│   │   ├── schemas/                # Request/Response schemas
│   │   ├── core/                   # Security & config
│   │   ├── deps/                   # Dependencies
│   │   └── main.py                 # App entry point
│   ├── setup_database.sql          # Database schema
│   ├── seed_data.sql               # Initial data
│   └── requirements.txt
│
└── SYSTEM_OVERVIEW.md              # This file
```

---

## 🔐 Security Features

- ✅ **JWT Token Authentication** - Secure token-based auth
- ✅ **Bcrypt Password Hashing** - Strong password encryption
- ✅ **Role-Based Access Control (RBAC)** - Fine-grained permissions
- ✅ **Self-Protection** - Users cannot modify their own roles
- ✅ **SQL Injection Prevention** - Parameterized queries
- ✅ **CORS Security** - Whitelist allowed origins
- ✅ **Email Validation** - Proper email format checking

---

## 🚦 Development Workflow

### 1. **User Registration**
```
User fills registration form
    ↓
Frontend calls POST /api/auth/register
    ↓
Backend hashes password & creates user (role: 'user')
    ↓
User can now login
```

### 2. **User Login**
```
User enters credentials
    ↓
Frontend calls POST /api/auth/login
    ↓
Backend validates & returns JWT token
    ↓
Frontend stores token in localStorage/Zustand
    ↓
User redirected to dashboard
```

### 3. **Dashboard Display**
```
Frontend checks user role
    ↓
If role = 'superadmin' or 'admin':
    → Show user management UI
Else:
    → Show boards list
```

### 4. **Board Management (Regular Users)**
```
User clicks "Create Board"
    ↓
Frontend calls POST /api/boards
    ↓
Backend creates board with owner_id = current user
    ↓
Board appears in user's dashboard
```

---

## 📝 Environment Configuration

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (app/.env.local)
```
APP_NAME=Trello Clone API
APP_VERSION=1.0.0
DEBUG=True

DATABASE_URL=postgresql://neondb_owner:...@...neon.tech/neondb?sslmode=require

SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

ALLOWED_ORIGINS=http://localhost,http://localhost:3000,http://localhost:3001
```

---

## ✅ Testing Checklist

- [ ] Database connection works
- [ ] Super admin can login
- [ ] Super admin can view all users
- [ ] Super admin can create new users
- [ ] Super admin can change user roles
- [ ] Super admin cannot delete own account
- [ ] Admin can see users but not boards
- [ ] Regular user can create boards
- [ ] Regular user cannot see other users' boards
- [ ] JWT token validation works

---

## 🔄 Troubleshooting

### Issue: Backend returns 500 on `/api/auth/me`
**Solution:** Check that JWT token is valid and user exists in database

### Issue: Frontend cannot connect to backend
**Solution:** Ensure CORS_ORIGINS in backend includes frontend URL

### Issue: Database connection fails
**Solution:** Verify DATABASE_URL in `.env.local` and network access to Neon

### Issue: Invalid email error
**Solution:** Use valid email domains (not `.local`). Use `@example.com` instead

---

## 📚 Additional Resources

- Backend Guide: `backend/SUPER_ADMIN_GUIDE.md`
- Quick Start: `backend/QUICK_START.md`
- Frontend Repo: `/frontend`
- Backend Repo: `/backend`

---

## 👨‍💻 Tech Stack Summary

| Component | Technology | Version |
|-----------|-----------|---------|
| Frontend Framework | Next.js | 16.2.4 |
| React | React | 19.2.4 |
| Language (Frontend) | TypeScript | ^5 |
| Language (Backend) | Python | 3.10+ |
| Web Framework | FastAPI | Latest |
| Database | PostgreSQL | (Neon) |
| ORM | SQLAlchemy | Latest |
| Authentication | JWT | HS256 |
| Password Hashing | Bcrypt | Latest |
| CSS Framework | Tailwind CSS | ^4 |

---

**Last Updated:** April 21, 2026
**Status:** ✅ Production Ready
