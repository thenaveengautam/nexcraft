import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedPaths = [
    "/dashboard",
    "/generate",
    "/history",
    "/templates",
    "/billing",
    "/settings",
  ];

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from auth pages
  const authPaths = ["/login", "/register"];
  if (authPaths.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/generate/:path*",
    "/history/:path*",
    "/templates/:path*",
    "/billing/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};
