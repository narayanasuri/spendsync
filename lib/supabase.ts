import { createClient } from "@supabase/supabase-js"
import type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "./database.types"

type Expense = Tables<"Expenses">
type ExpenseInsert = TablesInsert<"Expenses">
type ExpenseUpdate = TablesUpdate<"Expenses">

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// --- Expenses ---

export async function getExpenses(): Promise<Expense[]> {
  const { data, error } = await supabase
    .from("Expenses")
    .select("*")
    .order("spent_at", { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createExpense(expense: ExpenseInsert): Promise<Expense> {
  const { data, error } = await supabase
    .from("Expenses")
    .insert(expense)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateExpense(
  id: number,
  expense: ExpenseUpdate
): Promise<Expense> {
  const { data, error } = await supabase
    .from("Expenses")
    .update(expense)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteExpense(id: number): Promise<void> {
  const { error } = await supabase.from("Expenses").delete().eq("id", id)
  if (error) throw error
}
