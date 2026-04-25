import { NextRequest, NextResponse } from "next/server"
import { getSupabase, missingCreds } from "@/lib/supabase-server"

// GET /api/categories
export async function GET() {
  const supabase = getSupabase()
  if (!supabase) return missingCreds()

  const { data, error } = await supabase
    .from("Categories")
    .select("*")
    .order("name")

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/categories  { name, icon? }
export async function POST(req: NextRequest) {
  const supabase = getSupabase()
  if (!supabase) return missingCreds()

  const body = await req.json()

  if (!body.name?.trim())
    return NextResponse.json({ error: "name is required" }, { status: 422 })

  const { data, error } = await supabase
    .from("Categories")
    .insert({
      name: body.name.trim(),
      icon: body.icon,
      color: body.color,
      type: body.type,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
