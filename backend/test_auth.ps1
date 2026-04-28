# Backend API Testing Script (PowerShell)
# Dùng để test authentication flow

$API_URL = "http://localhost:8000"
# Production: https://trello-api-render.onrender.com

Write-Host "🧪 TRELLO API AUTHENTICATION TEST" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "API URL: $API_URL" -ForegroundColor Yellow
Write-Host ""

# Test 1: Health check
Write-Host "1️⃣ Health Check" -ForegroundColor Green
Write-Host "   GET $API_URL/health"
try {
    $response = Invoke-RestMethod -Uri "$API_URL/health" -Method Get
    Write-Host "   ✅ Response: $($response | ConvertTo-Json)" -ForegroundColor Green
}
catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""
Start-Sleep -Seconds 1

# Test 2: Register new user
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$EMAIL = "test_$timestamp@example.com"
$PASSWORD = "TestPassword123!"
Write-Host "2️⃣ Register User" -ForegroundColor Green
Write-Host "   POST $API_URL/api/auth/register"
Write-Host "   Email: $EMAIL"
try {
    $body = @{
        email    = $EMAIL
        password = $PASSWORD
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$API_URL/api/auth/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body
    
    Write-Host "   ✅ Response: $($response | ConvertTo-Json)" -ForegroundColor Green
}
catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""
Start-Sleep -Seconds 1

# Test 3: Login
Write-Host "3️⃣ Login" -ForegroundColor Green
Write-Host "   POST $API_URL/api/auth/login"
Write-Host "   Username: $EMAIL"
try {
    $body = "username=$([System.Web.HttpUtility]::UrlEncode($EMAIL))&password=$([System.Web.HttpUtility]::UrlEncode($PASSWORD))"
    
    $response = Invoke-RestMethod -Uri "$API_URL/api/auth/login" `
        -Method Post `
        -ContentType "application/x-www-form-urlencoded" `
        -Body $body
    
    $TOKEN = $response.access_token
    Write-Host "   ✅ Response: $($response | ConvertTo-Json)" -ForegroundColor Green
    Write-Host "   🔐 Token: $($TOKEN.Substring(0, 30))..." -ForegroundColor Cyan
}
catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Details: $($_.Exception.Response.Content | Out-String)" -ForegroundColor Red
    exit
}
Write-Host ""
Start-Sleep -Seconds 1

# Test 4: Get user info with token
Write-Host "4️⃣ Get Current User (/me)" -ForegroundColor Green
Write-Host "   GET $API_URL/api/auth/me"
Write-Host "   Authorization: Bearer [token]"
try {
    $headers = @{
        "Authorization" = "Bearer $TOKEN"
    }
    
    $response = Invoke-RestMethod -Uri "$API_URL/api/auth/me" `
        -Method Get `
        -Headers $headers
    
    Write-Host "   ✅ Response: $($response | ConvertTo-Json)" -ForegroundColor Green
}
catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Details: $($_.Exception.Response.Content | Out-String)" -ForegroundColor Red
}
Write-Host ""
Start-Sleep -Seconds 1

# Test 5: Test without token (should be 401/403)
Write-Host "5️⃣ Test WITHOUT Token (should be 401/403)" -ForegroundColor Green
Write-Host "   GET $API_URL/api/auth/me"
try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/auth/me" `
        -Method Get `
        -ErrorAction Stop
    
    Write-Host "   ⚠️ Got 200 (unexpected): $($response | ConvertTo-Json)" -ForegroundColor Yellow
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "   ✅ Got $statusCode (expected 401/403)" -ForegroundColor Green
    Write-Host "   Details: $($_.Exception.Response.Content | Out-String)" -ForegroundColor DarkGray
}
Write-Host ""

# Test 6: Test with invalid token (should be 401)
Write-Host "6️⃣ Test WITH Invalid Token (should be 401)" -ForegroundColor Green
Write-Host "   GET $API_URL/api/auth/me"
Write-Host "   Authorization: Bearer INVALID_TOKEN"
try {
    $headers = @{
        "Authorization" = "Bearer INVALID_TOKEN_12345"
    }
    
    $response = Invoke-RestMethod -Uri "$API_URL/api/auth/me" `
        -Method Get `
        -Headers $headers `
        -ErrorAction Stop
    
    Write-Host "   ⚠️ Got 200 (unexpected)" -ForegroundColor Yellow
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "   ✅ Got $statusCode (expected 401)" -ForegroundColor Green
    Write-Host "   Details: $($_.Exception.Response.Content | Out-String)" -ForegroundColor DarkGray
}
Write-Host ""

Write-Host "✅ Test complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Expected results:" -ForegroundColor Yellow
Write-Host "  1. Health: 200 OK" -ForegroundColor DarkGray
Write-Host "  2. Register: 201 Created" -ForegroundColor DarkGray
Write-Host "  3. Login: 200 OK + access_token" -ForegroundColor DarkGray
Write-Host "  4. Get /me: 200 OK + user data" -ForegroundColor DarkGray
Write-Host "  5. /me (no token): 403 Forbidden or 401 Unauthorized" -ForegroundColor DarkGray
Write-Host "  6. /me (invalid token): 401 Unauthorized" -ForegroundColor DarkGray
