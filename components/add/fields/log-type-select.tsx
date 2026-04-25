"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { LogFormInput, LogFormValues } from "@/lib/schemas/expense.schema"
import { Controller, useFormContext } from "react-hook-form"
import { LogTypeSelect as LogTypeSelectRaw } from "@/components/shared/log-type-select"

export function LogTypeSelect() {
  const methods = useFormContext<LogFormInput, unknown, LogFormValues>()
  const {
    control,
    formState: { errors },
  } = methods
  return (
    <Field>
      <FieldLabel htmlFor="transaction_type">Log Type</FieldLabel>
      <Controller
        control={control}
        name="transaction_type"
        render={({ field }) => (
          <LogTypeSelectRaw value={field.value} onChange={field.onChange} />
        )}
      />
      {errors.transaction_type && (
        <FieldError>{errors.transaction_type.message}</FieldError>
      )}
    </Field>
  )
}
