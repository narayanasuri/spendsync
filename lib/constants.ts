import type { CurrencyType } from "./types"

export const APP_NAME = "spendsync"

export const CURRENCIES: CurrencyType[] = [
  {
    id: 1,
    shortLabel: "USD",
    fullLabel: "United States Dollar",
    symbol: "$",
    flag: "🇺🇸",
  },
  {
    id: 2,
    shortLabel: "EUR",
    fullLabel: "Euro",
    symbol: "€",
    flag: "🇪🇺",
  },
  {
    id: 3,
    shortLabel: "GBP",
    fullLabel: "British Pound Sterling",
    symbol: "£",
    flag: "🇬🇧",
  },
  {
    id: 4,
    shortLabel: "JPY",
    fullLabel: "Japanese Yen",
    symbol: "¥",
    flag: "🇯🇵",
  },
  {
    id: 5,
    shortLabel: "AUD",
    fullLabel: "Australian Dollar",
    symbol: "A$",
    flag: "🇦🇺",
  },
  {
    id: 6,
    shortLabel: "CAD",
    fullLabel: "Canadian Dollar",
    symbol: "C$",
    flag: "🇨🇦",
  },
  {
    id: 7,
    shortLabel: "CHF",
    fullLabel: "Swiss Franc",
    symbol: "Fr.",
    flag: "🇨🇭",
  },
  {
    id: 8,
    shortLabel: "CNY",
    fullLabel: "Chinese Yuan",
    symbol: "¥",
    flag: "🇨🇳",
  },
  {
    id: 9,
    shortLabel: "INR",
    fullLabel: "Indian Rupee",
    symbol: "₹",
    flag: "🇮🇳",
  },
  {
    id: 10,
    shortLabel: "BRL",
    fullLabel: "Brazilian Real",
    symbol: "R$",
    flag: "🇧🇷",
  },
]

export const DATE_FORMAT = "yyyy-MM-dd"

export const LOCALE = "en-IN" as const

export const TIMEZONE = "UTC" as const
