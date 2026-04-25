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

export const LOCAL_DATE_FORMAT = "yyyy-MM-dd"

export const TIMESTAMP_FORMAT = "yyyy-MM-dd HH:mm:ssXX"

export const COLORS = [
  {
    label: "Icy Blue",
    value: "#B8D6FB",
  },
  {
    label: "Pale Oak",
    value: "#D9C5A0",
  },
  {
    label: "Blue Bell",
    value: "#279BF4",
  },
  {
    label: "Soft Blush",
    value: "#FBE4DD",
  },
  {
    label: "Lavender Blush",
    value: "#EDE0E7",
  },
  {
    label: "True Lilac",
    value: "#C8A2C8",
  },
  {
    label: "Sweet Salmon",
    value: "#FF9A86",
  },
  {
    label: "Medium Slate Blue",
    value: "#6D7BF1",
  },
  {
    label: "Light Gold",
    value: "#E5D38A",
  },
  {
    label: "Sandy Clay",
    value: "#F1AF8A",
  },
  {
    label: "Toasted Almond",
    value: "#C38C5C",
  },
  {
    label: "Dusk Blue",
    value: "#2E4B7B",
  },
  {
    label: "Palm Leaf",
    value: "#87987B",
  },
  {
    label: "Baby Blue Ice",
    value: "#84B4EB",
  },
  {
    label: "Apricot Cream",
    value: "#F9C976",
  },
]

export const SIGNAL_COLORS = {
  OPTIMAL: "#4ade80",
  NORMAL: "#93c5fd",
  WARNING: "#fcd34d",
  CRITICAL: "#f87171",
}
