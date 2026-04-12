import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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

import { TimeRangeEnum } from "./enums"

export type DateRange = { from: string; to: string }

// Returns YYYY-MM-DD strings — the API expands them to UTC start/end of day
export function resolveDateRange(range: TimeRangeEnum): DateRange {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

  switch (range) {
    case TimeRangeEnum.THIS_WEEK: {
      const start = new Date(now)
      start.setDate(now.getDate() - now.getDay())
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      return { from: fmt(start), to: fmt(end) }
    }
    case TimeRangeEnum.THIS_MONTH: {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      return { from: fmt(start), to: fmt(end) }
    }
    case TimeRangeEnum.PAST_WEEK: {
      const start = new Date(now)
      start.setDate(now.getDate() - now.getDay() - 7)
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      return { from: fmt(start), to: fmt(end) }
    }
    case TimeRangeEnum.PAST_MONTH: {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const end = new Date(now.getFullYear(), now.getMonth(), 0)
      return { from: fmt(start), to: fmt(end) }
    }
  }
}
