# Windows Debug Script for Trello API

param(
    [string]$BackendUrl = "http://localhost:8000",
    [string]$FrontendUrl = "http://localhost:3000"
)

Write-Host "=== TRELLO API DEBUG CHECKLIST ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend URL: $BackendUrl" -ForegroundColor Yellow
Write-Host "Frontend URL: $FrontendUrl" -ForegroundColor Yellow
Write-Host ""

# TEST 1: Health Check
Write-Host "[TEST 1] Health Check" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$BackendUrl/health" -Method GET -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Health check PASSED" -ForegroundColor Green
        Write-Host "Response: $($response.Content)"
    }
} catch {
    Write-Host "❌ Health check FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# TEST 2: Root Endpoint
Write-Host "[TEST 2] Root Endpoint" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$BackendUrl/" -Method GET -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Root endpoint PASSED" -ForegroundColor Green
        Write-Host "Response: $($response.Content)"
    }
} catch {
    Write-Host "❌ Root endpoint FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# TEST 3: Register Endpoint
Write-Host "[TEST 3] Register Endpoint" -ForegroundColor Cyan
try {
    $body = @{
        email = "test@test.com"
        password = "testpass123"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$BackendUrl/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -ErrorAction Stop
    Write-Host "✅ Register endpoint RESPONDED" -ForegroundColor Green
    Write-Host "Response: $($response.Content)"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "Response Code: $statusCode" -ForegroundColor Yellow
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""

# TEST 4: CORS Headers (Preflight)
Write-Host "[TEST 4] CORS Preflight Request" -ForegroundColor Cyan
try {
    $headers = @{
        "Origin" = $FrontendUrl
        "Access-Control-Request-Method" = "POST"
        "Access-Control-Request-Headers" = "content-type"
    }
    
    $response = Invoke-WebRequest -Uri "$BackendUrl/api/auth/login" `
        -Method OPTIONS `
        -Headers $headers `
        -ErrorAction Stop
    
    $corsHeaders = $response.Headers.Keys | Where-Object { $_ -like "*Access-Control*" }
    if ($corsHeaders) {
        Write-Host "✅ CORS headers PRESENT" -ForegroundColor Green
        foreach ($header in $corsHeaders) {
            Write-Host "$header`: $($response.Headers[$header])" -ForegroundColor Green
        }
    } else {
        Write-Host "❌ CORS headers MISSING" -ForegroundColor Red
    }
} catch {
    Write-Host "⚠️ Preflight test: $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""

# TEST 5: 404 Check
Write-Host "[TEST 5] 404 Not Found" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$BackendUrl/api/nonexistent" -Method GET -ErrorAction Stop
    Write-Host "❌ Expected 404, got $($response.StatusCode)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "✅ 404 response CORRECT" -ForegroundColor Green
    } else {
        Write-Host "❌ Unexpected status code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}
Write-Host ""

Write-Host "=== END DEBUG ===" -ForegroundColor Cyan
