"use client"

import { formatDate } from "@/lib/utils"
import { format, parse } from "date-fns"

export default function TestPage() {
  const date = new Date()
  const str = formatDate(date)
  const formatted = format(date, "yyyy-MM-dd")
  const parsed = parse(str, "yyyy-MM-dd", new Date())

  return (
    <p>
      {str} {formatted}
    </p>
  )
}
