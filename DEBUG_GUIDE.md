# CORS & 404 Error - Root Cause Analysis & Fixes

## 🔴 ROOT CAUSES IDENTIFIED

### Priority 1: CRITICAL - Procfile Path Issue
**File**: `backend/Procfile`
```
❌ BEFORE: web: uvicorn main:app --host 0.0.0.0 --port 10000
✅ AFTER:  web: uvicorn app.main:app --host 0.0.0.0 --port 8000
```
**Impact**: Render deployment FAILS immediately - cannot find module
**Symptom**: `ModuleNotFoundError: No module named 'main'`

---

### Priority 2: CRITICAL - Port Mismatch
**Locations**: 
- `app/main.py` line 52-54: `port=8000`
- `Procfile`: `port=10000` (WRONG)

**Impact**: App won't listen on correct port, requests go nowhere
**Fix**: Changed Procfile to port 8000

---

### Priority 3: HIGH - ALLOWED_ORIGINS Misconfiguration
**File**: `backend/app/core/config.py` line 40

**Problem**:
```python
❌ BEFORE: ALLOWED_ORIGINS: str = "http://localhost,..."
# String type, relies on JSON parsing
```

**Issues**:
1. Type is `str`, not `list` → unreliable parsing
2. No validation if JSON parse fails
3. Empty strings after split not filtered
4. If env var fails to parse, CORS breaks silently

**Fix**:
```python
✅ AFTER: ALLOWED_ORIGINS: list = [
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://trello-web-neon-rho.vercel.app",
    "https://trello-web-phi-five.vercel.app",
    "https://trello-web-git-master-team-alpla.vercel.app",
]
# Type: list, explicit, no parsing issues
```

Also improved `__init__` to handle both string and list gracefully.

---

### Priority 4: HIGH - CORS Regex Ineffective
**File**: `backend/app/main.py` line 22

**Problem**:
```python
❌ BEFORE:
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",  # ← Regex not used correctly
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Issues**:
1. Regex with wildcard methods/headers is risky
2. `allow_origin_regex` works only if origin NOT in `allow_origins` list
3. Mixing regex + explicit list is confusing
4. `["*"]` for methods doesn't include OPTIONS (needed for CORS preflight)

**Fix**:
```python
✅ AFTER:
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
```

---

### Priority 5: HIGH - Frontend Missing API URL Config
**File**: `frontend/src/lib/api.ts` line 4

**Problem**:
```typescript
❌ BEFORE:
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
// Fallback to localhost - breaks in production!
```

**Issues**:
1. No `.env.local` or `.env.production` created
2. Frontend doesn't know Render backend URL
3. In Vercel production, API calls go to localhost:8000 (fails)

**Fix**:
- Created `.env.local` for development:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:8000
  ```
- Created `.env.production` for production:
  ```
  NEXT_PUBLIC_API_URL=https://YOUR_RENDER_APP.onrender.com
  ```

**Action**: Replace `YOUR_RENDER_APP` with actual Render app name.

---

## 🔍 How CORS Errors Manifest

### Error #1: "No 'Access-Control-Allow-Origin' header"
```
Browser console: 
Access to XMLHttpRequest at 'https://api.example.com/api/auth/login' 
from origin 'https://app.vercel.com' has been blocked by CORS policy

Reason: 'Access-Control-Allow-Origin' header missing
```

**Root causes (in order)**:
1. ✅ **FIXED**: ALLOWED_ORIGINS doesn't include Vercel domain
2. ✅ **FIXED**: CORS middleware not configured correctly
3. ✅ **FIXED**: Backend running on wrong port → requests time out

---

### Error #2: "404 or ERR_FAILED"
```
Network tab shows:
- Status: 404 or blank
- No response body
```

**Root causes (in order)**:
1. ✅ **FIXED**: Backend not running (Procfile module error)
2. ✅ **FIXED**: Frontend using wrong API URL (localhost instead of Render)
3. ✅ **FIXED**: API endpoint routing misconfigured

---

## ✅ VERIFICATION CHECKLIST

### Local Development (Before Pushing)

```bash
# 1. Terminal 1: Start backend
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 2. Terminal 2: Test endpoints
bash scripts/debug.sh http://localhost:8000

# Expected outputs:
# [TEST 1] Health Check: 200 ✅
# [TEST 2] Root Endpoint: 200 ✅
# [TEST 3] Register Endpoint: 422 or 201 ✅
# [TEST 4] CORS Preflight: Has Access-Control headers ✅
# [TEST 5] 404 Check: 404 response ✅

# 3. Terminal 3: Start frontend
cd frontend
npm run dev

# 4. Browser: Test real requests
# Open http://localhost:3000
# DevTools Network tab → click any API call
# Response Headers should show:
#   access-control-allow-origin: http://localhost:3000
#   access-control-allow-credentials: true
```

---

### Render Production (After Deploying)

```bash
# 1. Check health endpoint
curl https://YOUR_APP.onrender.com/health
# Expected: {"status": "ok"}

# 2. Check root endpoint
curl https://YOUR_APP.onrender.com/
# Expected: {"name": "Trello Clone API", ...}

# 3. Verify Vercel frontend can reach backend
# Open your Vercel app in browser
# Check DevTools Network tab for /api/* calls
# Verify response headers have:
#   access-control-allow-origin: https://trello-web-neon-rho.vercel.app
```

---

## 🚀 Deployment Steps

### Backend (Render)

1. **Commit changes**:
   ```bash
   git add backend/Procfile backend/app/core/config.py backend/app/main.py
   git commit -m "fix: correct Procfile path and CORS configuration"
   ```

2. **Push to GitHub**:
   ```bash
   git push origin master
   ```

3. **On Render Dashboard**:
   - Service → Manual Deploy → Deploy Latest Commit
   - Check Build Logs for errors
   - Verify `/health` endpoint working

### Frontend (Vercel)

1. **Update .env.production**:
   ```bash
   # Replace with actual Render URL
   NEXT_PUBLIC_API_URL=https://YOUR_RENDER_APP.onrender.com
   ```

2. **Commit and push**:
   ```bash
   git add frontend/.env.production frontend/.env.local
   git commit -m "fix: add API URL configuration"
   git push origin master
   ```

3. **Vercel auto-deploys** - verify build succeeds

---

## 📊 Expected Behavior After Fixes

### Request Flow:
```
Frontend (Vercel)
  ↓ (NEXT_PUBLIC_API_URL=https://render-app.onrender.com)
Axios Client (api.ts)
  ↓ (sends Authorization header)
Render FastAPI
  ↓ (CORS middleware checks origin)
  ✅ Allows if origin in ALLOWED_ORIGINS
Browser
  ← Response with Access-Control headers
✅ Browser allows response to JS
```

### CORS Preflight (OPTIONS) Flow:
```
Browser: OPTIONS /api/auth/login
  - Origin: https://trello-web-neon-rho.vercel.app
  - Access-Control-Request-Method: POST

FastAPI (CORSMiddleware):
  ✅ Checks: origin in ALLOWED_ORIGINS? YES
  ✅ Checks: method POST allowed? YES
  ✅ Checks: headers allowed? YES

Response Headers:
  Access-Control-Allow-Origin: https://trello-web-neon-rho.vercel.app
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
  Access-Control-Allow-Headers: *
  Access-Control-Allow-Credentials: true

Browser:
  ✅ Allows actual request (POST)
```

---

## 🛠️ Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "404 Bad Gateway" on Render | Procfile path wrong | Use `app.main:app` |
| "CORS error" in browser | Wrong ALLOWED_ORIGINS | Add all Vercel domains to list |
| Frontend can't reach API | Wrong API_URL in .env | Set `NEXT_PUBLIC_API_URL` |
| Timeout errors | Wrong port in Procfile | Use port 8000 |
| Server sleep (free tier) | No keep-alive | Use GitHub Actions + keep-alive.yml |

---

## 📝 Files Changed

1. ✅ `backend/Procfile` - Fixed path and port
2. ✅ `backend/app/main.py` - Simplified CORS config
3. ✅ `backend/app/core/config.py` - Changed ALLOWED_ORIGINS to list type
4. ✅ `frontend/.env.local` - Added for development
5. ✅ `frontend/.env.production` - Added for production (needs URL)
6. ✅ `scripts/debug.sh` - New debug script (bash)
7. ✅ `scripts/debug.ps1` - New debug script (PowerShell)

---

## 🔐 Security Notes

1. **Never commit real secrets** to `.env.production` - use Vercel/Render environment variables
2. **ALLOWED_ORIGINS should NOT include `*`** when using `credentials=true`
3. **Remove `DEBUG=True`** in production (currently False in .env.prod ✅)
4. **Specific methods better than `["*"]`** → using explicit list

---

## 📞 Support

If errors persist:
1. Run `bash scripts/debug.sh YOUR_RENDER_URL` to get detailed diagnostics
2. Check Render logs: Dashboard → Service → Logs
3. Check Vercel logs: Dashboard → Deployments → Build Logs
4. Verify DB connection: `DATABASE_URL` must be correct in .env.prod
