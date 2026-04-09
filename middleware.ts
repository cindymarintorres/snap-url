import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/dashboard"];
const AUTH_PATHS = ["/login", "/register", "/forgot-password", "/reset-password"];

export default auth(async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await auth();

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p));
  if (isAuthPath && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
