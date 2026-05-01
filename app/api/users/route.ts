import { NextRequest, NextResponse } from "next/server"
import { getSupabase, missingCreds } from "@/lib/supabase-server"

// GET /api/users
export const GET = async () => {
  const supabase = getSupabase()
  if (!supabase) return missingCreds()

  const { data, error } = await supabase.from("Users").select("*").order("name")

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/users  { name }
export const POST = async (req: NextRequest) => {
  const supabase = getSupabase()
  if (!supabase) return missingCreds()

  const body = await req.json()

  if (!body.name?.trim())
    return NextResponse.json({ error: "name is required" }, { status: 422 })

  const { data, error } = await supabase
    .from("Users")
    .insert({ name: body.name.trim() })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
