# OTP Authentication System - Quick Reference

## 🚀 Quick Setup (5 minutes)

### 1. Database Migration
```bash
cd backend
alembic upgrade c8f5a1b2c3d4
```


### 2. Configure Email (in backend/.env.local)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=TrelloWeb
OTP_EXPIRE_MINUTES=5
OTP_MAX_ATTEMPTS=3
OTP_RATE_LIMIT_PER_HOUR=5
```

### 3. Start Services
```bash
# Terminal 1: Backend
cd backend && uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend && npm run dev
```

### 4. Test
- Go to http://localhost:3000/login/otp
- Enter your email
- Check email for code
- Enter 6-digit code
- Should redirect to /boards

## 📁 File Locations

| File | Purpose |
|------|---------|
| `backend/alembic/versions/c8f5a1b2c3d4_...py` | Database migration |
| `backend/app/model/email_otp_token.py` | ORM model |
| `backend/app/schemas/OTP.py` | Pydantic schemas |
| `backend/app/services/otp_service.py` | Business logic |
| `backend/app/api/v1/endpoints/auth_otp.py` | API endpoints |
| `frontend/src/app/(auth)/login/otp/page.tsx` | OTP login page |
| `frontend/src/app/api/auth/otp-callback/route.ts` | Token handler |

## 🔌 API Endpoints

### POST /api/auth/otp/request
```bash
curl -X POST http://localhost:8000/api/auth/otp/request \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

### POST /api/auth/otp/verify
```bash
curl -X POST http://localhost:8000/api/auth/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","otp_code":"123456"}'
```

## 🔑 Key Classes & Methods

### OTPService
```python
from app.services.otp_service import OTPService

# Generate random 6-digit code
code = OTPService.generate_otp()

# Hash OTP
hashed = OTPService.hash_otp(code)

# Verify OTP (constant-time comparison)
is_valid = OTPService.verify_otp(code, hashed)

# Check rate limit (5/hour/email)
is_limited, remaining = OTPService.check_rate_limit(db, email)

# Create token
token, otp_code = OTPService.create_otp_token(db, email, user_id, ip_address)

# Get valid token
token = OTPService.get_valid_otp_token(db, email)

# Verify and invalidate
is_valid, token = OTPService.verify_and_invalidate_otp(db, email, otp_code)
```

## 🧪 Testing

### Test OTP Generation
```python
from app.services.otp_service import OTPService

code = OTPService.generate_otp()
print(f"Generated: {code}")  # Output: 6-digit number

hashed = OTPService.hash_otp(code)
is_valid = OTPService.verify_otp(code, hashed)
print(f"Verified: {is_valid}")  # Output: True
```

### Test API
```bash
# Request OTP
curl -X POST http://localhost:8000/api/auth/otp/request \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Verify OTP (use code from email)
curl -X POST http://localhost:8000/api/auth/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp_code":"123456"}'
```

## 📊 Configuration

All settings via environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `OTP_EXPIRE_MINUTES` | 5 | Token lifetime in minutes |
| `OTP_MAX_ATTEMPTS` | 3 | Max failed verification attempts |
| `OTP_RATE_LIMIT_PER_HOUR` | 5 | Max requests per hour per email |
| `SMTP_HOST` | - | SMTP server host |
| `SMTP_PORT` | 587 | SMTP server port |
| `SMTP_USER` | - | SMTP username |
| `SMTP_PASSWORD` | - | SMTP password |
| `EMAIL_FROM` | - | Sender email address |
| `EMAIL_FROM_NAME` | TrelloWeb | Sender display name |

## 🐛 Troubleshooting

### Email not sending
```
✓ Check SMTP credentials in .env
✓ Verify SMTP server is accessible: telnet smtp.gmail.com 587
✓ Check backend logs for errors
✓ For Gmail, use App Password not regular password
```

### OTP not verifying
```
✓ Ensure OTP hasn't expired (5 minutes)
✓ Check if max attempts exceeded (3 attempts)
✓ Verify code is exactly 6 digits
✓ Check email matches original request
```

### Rate limit issues
```
✓ Check OTP_RATE_LIMIT_PER_HOUR setting
✓ Try after 1 hour
✓ Use different email address for testing
```

### Database migration failed
```bash
# Rollback to previous migration
alembic downgrade b70483ea6be0

# Check current state
alembic current

# Re-apply
alembic upgrade c8f5a1b2c3d4
```

## 📈 Monitoring

### Check Logs
```bash
# Backend logs
tail -f backend/logs/app.log | grep OTP

# Frontend browser console
DevTools > Console
```

### Database Queries
```sql
-- Count OTP tokens created today
SELECT COUNT(*) FROM email_otp_tokens 
WHERE created_at >= NOW() - INTERVAL '1 day';

-- Check rate limit for email
SELECT COUNT(*) FROM email_otp_tokens 
WHERE email = 'user@example.com' 
AND created_at >= NOW() - INTERVAL '1 hour';

-- Find unused tokens
SELECT * FROM email_otp_tokens 
WHERE is_used = false 
AND expires_at > NOW();
```

## 🔒 Security Checklist

- ✅ OTP hashed with bcrypt (never plaintext)
- ✅ Constant-time comparison prevents timing attacks
- ✅ Rate limiting (5 requests/hour/email)
- ✅ 5-minute expiration TTL
- ✅ Max 3 failed attempts
- ✅ Email enumeration protection (always 200 on /request)
- ✅ IP address logging
- ✅ Professional email template
- ✅ httpOnly secure cookies
- ✅ JWT token generation

## 📚 Documentation

- **OTP_INTEGRATION_GUIDE.md** - Complete integration guide
- **OTP_IMPLEMENTATION_SUMMARY.md** - Feature list and setup
- This file - Quick reference

## 🎯 Common Tasks

### Change OTP Expiration Time
```env
# In backend/.env.local
OTP_EXPIRE_MINUTES=10  # Changed from 5 to 10 minutes
```

### Change Max Attempts
```env
# In backend/.env.local
OTP_MAX_ATTEMPTS=5  # Changed from 3 to 5 attempts
```

### Change Rate Limit
```env
# In backend/.env.local
OTP_RATE_LIMIT_PER_HOUR=10  # Changed from 5 to 10 requests/hour
```

### Use Different Email Provider

**Mailgun:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-mailgun-domain.com
SMTP_PASSWORD=your-mailgun-password
```

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.your-sendgrid-api-key
```

## 💡 Tips

1. **Gmail Users**: Create App Password at https://myaccount.google.com/apppasswords
2. **Development**: Without SMTP config, the system logs OTP but doesn't send email
3. **Testing**: Use same email multiple times to test rate limiting
4. **Monitoring**: Check backend logs for OTP activity with `grep OTP`
5. **Security**: Never commit .env with real credentials

## 📞 Support Resources

- Check `OTP_INTEGRATION_GUIDE.md` for detailed troubleshooting
- Review backend logs: `tail -f backend/logs/app.log`
- Test SMTP: `telnet smtp.gmail.com 587`
- Check database: `psql -U user -d database -c "SELECT * FROM email_otp_tokens LIMIT 10;"`
