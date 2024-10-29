import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const debugLog = (message: string) => {
  if (process.env.NODE_ENV !== 'production') console.log(message);
};

const authRoutes = new Set(['/login', '/register']);
const protectedRoutes = new Set(['/', '/users', '/settings']);

const isProtectedRoute = (path: string) =>
  Array.from(protectedRoutes).some(route => path === route || path.startsWith(`${route}/`));

const redirectTo = (destination: string) => NextResponse.redirect(destination);

export async function middleware(request: NextRequest) {
  const { pathname: path, origin } = request.nextUrl;
  debugLog(`🔒 Middleware executing for: ${path}`);

  const token = request.cookies.get('auth_session')?.value;
  debugLog(`🔑 Token status: ${token ? 'Found' : 'Not found'}`);

  if (!isProtectedRoute(path) && !authRoutes.has(path)) {
    debugLog(`✅ Path ${path} is public, allowing access.`);
    return NextResponse.next();
  }

  if (!token) {
    debugLog('⚠️ No token found - redirecting to login');
    return isProtectedRoute(path) ? redirectTo(`${origin}/login`) : NextResponse.next();
  }

  try {
    debugLog('🔍 Verifying token...');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-token`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      debugLog('❌ Token verification failed');
      return redirectTo(`${origin}/login`);
    }

    const { valid, user } = await response.json();

    if (!valid) {
      debugLog('❌ Token is invalid - redirecting to login');
      return redirectTo(`${origin}/login`);
    }

    if (authRoutes.has(path)) {
      debugLog('🔄 Authenticated user on auth route - redirecting to home');
      return redirectTo(`${origin}/`);
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-data', JSON.stringify(user));
    debugLog('✅ Token is valid - allowing access with user data attached');

    return NextResponse.next({
      request: { headers: requestHeaders },
    });

  } catch (error) {
    console.error('🔥 Middleware Error:', error);
    return redirectTo(`${origin}/login`);
  }
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/users/:path*',
    '/settings/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
