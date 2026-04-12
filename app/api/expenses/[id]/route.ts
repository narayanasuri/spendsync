import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database, TablesUpdate } from "@/lib/database.types"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

function getSupabase() {
  const key = supabaseServiceKey ?? supabaseAnonKey
  if (!supabaseUrl || !key) return null
  return createClient<Database>(supabaseUrl, key)
}

function missingCreds() {
  return NextResponse.json(
    { error: "Server misconfiguration: missing Supabase credentials" },
    { status: 500 }
  )
}

function parseId(id: string) {
  const n = parseInt(id)
  return isNaN(n) ? null : n
}

// GET /api/expenses/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = getSupabase()
  if (!supabase) return missingCreds()

  const numericId = parseId(id)
  if (!numericId)
    return NextResponse.json({ error: "Invalid expense ID." }, { status: 400 })

  const { data, error } = await supabase
    .from("Expenses")
    .select("*")
    .eq("id", numericId)
    .single()

  if (error) {
    const status = error.code === "PGRST116" ? 404 : 500
    return NextResponse.json({ error: error.message }, { status })
  }

  return NextResponse.json(data)
}

// PATCH /api/expenses/:id
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = getSupabase()
  if (!supabase) return missingCreds()

  const numericId = parseId(id)
  if (!numericId)
    return NextResponse.json({ error: "Invalid expense ID." }, { status: 400 })

  let body: TablesUpdate<"Expenses">
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  console.log(`[PATCH /api/expenses/${id}] Updating:`, body)

  const { data, error } = await supabase
    .from("Expenses")
    .update(body)
    .eq("id", numericId)
    .select()
    .single()

  if (error) {
    console.error(`[PATCH /api/expenses/${id}] Supabase error:`, error.message)
    const status = error.code === "PGRST116" ? 404 : 500
    return NextResponse.json({ error: error.message }, { status })
  }

  console.log(`[PATCH /api/expenses/${id}] Updated successfully`)
  return NextResponse.json(data)
}

// DELETE /api/expenses/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = getSupabase()
  if (!supabase) return missingCreds()

  const numericId = parseId(id)
  if (!numericId)
    return NextResponse.json({ error: "Invalid expense ID." }, { status: 400 })

  console.log(`[DELETE /api/expenses/${id}] Deleting`)

  const { error } = await supabase.from("Expenses").delete().eq("id", numericId)

  if (error) {
    console.error(`[DELETE /api/expenses/${id}] Supabase error:`, error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log(`[DELETE /api/expenses/${id}] Deleted successfully`)
  return new NextResponse(null, { status: 204 })
}
