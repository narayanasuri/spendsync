import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database, TablesUpdate } from "@/lib/database.types"

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

  let body: TablesUpdate<"Expenses">
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  // Get the old transaction details from the database (source of truth)
  const { data: oldTransaction, error: fetchError } = await supabase
    .from("Expenses")
    .select("transaction_type, amount, payment_mode")
    .eq("id", numericId)
    .single()

  if (fetchError) {
    const status = fetchError.code === "PGRST116" ? 404 : 500
    return NextResponse.json({ error: fetchError.message }, { status })
  }

  const oldType = oldTransaction.transaction_type
  const oldAmount = oldTransaction.amount
  const oldPaymentMode = oldTransaction.payment_mode

  const newType = body.transaction_type || oldType
  const newAmount = body.amount || oldAmount
  const newPaymentMode = body.payment_mode || oldPaymentMode

  // 1. REVERT: Undo the old transaction's effect on balance
  // If old was expense: add money back (negative decrement)
  // If old was income: remove money (positive decrement)
  const revertAmount = oldType === "expense" ? -oldAmount : oldAmount

  const { error: revertError } = await supabase.rpc("decrement_balance", {
    payment_mode: oldPaymentMode,
    amount: revertAmount,
  })

  if (revertError) {
    return NextResponse.json({ error: revertError.message }, { status: 500 })
  }

  // 2. APPLY: Apply the new transaction's effect on balance
  // If new is expense: subtract money (positive decrement)
  // If new is income: add money (negative decrement)
  const applyAmount = newType === "expense" ? newAmount : -newAmount

  const { error: applyError } = await supabase.rpc("decrement_balance", {
    payment_mode: newPaymentMode,
    amount: applyAmount,
  })

  if (applyError) {
    // Critical: If this fails, the DB is now in an inconsistent state
    console.error("Balance application failed after revert!", applyError)
    return NextResponse.json(
      { error: "Failed to update balance" },
      { status: 500 }
    )
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

  // 1. Get the transaction details before deleting
  const { data: transaction, error: fetchError } = await supabase
    .from("Expenses")
    .select("amount, payment_mode, transaction_type")
    .eq("id", numericId)
    .single()

  if (fetchError) {
    console.error(`[DELETE /api/logs/${id}] Fetch error:`, fetchError.message)
    const status = fetchError.code === "PGRST116" ? 404 : 500
    return NextResponse.json({ error: fetchError.message }, { status })
  }

  // 2. Reimburse the balance
  // If it was an expense: add money back (negative decrement)
  // If it was income: remove money (positive decrement)
  const reimburseAmount =
    transaction.transaction_type === "expense"
      ? -transaction.amount
      : transaction.amount

  const { error: reimburseError } = await supabase.rpc("decrement_balance", {
    payment_mode: transaction.payment_mode,
    amount: reimburseAmount,
  })

  if (reimburseError) {
    console.error(
      `[DELETE /api/logs/${id}] Reimburse error:`,
      reimburseError.message
    )
    return NextResponse.json(
      { error: "Failed to reimburse balance" },
      { status: 500 }
    )
  }

  // 3. Delete the transaction
  const { error } = await supabase.from("Expenses").delete().eq("id", numericId)

  if (error) {
    console.error(`[DELETE /api/logs/${id}] Delete error:`, error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
