# 📱 Deployment & Deployment Guide

## Step-by-Step Setup (5 minutes)

### Phase 1: GitHub Configuration (1 minute)

1. **Go to your GitHub repository**
   ```
   https://github.com/your-username/TrelloWeb
   ```

2. **Add Secret: RENDER_URL**
   ```
   Settings
   ↓
   Secrets and variables
   ↓
   Actions
   ↓
   New repository secret
   ```

   ```
   Name:  RENDER_URL
   Value: https://your-app.onrender.com
   ```

   ⚠️ **Do NOT include `/health` in the URL**
   ✅ Correct: `https://your-app.onrender.com`
   ❌ Wrong: `https://your-app.onrender.com/health`

3. **Click "Add secret"**

### Phase 2: Verify Render Health Endpoint (30 seconds)

1. **Check `/health` endpoint works**
   ```bash
   curl https://your-app.onrender.com/health
   ```

   Expected response:
   ```json
   {"status": "ok"}
   ```

2. **If not working:**
   - Verify FastAPI backend is deployed on Render
   - Check `/health` endpoint exists in `backend/app/main.py`
   - Restart Render service if needed

### Phase 3: Deploy Code (1 minute)

1. **Commit all files**
   ```bash
   cd ~/path/to/TrelloWeb
   git add -A
   git commit -m "feat: add keep-alive solution for Render free tier

   - Node.js ping script (keep-alive.js)
   - Python ping script (keep-alive.py)
   - GitHub Actions workflow (keep-alive.yml)
   - Documentation and guides
   - Handles retry with exponential backoff
   - Clear logging for monitoring

   Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
   ```

2. **Push to GitHub**
   ```bash
   git push origin master
   ```

3. **Verify files are uploaded**
   - Check: GitHub → Code → `scripts/keep-alive.js` exists
   - Check: GitHub → Code → `.github/workflows/keep-alive.yml` exists

### Phase 4: Activate Workflow (1 minute)

1. **Go to GitHub Actions**
   ```
   https://github.com/your-username/TrelloWeb/actions
   ```

2. **Find workflow: "Keep-Alive Ping (Render Free Tier)"**
   - It should appear in the list
   - Click on it

3. **Test manually (optional but recommended)**
   - Click "Run workflow"
   - Select "master" branch
   - Click "Run workflow" button
   - Wait 30 seconds for results
   - Check logs → See ✅ success message

   Expected log:
   ```
   ✅ Server is alive (200) - 1234ms - Attempt 1/3
   ```

### Phase 5: Monitor (Optional but Recommended)

#### Option A: GitHub Actions Dashboard
```
GitHub → Actions → Keep-Alive Ping → Workflow runs
- Shows run history
- Last run status
- Execution time
- Click details for logs
```

#### Option B: UptimeRobot (Recommended)
```
1. Signup: https://uptimerobot.com (free)
2. Add Monitor:
   - Type: HTTP(S)
   - URL: https://your-app.onrender.com/health
   - Interval: 5 minutes
   - Alert: Email on down (optional)
3. Dashboard shows:
   - Current status (up/down)
   - Uptime percentage
   - Response time
   - Last check
```

---

## ✅ Verification Checklist

```
Phase 1: GitHub Secret
  ☑️ RENDER_URL secret created
  ☑️ Value is correct URL (without /health)
  ☑️ Secret is accessible in Actions

Phase 2: Health Endpoint
  ☑️ curl command returns 200 OK
  ☑️ Response is {"status": "ok"}
  ☑️ Endpoint is publicly accessible

Phase 3: Code Deployment
  ☑️ scripts/keep-alive.js pushed
  ☑️ scripts/keep-alive.py pushed
  ☑️ .github/workflows/keep-alive.yml pushed
  ☑️ All files visible on GitHub

Phase 4: Workflow Activation
  ☑️ Workflow appears in Actions
  ☑️ Manual run succeeds
  ☑️ Logs show ✅ success message
  ☑️ Exit code is 0 (success)

Phase 5: Monitoring
  ☑️ GitHub Actions logs show pings
  ☑️ UptimeRobot shows "UP" status
  ☑️ No errors in workflow runs
  ☑️ Server never sleeps 🎉
```

---

## 🧪 Testing

### Local Testing

```bash
# Test Node.js script
cd scripts
node keep-alive.js https://your-app.onrender.com

# Test Python script
pip install requests
python keep-alive.py https://your-app.onrender.com

# Test with verbose logging
VERBOSE=true node keep-alive.js https://your-app.onrender.com
```

### GitHub Actions Testing

1. **Manual trigger**
   ```
   Actions → Keep-Alive Ping → Run workflow
   ```

2. **Check results**
   - Click on run
   - View logs
   - Should show ✅ success

3. **Schedule activation**
   - First run: Immediate (if triggered manually)
   - Subsequent: Every 5 minutes (automatic cron)

---

## 📊 Expected Behavior

### Before Setup (❌ Not Ideal)
```
Timeline:
00:00 - User request → Server: 🟢 ON
05:00 - (No request)
10:00 - (No request)
15:00 - (No request)
20:00 - (No request)
25:00 - (No request)
30:00 - Server: 💤 SLEEP (30min timeout)

User Action:
30:01 - New user request
        → Render wakes server
        → Response takes 30-50s 😞
```

### After Setup (✅ Ideal)
```
Timeline:
00:00 - Ping #1 → Server: 🟢 ON
05:00 - Ping #2 → Server: 🟢 ON
10:00 - Ping #3 → Server: 🟢 ON
15:00 - Ping #4 → Server: 🟢 ON
20:00 - Ping #5 → Server: 🟢 ON
25:00 - Ping #6 → Server: 🟢 ON
30:00 - User request → Server: 🟢 ON (instant!) ✨

Server: ALWAYS ACTIVE 🚀
User Experience: Fast responses ⚡
```

---

## 🔧 Troubleshooting

### Problem: Workflow not running

**Symptom:** "Keep-Alive Ping" workflow not in Actions list

**Solution:**
```
1. Check: .github/workflows/keep-alive.yml pushed
2. Wait 5-10 minutes for GitHub to sync
3. Refresh Actions page
4. If still not showing: 
   - Check file syntax (YAML format)
   - Verify file location: .github/workflows/keep-alive.yml
   - Commit and push again
```

### Problem: 404 Not Found on /health

**Symptom:**
```
Attempt 1 failed: Unexpected status code: 404
```

**Solution:**
```
1. Check endpoint exists:
   curl https://your-app.onrender.com/health
   
2. If 404, verify in backend/app/main.py:
   @app.get("/health")
   async def health_check():
       return {"status": "ok"}

3. If missing, add and redeploy
4. Wait for Render deployment to finish
```

### Problem: 401 Unauthorized

**Symptom:**
```
Attempt 1 failed: Unexpected status code: 401
```

**Solution:**
```
1. /health endpoint requires auth? Remove it:
   @app.get("/health")  # No auth decorator
   async def health_check():
       return {"status": "ok"}

2. Or create separate health endpoint without auth
3. Redeploy and test
```

### Problem: RENDER_URL secret not working

**Symptom:**
```
Error: undefined
or
Connection failed: <secret not found>
```

**Solution:**
```
1. Go: GitHub Settings → Secrets
2. Verify RENDER_URL exists
3. Verify value is correct URL:
   ✅ https://your-app.onrender.com
   ❌ https://your-app.onrender.com/health
   ❌ https://your-app.onrender.com/
   
4. If value has trailing slash, remove it
5. Test: Manual workflow run
```

### Problem: Timeout errors

**Symptom:**
```
Request timeout after 10000ms
```

**Likely cause:** Server too slow or network latency

**Solution:**
1. Verify server is running
2. Increase timeout in keep-alive.yml:
   ```yaml
   PING_TIMEOUT: 15000  # Change from 10000 to 15000
   ```
3. Redeploy and test

### Problem: Connection refused

**Symptom:**
```
Request error: connect ECONNREFUSED
```

**Likely cause:** Server is down or URL is wrong

**Solution:**
```
1. Verify server is running on Render
2. Test URL in browser: https://your-app.onrender.com/health
3. Check RENDER_URL secret is correct
4. Verify server port is 8000 (or check Render config)
```

---

## 📈 Monitoring Dashboard Setup

### Option 1: GitHub Actions (Built-in)

```
Dashboard:
https://github.com/your-username/TrelloWeb/actions

View:
├── Keep-Alive Ping workflow
├── Workflow runs (history)
├── Click on run → View logs
└── Status: Success ✅ or Failed ❌
```

### Option 2: UptimeRobot (Recommended)

```
Setup (2 minutes):
1. Signup: https://uptimerobot.com
2. Add Monitor:
   URL: https://your-app.onrender.com/health
   Type: HTTP(S)
   Interval: 5 minutes
3. Email alerts (optional)

Dashboard Shows:
├── Current status: UP ✅
├── Uptime: 99.95%
├── Response time: 1.2s avg
├── Last check: 2 min ago
└── History: Last 7 days
```

### Option 3: Cron-Job.org

```
Setup (2 minutes):
1. Signup: https://cron-job.org
2. Create cronjob:
   URL: https://your-app.onrender.com/health
   Cron: */5 * * * *
   Timeout: 20s
3. Notifications: Email

Dashboard Shows:
├── Execution history
├── Success/failure status
├── Response times
└── Last run time
```

---

## 📝 Post-Deployment Checklist

After setup, verify everything works:

```
✅ GitHub Action:
   - Commits & pushes without errors
   - Workflow file syntax is valid
   - Secret RENDER_URL is created
   - Secret is accessible in workflow

✅ Ping Scripts:
   - Node.js script returns exit code 0 (success)
   - Python script returns exit code 0 (success)
   - Both scripts handle timeouts gracefully
   - Logs show clear messages

✅ Health Endpoint:
   - curl https://your-app.onrender.com/health returns 200
   - Response body contains {"status": "ok"}
   - Endpoint is publicly accessible
   - No authentication required

✅ Automation:
   - First manual run succeeds
   - Subsequent runs every 5 minutes
   - All logs show success (✅)
   - No errors in workflow history

✅ Monitoring:
   - GitHub Actions shows all pings
   - UptimeRobot dashboard shows UP
   - No 404 or timeout errors
   - Server uptime is 100%
```

---

## 🎉 Success Indicators

Your setup is **complete and working** when you see:

```
✅ GitHub Actions:
   [2026-04-22T10:15:23.123Z] ℹ️  Starting keep-alive ping...
   [2026-04-22T10:15:24.567Z] ✅ Server is alive (200) - 1234ms - Attempt 1/3

✅ UptimeRobot:
   Status: UP ✅
   Last check: 2 minutes ago
   Uptime: 100%

✅ Result:
   Server never sleeps 🟢
   User requests are instant ⚡
   No warm-up delays 🚀
```

---

## 🚀 Next Steps (Optional Enhancements)

1. **Add more endpoints to monitor**
   ```bash
   node keep-alive.js https://your-app.onrender.com/api/status
   ```

2. **Setup Slack notifications**
   - UptimeRobot → Alert Contact → Slack
   - Get pinged in Slack if server goes down

3. **Monitor other services**
   - Frontend on Vercel (uses auto-deploy)
   - Database health
   - API response times

4. **Set up alerting**
   - Multiple consecutive failures → Email alert
   - Downtime exceeds X minutes → Webhook notification
   - Response time > 5s → Flag for investigation

---

**Version:** 1.0.0
**Last Updated:** 2026-04-22
**Status:** Ready for Production ✅
