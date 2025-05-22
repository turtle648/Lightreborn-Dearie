// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("dearie_access_token")?.value;
  // if no token, always send to /auth/login
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // match any path with at least one character, EXCEPT:
    // - Next.js internals: _next, api
    // - your public routes: /auth/login, /auth/register, /survey-no-auth
    "/((?!_next|api|onboarding|auth/login|auth/register|survey-no-auth).+)",
  ],
};
