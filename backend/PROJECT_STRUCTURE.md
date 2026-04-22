# 🏗️ FastAPI Trello Clone - Final Project Structure

## 📂 Complete Directory Tree

```
Trello/
├── app/
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   └── security.py
│   ├── db/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   └── session.py
│   ├── model/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── board.py
│   │   └── task.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── User.py
│   │   ├── Board.py
│   │   └── Task.py
│   ├── crud/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── board.py
│   │   └── task.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── router.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       └── endpoints/
│   │           ├── __init__.py
│   │           ├── user.py
│   │           ├── board.py
│   │           └── task.py
│   ├── deps/
│   │   ├── __init__.py
│   │   └── auth.py
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
├── COMPLETE_GUIDE.md
└── PROJECT_STRUCTURE.md (this file)
```

---

## 🔄 Request Flow Diagram

```
Browser/Client
     ↓
HTTP Request → FastAPI Router
     ↓
API Endpoint (async function)
     ├→ Extract Data (Query, Path, Body)
     ├→ Get Current User (Dependency)
     ├→ Get Database Session (Dependency)
     ├→ CRUD Operations
     ├→ Database (SQLAlchemy)
     ├→ Validate Response (Pydantic)
     └→ Return JSON Response
     ↓
Browser/Client
```

---

## 📊 Data Model Relations

```
┌─────────────┐
│    Users    │
├─────────────┤
│ id (PK)     │
│ email       │
│ password    │
│ created_at  │
│ updated_at  │
└──────┬──────┘
       │ (1:M)
       │
       ↓
┌─────────────────┐
│    Boards       │
├─────────────────┤
│ id (PK)         │
│ name            │
│ owner_id (FK)   │──→ Users.id
│ created_at      │
│ updated_at      │
└─────────┬───────┘
          │ (1:M)
          │
          ↓
┌──────────────────┐
│    Tasks         │
├──────────────────┤
│ id (PK)          │
│ title            │
│ description      │
│ status (enum)    │
│ board_id (FK)    │──→ Boards.id
│ created_at       │
│ updated_at       │
└──────────────────┘

Status Enum Values:
  - "todo"  (Not started)
  - "doing" (In progress)
  - "done"  (Completed)
```

---

## 🔐 Authentication Architecture

```
1. Register Request
   ↓
   [UserCreate Schema] → Hash Password → Create User → [UserResponse]

2. Login Request
   ↓
   [Email + Password] → Verify → Generate JWT Token → [Token Response]

3. Authenticated Request
   ↓
   [Authorization: Bearer TOKEN]
   ↓
   get_current_user (Dependency)
     ├→ Extract Token from Header
     ├→ Decode JWT
     ├→ Fetch User from Database
     └→ Return User Object
   ↓
   [User Object available in endpoint]
```

---

## 📝 Schema Layer Separation

### User Schemas
```python
UserBase          # Common: email
  ├→ UserCreate   # Add: password
  ├→ UserUpdate   # Optional: password
  └→ UserResponse # Return: id, created_at, updated_at
```

### Board Schemas
```python
BoardBase         # Common: name
  ├→ BoardCreate  # For POST
  ├→ BoardUpdate  # Optional: name
  └→ BoardResponse# Return: id, owner_id, timestamps
```

### Task Schemas
```python
TaskBase          # Common: title, description, status
  ├→ TaskCreate   # For POST
  ├→ TaskUpdate   # Optional: all fields
  └→ TaskResponse # Return: id, board_id, timestamps
```

---

## 🌳 API Route Structure

```
/
├── / (GET)
│   └→ Returns app info
├── /health (GET)
│   └→ Returns status
│
/api/auth
├── /register (POST)
│   ├→ Request: {email, password}
│   └→ Response: UserResponse
├── /login (POST)
│   ├→ Request: {username, password}
│   └→ Response: {access_token, token_type}
└── /me (GET)
    ├→ Auth Required: Yes
    └→ Response: UserResponse

/api/boards
├── / (POST)
│   ├→ Auth Required: Yes
│   ├→ Request: {name}
│   └→ Response: BoardResponse (201)
├── / (GET)
│   ├→ Auth Required: Yes
│   └→ Response: [BoardResponse]
├── /{board_id} (GET)
│   ├→ Auth Required: Yes
│   ├→ Permission: Owner only
│   └→ Response: BoardResponse
├── /{board_id} (PUT)
│   ├→ Auth Required: Yes
│   ├→ Permission: Owner only
│   ├→ Request: {name?}
│   └→ Response: BoardResponse
└── /{board_id} (DELETE)
    ├→ Auth Required: Yes
    ├→ Permission: Owner only
    └→ Response: 204 No Content

/api/boards/{board_id}/tasks
├── / (POST)
│   ├→ Auth Required: Yes
│   ├→ Permission: Board Owner only
│   ├→ Request: {title, description?, status?}
│   └→ Response: TaskResponse (201)
├── / (GET)
│   ├→ Auth Required: Yes
│   ├→ Permission: Board Owner only
│   └→ Response: [TaskResponse]
├── /{task_id} (GET)
│   ├→ Auth Required: Yes
│   ├→ Permission: Board Owner only
│   └→ Response: TaskResponse
├── /{task_id} (PUT)
│   ├→ Auth Required: Yes
│   ├→ Permission: Board Owner only
│   ├→ Request: {title?, description?, status?}
│   └→ Response: TaskResponse
└── /{task_id} (DELETE)
    ├→ Auth Required: Yes
    ├→ Permission: Board Owner only
    └→ Response: 204 No Content
```

---

## 🔄 Request/Response Examples

### Register
```json
// Request (POST /api/auth/register)
{
  "email": "user@example.com",
  "password": "SecurePass123"
}

// Response (201)
{
  "id": 1,
  "email": "user@example.com",
  "created_at": "2026-04-16T07:30:46.568Z",
  "updated_at": "2026-04-16T07:30:46.568Z"
}
```

### Login
```json
// Request (POST /api/auth/login)
username=user@example.com&password=SecurePass123

// Response (200)
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Create Board
```json
// Request (POST /api/boards)
// Header: Authorization: Bearer {token}
{
  "name": "Project Alpha"
}

// Response (201)
{
  "id": 1,
  "name": "Project Alpha",
  "owner_id": 1,
  "created_at": "2026-04-16T07:30:46.568Z",
  "updated_at": "2026-04-16T07:30:46.568Z"
}
```

### Create Task
```json
// Request (POST /api/boards/1/tasks)
// Header: Authorization: Bearer {token}
{
  "title": "Design homepage",
  "description": "Create mockups for landing page",
  "status": "todo"
}

// Response (201)
{
  "id": 1,
  "title": "Design homepage",
  "description": "Create mockups for landing page",
  "status": "todo",
  "board_id": 1,
  "created_at": "2026-04-16T07:30:46.568Z",
  "updated_at": "2026-04-16T07:30:46.568Z"
}
```

---

## 🛡️ Security Implementation Details

### Password Hashing
```
Plain Password → bcrypt (with salt) → Hashed Password (in database)
Verification:   Plain Password + Hash → bcrypt.verify() → True/False
```

### JWT Token
```
Token Contents:
{
  "sub": 1,           // User ID (subject)
  "exp": 1714243246   // Expiration timestamp
}

Signing: HMAC-SHA256 with SECRET_KEY
Algorithm: HS256
Expiry: 30 minutes (configurable)
```

### Permission Checks
```
User Request
  ↓
get_current_user() → Extract user_id from token
  ↓
Check Ownership → user.id == board.owner_id
  ↓
If False → 403 Forbidden
If True → Process Request
```

---

## 💾 Database Features

### Relationships
- **One-to-Many:** User → Boards
- **One-to-Many:** Board → Tasks
- **Cascade Delete:** Delete user → Delete boards → Delete tasks

### Timestamps
- `created_at`: Set on creation, never changes
- `updated_at`: Set on creation, updated on modification

### Indexing
- `users.email` - indexed (unique, for fast lookup)
- `boards.owner_id` - indexed (for user's boards query)
- `tasks.board_id` - indexed (for board's tasks query)

---

## 🔧 Configuration Management

### Environment Variables (config.py)
```python
Settings class reads from .env file:
  - APP_NAME, APP_VERSION, DEBUG
  - DATABASE_URL
  - SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
  - ALLOWED_ORIGINS
```

### Database Flexibility
```
SQLite (Development):   DATABASE_URL=sqlite:///./test.db
PostgreSQL (Production): DATABASE_URL=postgresql://user:pass@host/db
```

---

## 📦 Dependencies Summary

| Package | Version | Purpose |
|---------|---------|---------|
| fastapi | 0.104.1 | Web framework |
| uvicorn | 0.24.0 | ASGI server |
| sqlalchemy | 2.0.23 | ORM |
| pydantic | 2.5.0 | Data validation |
| python-jose | 3.3.0 | JWT handling |
| passlib | 1.7.4 | Password hashing |
| psycopg2 | 2.9.9 | PostgreSQL adapter |
| email-validator | 2.1.0 | Email validation |

---

## 🎯 Key Features Checklist

✅ Separated layers (models, schemas, crud, api)
✅ Pydantic schemas with validation
✅ SQLAlchemy ORM with relationships
✅ JWT authentication
✅ Password hashing (bcrypt)
✅ Permission checks
✅ Proper HTTP status codes
✅ CORS enabled
✅ Type hints throughout
✅ Configuration management
✅ Database transactions
✅ No password in responses
✅ Cascade delete
✅ Auto-generated timestamps
✅ Async/await ready

---

## 🚀 Next Steps for Production

1. **Setup PostgreSQL** database
2. **Update .env** with production values
3. **Add logging** for debugging
4. **Add rate limiting** for security
5. **Add caching** for performance
6. **Setup database migrations** (Alembic)
7. **Add tests** (pytest)
8. **Setup CI/CD** pipeline
9. **Add API versioning** headers
10. **Monitor** application health

---

Generated: 2026-04-16 | FastAPI v0.104.1 | Production-Ready
