import { NextRequest, NextResponse } from "next/server"
import { getSupabase, missingCreds } from "@/lib/supabase-server"
import type { TablesInsert } from "@/lib/database.types"

type ExpenseInsert = TablesInsert<"Expenses">

// GET /api/logs?page=0&from=...
export const GET = async (req: NextRequest) => {
  const supabase = getSupabase()
  if (!supabase) return missingCreds()

  const { searchParams } = req.nextUrl

  // 1. Pagination Setup
  const page = parseInt(searchParams.get("page") ?? "0")
  const PAGE_SIZE = 20 // Match this with your frontend PAGE_SIZE
  const rangeFrom = page * PAGE_SIZE
  const rangeTo = rangeFrom + PAGE_SIZE - 1

  const from = searchParams.get("from")
  const to = searchParams.get("to")
  const categoryId = searchParams.get("category_id")
  const paymentModeId = searchParams.get("payment_mode_id")
  const transactionType = searchParams.get("transaction_type")

  // 2. Base Query (Replace .limit with .range)
  let query = supabase
    .from("Expenses")
    .select("*")
    .order("spent_at", { ascending: false })
    .range(rangeFrom, rangeTo) // 👈 This is the key change

  // 3. Filters
  if (from && !isNaN(Date.parse(from))) {
    query = query.gte(
      "spent_at",
      new Date(from + "T00:00:00.000Z").toISOString()
    )
  }
  if (to && !isNaN(Date.parse(to))) {
    query = query.lte("spent_at", new Date(to + "T23:59:59.999Z").toISOString())
  }

  // Use explicit null/undefined checks to avoid "0" being falsy
  if (categoryId && categoryId !== "all") {
    query = query.eq("category", parseInt(categoryId))
  }
  if (paymentModeId && paymentModeId !== "all") {
    query = query.eq("payment_mode", parseInt(paymentModeId))
  }
  if (transactionType && transactionType !== "all") {
    query = query.eq("transaction_type", transactionType)
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/logs
export const POST = async (req: NextRequest) => {
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
    payment_mode: body.payment_mode,
    amount: body.amount,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (expenseError)
    return NextResponse.json({ error: expenseError.message }, { status: 500 })

  return NextResponse.json(data, { status: 201 })
}
