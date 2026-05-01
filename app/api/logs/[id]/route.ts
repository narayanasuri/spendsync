import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database, TablesUpdate } from "@/lib/database.types"

interface UpdateExpenseDataWithDecrement extends TablesUpdate<"Expenses"> {
  old_payment_method_id: number
  old_amount: number
}

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

const getSupabase = () => {
  const key = supabaseServiceKey ?? supabaseAnonKey
  if (!supabaseUrl || !key) return null
  return createClient<Database>(supabaseUrl, key)
}

const missingCreds = () => {
  return NextResponse.json(
    { error: "Server misconfiguration: missing Supabase credentials" },
    { status: 500 }
  )
}

const parseId = (id: string) => {
  const n = parseInt(id)
  return isNaN(n) ? null : n
}

// GET /api/logs/:id
export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params
  const supabase = getSupabase()
  if (!supabase) return missingCreds()

  const numericId = parseId(id)
  if (!numericId)
    return NextResponse.json({ error: "Invalid expense ID." }, { status: 400 })

  const { data, error } = await supabase
    .from("Expenses")
    .select("*")
    .eq("id", numericId)
    .single()

  if (error) {
    const status = error.code === "PGRST116" ? 404 : 500
    return NextResponse.json({ error: error.message }, { status })
  }

  return NextResponse.json(data)
}

// PATCH /api/logs/:id
export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params
  const supabase = getSupabase()
  if (!supabase) return missingCreds()

  const numericId = parseId(id)
  if (!numericId)
    return NextResponse.json({ error: "Invalid expense ID." }, { status: 400 })

  let bodyWithOldData: UpdateExpenseDataWithDecrement
  try {
    bodyWithOldData = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const { old_amount, old_payment_method_id, ...body } = bodyWithOldData

  // 1. REVERT: Add the old amount back to the old payment method
  const { error: revertError } = await supabase.rpc("decrement_balance", {
    payment_mode: old_payment_method_id,
    amount: -old_amount, // Negative decrement = Increment
  })

  if (revertError) {
    return NextResponse.json({ error: revertError.message }, { status: 500 })
  }

  // 2. APPLY: Subtract the new amount from the (possibly new) payment method
  // We use body.payment_mode (new ID) and body.amount (new amount)
  if (body.payment_mode && body.amount) {
    const { error: applyError } = await supabase.rpc("decrement_balance", {
      payment_mode: body.payment_mode,
      amount: body.amount,
    })

    if (applyError) {
      // Critical: If this fails, the DB is now in an inconsistent state (money added back but not re-deducted)
      console.error("Balance deduction failed after revert!")
    }
  }

  // 3. Update the Expense record
  const { data, error } = await supabase
    .from("Expenses")
    .update(body)
    .eq("id", numericId)
    .select()
    .single()

  if (error) {
    console.error(`[PATCH /api/logs/${id}] Supabase error:`, error.message)
    const status = error.code === "PGRST116" ? 404 : 500
    return NextResponse.json({ error: error.message }, { status })
  }

  return NextResponse.json(data)
}

// DELETE /api/logs/:id
export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params
  const supabase = getSupabase()
  if (!supabase) return missingCreds()

  const numericId = parseId(id)
  if (!numericId)
    return NextResponse.json({ error: "Invalid expense ID." }, { status: 400 })

  const { error } = await supabase.from("Expenses").delete().eq("id", numericId)

  if (error) {
    console.error(`[DELETE /api/logs/${id}] Supabase error:`, error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
