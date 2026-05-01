import { NextRequest, NextResponse } from "next/server"
import { getSupabase, missingCreds } from "@/lib/supabase-server"

// GET /api/payment-methods
export const GET = async () => {
  const supabase = getSupabase()
  if (!supabase) return missingCreds()

  const { data, error } = await supabase
    .from("PaymentMethods")
    .select("*")
    .order("name")

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/payment-methods  { name, type, balance? }
export const POST = async (req: NextRequest) => {
  const supabase = getSupabase()
  if (!supabase) return missingCreds()

  const body = await req.json()

  if (!body.name?.trim())
    return NextResponse.json({ error: "name is required" }, { status: 422 })
  if (!body.type?.trim())
    return NextResponse.json({ error: "type is required" }, { status: 422 })

  const { data, error } = await supabase
    .from("PaymentMethods")
    .insert({
      name: body.name.trim(),
      type: body.type.trim(),
      balance: body.balance ?? null,
      due: body.due ?? 1,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
