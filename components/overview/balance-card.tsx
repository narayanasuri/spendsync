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
import {
  ArrowRightIcon,
  EyeClosedIcon,
  EyeIcon,
  ScanSearchIcon,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { haptic } from "ios-haptics"
import { abbreviate, cn } from "@/lib/utils"
import Link from "next/link"

export function BalanceCardSkeleton() {
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

export function BalanceCard({
  paymentMethod,
}: {
  paymentMethod: PaymentMethod
}) {
  const { balance, name } = paymentMethod
  const { currency } = useCurrency()
  const [hidden, setHidden] = useState<boolean>(true)
  const [expanded, setExpanded] = useState<boolean>(false)

  const onToggleHide = () => {
    haptic()
    setHidden((prev) => !prev)
  }

  const onToggleExpansion = () => {
    if (!hidden) {
      setExpanded((expanded) => !expanded)
    }
  }

  const amount = useMemo<string>(() => {
    if (!balance) return "-"

    let res = currency.symbol

    if (hidden) {
      res += "*****"
    } else {
      if (expanded) {
        res += balance.toString()
      } else {
        res += abbreviate(balance)
      }
    }

    return res
  }, [balance, currency, expanded, hidden])

  const link = useMemo<string>(() => {
    const params = new URLSearchParams({
      paymentMethodId: paymentMethod.id.toString(),
    })

    return `/logs?${params.toString()}`
  }, [paymentMethod.id])

  if (!balance) return null

  return (
    <Card className="w-full md:basis-1/2" onClick={onToggleHide}>
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
            expanded
              ? "text-lg font-semibold tabular-nums"
              : "text-2xl font-semibold tabular-nums"
          )}
          onClick={onToggleExpansion}
        >
          {amount}
        </p>
      </CardContent>
    </Card>
  )
}
