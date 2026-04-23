import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { DateRange } from "react-day-picker"
import {
  addMonths,
  format,
  isBefore,
  parse,
  set,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns"
import { DATE_FORMAT } from "./constants"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const abbreviate = (value: number) => {
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

export const formatDate = (d: Date): string => format(d, DATE_FORMAT)

export const parseDate = (str: string): Date =>
  parse(str, "yyyy-MM-dd", new Date())

export const getDateRange = ({
  period,
  endDate = new Date(),
  excludePastPeriod = true,
}: {
  period: "weekly" | "monthly" | "yearly"
  endDate?: Date
  excludePastPeriod?: boolean
}): DateRange => {
  if (period === "weekly") {
    return {
      from: excludePastPeriod ? startOfWeek(endDate) : subWeeks(endDate, 1),
      to: endDate,
    }
  } else if (period === "monthly") {
    return {
      from: excludePastPeriod ? startOfWeek(endDate) : subMonths(endDate, 1),
      to: endDate,
    }
  }

  return {
    from: excludePastPeriod ? startOfWeek(endDate) : subYears(endDate, 1),
    to: endDate,
  }
}

export const getDateRangeForPreset = (
  preset: "weekly" | "monthly" | "yearly",
  endDate?: Date
): DateRange => {
  const END_DATE = endDate || new Date()

  if (preset === "weekly") {
    return {
      from: startOfWeek(END_DATE),
      to: END_DATE,
    }
  } else if (preset === "monthly") {
    return {
      from: startOfMonth(END_DATE),
      to: END_DATE,
    }
  }

  return {
    from: startOfYear(END_DATE),
    to: END_DATE,
  }
}

export const getUpcomingDateByDay = (targetDay: number): Date => {
  const now = new Date()

  let targetDate = set(now, {
    date: targetDay,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  })

  if (isBefore(targetDate, now)) {
    targetDate = addMonths(targetDate, 1)
  }

  return targetDate
}
