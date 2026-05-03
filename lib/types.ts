import type { TablesInsert, TablesUpdate } from "./database.types"
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

export type ExpenseInsert = TablesInsert<"Expenses">

export type TransactionType = Expense["transaction_type"]

export type Category = Tables<"Categories">

export type CategoryInsert = TablesInsert<"Categories">

export type CategoryUpdate = TablesUpdate<"Categories">

export type PaymentMethod = Tables<"PaymentMethods">

export type User = Tables<"Users">

export type Budget = Tables<"Budgets">

export type DecrementType = {
  decrement: number
  payment_method_id: number
}

export type TotalItem = {
  transaction_type: "expense" | "income"
  sum: number
}

export type GroupedItem<K extends string> = {
  [P in K]: number
} & {
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

export type GroupedLogsType = {
  group: string
  logs: Expense[]
}
