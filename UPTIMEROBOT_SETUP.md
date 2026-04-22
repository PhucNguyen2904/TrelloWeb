# UptimeRobot Setup Guide

Hướng dẫn nhanh cấu hình UptimeRobot để ping server Render mỗi 5 phút.

## 🚀 Bước 1: Đăng ký UptimeRobot

1. Truy cập: https://uptimerobot.com
2. Nhấn **"Sign Up Free"**
3. Điền email, password, xác nhận email
4. Đăng nhập vào dashboard

## 📍 Bước 2: Tạo Monitor

### 2.1 Cấu hình cơ bản

1. Dashboard → **Add Monitor** (hoặc dấu `+`)

```
Monitor Type: HTTP(S)
Friendly Name: Trello Backend Keep-Alive
URL: https://your-render-url.onrender.com/health
Monitoring Interval: 5 minutes
```

### 2.2 Cài đặt nâng cao

```
HTTP Method: GET
Check Frequency: Every 5 minutes
Timeout: 20 seconds
```

### 2.3 Thông báo (Optional)

1. Chọn **Alert Contacts**
2. Nhấn **Add Alert Contact**
3. Chọn: **Email** (hoặc Webhook, Slack, Discord)
4. Nhập email của bạn
5. Verify email notification

## ✅ Bước 3: Verify

```
Expected Status: 200 OK
Response Time: < 3 seconds
Uptime: Immediately appears in dashboard
```

## 📊 Dashboard

Sau khi tạo, bạn sẽ thấy:

```
┌─────────────────────────────────────────┐
│ Monitor: Trello Backend Keep-Alive      │
├─────────────────────────────────────────┤
│ Status: Up                              │ ✅
│ Uptime: 100% (Last 30 days)            │
│ Check Frequency: Every 5 minutes        │
│ Response Time: 1.2s avg                 │
│ Last Checked: 1 minute ago              │
│ Next Check: In 4 minutes                │
└─────────────────────────────────────────┘
```

## 🔔 Thông báo

Nếu server down:

```
Subject: [UptimeRobot] Monitor Down
Body: 
  Monitor: Trello Backend Keep-Alive
  Down at: 2026-04-22 10:15:42 UTC
  Expected Status: 200
  Actual Response: 503 Service Unavailable
```

## 💡 Tips

| Tip | Lợi ích |
|-----|---------|
| **Cron-Job.org + UptimeRobot** | Redundancy đảm bảo ping |
| **Multiple Alert Contacts** | Nhận thông báo trên nhiều channel |
| **Public Status Page** | Chia sẻ uptime dashboard với users |
| **API Access** | Tích hợp uptime data vào app |

## 🎯 Kết quả

✅ Server luôn active (ping mỗi 5 phút)
✅ Nhận thông báo nếu down
✅ Track uptime history
✅ Miễn phí, no setup required

---

**Thời gian setup:** ~2 phút
**Chi phí:** $0 (Free plan)
**Reliability:** 99.9%+
