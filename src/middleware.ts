import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = process.env.JWT_SECRET || "super-secret-jwt-key-taskflow-1234567890-aesthetics";
const encoder = new TextEncoder();
const JWT_SECRET = encoder.encode(SECRET_KEY);

async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isProtectedPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/calendar");

  const session = token ? await verifySession(token) : null;

  if (isProtectedPage && !session) {
    // Redirect to login if user is not authenticated
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && session) {
    // Redirect authenticated users to the dashboard
    const url = new URL("/dashboard", req.url);
    return NextResponse.redirect(url);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/calendar/:path*",
    "/login",
    "/register",
  ],
};
