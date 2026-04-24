import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { DateRange } from "react-day-picker"
import {
  addMonths,
  format,
  isBefore,
  parse,
  parseISO,
  set,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns"
import { LOCAL_DATE_FORMAT } from "./constants"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

/**
 * Abbreviates amounts like 15,000 to 15k
 * @param value the number to be abbreviated
 * @returns the shortened abbreviated notation
 */
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

/**
 * Formats date object to local string format
 * @param d date object
 * @returns date string in LOCAL_DATE_FORMAT (yyyy-MM-dd)
 */
export const formatToLocalDate = (d: Date): string =>
  format(d, LOCAL_DATE_FORMAT)

/**
 * Parses local date string to Date object
 * @param dateString date string in the LOCAL_DATE_FORMAT (yyyy-MM-dd)
 * @returns date object
 */
export const parseLocalDate = (dateString: string): Date =>
  parse(dateString, LOCAL_DATE_FORMAT, new Date())

/**
 * Parses local date string to Date object
 * @param dateString timestamp - 2026-03-30 23:30:10+00
 * @returns date object
 */
export const parseTimestamp = (timestamp: string): Date =>
  parseISO(timestamp.split("+")[0])

/**
 * Gets the period and returns start and end dates
 * @param period period of time - "weekly" | "monthly" | "yearly"
 * @param endDate the date from which the period should be calculated backwards
 * @param excludePastPeriod whether to start from the beginning of the month or 30 days behind endDate
 * @returns date range containing `from` and `to` dates
 */
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
      from: excludePastPeriod ? startOfMonth(endDate) : subMonths(endDate, 1),
      to: endDate,
    }
  }

  return {
    from: excludePastPeriod ? startOfYear(endDate) : subYears(endDate, 1),
    to: endDate,
  }
}

/**
 * Gets the upcoming date for the target day of the month
 * @param targetDay target day of the month (e.g. 23)
 * @returns a Date object which is the upcoming date with day of month equal to targetDay
 */
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
