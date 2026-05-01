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
import { Button } from "@/components/ui/button"
import { useMemo, useState } from "react"
import { ArrowRightIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { abbreviate, cn } from "@/lib/utils"
import Link from "next/link"

export const BalanceCardSkeleton = () => {
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

export const BalanceCard = ({
  paymentMethod,
}: {
  paymentMethod: PaymentMethod
}) => {
  const { balance, name } = paymentMethod
  const { currency } = useCurrency()
  const [visibilityStatus, setVisibilityStatus] = useState<
    "HIDE" | "SHORT" | "LONG"
  >("HIDE")

  const onToggleVisibilityStatus = () =>
    setVisibilityStatus((prev) =>
      prev === "HIDE" ? "SHORT" : prev === "SHORT" ? "LONG" : "HIDE"
    )

  const amount = useMemo<string>(() => {
    if (!balance) return "-"

    switch (visibilityStatus) {
      case "SHORT":
        return currency.symbol + abbreviate(balance)
      case "LONG":
        return currency.symbol + balance.toString()
      default:
        return currency.symbol + "*****"
    }
  }, [balance, currency, visibilityStatus])

  const link = useMemo<string>(() => {
    const params = new URLSearchParams({
      paymentMethodId: paymentMethod.id.toString(),
    })

    return `/logs?${params.toString()}`
  }, [paymentMethod.id])

  if (!balance) return null

  return (
    <Card className="w-full md:basis-1/2" onClick={onToggleVisibilityStatus}>
      <CardHeader>
        <CardTitle className="font-semibold">{name} (Savings)</CardTitle>
        <CardDescription className="font-medium">Balance</CardDescription>
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
        <p
          className={cn(
            visibilityStatus === "LONG"
              ? "text-lg font-semibold tabular-nums"
              : "text-2xl font-semibold tabular-nums"
          )}
        >
          {amount}
        </p>
      </CardContent>
    </Card>
  )
}
