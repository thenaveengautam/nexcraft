import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Native cookie check bypasses Edge runtime decryption bugs on Vercel
  const hasSecureAuthJs = request.cookies.has("__Secure-authjs.session-token");
  const hasAuthJs = request.cookies.has("authjs.session-token");
  const hasSecureNextAuth = request.cookies.has("__Secure-next-auth.session-token");
  const hasNextAuth = request.cookies.has("next-auth.session-token");
  
  const token = hasSecureAuthJs || hasAuthJs || hasSecureNextAuth || hasNextAuth;

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

  if (pathname.startsWith("/dashboard")) {
    console.log("MIDDLEWARE HIT:", pathname);
    console.log("ALL COOKIES:", request.cookies.getAll().map(c => c.name).join(", "));
    console.log("IS TOKEN VALID?", !!token);
  }

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
