/**
 * Derived from config.ts — do not edit by hand.
 * Add/remove categories and payment modes in config.ts instead.
 */
import { CATEGORIES, PAYMENT_MODES } from "@/config"

// Build union-enum-like objects from config so the rest of the app
// can keep using  CategoryEnum.DINEOUT  /  PaymentModeEnum.ZEN  etc.
export const CategoryEnum = Object.fromEntries(
  CATEGORIES.map((c) => [c.value.toUpperCase(), c.value])
) as Record<string, string>

export const PaymentModeEnum = Object.fromEntries(
  PAYMENT_MODES.map((p) => [p.value.toUpperCase(), p.value])
) as Record<string, string>

// Keep TimeRangeEnum here — it's not user-configurable
export enum TimeRangeEnum {
  THIS_WEEK = "this_week",
  THIS_MONTH = "this_month",
  PAST_WEEK = "past_week",
  PAST_MONTH = "past_month",
}
