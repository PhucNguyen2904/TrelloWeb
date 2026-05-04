import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Proxy (Next.js edge middleware equivalent).
 *
 * Route-protection strategy for /superadmin/* paths:
 *  - Reads a lightweight `user_role` HttpOnly cookie set by the backend at login.
 *  - /superadmin/* → must have user_role === 'superadmin'; otherwise redirect.
 *  - Superadmin users hitting /dashboard or /boards are bounced to /superadmin/users.
 *  - All other routes pass through.
 *
 * Client-side protection also exists in SuperAdminShell.tsx as a second layer.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isSuperAdminRoute = pathname.startsWith('/superadmin');
  const isDashboardOrBoards =
    pathname.startsWith('/dashboard') || pathname.startsWith('/boards');

  // Read role from HttpOnly cookie (set by backend /api/auth/login)
  const userRole = request.cookies.get('user_role')?.value;

  // ── Protect /superadmin/* — must be superadmin
  if (isSuperAdminRoute) {
    if (!userRole) {
      // Not authenticated at all → send to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (userRole !== 'superadmin') {
      // Authenticated but wrong role → send to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // ✓ Superadmin on /superadmin/* — allow
    return NextResponse.next();
  }

  // ── Prevent superadmin from landing on regular app routes
  if (isDashboardOrBoards && userRole === 'superadmin') {
    return NextResponse.redirect(new URL('/superadmin/users', request.url));
  }

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
