import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Proxy (previously middleware) — Next.js 16
 * Auth guards are handled client-side in DashboardLayout.
 * This file simply passes all requests through.
 */
export function proxy(request: NextRequest) {
  void request;
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes / rewrites)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
