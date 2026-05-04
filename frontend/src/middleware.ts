import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware: Route protection for /superadmin/* paths.
 *
 * Strategy:
 *  - Reads the persisted Zustand auth store from localStorage via a cookie
 *    fallback, or checks a lightweight `x-user-role` cookie set at login.
 *  - For full JWT verification, swap the cookie read for a real JWT decode
 *    (e.g. with the `jose` library) using process.env.JWT_SECRET.
 *
 * Because Next.js middleware runs on the Edge runtime (no Node.js APIs), we
 * use the `Authorization` cookie pattern that many Next.js apps adopt:
 *   - At login, the server sets: Set-Cookie: user_role=superadmin; HttpOnly; Secure
 *   - Middleware reads that cookie to gate routes.
 *
 * If you store the token in localStorage (client-only), route protection is
 * done client-side in SuperAdminShell.tsx; this middleware adds a second layer
 * via the `user_role` cookie (set it at login time in your API route).
 */
export function middleware(request: NextRequest) {
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
  matcher: ['/superadmin/:path*', '/dashboard/:path*', '/boards/:path*'],
};
