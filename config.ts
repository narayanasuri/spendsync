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
export const CURRENCY = "₹" as const

export const LOCALE = "en-IN" as const

export const TIMEZONE = "UTC" as const

// ─── Categories ──────────────────────────────────────────────────────────────

export type CategoryConfig = {
  value: string
  label: string
  icon: LucideIcon
  budget?: number
}

export const CATEGORIES: CategoryConfig[] = [
  { value: "dineout", label: "Dineout", icon: PizzaIcon, budget: 6000 },
  { value: "takeout", label: "Takeout", icon: ScooterIcon, budget: 4000 },
  { value: "groceries", label: "Groceries", icon: MilkIcon },
  { value: "health", label: "Health", icon: HeartPlusIcon },
  { value: "entertainment", label: "Entertainment", icon: FilmIcon },
  { value: "transport", label: "Transport", icon: CarIcon, budget: 2000 },
  {
    value: "shopping",
    label: "Shopping",
    icon: ShoppingCartIcon,
    budget: 5000,
  },
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
  {
    value: "savings",
    label: "Savings",
    logoUrl: "/phonepe.png",
    fallback: "SV",
  },
  {
    value: "zen",
    label: "Zen",
    logoUrl: "/kotak.png",
    fallback: "ZN",
    limit: 236000,
  },
  {
    value: "neo",
    label: "Neo",
    logoUrl: "/axis.png",
    fallback: "NE",
    limit: 40000,
  },
  {
    value: "myzone",
    label: "MyZone",
    logoUrl: "/axis.png",
    fallback: "MY",
    limit: 40000,
  },
  {
    value: "amazon",
    label: "Amazon",
    logoUrl: "/icici.png",
    fallback: "AM",
    limit: 350000,
  },
  {
    value: "legend",
    label: "Legend",
    logoUrl: "/indusind.png",
    fallback: "LG",
    limit: 75000,
  },
]
