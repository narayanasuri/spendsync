import { NextRequest, NextResponse } from "next/server"
import { getSupabase, missingCreds } from "@/lib/supabase-server"

// GET /api/budgets?user_id=1
export async function GET(req: NextRequest) {
  const supabase = getSupabase()
  if (!supabase) return missingCreds()

  const userId = req.nextUrl.searchParams.get("user_id")

  let query = supabase
    .from("Budgets")
    .select("*, Categories(id, name, icon)")
    .order("id")

  if (userId) query = query.eq("user", Number(userId))

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/budgets  { category_id, budget_amount, user? }
export async function POST(req: NextRequest) {
  const supabase = getSupabase()
  if (!supabase) return missingCreds()

  const body = await req.json()

  if (!body.category_id)
    return NextResponse.json(
      { error: "category_id is required" },
      { status: 422 }
    )
  if (!body.budget_amount || body.budget_amount <= 0)
    return NextResponse.json(
      { error: "budget_amount must be greater than 0" },
      { status: 422 }
    )

  const { data, error } = await supabase
    .from("Budgets")
    .insert({
      category_id: body.category_id,
      budget_amount: body.budget_amount,
      user: body.user ?? null,
    })
    .select("*, Categories(id, name, icon)")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
