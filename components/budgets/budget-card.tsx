"use client"

import { Budget } from "@/lib/types"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useCategory } from "@/hooks/use-category"
import {
  abbreviate,
  formatToLocalDate,
  getDateRange,
  getStatusColor,
} from "@/lib/utils"
import { useTotal } from "@/hooks/use-total"
import { useCallback, useMemo, useState } from "react"
import { DateRange } from "react-day-picker"
import { Field, FieldLabel } from "@/components/ui/field"
import { useCurrency } from "@/hooks/use-currency"
import { Skeleton } from "@/components/ui/skeleton"
import { useMediaQuery } from "@/hooks/use-media-query"
import { BudgetActionMenu } from "./budget-action-menu"
import { useRouter } from "next/navigation"

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
        <Skeleton className="h-[57.25px] w-full" />
      </CardContent>
    </Card>
  )
}

export function BudgetCard({
  budget,
  onEdit,
}: {
  budget: Budget
  onEdit: () => void
}) {
  const { budget_amount, category_id, period } = budget
  const { found, emoji, label } = useCategory(category_id)
  const { currency } = useCurrency()
  const [showBudget, setShowBudget] = useState<boolean>(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const router = useRouter()

  const { from, to } = useMemo<DateRange>(
    () => getDateRange({ period }),
    [period]
  )

  const { totals, loading, error } = useTotal({
    from,
    to,
    categoryId: category_id.toString(),
    excludeIncome: true,
  })

  const spentDuringPeriod = useMemo<number>(() => {
    if (totals.length === 0) return 0

    return totals.find((t) => t.transaction_type === "expense")?.sum || 0
  }, [totals])

  const percentage = useMemo<number>(
    () => Math.floor((spentDuringPeriod / budget_amount) * 100),
    [budget_amount, spentDuringPeriod]
  )

  const onToggleLimit = useCallback(() => {
    if (isDesktop) return

    setShowBudget((shown) => !shown)
  }, [isDesktop, setShowBudget])

  const cellValue = useMemo<string>(() => {
    let res = currency.symbol

    if (isDesktop) {
      res += abbreviate(spentDuringPeriod)
    } else {
      if (showBudget) {
        res += abbreviate(budget_amount)
      } else {
        res += abbreviate(spentDuringPeriod)
      }
    }

    return res
  }, [budget_amount, currency, isDesktop, showBudget, spentDuringPeriod])

  const link = useMemo<string>(() => {
    const params = new URLSearchParams({
      categoryId: category_id.toString(),
    })

    if (from && to) {
      params.set("from", formatToLocalDate(from))
      params.set("to", formatToLocalDate(to))
    }

    return `/logs?${params.toString()}`
  }, [category_id, from, to])

  if (!found) return null

  return loading ? (
    <BudgetCardSkeleton />
  ) : (
    <Card className="w-full" onClick={onToggleLimit}>
      <CardHeader>
        <CardTitle className="overflow-hidden font-semibold text-ellipsis">
          {emoji} {label}
        </CardTitle>
        <CardDescription className="font-medium">
          {calculateTimeRemaining(period)} days left
        </CardDescription>
        <CardAction>
          <BudgetActionMenu
            onViewLogs={() => router.replace(link)}
            onEdit={onEdit}
          />
        </CardAction>
      </CardHeader>
      <CardContent>
        <Field className="w-full max-w-sm">
          <FieldLabel>
            <div className="flex w-full items-end gap-1">
              <span className="text-2xl font-semibold tabular-nums">
                {cellValue}
              </span>
              {!isDesktop && !showBudget && (
                <span className="text-md mb-0.5 text-muted-foreground tabular-nums">
                  ({percentage}%)
                </span>
              )}
              {isDesktop && (
                <span className="mb-0.5">
                  of {currency.symbol}
                  {abbreviate(budget_amount)}
                </span>
              )}
            </div>
          </FieldLabel>
          <Progress
            value={percentage}
            className="my-1.5 h-2 w-full"
            style={{ color: getStatusColor(percentage) }}
          />
        </Field>
      </CardContent>
    </Card>
  )
}
