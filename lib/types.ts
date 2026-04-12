import type { TablesInsert } from "./database.types"

export type OptionType = {
  label: string
  value: string
}

export type ExpenseInsert = TablesInsert<"Expenses">
