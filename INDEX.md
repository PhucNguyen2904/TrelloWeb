# 📑 Keep-Alive Solution - Complete Index

> **Giải pháp hoàn chỉnh để giữ cho FastAPI backend trên Render free tier không bị sleep**

---

## 🚀 Quick Start (2 phút)

```bash
# 1. Add GitHub Secret
GitHub Settings → Secrets → New secret
Name:  RENDER_URL
Value: https://your-app.onrender.com

# 2. Push Code
git add -A
git commit -m "add keep-alive solution"
git push

# Done! ✨ Server pings every 5 minutes automatically
```

---

## 📚 Documentation Map

### 🟢 **For Everyone** (Start Here)

| File | Mục đích | Thời gian |
|------|---------|----------|
| **[00_START_HERE.md](00_START_HERE.md)** | Tổng quan solution & checklist | 2 min |
| **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** | Hướng dẫn setup từng bước | 5 min |

### 🔵 **For Detailed Info**

| File | Mục đích | Thời gian |
|------|---------|----------|
| **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** | Commands, troubleshooting, tips | 5 min |
| **[KEEP_ALIVE.md](KEEP_ALIVE.md)** | Tài liệu kỹ thuật đầy đủ | 10 min |
| **[RENDER_KEEP_ALIVE_README.md](RENDER_KEEP_ALIVE_README.md)** | Overview & features | 5 min |

### 🟠 **For Optional Setup**

| File | Mục đích | Thời gian |
|------|---------|----------|
| **[UPTIMEROBOT_SETUP.md](UPTIMEROBOT_SETUP.md)** | Setup UptimeRobot (backup) | 2 min |

---

## 📦 Code Files

### Scripts

```
scripts/
├── keep-alive.js       ⭐ Node.js ping script (khuyến nghị)
│   └─ Không dependencies, retry logic, logs rõ
│
├── keep-alive.py       🐍 Python ping script (backup)
│   └─ Sử dụng requests, same features
│
├── package.json        📦 NPM helper
│   └─ Scripts để chạy dễ dàng
│
└── .env.example        ⚙️ Config template
    └─ Ví dụ cấu hình
```

### GitHub Actions

```
.github/workflows/
└── keep-alive.yml      🤖 Workflow tự động
    └─ Chạy mỗi 5 phút, 24/7
```

---

## 🎯 What's Included

### ✅ Ping Scripts

**Node.js (keep-alive.js)**
- Không cần dependencies
- HTTP/HTTPS support
- Retry logic (1s, 2s, 4s backoff)
- Timeout handling (10s default)
- Clear logging
- Exit codes (0=success, 1=fail)

```bash
node scripts/keep-alive.js https://your-app.onrender.com
# Output: ✅ Server is alive (200) - 1234ms - Attempt 1/3
```

**Python (keep-alive.py)**
- Backup option
- Tính năng giống Node.js
- Sử dụng requests library

```bash
python scripts/keep-alive.py https://your-app.onrender.com
# Output: ✅ Server is alive (200) - 1234ms - Attempt 1/3
```

### ✅ GitHub Actions

**Workflow (keep-alive.yml)**
- Chạy mỗi 5 phút
- Chạy cả Node.js và Python
- Logging tự động
- continue-on-error: true (không block)

### ✅ Health Endpoint

**Backend (main.py)**
```python
@app.get("/health")
async def health_check():
    return {"status": "ok"}
```
- Đã tồn tại trong backend
- Không cần authentication
- Trả về 200 OK

### ✅ Documentation

- 7 markdown files với hướng dẫn chi tiết
- Troubleshooting guides
- Configuration examples
- Monitoring setup guides

---

## 📖 Reading Guide

### If You Have 5 Minutes
```
1. 00_START_HERE.md (skim)
2. Setup: Add GitHub secret
3. Push code
Done ✅
```

### If You Have 15 Minutes
```
1. 00_START_HERE.md (read)
2. DEPLOYMENT_GUIDE.md (follow step-by-step)
3. Test workflow (optional)
Done ✅
```

### If You Want Full Understanding
```
1. RENDER_KEEP_ALIVE_README.md (overview)
2. DEPLOYMENT_GUIDE.md (setup)
3. KEEP_ALIVE.md (technical details)
4. QUICK_REFERENCE.md (commands & tips)
Done ✅
```

### If You Have Issues
```
1. DEPLOYMENT_GUIDE.md → Troubleshooting section
2. QUICK_REFERENCE.md → FAQ
3. Check: GitHub Actions logs
Done ✅
```

---

## ✨ Features at a Glance

| Feature | Status | Details |
|---------|--------|---------|
| **Automatic Ping** | ✅ | Every 5 minutes, 24/7 |
| **Retry Logic** | ✅ | 3 attempts, exponential backoff |
| **Error Handling** | ✅ | Timeout, connection, network errors |
| **Logging** | ✅ | Success/warn/error, clear messages |
| **GitHub Actions** | ✅ | Free tier, unlimited runs |
| **UptimeRobot** | ✅ | Optional backup, free tier |
| **Documentation** | ✅ | 7 comprehensive guides |
| **Testing** | ✅ | Works with httpbin.org verified |

---

## 🎯 Implementation Checklist

```
Phase 1: Preparation
  ☐ Read 00_START_HERE.md (2 min)
  ☐ Read DEPLOYMENT_GUIDE.md (5 min)

Phase 2: GitHub Setup
  ☐ Add RENDER_URL secret
  ☐ Verify value is correct

Phase 3: Code Deployment
  ☐ git add scripts/ .github/
  ☐ git commit with proper message
  ☐ git push origin master

Phase 4: Verification
  ☐ Check workflow appears in Actions
  ☐ Manual test (optional)
  ☐ Check first automatic run

Phase 5: Monitoring (Optional)
  ☐ Setup UptimeRobot (2 min)
  ☐ Enable email alerts
  ☐ Save dashboard link

Success Indicator:
  ✅ Workflow runs every 5 minutes
  ✅ Logs show ✅ Server is alive
  ✅ Server never sleeps
```

---

## 🔧 Configuration Reference

### GitHub Actions
```yaml
# File: .github/workflows/keep-alive.yml
env:
  RENDER_URL: ${{ secrets.RENDER_URL }}  # Your secret
  PING_RETRIES: 3                        # Attempts
  PING_TIMEOUT: 10000                    # Milliseconds
  VERBOSE: false                         # Debug mode
```

### Environment Variables
```bash
RENDER_URL=https://your-app.onrender.com      # Target URL
PING_RETRIES=3                                # Retry attempts
PING_TIMEOUT=10000                           # Timeout (ms)
VERBOSE=true                                  # Debug logging
```

### Cron Schedule
```yaml
# Every 5 minutes
cron: '*/5 * * * *'

# Examples:
# */3   → Every 3 minutes
# */10  → Every 10 minutes
# 0 */6 → Every 6 hours
```

---

## 🧪 Testing

### Test Locally
```bash
# Node.js
node scripts/keep-alive.js https://your-app.onrender.com

# Python
pip install requests
python scripts/keep-alive.py https://your-app.onrender.com

# Verbose
VERBOSE=true node scripts/keep-alive.js https://your-app.onrender.com
```

### Test Health Endpoint
```bash
curl https://your-app.onrender.com/health
# Expected: {"status": "ok"}
```

### Test Workflow
```
GitHub → Actions → Keep-Alive Ping
→ Run workflow → Check logs
Expected: ✅ Server is alive (200)
```

---

## 📊 Monitoring Options

### GitHub Actions (Built-in)
- Free ✅
- Logs visible ✅
- No notifications ❌

### UptimeRobot (Recommended)
- Free ✅
- Email alerts ✅
- Dashboard ✅
- 99.9% reliability ✅

### Cron-Job.org
- Free ✅
- Email alerts ✅
- Simpler ✅

**Best Practice:** Use GitHub Actions (automatic) + UptimeRobot (backup)

---

## 🎉 Next Steps

1. **Open:** [00_START_HERE.md](00_START_HERE.md)
2. **Read:** Summary (2 minutes)
3. **Follow:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) (5 minutes)
4. **Setup:** Add GitHub secret (1 minute)
5. **Deploy:** git push (1 minute)
6. **Verify:** Check workflow runs ✅

**Total Time:** ~10 minutes

---

**👉 Start Here:** [00_START_HERE.md](00_START_HERE.md)

**Happy coding! 🚀**
