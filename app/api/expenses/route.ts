import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database, TablesInsert } from "@/lib/database.types"
import { CategoryEnum, PaymentModeEnum } from "@/lib/enums"

type ExpenseInsert = TablesInsert<"Expenses">

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function getSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) return null
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// GET /api/expenses?from=2026-01-01&to=2026-04-30&category=dineout&payment_mode=zen&limit=50
export async function GET(req: NextRequest) {
  console.log("[GET /api/expenses] Request received")

  const supabase = getSupabase()
  if (!supabase) {
    console.error("[GET /api/expenses] Missing Supabase env vars")
    return NextResponse.json(
      { error: "Server misconfiguration: missing Supabase credentials" },
      { status: 500 }
    )
  }

  const { searchParams } = req.nextUrl
  const from = searchParams.get("from")
  const to = searchParams.get("to")
  const category = searchParams.get("category") as CategoryEnum | null
  const payment_mode = searchParams.get(
    "payment_mode"
  ) as PaymentModeEnum | null
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 200)

  // Validate date formats if provided
  if (from && isNaN(Date.parse(from))) {
    return NextResponse.json({ error: "Invalid 'from' date." }, { status: 400 })
  }
  if (to && isNaN(Date.parse(to))) {
    return NextResponse.json({ error: "Invalid 'to' date." }, { status: 400 })
  }

  // Validate enum values if provided
  if (category && !Object.values(CategoryEnum).includes(category)) {
    return NextResponse.json(
      { error: `Invalid category: ${category}` },
      { status: 400 }
    )
  }
  if (payment_mode && !Object.values(PaymentModeEnum).includes(payment_mode)) {
    return NextResponse.json(
      { error: `Invalid payment_mode: ${payment_mode}` },
      { status: 400 }
    )
  }

  console.log("[GET /api/expenses] Filters:", {
    from,
    to,
    category,
    payment_mode,
    limit,
  })

  let query = supabase
    .from("Expenses")
    .select("*")
    .order("spent_at", { ascending: false })
    .limit(limit)

  if (from) query = query.gte("spent_at", new Date(from).toISOString())
  if (to) {
    // Include the full end day by going to end of day
    const toDate = new Date(to)
    toDate.setHours(23, 59, 59, 999)
    query = query.lte("spent_at", toDate.toISOString())
  }
  if (category) query = query.eq("category", category)
  if (payment_mode) query = query.eq("payment_mode", payment_mode)

  const { data, error } = await query

  if (error) {
    console.error("[GET /api/expenses] Supabase error:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    })
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      },
      { status: 500 }
    )
  }

  console.log(`[GET /api/expenses] Returned ${data.length} rows`)
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  console.log("[POST /api/expenses] Request received")

  const supabase = getSupabase()
  if (!supabase) {
    console.error("[POST /api/expenses] Missing Supabase env vars", {
      supabaseUrl: !!supabaseUrl,
      supabaseAnonKey: !!supabaseAnonKey,
    })
    return NextResponse.json(
      { error: "Server misconfiguration: missing Supabase credentials" },
      { status: 500 }
    )
  }

  let body: ExpenseInsert
  try {
    body = await req.json()
    console.log("[POST /api/expenses] Parsed body:", body)
  } catch (err) {
    console.error("[POST /api/expenses] Failed to parse request body:", err)
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { name, amount, category, payment_mode } = body

  if (!name?.trim()) {
    return NextResponse.json(
      { error: "Expense title is required." },
      { status: 422 }
    )
  }
  if (!amount || amount <= 0) {
    return NextResponse.json(
      { error: "Amount must be greater than 0." },
      { status: 422 }
    )
  }
  if (!category) {
    return NextResponse.json(
      { error: "Category is required." },
      { status: 422 }
    )
  }
  if (!payment_mode) {
    return NextResponse.json(
      { error: "Payment mode is required." },
      { status: 422 }
    )
  }

  console.log("[POST /api/expenses] Inserting into Supabase:", body)

  const { data, error } = await supabase
    .from("Expenses")
    .insert(body)
    .select()
    .single()

  if (error) {
    console.error("[POST /api/expenses] Supabase insert error:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    })
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      },
      { status: 500 }
    )
  }

  console.log("[POST /api/expenses] Insert successful:", data)
  return NextResponse.json(data, { status: 201 })
}
