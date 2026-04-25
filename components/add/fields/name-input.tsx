"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { LogFormInput, LogFormValues } from "@/lib/schemas/expense.schema"
import { useFormContext } from "react-hook-form"

export function NameInput() {
  const methods = useFormContext<LogFormInput, unknown, LogFormValues>()
  const {
    register,
    formState: { errors },
  } = methods
  return (
    <Field>
      <FieldLabel htmlFor="title">Title</FieldLabel>
      <Input
        id="title"
        placeholder="e.g. Dinner"
        {...register("name")}
        autoFocus
      />
      {errors.name && <FieldError>{errors.name.message}</FieldError>}
    </Field>
  )
}
