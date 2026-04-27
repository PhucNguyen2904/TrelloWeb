#!/bin/bash
# Backend API Testing Script
# Dùng để test authentication flow từ đầu đến cuối

API_URL="http://localhost:8000"
# Production: https://trello-api-render.onrender.com
# Staging: API_URL từ .env.staging

echo "🧪 TRELLO API AUTHENTICATION TEST"
echo "=================================="
echo "API URL: $API_URL"
echo ""

# Test 1: Health check
echo "1️⃣ Health Check"
echo "   GET $API_URL/health"
curl -v "$API_URL/health" 2>&1 | grep -E "< HTTP|\"status\""
echo ""
sleep 1

# Test 2: Register new user
EMAIL="test_$(date +%s)@example.com"
PASSWORD="TestPassword123!"
echo "2️⃣ Register User"
echo "   POST $API_URL/api/auth/register"
echo "   Email: $EMAIL"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")
echo "   Response: $REGISTER_RESPONSE"
echo ""
sleep 1

# Test 3: Login
echo "3️⃣ Login"
echo "   POST $API_URL/api/auth/login"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=$EMAIL&password=$PASSWORD")
echo "   Response: $LOGIN_RESPONSE"

# Extract token
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
echo "   ✅ Token: ${TOKEN:0:30}..."
echo ""
sleep 1

# Test 4: Get user info with token
echo "4️⃣ Get Current User (/me)"
echo "   GET $API_URL/api/auth/me"
echo "   Authorization: Bearer $TOKEN"
curl -v -X GET "$API_URL/api/auth/me" \
  -H "Authorization: Bearer $TOKEN" \
  2>&1 | grep -E "< HTTP|id|email|name"
echo ""
sleep 1

# Test 5: Test without token (should be 401)
echo "5️⃣ Test WITHOUT Token (should be 401 Unauthorized)"
echo "   GET $API_URL/api/auth/me"
curl -v "$API_URL/api/auth/me" \
  2>&1 | grep "< HTTP"
echo ""

# Test 6: Test with invalid token (should be 401)
echo "6️⃣ Test WITH Invalid Token (should be 401)"
echo "   GET $API_URL/api/auth/me"
echo "   Authorization: Bearer INVALID_TOKEN_12345"
curl -v -X GET "$API_URL/api/auth/me" \
  -H "Authorization: Bearer INVALID_TOKEN_12345" \
  2>&1 | grep -E "< HTTP|detail"
echo ""

echo "✅ Test complete! Check results above."
echo ""
echo "Expected results:"
echo "  1. Health: 200 OK"
echo "  2. Register: 201 Created"
echo "  3. Login: 200 OK + access_token"
echo "  4. Get /me: 200 OK + user data"
echo "  5. /me (no token): 403 Forbidden (CORS might block) or 401 Unauthorized"
echo "  6. /me (invalid token): 401 Unauthorized"
