import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"
import { CategoryEnum, PaymentModeEnum } from "@/lib/enums"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

function getSupabase() {
  const key = supabaseServiceKey ?? supabaseAnonKey
  if (!supabaseUrl || !key) return null
  return createClient<Database>(supabaseUrl, key)
}

function missingCredsResponse() {
  return NextResponse.json(
    { error: "Server misconfiguration: missing Supabase credentials" },
    { status: 500 }
  )
}

function parseDateRange(searchParams: URLSearchParams) {
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  if (from && isNaN(Date.parse(from))) return { error: "Invalid 'from' date." }
  if (to && isNaN(Date.parse(to))) return { error: "Invalid 'to' date." }

  const toDate = to ? new Date(to) : null
  if (toDate) toDate.setHours(23, 59, 59, 999)

  return {
    from: from ? new Date(from).toISOString() : null,
    to: toDate ? toDate.toISOString() : null,
  }
}

// GET /api/expenses/summary/category?from=2026-03-01&to=2026-03-31
// Returns: { category: string, total: number }[]
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const groupBy = searchParams.get("group_by") ?? "category"

  if (groupBy !== "category" && groupBy !== "payment_mode") {
    return NextResponse.json(
      { error: "group_by must be 'category' or 'payment_mode'" },
      { status: 400 }
    )
  }

  const supabase = getSupabase()
  if (!supabase) return missingCredsResponse()

  const range = parseDateRange(searchParams)
  if ("error" in range) {
    return NextResponse.json({ error: range.error }, { status: 400 })
  }

  // Validate optional filter values
  const categoryFilter = searchParams.get("category") as CategoryEnum | null
  const paymentModeFilter = searchParams.get(
    "payment_mode"
  ) as PaymentModeEnum | null

  if (categoryFilter && !Object.values(CategoryEnum).includes(categoryFilter)) {
    return NextResponse.json(
      { error: `Invalid category: ${categoryFilter}` },
      { status: 400 }
    )
  }
  if (
    paymentModeFilter &&
    !Object.values(PaymentModeEnum).includes(paymentModeFilter)
  ) {
    return NextResponse.json(
      { error: `Invalid payment_mode: ${paymentModeFilter}` },
      { status: 400 }
    )
  }

  console.log("[GET /api/expenses/summary] Params:", {
    group_by: groupBy,
    from: range.from,
    to: range.to,
    category: categoryFilter,
    payment_mode: paymentModeFilter,
  })

  let query = supabase.from("Expenses").select(`${groupBy}, amount`)

  if (range.from) query = query.gte("spent_at", range.from)
  if (range.to) query = query.lte("spent_at", range.to)
  if (categoryFilter) query = query.eq("category", categoryFilter)
  if (paymentModeFilter) query = query.eq("payment_mode", paymentModeFilter)

  const { data, error } = await query

  if (error) {
    console.error("[GET /api/expenses/summary] Supabase error:", {
      message: error.message,
      code: error.code,
      details: error.details,
    })
    return NextResponse.json(
      { error: error.message, code: error.code, details: error.details },
      { status: 500 }
    )
  }

  // Aggregate totals by group key in JS
  const totals = data.reduce<Record<string, number>>((acc, row) => {
    const key = String(row[groupBy as keyof typeof row])
    acc[key] = (acc[key] ?? 0) + Number(row.amount)
    return acc
  }, {})

  const result = Object.entries(totals).map(([key, total]) => ({
    [groupBy]: key,
    total: Math.round(total * 100) / 100,
  }))

  console.log(`[GET /api/expenses/summary] Returned ${result.length} groups`)
  return NextResponse.json(result)
}
