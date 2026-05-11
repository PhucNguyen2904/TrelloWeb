import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userRole = request.cookies.get('user_role')?.value;

  // ── 1. Handle /dashboard/* redirects
  if (pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone();
    let newPath = pathname.replace('/dashboard', '');
    
    // If it was just /dashboard or /dashboard/, go to /boards
    if (newPath === '' || newPath === '/') {
      newPath = '/boards';
    }
    
    url.pathname = newPath;
    return NextResponse.redirect(url);
  }

  // ── 2. Role Protection (formerly in proxy.ts)
  const isSuperAdminRoute = pathname.startsWith('/superadmin');
  const isBoardsRoute = pathname.startsWith('/boards');
  const isMembersRoute = pathname.startsWith('/members');
  const isAnalyticsRoute = pathname.startsWith('/analytics');
  const isSettingsRoute = pathname.startsWith('/workspace-settings');
  const isProfileRoute = pathname.startsWith('/profile');

  const isProtectedRoute = isBoardsRoute || isMembersRoute || isAnalyticsRoute || isSettingsRoute || isProfileRoute;

  // Protect /superadmin/* — must be superadmin
  if (isSuperAdminRoute) {
    if (!userRole) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (userRole !== 'superadmin') {
      return NextResponse.redirect(new URL('/boards', request.url));
    }
    return NextResponse.next();
  }

  // Prevent superadmin from landing on regular app routes
  if (isProtectedRoute && userRole === 'superadmin') {
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
