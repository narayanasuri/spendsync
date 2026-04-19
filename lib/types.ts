import type { TablesInsert } from "./database.types"
import type { Tables } from "./database.types"

export type OptionType = {
  label: string
  value: string
}

export type CategoryDraftType = {
  icon: string
  category: string
  type: "income" | "expense"
}

export type Expense = Tables<"Expenses">

export type TransactionType = Expense["transaction_type"]

export type ExpenseInsert = TablesInsert<"Expenses">

export type Category = Tables<"Categories">

export type PaymentMethod = Tables<"PaymentMethods">

export type User = Tables<"Users">

export type Budget = Tables<"Budgets">

export type TotalItem = {
  transaction_type: "expense" | "income"
  sum: number
}

export type CurrencyType = {
  id: number
  shortLabel: string
  fullLabel: string
  symbol: string
  flag: string
}

export type LastSelectedType = {
  categoryId: number | null
  paymentMethodId: number | null
  userId: number | null
}
