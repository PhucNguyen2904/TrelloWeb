# Keep-Alive Solution for Render Free Tier

Giải pháp hoàn chỉnh để gửi request ping định kỳ và giữ cho FastAPI service không bị sleep trên Render.

## 📋 Nội dung

- [1. Cấu hình Backend](#1-cấu-hình-backend)
- [2. Ping Scripts](#2-ping-scripts)
- [3. GitHub Actions Setup](#3-github-actions-setup)
- [4. Dịch vụ bên ngoài](#4-dịch-vụ-bên-ngoài)
- [5. Hướng dẫn sử dụng](#5-hướng-dẫn-sử-dụng)

---

## 1. Cấu hình Backend

### ✅ Endpoint `/health` đã có sẵn

Backend FastAPI của bạn đã có endpoint `/health`:

```python
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}
```

Endpoint này:
- Nhẹ, không tính vào quota API
- Trả về status 200 khi server online
- Không yêu cầu authentication

---

## 2. Ping Scripts

### 2.1 Node.js Script (Khuyến nghị)

**File:** `scripts/keep-alive.js`

```bash
# Test cơ bản
node scripts/keep-alive.js https://your-render-url.onrender.com

# Với custom retries (3 lần) và timeout (10 giây)
node scripts/keep-alive.js https://your-render-url.onrender.com 3 10000

# Verbose mode (debug)
VERBOSE=true node scripts/keep-alive.js https://your-render-url.onrender.com
```

**Tính năng:**
- ✅ Retry tự động (exponential backoff: 1s, 2s, 4s)
- ✅ Xử lý timeout, error
- ✅ Log chi tiết (success/fail)
- ✅ Không phụ thuộc external package
- ✅ Exit code: 0 (success), 1 (failure)

### 2.2 Python Script (Backup)

**File:** `scripts/keep-alive.py`

```bash
# Cài đặt dependency
pip install requests

# Test cơ bản
python scripts/keep-alive.py https://your-render-url.onrender.com

# Với custom params
python scripts/keep-alive.py https://your-render-url.onrender.com 3 10

# Verbose mode
VERBOSE=true python scripts/keep-alive.py https://your-render-url.onrender.com
```

**Tính năng:**
- ✅ Tương tự Node.js version
- ✅ Dùng `requests` library
- ✅ Backup nếu Node.js fail

---

## 3. GitHub Actions Setup

### 3.1 Tạo Secret

1. **Vào:** GitHub Repository → Settings → Secrets and variables → Actions
2. **Tạo secret mới:**
   - Name: `RENDER_URL`
   - Value: `https://your-render-url.onrender.com` (không có `/health`)

### 3.2 Workflow File

**File:** `.github/workflows/keep-alive.yml`

```yaml
name: Keep-Alive Ping (Render Free Tier)

on:
  schedule:
    - cron: '*/5 * * * *'  # Chạy mỗi 5 phút
  workflow_dispatch:       # Chạy thủ công

jobs:
  keep-alive:
    runs-on: ubuntu-latest
    steps:
      # Node.js (ưu tiên)
      - name: Setup & Run Node.js ping
        run: node scripts/keep-alive.js "${{ secrets.RENDER_URL }}" 3 10000
        continue-on-error: true
      
      # Python (backup)
      - name: Setup & Run Python ping
        run: |
          pip install requests
          python scripts/keep-alive.py "${{ secrets.RENDER_URL }}" 2 10
        continue-on-error: true
```

### 3.3 Kích hoạt Workflow

```bash
# Push file workflow để activate
git add .github/workflows/keep-alive.yml
git commit -m "feat: add keep-alive workflow for Render"
git push
```

**Kiểm tra:**
- Vào Actions tab → chọn workflow "Keep-Alive Ping"
- Nhấn "Run workflow" → "Run workflow" để test
- Xem logs trong Details

---

## 4. Dịch vụ bên ngoài

### 4.1 UptimeRobot (Khuyến nghị)

**Ưu điểm:** Miễn phí, đơn giản, không cần GitHub

1. Đăng ký: https://uptimerobot.com
2. Tạo Monitor mới:
   - Type: **HTTP(S)**
   - URL: `https://your-render-url.onrender.com/health`
   - Interval: **5 minutes**
   - Name: "Trello Backend Keep-Alive"
3. Tùy chọn: Nhận thông báo nếu down

```
Status: Monitoring
Interval: 5 min
Alert: Email/Webhook (optional)
Uptime: 99.9%+ guaranteed
```

### 4.2 Cron-Job.org

**Ưu điểm:** Miễn phí, không cần account

1. Đăng ký: https://cron-job.org
2. Create cronjob:
   - URL: `https://your-render-url.onrender.com/health`
   - Schedule: `*/5 * * * *` (every 5 min)
   - Timeout: `20` seconds
   - Notifications: Email on failure

### 4.3 Comparison

| Dịch vụ | Chi phí | Setup | Reliability | Notification |
|---------|--------|-------|-------------|--------------|
| **GitHub Actions** | Free | Medium | 99% | Logs only |
| **UptimeRobot** | Free | Easy | 99.9% | Email/Webhook |
| **Cron-Job.org** | Free | Easy | 99% | Email |
| **Render Cron** | Paid | Hard | 100% | Built-in |

**Khuyến nghị:** Sử dụng **UptimeRobot** + **GitHub Actions** để redundancy

---

## 5. Hướng dẫn sử dụng

### 5.1 Toàn bộ Setup (5 phút)

```bash
# 1. Điền URL Render vào GitHub Secret
# Vào: Settings → Secrets → RENDER_URL = https://your-app.onrender.com

# 2. Push code
git add scripts/ .github/
git commit -m "add keep-alive solution"
git push

# 3. GitHub Actions tự động chạy mỗi 5 phút ✅
```

### 5.2 Test thủ công

```bash
# Node.js
node scripts/keep-alive.js https://your-app.onrender.com

# Python
python scripts/keep-alive.py https://your-app.onrender.com
```

### 5.3 Environment Variables

```bash
# Di chuyển URL để an toàn (không commit)
export RENDER_URL=https://your-app.onrender.com
node scripts/keep-alive.js "$RENDER_URL"
```

### 5.4 Logs & Monitoring

```bash
# GitHub Actions logs:
# Vào: Actions → Keep-Alive Ping → Latest run → Logs

# Local test with verbose:
VERBOSE=true node scripts/keep-alive.js https://your-app.onrender.com
VERBOSE=true python scripts/keep-alive.py https://your-app.onrender.com
```

---

## 📊 Kiến trúc

```
┌─────────────────────────────────────────────────┐
│       GitHub Actions (Every 5 min)              │
│  ┌──────────────────────────────────────────┐  │
│  │ 1. Node.js ping → /health                │  │
│  │ 2. Python ping → /health (backup)        │  │
│  │ 3. Log result & continue                 │  │
│  └──────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────┘
                 │ HTTP GET
                 ↓
    ┌────────────────────────────────┐
    │   Render (Free Tier)           │
    │  ┌──────────────────────────┐  │
    │  │ FastAPI Server           │  │
    │  │ GET /health              │  │
    │  │ ✅ Return 200 OK          │  │
    │  │ ✅ Server stays awake     │  │
    │  └──────────────────────────┘  │
    └────────────────────────────────┘
```

---

## 🎯 Kết quả

- ✅ Server **never sleeps** (ping every 5 min)
- ✅ **Zero cost** (GitHub Actions free tier)
- ✅ **Automatic retry** (exponential backoff)
- ✅ **Clear logs** (success/fail tracking)
- ✅ **Redundancy** (Node.js + Python backup)
- ✅ **Easy setup** (just add secret + push)

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Ping fails | Check RENDER_URL secret is correct |
| Workflow not running | Enable Actions in Settings |
| 404 error | Verify `/health` endpoint exists |
| Timeout | Increase PING_TIMEOUT value |
| Too many pings | Adjust cron schedule (*/5 = 5 min) |

---

## 📝 Files

```
├── scripts/
│   ├── keep-alive.js       # Node.js ping script
│   └── keep-alive.py       # Python ping script
├── .github/
│   └── workflows/
│       └── keep-alive.yml  # GitHub Actions workflow
└── KEEP_ALIVE.md           # This file
```

---

## 🚀 Next Steps

1. ✅ Backend: `/health` endpoint ready
2. ✅ Scripts: Node.js + Python ready
3. ✅ GitHub Actions: Workflow ready
4. 📌 TODO: Add RENDER_URL secret
5. 📌 TODO: Test workflow (optional)
6. 📌 TODO: Setup UptimeRobot (optional)

**Start:** Add secret + Push code → Done! 🎉
