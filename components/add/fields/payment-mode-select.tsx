"use client"

import { PaymentModeSelect as PaymentModeSelectRaw } from "@/components/shared/payment-mode-select"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { LogFormInput, LogFormValues } from "@/lib/schemas/expense.schema"
import { Controller, useFormContext } from "react-hook-form"

export const PaymentModeSelect = () => {
  const methods = useFormContext<LogFormInput, unknown, LogFormValues>()
  const {
    control,
    formState: { errors },
  } = methods

  return (
    <Field>
      <FieldLabel htmlFor="paymentMode">Payment Mode</FieldLabel>
      <Controller
        control={control}
        name="payment_mode"
        render={({ field }) => (
          <PaymentModeSelectRaw value={field.value} onChange={field.onChange} />
        )}
      />
      {errors.payment_mode && (
        <FieldError>{errors.payment_mode.message}</FieldError>
      )}
    </Field>
  )
}
