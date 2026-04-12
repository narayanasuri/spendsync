import { z } from "zod"
import { CATEGORIES, PAYMENT_MODES } from "@/config"

const categoryValues = CATEGORIES.map((c) => c.value) as [string, ...string[]]
const paymentModeValues = PAYMENT_MODES.map((p) => p.value) as [
  string,
  ...string[],
]

export const expenseSchema = z.object({
  name: z.string().min(1, "Expense title is required."),
  amount: z
    .string()
    .min(1, "Amount is required.")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, {
      message: "Amount must be greater than 0.",
    })
    .transform((v) => parseFloat(v)),
  description: z.string().optional(),
  category: z.enum(categoryValues, {
    message: "Please select a category.",
  }),
  payment_mode: z.enum(paymentModeValues, {
    message: "Please select a payment mode.",
  }),
  spent_at: z.date({ message: "Please select a date." }),
})

export type ExpenseFormInput = z.input<typeof expenseSchema>
export type ExpenseFormValues = z.output<typeof expenseSchema>
