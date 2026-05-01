"use client"

import { UserSelect } from "@/components/shared/user-select"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { useLastSelectedUser } from "@/hooks/use-last-selected-user"
import { LogFormInput, LogFormValues } from "@/lib/schemas/expense.schema"
import { Controller, useFormContext, useWatch } from "react-hook-form"

export const PaidBySelect = () => {
  const methods = useFormContext<LogFormInput, unknown, LogFormValues>()
  const {
    control,
    formState: { errors },
  } = methods
  const transactionType = useWatch({ control, name: "transaction_type" })
  const { updateUser } = useLastSelectedUser()

  if (transactionType === "income") return null

  return (
    <Field>
      <FieldLabel htmlFor="paid_by">Paid by</FieldLabel>
      <Controller
        control={control}
        name="paid_by"
        render={({ field }) => (
          <UserSelect
            value={field.value || "1"}
            onChange={(val) => {
              updateUser(parseInt(val))
              field.onChange(val)
            }}
          />
        )}
      />
      {errors.payment_mode && (
        <FieldError>{errors.payment_mode.message}</FieldError>
      )}
    </Field>
  )
}
