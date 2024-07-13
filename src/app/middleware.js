import { NextResponse } from 'next/server';

export function middleware(request) {
  const user = request.cookies.get('user');
  const isAuthPage = request.nextUrl.pathname.startsWith('/navigrowth-education-and-career-management/login') || 
                     request.nextUrl.pathname.startsWith('/navigrowth-education-and-career-management/register');

  if (!user && !isAuthPage) {
    return NextResponse.redirect(new URL('/navigrowth-education-and-career-management/login', request.url));
  }

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/navigrowth-education-and-career-management/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/navigrowth-education-and-career-management/:path*'],
};