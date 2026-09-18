import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = [
  '/login',
  '/signup',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = request.cookies.get(
    'my-custom-session'
  )?.value;

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(
      new URL('/login', request.url)
    );
  }

  if (session && isPublicRoute) {
    return NextResponse.redirect(
      new URL('/dashboard', request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};