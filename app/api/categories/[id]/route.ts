import { NextRequest, NextResponse } from "next/server"
import { getSupabase, missingCreds } from "@/lib/supabase-server"

type Params = { params: Promise<{ id: string }> }

// PATCH /api/categories/:id  { name?, icon? }
export async function PATCH(req: NextRequest, { params }: Params) {
  const supabase = getSupabase()
  if (!supabase) return missingCreds()

  const { id } = await params
  const body = await req.json()

  const { data, error } = await supabase
    .from("Categories")
    .update(body)
    .eq("id", Number(id))
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE /api/categories/:id
export async function DELETE(_req: NextRequest, { params }: Params) {
  const supabase = getSupabase()
  if (!supabase) return missingCreds()

  const { id } = await params
  const { error } = await supabase
    .from("Categories")
    .delete()
    .eq("id", Number(id))

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
