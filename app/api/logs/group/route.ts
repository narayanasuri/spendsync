import { NextRequest, NextResponse } from "next/server"
import { getSupabase, missingCreds } from "@/lib/supabase-server"
import { differenceInDays } from "date-fns"

// GET /api/logs/group?group=category&from=2026-04-1&to=2026-04-18
export async function GET(req: NextRequest) {
  const supabase = getSupabase()
  if (!supabase) return missingCreds()

  const { searchParams } = req.nextUrl
  const group = searchParams.get("group")
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  // group is required
  if (!group)
    return NextResponse.json(
      { error: "Missing 'group' in the params" },
      { status: 400 }
    )

  if (group !== "category" && group !== "payment_mode")
    return NextResponse.json(
      {
        error:
          "'group' should either be 'category' or 'payment_mode' in the params",
      },
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

  let query = supabase.from("Expenses").select(`${group},amount.sum()`)

  if (from)
    query = query.gte(
      "spent_at",
      new Date(from + "T00:00:00.000Z").toISOString()
    )
  if (to)
    query = query.lte("spent_at", new Date(to + "T23:59:59.999Z").toISOString())

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
