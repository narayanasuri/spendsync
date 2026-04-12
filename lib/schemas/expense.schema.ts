import { z } from "zod"
import { CategoryEnum, PaymentModeEnum } from "@/lib/enums"

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
  category: z.nativeEnum(CategoryEnum, {
    message: "Please select a category.",
  }),
  payment_mode: z.nativeEnum(PaymentModeEnum, {
    message: "Please select a payment mode.",
  }),
  spent_at: z.date({ message: "Please select a date." }),
})

// Input type (what the form fields hold — amount is a string)
export type ExpenseFormInput = z.input<typeof expenseSchema>

// Output type (after validation/transform — amount is a number)
export type ExpenseFormValues = z.output<typeof expenseSchema>
