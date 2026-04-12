/**
 * ─────────────────────────────────────────────
 *  APP CONFIG  –  edit this file to customise
 *  your fork without touching anything else.
 * ─────────────────────────────────────────────
 *
 * APP_NAME   – shown in the navbar and login page
 *
 * CURRENCY   – currency symbol prefix  (e.g. "₹", "$", "€")
 * LOCALE     – date/number formatting  (e.g. "en-IN", "en-US")
 * TIMEZONE   – display timezone        (e.g. "UTC", "Asia/Kolkata", "America/New_York")
 *
 * CATEGORIES
 *   value    – stored in the database (keep lowercase, no spaces)
 *   label    – shown in the UI
 *   icon     – any Lucide icon        (https://lucide.dev/icons)
 *   budget   – optional monthly spend limit
 *
 * PAYMENT MODES
 *   value    – stored in the database (keep lowercase, no spaces)
 *   label    – shown in the UI
 *   logoUrl  – path inside /public, or a full URL
 *   fallback – 2-letter avatar fallback
 *   limit    – optional credit limit (omit for debit / cash)
 */

import type { LucideIcon } from "lucide-react"
import {
  CarIcon,
  CircleQuestionMarkIcon,
  FilmIcon,
  HandHelpingIcon,
  HeartPlusIcon,
  MilkIcon,
  PizzaIcon,
  ScooterIcon,
  ShoppingCartIcon,
} from "lucide-react"

// ─── App ─────────────────────────────────────────────────────────────────────

export const APP_NAME = "my expenses" as const

// ─── Settings ────────────────────────────────────────────────────────────────

export const CURRENCY = "$" as const

export const LOCALE = "en-US" as const

export const TIMEZONE = "UTC" as const

// ─── Categories ──────────────────────────────────────────────────────────────

export type CategoryConfig = {
  value: string
  label: string
  icon: LucideIcon
  budget?: number
}

export const CATEGORIES: CategoryConfig[] = [
  { value: "dineout", label: "Dineout", icon: PizzaIcon },
  { value: "takeout", label: "Takeout", icon: ScooterIcon },
  { value: "groceries", label: "Groceries", icon: MilkIcon },
  { value: "health", label: "Health", icon: HeartPlusIcon },
  { value: "entertainment", label: "Entertainment", icon: FilmIcon },
  { value: "transport", label: "Transport", icon: CarIcon },
  { value: "shopping", label: "Shopping", icon: ShoppingCartIcon },
  { value: "services", label: "Services", icon: HandHelpingIcon },
  { value: "misc", label: "Misc", icon: CircleQuestionMarkIcon },
]

// ─── Payment modes ────────────────────────────────────────────────────────────

export type PaymentModeConfig = {
  value: string
  label: string
  logoUrl: string
  fallback: string
  limit?: number
}

export const PAYMENT_MODES: PaymentModeConfig[] = [
  { value: "cash", label: "Cash", logoUrl: "", fallback: "CA" },
  { value: "debit", label: "Debit Card", logoUrl: "", fallback: "DB" },
  {
    value: "credit",
    label: "Credit Card",
    logoUrl: "",
    fallback: "CC",
    limit: 5000,
  },
]
