"use client"

import { FieldGroup, FieldSet } from "@/components/ui/field"
import { LogTypeSelect } from "./fields/log-type-select"
import { NameInput } from "./fields/name-input"
import { AmountInput } from "./fields/amount-input"
import { DescriptionInput } from "./fields/description-input"
import { CategorySelect } from "./fields/category-select"
import { PaymentModeSelect } from "./fields/payment-mode-select"
import { PaidBySelect } from "./fields/paid-by-select"
import { TimestampSelect } from "./fields/timestamp-select"

export function NewLogForm() {
  return (
    <FieldSet className="w-full">
      <FieldGroup className="pb-3">
        <LogTypeSelect />
        <NameInput />
        <AmountInput />
        <DescriptionInput />
        <CategorySelect />
        <PaymentModeSelect />
        <PaidBySelect />
        <TimestampSelect />
      </FieldGroup>
    </FieldSet>
  )
}
