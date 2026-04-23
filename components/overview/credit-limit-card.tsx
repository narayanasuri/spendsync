"use client"

import { PaymentMethod } from "@/lib/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCurrency } from "@/hooks/use-currency"
import { useMemo } from "react"
import { DateRange } from "react-day-picker"
import { getDateRange, getUpcomingDateByDay } from "@/lib/utils"
import { useTotal } from "@/hooks/use-total"
import { Field, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import { differenceInDays, startOfDay } from "date-fns"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty"
import { CircleAlertIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function CreditCardLimitCardSkeleton() {
  return (
    <Card size="sm" className="w-full">
      <CardHeader>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-14 w-full" />
      </CardContent>
    </Card>
  )
}

export function CreditLimitCard({
  paymentMethod,
}: {
  paymentMethod: PaymentMethod
}) {
  const { id, balance, name, due } = paymentMethod
  const { currency } = useCurrency()

  const { from, to } = useMemo<DateRange>(() => {
    return getDateRange({
      period: "monthly",
      endDate: getUpcomingDateByDay(due),
    })
  }, [due])

  const daysLeftUntilDue = useMemo<number>(() => {
    return differenceInDays(
      startOfDay(getUpcomingDateByDay(due)),
      startOfDay(new Date())
    )
  }, [due])

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

  if (error) {
    return (
      <Card size="sm" className="w-full">
        <CardContent>
          <Empty className="h-full">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CircleAlertIcon />
              </EmptyMedia>
              <EmptyDescription className="max-w-xs text-pretty">
                Failed to fetch credit credit card information
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return loading ? (
    <CreditCardLimitCardSkeleton />
  ) : (
    <Card size="sm" className="w-full">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{daysLeftUntilDue} days left</CardDescription>
      </CardHeader>
      <CardContent>
        <Field className="w-full max-w-sm">
          <FieldLabel>
            <span>
              {currency.symbol}
              {spentDuringPeriod} / {currency.symbol}
              {balance}
            </span>
          </FieldLabel>
          <Progress value={percentage} className="my-1.5 h-2 w-full" />
        </Field>
      </CardContent>
    </Card>
  )
}
