import { z } from "zod"

export const logSchema = z.object({
  transaction_type: z.literal(["expense", "income"]),
  name: z.string().min(1, "Title is required."),
  amount: z
    .string()
    .min(1, "Amount is required.")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, {
      message: "Amount must be greater than 0.",
    })
    .transform((v) => parseFloat(v)),
  description: z.string().optional(),
  category: z.string({ error: "Category is required" }),
  payment_mode: z.string({ error: "Payment mode is required" }),
  paid_by: z.string({ error: "Paid by is required" }),
  spent_at: z.date({ message: "Please select a date." }),
})

export type LogFormInput = z.input<typeof logSchema>

export type LogFormValues = z.output<typeof logSchema>
