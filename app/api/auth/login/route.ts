import { NextRequest, NextResponse } from "next/server"

const UI_PASSWORD = process.env.UI_PASSWORD
const AUTH_COOKIE = "ui_auth"
const THIRTY_DAYS = 60 * 60 * 24 * 30

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (!UI_PASSWORD || password !== UI_PASSWORD) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(AUTH_COOKIE, UI_PASSWORD, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: THIRTY_DAYS,
    path: "/",
  })

  return res
}
