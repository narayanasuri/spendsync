"use client"

import { Button } from "@/components/ui/button"
import { DateRangeInput } from "@/components/logs/filter-fields/date-range-input"
import { Field, FieldLabel } from "@/components/ui/field"
import { FilterBarProps } from "../filter-bar"
import { PaymentModeSelect } from "@/components/shared/payment-mode-select"
import { CategorySelect } from "@/components/shared/category-select"
import { LogTypeSelect } from "@/components/shared/log-type-select"

export const FilterFields = ({
  dateRange,
  setDateRange,
  category,
  setCategory,
  paymentMode,
  setPaymentMode,
  transactionType,
  setTransactionType,
  onClear,
}: FilterBarProps) => {
  const hasFilters =
    category !== "all" || paymentMode !== "all" || transactionType !== "all"

  return (
    <>
      <Field>
        <FieldLabel>Time Range</FieldLabel>
        <DateRangeInput value={dateRange} onChange={setDateRange} />
      </Field>
      <Field>
        <FieldLabel htmlFor="category">Category</FieldLabel>
        <CategorySelect
          value={category}
          onChange={setCategory}
          allowSelectAll
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="paymentMode">Payment mode</FieldLabel>
        <PaymentModeSelect
          value={paymentMode}
          onChange={setPaymentMode}
          allowSelectAll
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="transactionType">Type</FieldLabel>
        <LogTypeSelect
          value={
            ["all", "expense", "income"].includes(transactionType)
              ? (transactionType as "all" | "expense" | "income")
              : "all"
          }
          onChange={setTransactionType}
          allowSelectAll
        />
      </Field>
      <Button
        variant="ghost"
        size="sm"
        className="self-end"
        onClick={onClear}
        disabled={!hasFilters}
      >
        Clear filters
      </Button>
    </>
  )
}
