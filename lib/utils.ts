import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { DateRange as DayPickerDateRange } from "react-day-picker"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function abbreviate(value: number) {
  const negative = value < 0
  const absolute = negative ? value * -1 : value
  const sign = negative ? "-" : ""

  if (absolute < 1000) {
    return `${sign}${absolute.toFixed(1)}`
  } else if (absolute < 1_000_000) {
    return `${sign}${(absolute / 1000).toFixed(1)}k`
  }
  return `${sign}${(absolute / 1_000_000).toFixed(1)}m`
}

import { startOfMonth, startOfWeek, startOfYear } from "date-fns"

export type DateRange = { from: string; to: string }

export function formatDateToString(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// Parse YYYY-MM-DD as local date (not UTC) for the calendar display
export function parseLocalDate(str: string): Date {
  const [y, m, d] = str.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function getDateRangeForPreset(
  preset: "weekly" | "monthly" | "yearly"
): DayPickerDateRange {
  const DATE_NOW = new Date()

  if (preset === "weekly") {
    return {
      from: startOfWeek(DATE_NOW),
      to: DATE_NOW,
    }
  } else if (preset === "monthly") {
    return {
      from: startOfMonth(DATE_NOW),
      to: DATE_NOW,
    }
  }

  return {
    from: startOfYear(DATE_NOW),
    to: DATE_NOW,
  }
}
