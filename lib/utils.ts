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

export function resolveDateRange(range: TimeRangeEnum): DateRange {
  const now = new Date()

  switch (range) {
    case TimeRangeEnum.THIS_WEEK: {
      // Sunday 00:00:00 to Saturday 23:59:59 of the current week
      const start = new Date(now)
      start.setDate(now.getDate() - now.getDay())
      start.setHours(0, 0, 0, 0)
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      end.setHours(23, 59, 59, 999)
      return { from: start.toISOString(), to: end.toISOString() }
    }
    case TimeRangeEnum.THIS_MONTH: {
      // 1st 00:00:00 to last day 23:59:59 of the current month
      const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
      const end = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      )
      return { from: start.toISOString(), to: end.toISOString() }
    }
    case TimeRangeEnum.PAST_WEEK: {
      // Sunday 00:00:00 to Saturday 23:59:59 of last week
      const start = new Date(now)
      start.setDate(now.getDate() - now.getDay() - 7)
      start.setHours(0, 0, 0, 0)
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      end.setHours(23, 59, 59, 999)
      return { from: start.toISOString(), to: end.toISOString() }
    }
    case TimeRangeEnum.PAST_MONTH: {
      // 1st 00:00:00 to last day 23:59:59 of last month
      const start = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1,
        0,
        0,
        0,
        0
      )
      const end = new Date(
        now.getFullYear(),
        now.getMonth(),
        0,
        23,
        59,
        59,
        999
      )
      return { from: start.toISOString(), to: end.toISOString() }
    }
  }
}
