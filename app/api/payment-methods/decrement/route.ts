import { NextRequest, NextResponse } from "next/server"
import { getSupabase, missingCreds } from "@/lib/supabase-server"
import { DecrementType } from "@/lib/types"

// POST /api/payment-methods/decrement
export async function POST(req: NextRequest) {
  const supabase = getSupabase()
  if (!supabase) return missingCreds()

  let body: DecrementType
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { decrement, payment_method_id } = body

  if (!decrement)
    return NextResponse.json(
      { error: "decrement amount is required" },
      { status: 422 }
    )

  if (!payment_method_id)
    return NextResponse.json(
      { error: "payment method id is required" },
      { status: 422 }
    )

  const { data, error } = await supabase.rpc("decrement_balance", {
    row_id: payment_method_id,
    amount: decrement,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data, { status: 200 })
}
