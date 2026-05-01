"use client"

import { Field, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { LogFormInput, LogFormValues } from "@/lib/schemas/expense.schema"
import { useFormContext } from "react-hook-form"

export const DescriptionInput = () => {
  const methods = useFormContext<LogFormInput, unknown, LogFormValues>()
  const { register } = methods
  return (
    <Field>
      <FieldLabel htmlFor="description">Description</FieldLabel>
      <Textarea
        id="description"
        placeholder="e.g. Pizzas split with Ron and Gwen"
        className="resize-none"
        {...register("description")}
      />
    </Field>
  )
}
