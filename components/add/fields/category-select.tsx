"use client"

import { CategorySelect as CategorySelectRaw } from "@/components/shared/category-select"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { LogFormInput, LogFormValues } from "@/lib/schemas/expense.schema"
import { Controller, useFormContext, useWatch } from "react-hook-form"

export function CategorySelect() {
  const methods = useFormContext<LogFormInput, unknown, LogFormValues>()
  const {
    control,
    formState: { errors },
  } = methods
  const transactionType = useWatch({ control, name: "transaction_type" })
  return (
    <Field>
      <FieldLabel htmlFor="category">Category</FieldLabel>
      <Controller
        control={control}
        name="category"
        render={({ field }) => (
          <CategorySelectRaw
            value={field.value}
            onChange={field.onChange}
            transactionType={
              transactionType as "expense" | "income" | undefined
            }
          />
        )}
      />
      {errors.category && <FieldError>{errors.category.message}</FieldError>}
    </Field>
  )
}
