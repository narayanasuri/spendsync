"use client"

import { PaymentMethod } from "@/lib/types"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCurrency } from "@/hooks/use-currency"
import { useCallback, useMemo, useState } from "react"
import { DateRange } from "react-day-picker"
import {
  abbreviate,
  getDateRange,
  getUpcomingDateByDay,
  formatToLocalDate,
  getStatusColor,
} from "@/lib/utils"
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
import { ArrowRightIcon, CircleAlertIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "../ui/button"
import Link from "next/link"

export function CreditCardLimitCardSkeleton() {
  return (
    <Card className="w-full">
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
  const [showLimit, setShowLimit] = useState<boolean>(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const { from, to } = useMemo<DateRange>(() => {
    return getDateRange({
      period: "monthly",
      endDate: getUpcomingDateByDay(due),
      excludePastPeriod: false,
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

  const percentage = useMemo<number>(
    () => (balance ? Math.floor((spentDuringPeriod / balance) * 100) : 0),
    [balance, spentDuringPeriod]
  )

  const onToggleLimit = useCallback(() => {
    if (isDesktop) return

    setShowLimit((shown) => !shown)
  }, [isDesktop, setShowLimit])

  const cellValue = useMemo<string>(() => {
    let res = currency.symbol

    if (isDesktop) {
      res += abbreviate(spentDuringPeriod)
    } else {
      if (showLimit && balance !== null) {
        res += abbreviate(balance)
      } else {
        res += abbreviate(spentDuringPeriod)
      }
    }

    return res
  }, [balance, currency, isDesktop, showLimit, spentDuringPeriod])

  const link = useMemo<string>(() => {
    const params = new URLSearchParams({
      paymentMethodId: paymentMethod.id.toString(),
    })

    if (from && to) {
      params.set("from", formatToLocalDate(from))
      params.set("to", formatToLocalDate(to))
    }

    return `/logs?${params.toString()}`
  }, [paymentMethod.id, from, to])

  if (error) {
    return (
      <Card className="w-full">
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
    <Card className="w-full" onClick={onToggleLimit}>
      <CardHeader>
        <CardTitle className="font-semibold">{name}</CardTitle>
        <CardDescription className="font-medium">
          {daysLeftUntilDue} days left
        </CardDescription>
        <CardAction>
          <Button
            variant="ghost"
            size="icon-sm"
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <Link href={link} replace>
              <ArrowRightIcon />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Field className="w-full max-w-sm">
          <FieldLabel>
            <div className="flex w-full items-end gap-1">
              <span className="text-2xl font-semibold tabular-nums">
                {cellValue}
              </span>
              {!isDesktop && !showLimit && (
                <span className="text-md mb-0.5 text-muted-foreground tabular-nums">
                  ({percentage}%)
                </span>
              )}
              {isDesktop && (
                <span className="mb-0.5">
                  of {currency.symbol}
                  {balance === null ? "-" : abbreviate(balance)}
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
