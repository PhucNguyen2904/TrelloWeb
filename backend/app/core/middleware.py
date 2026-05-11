from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from fastapi import Request

import json
from app.core.sanitization import sanitize_recursive

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Skip security headers for CORS preflight requests
        # Let CORSMiddleware handle OPTIONS completely
        if request.method == "OPTIONS":
            return await call_next(request)

        response = await call_next(request)
        
        # Layer 3: CSP Headers
        csp_policy = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data: https:; "
            "connect-src 'self' "
            "http://localhost:8000 http://localhost:3000 "
            "https://trelloweb-1.onrender.com "
            "https://*.vercel.app; "
            "frame-ancestors 'none'; "
            "base-uri 'self'; "
            "form-action 'self';"
        )
        
        response.headers["Content-Security-Policy"] = csp_policy
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        return response

class SanitizationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Layer 4: Input Sanitization
        if request.method in ["POST", "PUT", "PATCH"]:
            content_type = request.headers.get("Content-Type", "")
            if "application/json" in content_type:
                try:
                    body = await request.json()
                    sanitized_body = sanitize_recursive(body)
                    
                    # Replace the request body with sanitized version
                    async def receive():
                        return {
                            "type": "http.request",
                            "body": json.dumps(sanitized_body).encode("utf-8"),
                        }
                    request._receive = receive
                except Exception:
                    # If JSON parsing fails, let the application handle it
                    pass
        
        return await call_next(request)

