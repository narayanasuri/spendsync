import { NextRequest, NextResponse } from "next/server"
import { getSupabase, missingCreds } from "@/lib/supabase-server"

type Params = { params: Promise<{ id: string }> }

// PATCH /api/budgets/:id  { budget_amount?, category_id?, user? }
export const PATCH = async (req: NextRequest, { params }: Params) => {
  const supabase = getSupabase()
  if (!supabase) return missingCreds()

  const { id } = await params
  const body = await req.json()

  const { data, error } = await supabase
    .from("Budgets")
    .update(body)
    .eq("id", Number(id))
    .select("*, Categories(id, name, icon)")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE /api/budgets/:id
export const DELETE = async (_req: NextRequest, { params }: Params) => {
  const supabase = getSupabase()
  if (!supabase) return missingCreds()

  const { id } = await params
  const { error } = await supabase.from("Budgets").delete().eq("id", Number(id))

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
