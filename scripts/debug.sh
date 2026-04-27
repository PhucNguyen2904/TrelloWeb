#!/bin/bash

# COLOR CODES
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== TRELLO API DEBUG CHECKLIST ===${NC}\n"

# Get backend URL from argument or default
BACKEND_URL="${1:-http://localhost:8000}"
FRONTEND_URL="http://localhost:3000"

echo -e "${YELLOW}Backend URL: ${BACKEND_URL}${NC}"
echo -e "${YELLOW}Frontend URL: ${FRONTEND_URL}${NC}\n"

# TEST 1: Health Check
echo -e "${BLUE}[TEST 1] Health Check${NC}"
HEALTH=$(curl -s -w "\n%{http_code}" "${BACKEND_URL}/health")
HTTP_CODE=$(echo "$HEALTH" | tail -1)
BODY=$(echo "$HEALTH" | head -1)

if [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}✅ Health check PASSED${NC}"
    echo "Response: $BODY"
else
    echo -e "${RED}❌ Health check FAILED (HTTP $HTTP_CODE)${NC}"
    echo "Response: $BODY"
fi
echo ""

# TEST 2: Root Endpoint
echo -e "${BLUE}[TEST 2] Root Endpoint${NC}"
ROOT=$(curl -s -w "\n%{http_code}" "${BACKEND_URL}/")
HTTP_CODE=$(echo "$ROOT" | tail -1)
BODY=$(echo "$ROOT" | head -1)

if [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}✅ Root endpoint PASSED${NC}"
    echo "Response: $BODY"
else
    echo -e "${RED}❌ Root endpoint FAILED (HTTP $HTTP_CODE)${NC}"
    echo "Response: $BODY"
fi
echo ""

# TEST 3: Register (should fail with validation error)
echo -e "${BLUE}[TEST 3] Register Endpoint (Invalid data)${NC}"
REGISTER=$(curl -s -w "\n%{http_code}" -X POST "${BACKEND_URL}/api/auth/register" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"testpass123"}')
HTTP_CODE=$(echo "$REGISTER" | tail -1)
BODY=$(echo "$REGISTER" | head -1)

if [ "$HTTP_CODE" == "422" ] || [ "$HTTP_CODE" == "400" ] || [ "$HTTP_CODE" == "201" ]; then
    echo -e "${GREEN}✅ Register endpoint RESPONDED${NC}"
else
    echo -e "${RED}❌ Register endpoint FAILED (HTTP $HTTP_CODE)${NC}"
fi
echo "Response: $BODY"
echo ""

# TEST 4: CORS Headers (Preflight)
echo -e "${BLUE}[TEST 4] CORS Preflight Request${NC}"
CORS=$(curl -s -w "\n%{http_code}" -X OPTIONS "${BACKEND_URL}/api/auth/login" \
    -H "Origin: ${FRONTEND_URL}" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: content-type" -v 2>&1)

if echo "$CORS" | grep -q "Access-Control-Allow-Origin"; then
    echo -e "${GREEN}✅ CORS headers PRESENT${NC}"
    echo "$CORS" | grep "Access-Control"
else
    echo -e "${RED}❌ CORS headers MISSING${NC}"
    echo "Full response: $CORS"
fi
echo ""

# TEST 5: 404 Check
echo -e "${BLUE}[TEST 5] 404 Not Found${NC}"
NOTFOUND=$(curl -s -w "\n%{http_code}" "${BACKEND_URL}/api/nonexistent")
HTTP_CODE=$(echo "$NOTFOUND" | tail -1)
BODY=$(echo "$NOTFOUND" | head -1)

if [ "$HTTP_CODE" == "404" ]; then
    echo -e "${GREEN}✅ 404 response CORRECT${NC}"
else
    echo -e "${RED}❌ Expected 404, got $HTTP_CODE${NC}"
fi
echo "Response: $BODY"
echo ""

# TEST 6: Check environment variables
echo -e "${BLUE}[TEST 6] Config Check${NC}"
if [ -f "backend/app/.env.prod" ]; then
    echo -e "${GREEN}✅ .env.prod EXISTS${NC}"
    grep "ALLOWED_ORIGINS\|DATABASE_URL" "backend/app/.env.prod" | head -2
else
    echo -e "${RED}❌ .env.prod NOT FOUND${NC}"
fi
echo ""

echo -e "${BLUE}=== END DEBUG ===${NC}"
