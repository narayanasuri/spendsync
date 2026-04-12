/**
 * Derived from config.ts — do not edit by hand.
 * Add/remove categories and payment modes in config.ts instead.
 */
import { CATEGORIES, PAYMENT_MODES } from "@/config"
import { TimeRangeEnum } from "./enums"
import type { OptionType } from "./types"

export const CATEGORY_OPTIONS: OptionType[] = CATEGORIES.map((c) => ({
  label: c.label,
  value: c.value,
}))

export const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c.label])
)

export const PAYMENT_MODE_OPTIONS: OptionType[] = PAYMENT_MODES.map((p) => ({
  label: p.label,
  value: p.value,
}))

export const PAYMENT_MODE_LABEL: Record<string, string> = Object.fromEntries(
  PAYMENT_MODES.map((p) => [p.value, p.label])
)

/** Categories that have a budget set in config.ts */
export const BUDGET_LIMITS: Record<string, number> = Object.fromEntries(
  CATEGORIES.filter((c) => c.budget != null).map((c) => [c.value, c.budget!])
)

/** Payment modes that have a credit limit set in config.ts */
export const CARD_LIMITS: Record<string, number> = Object.fromEntries(
  PAYMENT_MODES.filter((p) => p.limit != null).map((p) => [p.value, p.limit!])
)

export const TIME_RANGE_LABEL: Record<TimeRangeEnum, string> = {
  [TimeRangeEnum.THIS_WEEK]: "This Week",
  [TimeRangeEnum.THIS_MONTH]: "This Month",
  [TimeRangeEnum.PAST_WEEK]: "Past Week",
  [TimeRangeEnum.PAST_MONTH]: "Past Month",
}

export const TIME_RANGE_OPTIONS: OptionType[] = [
  {
    label: TIME_RANGE_LABEL[TimeRangeEnum.THIS_WEEK],
    value: TimeRangeEnum.THIS_WEEK,
  },
  {
    label: TIME_RANGE_LABEL[TimeRangeEnum.THIS_MONTH],
    value: TimeRangeEnum.THIS_MONTH,
  },
  {
    label: TIME_RANGE_LABEL[TimeRangeEnum.PAST_WEEK],
    value: TimeRangeEnum.PAST_WEEK,
  },
  {
    label: TIME_RANGE_LABEL[TimeRangeEnum.PAST_MONTH],
    value: TimeRangeEnum.PAST_MONTH,
  },
]
