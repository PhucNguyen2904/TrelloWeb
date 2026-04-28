# ⚡ QUICK FIX SUMMARY - Authentication 403 Issue

## 🔴 Nguyên nhân
**Race condition trong AuthForm.tsx**: Token được lấy từ backend nhưng được lưu vào store **MỜI** (sau khi gọi `/me`), nên request `/me` không có Authorization header.

## ✅ Fixes Applied

### 1. Frontend: AuthForm.tsx (FIXED ✅)
**File**: `frontend/src/components/auth/AuthForm.tsx`

**Thay đổi**: 
- ✅ Lấy token từ response ngay sau login
- ✅ Gửi `/me` request với token explicit trong Authorization header
- ✅ Sau đó mới update store

```javascript
const token = res.data.access_token;  // Lấy token

// Gửi /me với token explicit
const userRes = await api.get('/api/auth/me', {
  headers: { Authorization: `Bearer ${token}` }
});

login(user, token);  // Lưu store sau cùng
```

### 2. Frontend: api.ts (ENHANCED ✅)
**File**: `frontend/src/lib/api.ts`

**Thay đổi**:
- ✅ Thêm `withCredentials: true` (future-proof cho cookies)
- ✅ Thêm timeout 10s
- ✅ Thêm console.log debug (Development mode)
- ✅ Cải thiện error handling

### 3. Backend: Config Check (VERIFY ✅)
**File**: `backend/app/.env.staging` & `backend/app/main.py`

**Kiểm tra**:
- ✅ `ALLOWED_ORIGINS` đã cấu hình Vercel domains
- ✅ `allow_credentials=True` đã set
- ✅ CORS middleware đã thêm `allow_headers=["*"]`

---

## 🧪 Testing Locally

### Test 1: Backend API Test
```powershell
cd backend
# Windows:
powershell -ExecutionPolicy Bypass -File test_auth.ps1

# Or Linux/Mac:
bash test_auth.sh
```

### Test 2: Frontend Login Flow
1. Terminal: `npm run dev` (frontend)
2. F12 → Console tab
3. Kiểm tra logs:
   ```
   [API] 🔐 Attached token to POST /api/auth/login
   [API] ✅ 200 POST /api/auth/login
   [API] 🔐 Attached token to GET /api/auth/me
   [API] ✅ 200 GET /api/auth/me
   ```

### Test 3: DevTools Network Tab
1. F12 → Network tab
2. Preserve logs: ✓
3. Login
4. Check request headers:
   ```
   POST /api/auth/login → 200 ✅
   GET /api/auth/me → 200 ✅ (not 403!)
   ```

---

## 📊 Verify Token in Authorization Header

**DevTools → Network → GET /api/auth/me → Request Headers**

```
✅ CORRECT:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

❌ WRONG (vấn đề):
(Authorization header không có)
```

---

## 🚀 Deploy Steps

### Frontend (Vercel)
```bash
cd frontend
git add .
git commit -m "fix: resolve authentication race condition in login flow"
git push origin master
# Vercel auto-deploys
```

### Backend (Render) - if needed
```bash
cd backend
git add .
git commit -m "chore: enhance CORS & logging"
git push origin master
# Render auto-deploys
```

---

## ⏸️ If Still Getting 403

Check this priority list:

1. **Check Storage** (DevTools → Application → Local Storage)
   - Key: `trello-auth-storage`
   - Should have token after login

2. **Check Network Headers** (DevTools → Network → GET /me → Request Headers)
   - Should have: `Authorization: Bearer <token>`
   - If missing: Axios interceptor didn't run

3. **Check Console Logs**
   - Should see: `[API] 🔐 Attached token to GET /api/auth/me`
   - If no logs: Interceptor didn't run

4. **Check Backend Logs**
   - Should see token being validated
   - If errors: Backend auth check failed

5. **Check CORS Response Headers**
   - `Access-Control-Allow-Origin: <your-domain>`
   - `Access-Control-Allow-Credentials: true`

6. **Check Token Expiry**
   - Go to https://jwt.io
   - Paste token
   - Check `exp` claim - is it in the future?

---

## 📝 Manual Test with curl (Windows PowerShell)

```powershell
# 1. Login
$login = Invoke-RestMethod -Uri "http://localhost:8000/api/auth/login" `
  -Method Post `
  -ContentType "application/x-www-form-urlencoded" `
  -Body "username=test@example.com&password=password"

$token = $login.access_token

# 2. Get user
Invoke-RestMethod -Uri "http://localhost:8000/api/auth/me" `
  -Method Get `
  -Headers @{"Authorization" = "Bearer $token"}

# Should return user data, not 403!
```

---

## 📚 Files Changed

| File | Change |
|------|--------|
| `frontend/src/components/auth/AuthForm.tsx` | ✅ Fix race condition, explicit token header |
| `frontend/src/lib/api.ts` | ✅ Enhanced config, debug logging |
| `AUTHENTICATION_DEBUG_GUIDE.md` | 📝 New - full debugging guide |
| `backend/test_auth.ps1` | 🧪 New - PowerShell test script |
| `backend/test_auth.sh` | 🧪 New - Bash test script |

---

## ⚠️ Important Notes

1. **Local vs Production**
   - Local (localhost): Works because CORS allows `http://localhost:3000`
   - Production (Vercel): Must match domain in `ALLOWED_ORIGINS`

2. **Token Expiry**
   - Default: 30 minutes (`ACCESS_TOKEN_EXPIRE_MINUTES=30`)
   - Change in `backend/app/.env.staging` if needed

3. **Console Logs**
   - Only shown in development
   - Turn off by removing console.log in `api.ts` before production

4. **withCredentials**
   - Currently using Bearer tokens (not cookies)
   - But `withCredentials: true` is set for future cookie support

---

## 🆘 Still Having Issues?

1. Read full `AUTHENTICATION_DEBUG_GUIDE.md`
2. Run test script: `powershell test_auth.ps1`
3. Check DevTools console + Network
4. Check backend logs: `docker logs trello-backend` (if using Docker)
5. Ask in error message detail from DevTools

