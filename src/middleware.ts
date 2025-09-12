import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const token = true
  // const token = request.cookies.get("token");
  // const role = request.cookies.get("role");

  const url = request.nextUrl.clone();
  if (!token){
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
 
export const config = {
  matcher:  ['/admin/:path*', '/user/:path*', '/'],
}