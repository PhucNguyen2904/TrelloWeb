# 🐛 Frontend API Timeout Debug Guide

## 📋 Problem Summary

```
[API] ⚠️ No token in store for POST /api/auth/login
[API] ❌ Request timeout (10s exceeded) /api/auth/login
```

**Impact**: Login request fails after 10 seconds

---

## 🔍 Root Causes (Priority Order)

### 1. ❌ **Render Deployment Issue** (Most Common)

**Symptoms**:
- First request always times out (after 10s)
- Subsequent requests work fine
- Only happens in production, not locally

**Cause**: Render free tier has "cold start" - server goes to sleep after inactivity
- First request wakes up server (takes 30-60s)
- Axios timeout is 15s → timeout occurs

**Solution**:
```bash
# Option A: Upgrade Render to paid plan (eliminates cold starts)
# Option B: Add keep-alive service (see section below)
# Option C: Increase timeout for login endpoint
```

---

### 2. ❌ **Wrong API URL in Production**

**Symptoms**:
- Timeout on all requests
- Network tab shows request pending forever
- No response from server

**Check**:
1. Vercel → Settings → Environment Variables
2. Verify `NEXT_PUBLIC_API_URL` is set to production Render URL
3. Check if URL is accessible from browser console:
   ```javascript
   // In browser console:
   fetch('https://trelloweb-1.onrender.com/health')
     .then(r => r.json())
     .then(console.log)
     .catch(console.error)
   ```

---

### 3. ❌ **CORS Preflight Timeout**

**Symptoms**:
- Network tab shows OPTIONS request taking 10+ seconds
- Then timeout error

**Cause**: CORS preflight request is slow
- POST request triggers automatic OPTIONS preflight
- CORS headers not configured properly on backend

**Check**:
```javascript
// Browser console - Network tab
// Filter: XHR
// Look for OPTIONS request for /api/auth/login
// If it exists and times out → backend CORS issue
```

---

### 4. ❌ **Network Connection Issues**

**Symptoms**:
- Timeout occurs at exactly 15s (Axios timeout)
- No "Connection refused" error
- Request seems to hang

**Check**:
```javascript
// Browser console:
console.log(process.env.NEXT_PUBLIC_API_URL)
// Should output: https://trelloweb-1.onrender.com
```

---

## 🛠️ Fixes Applied

### ✅ **Fix 1: API Client Improvements**

**File**: `frontend/src/lib/api.ts`

**Changes**:
```typescript
// ❌ BEFORE: All requests got "No token in store" log
if (token && config.headers) {
  config.headers.Authorization = `Bearer ${token}`;
}

// ✅ AFTER: Skip token for auth endpoints
const AUTH_ENDPOINTS = ['/api/auth/login', '/api/auth/register'];
const isAuthEndpoint = AUTH_ENDPOINTS.some(e => url.includes(e));
if (isAuthEndpoint) return config;  // No token needed
if (token) config.headers.Authorization = `Bearer ${token}`;
```

**Benefits**:
- Clearer logging (no confusing "No token in store" for public endpoints)
- Removed `withCredentials: true` (not needed for Bearer tokens)
- Increased timeout to 15s (allows for network latency)
- Better error detection (ENOTFOUND, ECONNREFUSED vs timeout)

### ✅ **Fix 2: Environment Configuration**

**File**: `frontend/.env.production`
```env
NEXT_PUBLIC_API_URL=https://trelloweb-1.onrender.com
```

**File**: `frontend/.env.staging`
```env
NEXT_PUBLIC_API_URL=https://trelloweb-1.onrender.com
```

**File**: `frontend/.env.local` (development)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🧪 Debugging Steps

### Step 1: Verify API URL in Console

```javascript
// Open browser DevTools → Console
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)

// Should show:
// API URL: https://trelloweb-1.onrender.com (production)
// API URL: http://localhost:8000 (development)
```

### Step 2: Test Backend Connection

```javascript
// Test if backend is reachable
fetch(process.env.NEXT_PUBLIC_API_URL + '/health')
  .then(r => r.json())
  .then(data => console.log('Backend healthy:', data))
  .catch(err => console.error('Backend unreachable:', err))
```

**Expected Response**:
```json
{"status": "ok"}
```

### Step 3: Check Network Tab

1. **F12 → Network tab**
2. **Preserve logs**: Enable checkbox
3. **Clear cache**: Ctrl+Shift+Delete
4. **Click Login button**
5. **Look for requests**:
   ```
   ✅ OPTIONS /api/auth/login → 200 (preflight, optional)
   ✅ POST /api/auth/login → 200 (actual request)
   ✅ GET /api/auth/me → 200 (get user data)
   ```

6. **Check Timing** for each request:
   ```
   ✅ < 2s: Normal
   ⚠️ 2-10s: Slow network or backend
   ❌ > 15s: Timeout
   ```

### Step 4: Check Console Logs

**Healthy login flow**:
```
[API] 📡 API URL: https://trelloweb-1.onrender.com
[API] 📤 POST /api/auth/login (public endpoint, no token)
[API] ✅ 200 POST /api/auth/login
[API] 🔐 GET /api/auth/me (token attached)
[API] ✅ 200 GET /api/auth/me
```

**Timeout flow** (indicates Render cold start):
```
[API] 📡 API URL: https://trelloweb-1.onrender.com
[API] 📤 POST /api/auth/login (public endpoint, no token)
[API] ⏱️ Request timeout (15000ms exceeded)
```

### Step 5: Test with curl (if using Render staging)

```bash
# Check if backend is awake
curl -i https://trelloweb-1.onrender.com/health

# Expected response:
# HTTP/1.1 200 OK
# {"status":"ok"}
```

---

## 🚀 Solutions

### Solution 1: Eliminate Render Cold Start (Recommended)

**Upgrade Render Plan** or **Use Keep-Alive Service**:

```javascript
// frontend/src/lib/keep-alive.ts
export async function keepAliveBackend() {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log('[KeepAlive] Backend not reachable');
  }
}

// Call on app load
// frontend/src/app/layout.tsx
useEffect(() => {
  keepAliveBackend();
  // Run every 10 minutes to keep backend awake
  const interval = setInterval(keepAliveBackend, 10 * 60 * 1000);
  return () => clearInterval(interval);
}, []);
```

### Solution 2: Increase Timeout for Login

```typescript
// frontend/src/lib/api.ts
const LOGIN_TIMEOUT = 30000;  // 30 seconds for login

api.post('/api/auth/login', data, {
  timeout: LOGIN_TIMEOUT  // Override default 15s
});
```

### Solution 3: Add Retry Logic

```typescript
// frontend/src/lib/api-retry.ts
export async function apiWithRetry(
  fn: () => Promise<any>,
  maxRetries = 3,
  delay = 1000
): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      if (attempt === maxRetries) throw error;
      
      const isTimeout = error.code === 'ECONNABORTED';
      if (isTimeout) {
        console.log(`[Retry] Timeout on attempt ${attempt}, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;  // Exponential backoff
      } else {
        throw error;
      }
    }
  }
}

// Usage:
const res = await apiWithRetry(() =>
  api.post('/api/auth/login', data)
);
```

### Solution 4: Use Next.js API Route as Proxy

**Create**: `frontend/src/app/api/auth/login/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.text();
  
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        // No timeout for server-side request
      }
    );
    
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Login proxy error:', error);
    return NextResponse.json(
      { detail: 'Backend unavailable' },
      { status: 503 }
    );
  }
}
```

Then update frontend to call `/api/auth/login` instead of backend directly.

**Benefits**:
- Server-side request (no CORS issues)
- No timeout concerns (Next.js handles retries)
- Can add middleware (logging, rate limiting)

---

## 📊 Common Scenarios

| Scenario | Symptom | Solution |
|----------|---------|----------|
| **Render cold start** | Timeout first time only | Upgrade Render or keep-alive service |
| **Wrong API URL** | All requests timeout | Check Vercel env vars |
| **CORS misconfigured** | OPTIONS request fails | Fix backend CORS headers |
| **Network latency** | 5-10s response time | Normal, increase timeout to 20s |
| **Backend down** | Connection refused | Check Render dashboard |

---

## ✅ Checklist

- [ ] API URL set correctly in Vercel environment variables
- [ ] `NEXT_PUBLIC_API_URL=https://trelloweb-1.onrender.com`
- [ ] Network tab shows POST /api/auth/login → 200 (not pending)
- [ ] Console shows `[API] ✅ 200 POST /api/auth/login`
- [ ] Login completes within 15 seconds
- [ ] No "No token in store for POST /api/auth/login" warnings

---

## 🔗 Related Docs

- [Render Cold Start Documentation](https://render.com/docs/cold-starts)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Axios Timeout Configuration](https://axios-http.com/docs/req_config)
- [CORS Troubleshooting](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors)

