"use client"

import { Budget } from "@/lib/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useCategory } from "@/hooks/use-category"
import { getDateRange } from "@/lib/utils"
import { useTotal } from "@/hooks/use-total"
import { useMemo } from "react"
import { DateRange } from "react-day-picker"
import { Field, FieldLabel } from "@/components/ui/field"
import { useCurrency } from "@/hooks/use-currency"
import { Skeleton } from "@/components/ui/skeleton"

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

export function BudgetCardSkeleton() {
  return (
    <Card className="w-full md:basis-1/2">
      <CardHeader>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-11 w-full" />
      </CardContent>
    </Card>
  )
}

export function BudgetCard({ budget }: { budget: Budget }) {
  const { budget_amount, category_id, period } = budget
  const { found, emoji, label } = useCategory(category_id)
  const { currency } = useCurrency()

  const { from, to } = useMemo<DateRange>(
    () => getDateRange({ period }),
    [period]
  )

  const { totals, loading, error } = useTotal({
    from,
    to,
    categoryId: category_id.toString(),
  })

  const spentDuringPeriod = useMemo<number>(() => {
    if (totals.length === 0) return 0

    return totals.find((t) => t.transaction_type === "expense")?.sum || 0
  }, [totals])

  const percentage = useMemo<number>(() => {
    const calculated = Math.floor((spentDuringPeriod / budget_amount) * 100)

    if (calculated > 100) return 100

    return calculated
  }, [budget_amount, spentDuringPeriod])

  if (!found) return null

  return loading ? (
    <BudgetCardSkeleton />
  ) : (
    <Card className="mb-3 w-full">
      <CardHeader>
        <CardTitle className="font-semibold">
          {emoji} {label}
        </CardTitle>
        <CardDescription className="font-medium">
          {calculateTimeRemaining(period)} days left
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Field className="w-full max-w-sm">
          <FieldLabel>
            <span>
              {currency.symbol}
              {spentDuringPeriod} / {currency.symbol}
              {budget_amount}
            </span>
            {/* <span className="ml-auto">{percentage}% spent</span> */}
          </FieldLabel>
          <Progress value={percentage} className="my-1.5 h-2 w-full" />
        </Field>
      </CardContent>
    </Card>
  )
}
