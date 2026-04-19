"use client"

import { PaymentMethod } from "@/lib/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { useCurrency } from "@/hooks/use-currency"
import { useMemo, useState } from "react"
import { DateRange } from "react-day-picker"
import { getDateRangeForPreset } from "@/lib/utils"
import { useTotal } from "@/hooks/use-total"
import { Field, FieldLabel } from "../ui/field"
import { Progress } from "../ui/progress"

function calculateTimeRemaining(period: "weekly" | "monthly" | "yearly") {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const day = now.getDate()

  let daysLeft = 0

  if (period === "weekly") {
    const today = now.getDay()
    daysLeft = 6 - today
  } else if (period === "monthly") {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    daysLeft = daysInMonth - day
  } else {
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
    const daysInYear = isLeapYear ? 366 : 365
    daysLeft = daysInYear - (day + month * 30)
  }

  return daysLeft
}

export function CreditLimitCard({
  paymentMethod,
}: {
  paymentMethod: PaymentMethod
}) {
  const { id, balance, name } = paymentMethod
  const { currency } = useCurrency()
  const [hidden, setHidden] = useState<boolean>(true)

  const { from, to } = useMemo<DateRange>(() => {
    return getDateRangeForPreset("monthly")
  }, [])

  const { totals, loading, error } = useTotal({
    from,
    to,
    paymentId: id.toString(),
  })

  const spentDuringPeriod = useMemo<number>(() => {
    if (totals.length === 0) return 0

    return totals.find((t) => t.transaction_type === "expense")?.sum || 0
  }, [totals])

  const percentage = useMemo<number>(() => {
    if (!balance) return 0

    const calculated = Math.floor((spentDuringPeriod / balance) * 100)

    if (calculated > 100) return 100

    return calculated
  }, [balance, spentDuringPeriod])

  return (
    <Card size="sm" className="mb-3 w-full">
      <CardHeader>
        <CardTitle>
          <span className="text-sm text-muted-foreground">{name}</span>
        </CardTitle>
        <CardDescription>
          {calculateTimeRemaining("monthly")} days left
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Field className="w-full max-w-sm">
          <FieldLabel>
            <span>
              {currency.symbol}
              {spentDuringPeriod} / {currency.symbol}
              {balance}
            </span>
            {/* <span className="ml-auto">{percentage}% spent</span> */}
          </FieldLabel>
          <Progress value={percentage} className="my-1.5 h-2 w-full" />
        </Field>
      </CardContent>
    </Card>
  )
}
