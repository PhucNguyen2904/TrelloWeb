# Quick Fix Summary

## 🔥 Root Causes Found & Fixed

| # | Issue | File | Severity | Fix |
|---|-------|------|----------|-----|
| 1 | Procfile path wrong (`main:app` → `app.main:app`) | `backend/Procfile` | 🔴 CRITICAL | Changed to `uvicorn app.main:app --port 8000` |
| 2 | Port mismatch (Procfile 10000 vs app 8000) | `backend/Procfile` | 🔴 CRITICAL | Changed to port 8000 |
| 3 | ALLOWED_ORIGINS type wrong (str → list) | `backend/app/core/config.py` | 🔴 CRITICAL | Changed to explicit list of URLs |
| 4 | CORS middleware has bad regex config | `backend/app/main.py` | 🟠 HIGH | Removed regex, simplified to explicit methods |
| 5 | Frontend missing API URL config | `frontend/.env*` | 🟠 HIGH | Added .env.local & .env.production |

---

## 📝 Files Modified

### ✅ backend/Procfile
```bash
# BEFORE
web: uvicorn main:app --host 0.0.0.0 --port 10000

# AFTER
web: uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### ✅ backend/app/main.py (lines 18-25)
```python
# BEFORE
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",  # ❌ confusing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AFTER
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,  # ✅ only explicit origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # ✅ explicit methods
    allow_headers=["*"],
)
```

### ✅ backend/app/core/config.py (lines 40-49)
```python
# BEFORE
ALLOWED_ORIGINS: str = "http://localhost,http://localhost:3000,..."

# AFTER  
ALLOWED_ORIGINS: list = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "https://trello-web-neon-rho.vercel.app",
    "https://trello-web-phi-five.vercel.app",
    "https://trello-web-git-master-team-alpla.vercel.app",
]
```

### ✅ frontend/.env.local (NEW)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### ✅ frontend/.env.production (NEW)
```bash
NEXT_PUBLIC_API_URL=https://YOUR_RENDER_APP.onrender.com
# ⚠️ Replace YOUR_RENDER_APP with actual Render service name
```

---

## 🧪 How to Test Locally

```bash
# Terminal 1: Start backend
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Run debug script
cd scripts
bash debug.sh http://localhost:8000
# OR on Windows:
powershell -ExecutionPolicy Bypass -File debug.ps1

# Terminal 3: Start frontend
cd frontend
npm run dev

# Browser: Open http://localhost:3000
# DevTools Network tab: Check /api/* calls have CORS headers
```

---

## 🚀 Deploy to Production

### Step 1: Update Vercel frontend env
```bash
# In Vercel Dashboard → Settings → Environment Variables
NEXT_PUBLIC_API_URL = https://YOUR_RENDER_APP.onrender.com
```

### Step 2: Commit changes
```bash
git add backend/Procfile backend/app/main.py backend/app/core/config.py
git add frontend/.env.local frontend/.env.production
git add DEBUG_GUIDE.md scripts/debug.*
git commit -m "fix: CORS & 404 errors - Procfile path, CORS config, API URL env"
git push origin master
```

### Step 3: Verify Render deployment
```bash
# After GitHub push, Render auto-deploys
curl https://YOUR_RENDER_APP.onrender.com/health
# Expected: {"status":"ok"}
```

### Step 4: Test from Vercel
- Open your Vercel app
- Try login/register
- Check DevTools Network tab
- Response headers should have:
  ```
  access-control-allow-origin: https://trello-web-neon-rho.vercel.app
  access-control-allow-credentials: true
  ```

---

## ⚠️ Important Notes

1. **Update .env.production ASAP**:
   - Replace `YOUR_RENDER_APP` with your actual Render service name
   - Example: `https://trello-api-production.onrender.com`

2. **CORS still broken?** Check:
   - Is Render service running? (`curl /health`)
   - Is Vercel URL in ALLOWED_ORIGINS?
   - Are you testing from correct domain? (not localhost:3000)

3. **404 errors still happening?** Check:
   - Endpoint path is `/api/auth/*` not `/api/*`
   - Database connection working (check Render logs)

4. **Free tier Render sleep**: Use GitHub Actions to ping `/health` every 10 minutes
   - Already set up in `scripts/keep-alive.js`
   - Activate in `.github/workflows/keep-alive.yml`

---

## 📞 Quick Debug Commands

```bash
# Test health endpoint (works = server running)
curl https://YOUR_RENDER_APP.onrender.com/health

# Test CORS preflight
curl -X OPTIONS https://YOUR_RENDER_APP.onrender.com/api/auth/login \
  -H "Origin: https://trello-web-neon-rho.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v

# Test actual API call (needs valid data)
curl -X POST https://YOUR_RENDER_APP.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test@test.com","password":"test123"}' \
  -v
```

---

## ✅ Success Criteria

After applying all fixes:
- ✅ Backend deploys without `ModuleNotFoundError`
- ✅ `/health` endpoint returns 200 OK
- ✅ Frontend API calls include `Authorization` header
- ✅ Backend responses include `Access-Control-Allow-*` headers
- ✅ Login/Register work without CORS errors
- ✅ 404 errors are real API not found (not CORS issue)
