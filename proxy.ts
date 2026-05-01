import { NextRequest, NextResponse } from "next/server"

const UI_PASSWORD = process.env.UI_PASSWORD
const API_SECRET_KEY = process.env.API_SECRET_KEY
const AUTH_COOKIE = "ui_auth"

export const proxy = (req: NextRequest) => {
  const { pathname } = req.nextUrl

  // Auth endpoints are always public
  if (pathname.startsWith("/api/auth/")) {
    return NextResponse.next()
  }

  // --- API routes: accept either a valid API key OR a valid UI session cookie OR PWA auth header ---
  if (pathname.startsWith("/api/")) {
    const apiKey = req.headers.get("x-api-key")
    if (API_SECRET_KEY && apiKey === API_SECRET_KEY) {
      return NextResponse.next()
    }

    const authCookie = req.cookies.get(AUTH_COOKIE)
    if (UI_PASSWORD && authCookie?.value === UI_PASSWORD) {
      return NextResponse.next()
    }

    const pwaAuth = req.headers.get("x-pwa-auth")
    if (UI_PASSWORD && pwaAuth === UI_PASSWORD) {
      return NextResponse.next()
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // --- Login page and manifest: always accessible ---
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/screenshots") ||
    pathname.startsWith("/splash") ||
    pathname === "/manifest.json"
  ) {
    return NextResponse.next()
  }

  // --- All other UI routes: require password cookie or PWA auth header ---
  const authCookie = req.cookies.get(AUTH_COOKIE)
  if (UI_PASSWORD && authCookie?.value === UI_PASSWORD) {
    return NextResponse.next()
  }

  const pwaAuth = req.headers.get("x-pwa-auth")
  if (UI_PASSWORD && pwaAuth === UI_PASSWORD) {
    return NextResponse.next()
  }

  if (!UI_PASSWORD) {
    return NextResponse.next()
  }

  const loginUrl = req.nextUrl.clone()
  loginUrl.pathname = "/login"
  loginUrl.searchParams.set("from", pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
