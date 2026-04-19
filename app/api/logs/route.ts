import { NextRequest, NextResponse } from "next/server"
import { getSupabase, missingCreds } from "@/lib/supabase-server"
import type { TablesInsert } from "@/lib/database.types"

type ExpenseInsert = TablesInsert<"Expenses">

// GET /api/logs?from=2026-01-01&to=2026-04-30&category_id=3&payment_mode_id=1&limit=50
export async function GET(req: NextRequest) {
  const supabase = getSupabase()
  if (!supabase) return missingCreds()

  const { searchParams } = req.nextUrl
  const from = searchParams.get("from")
  const to = searchParams.get("to")
  const categoryId = searchParams.get("category_id")
  const paymentModeId = searchParams.get("payment_mode_id")
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 200)

  if (from && isNaN(Date.parse(from)))
    return NextResponse.json({ error: "Invalid 'from' date." }, { status: 400 })
  if (to && isNaN(Date.parse(to)))
    return NextResponse.json({ error: "Invalid 'to' date." }, { status: 400 })

  let query = supabase
    .from("Expenses")
    .select("*")
    .order("spent_at", { ascending: false })
    .limit(limit)

  if (from)
    query = query.gte(
      "spent_at",
      new Date(from + "T00:00:00.000Z").toISOString()
    )
  if (to)
    query = query.lte("spent_at", new Date(to + "T23:59:59.999Z").toISOString())
  if (categoryId) query = query.eq("category", parseInt(categoryId))
  if (paymentModeId) query = query.eq("payment_mode", parseInt(paymentModeId))

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/logs
export async function POST(req: NextRequest) {
  const supabase = getSupabase()
  if (!supabase) return missingCreds()

  let body: ExpenseInsert
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { name, amount, category, payment_mode } = body

  if (!name?.trim())
    return NextResponse.json(
      { error: "Expense title is required." },
      { status: 422 }
    )
  if (!amount || amount <= 0)
    return NextResponse.json(
      { error: "Amount must be greater than 0." },
      { status: 422 }
    )
  if (!category)
    return NextResponse.json(
      { error: "Category is required." },
      { status: 422 }
    )
  if (!payment_mode)
    return NextResponse.json(
      { error: "Payment mode is required." },
      { status: 422 }
    )

  const { data, error } = await supabase
    .from("Expenses")
    .insert(body)
    .select()
    .single()

  const { error: expenseError } = await supabase.rpc("decrement_balance", {
    row_id: body.payment_mode,
    amount: body.amount,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (expenseError)
    return NextResponse.json({ error: expenseError.message }, { status: 500 })

  return NextResponse.json(data, { status: 201 })
}
