# FastAPI Trello Clone - Production-Lite Backend

Ứng dụng Trello clone backend được xây dựng với FastAPI, SQLAlchemy, JWT Authentication.

## 🏗️ Cấu trúc dự án

```
app/
├── core/
│   ├── __init__.py
│   ├── config.py          # Cấu hình ứng dụng
│   └── security.py        # JWT & Password hashing
├── db/
│   ├── __init__.py
│   ├── base.py            # Base model cho SQLAlchemy
│   └── session.py         # Database session
├── models/
│   ├── __init__.py
│   ├── user.py            # User model
│   ├── board.py           # Board model
│   └── task.py            # Task model
├── schemas/
│   ├── __init__.py
│   ├── user.py            # User schemas
│   ├── board.py           # Board schemas
│   └── task.py            # Task schemas
├── crud/
│   ├── __init__.py
│   ├── user.py            # User CRUD operations
│   ├── board.py           # Board CRUD operations
│   └── task.py            # Task CRUD operations
├── api/
│   ├── __init__.py
│   ├── deps.py            # Dependencies
│   └── endpoints/
│       ├── __init__.py
│       ├── auth.py        # Auth routes
│       ├── boards.py      # Board routes
│       └── tasks.py       # Task routes
├── requirements.txt       # Python dependencies
├── main.py               # Entry point
└── .env.example          # Environment variables template
```

## 🚀 Hướng dẫn chạy

### 1. Setup virtual environment
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Setup environment
```bash
cp .env.example .env
# Edit .env nếu cần
```

### 4. Run application
```bash
uvicorn app.main:app --reload
```

Server sẽ chạy tại `http://localhost:8000`

### 5. API Documentation
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🔐 Authentication

### Register
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=password123"
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Get Current User
```bash
curl -X GET "http://localhost:8000/api/auth/me" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📋 Board API

### Create Board
```bash
curl -X POST "http://localhost:8000/api/boards" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Board"}'
```

### Get My Boards
```bash
curl -X GET "http://localhost:8000/api/boards" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## ✅ Task API

### Create Task
```bash
curl -X POST "http://localhost:8000/api/boards/{board_id}/tasks" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Task Title",
    "description":"Task description",
    "status":"todo"
  }'
```

### Get Tasks by Board
```bash
curl -X GET "http://localhost:8000/api/boards/{board_id}/tasks" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Task
```bash
curl -X PUT "http://localhost:8000/api/boards/{board_id}/tasks/{task_id}" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Updated Title",
    "status":"doing"
  }'
```

### Delete Task
```bash
curl -X DELETE "http://localhost:8000/api/boards/{board_id}/tasks/{task_id}" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📚 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    status VARCHAR(20) DEFAULT 'todo',
    board_id INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## ✨ Key Features

- ✅ JWT Authentication (python-jose)
- ✅ Password Hashing (bcrypt)
- ✅ Role-based access (user chỉ xem board của họ)
- ✅ Type hints & Pydantic validation
- ✅ Separate schemas (Create/Update/Response)
- ✅ Proper HTTP status codes
- ✅ Auto API documentation (Swagger)
- ✅ CORS enabled
- ✅ Environment configuration

## 🔒 Security Features

- Password không bao giờ return trong response
- JWT token expiration
- CORS configuration
- SQL injection prevention (SQLAlchemy ORM)
- Input validation (Pydantic)
- Permission checks (user chỉ access data của họ)

## 🛠️ Development

Để phát triển thêm, hãy tuân theo cấu trúc hiện tại:

1. **Models**: Định nghĩa database schema trong `models/`
2. **Schemas**: CRUD request/response models trong `schemas/`
3. **CRUD**: Database operations trong `crud/`
4. **API**: HTTP routes trong `api/endpoints/`
5. **Core**: Security & config logic
