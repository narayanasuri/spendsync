import { z } from "zod"

export const logSchema = z.object({
  transaction_type: z.literal(["expense", "income"]),
  name: z.string().min(1, "Log title is required."),
  amount: z
    .string()
    .min(1, "Amount is required.")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, {
      message: "Amount must be greater than 0.",
    })
    .transform((v) => parseFloat(v)),
  description: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  payment_mode: z.string().min(1, "Please select a payment mode"),
  paid_by: z.string().nullable(),
  spent_at: z.date({ message: "Please select a date." }),
})

export type LogFormInput = z.input<typeof logSchema>

export type LogFormValues = z.output<typeof logSchema>
