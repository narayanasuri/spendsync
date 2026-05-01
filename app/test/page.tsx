"use client"

import { formatToLocalDate } from "@/lib/utils"
import { format, parse } from "date-fns"

export default () => {
  const date = new Date()
  const str = formatToLocalDate(date)
  const formatted = format(date, "yyyy-MM-dd")
  const parsed = parse(str, "yyyy-MM-dd", new Date())

  return (
    <p>
      {str} {formatted}
    </p>
  )
}
