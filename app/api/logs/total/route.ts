import { NextRequest, NextResponse } from "next/server"
import { getSupabase, missingCreds } from "@/lib/supabase-server"
import { differenceInDays } from "date-fns"

// GET /api/logs/total?categoryId=10&from=2026-04-1&to=2026-04-18
export async function GET(req: NextRequest) {
  const supabase = getSupabase()
  if (!supabase) return missingCreds()

  const { searchParams } = req.nextUrl
  const categoryId = searchParams.get("categoryId")
  const paymentId = searchParams.get("paymentId")
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  // categoryId is required
  if (!categoryId && !paymentId)
    return NextResponse.json(
      { error: "Missing 'categoryId' or 'paymentId' in the params" },
      { status: 400 }
    )

  // from date is required
  if (!from)
    return NextResponse.json(
      { error: "Missing 'from' date range" },
      { status: 400 }
    )

  // to date is required
  if (!to)
    return NextResponse.json(
      { error: "Missing 'to' date range" },
      { status: 400 }
    )

  // invalid date formats not allowed
  if (isNaN(Date.parse(from)) || isNaN(Date.parse(to)))
    return NextResponse.json(
      { error: "Invalid date format in range" },
      { status: 400 }
    )

  // start date cannot be after end date
  if (new Date(from) > new Date(to)) {
    return NextResponse.json(
      { error: "Start date cannot be after end date" },
      { status: 400 }
    )
  }

  // difference between dates can't be over a year
  if (differenceInDays(new Date(to), new Date(from)) > 365) {
    return NextResponse.json(
      { error: "Difference between dates cannot be greater than 365" },
      { status: 400 }
    )
  }

  if (categoryId) {
    const { data, error } = await supabase
      .from("Expenses")
      .select("transaction_type,amount.sum()")
      .eq("category", parseInt(categoryId))

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data)
  } else if (paymentId) {
    const { data, error } = await supabase
      .from("Expenses")
      .select("transaction_type, amount.sum()")
      .eq("payment_mode", parseInt(paymentId))

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data)
  }

  return NextResponse.json({ error: "Unreachable" }, { status: 500 })
}
