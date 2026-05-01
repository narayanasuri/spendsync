"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { useCurrency } from "@/hooks/use-currency"
import { LogFormInput, LogFormValues } from "@/lib/schemas/expense.schema"
import { useFormContext } from "react-hook-form"

export const AmountInput = () => {
  const methods = useFormContext<LogFormInput, unknown, LogFormValues>()
  const { currency } = useCurrency()
  const {
    register,
    formState: { errors },
  } = methods

  return (
    <Field>
      <FieldLabel htmlFor="amount">Amount</FieldLabel>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>{currency.symbol}</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          id="amount"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="200.00"
          {...register("amount")}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupText>{currency.shortLabel}</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      {errors.amount && <FieldError>{errors.amount.message}</FieldError>}
    </Field>
  )
}
