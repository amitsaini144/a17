import { NextResponse, type NextRequest } from "next/server"

// Set by the API alongside the session cookies (app/auth/cookies.py). It only says that a login
// session exists; the page still verifies it, refreshing the access token if needed.
const SESSION_HINT_COOKIE = "session"

/** Send logged-out visitors of protected pages to log in, and back here afterwards. */
export function middleware(request: NextRequest) {
    if (request.cookies.get(SESSION_HINT_COOKIE)?.value === "1") return NextResponse.next()

    const login = new URL("/login", request.url)
    login.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search)
    return NextResponse.redirect(login)
}

export const config = {
    matcher: ["/checkout/:path*", "/account/:path*"],
}
