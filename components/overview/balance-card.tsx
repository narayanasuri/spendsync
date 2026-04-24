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
import { useState } from "react"
import { EyeClosedIcon, EyeIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { haptic } from "ios-haptics"

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

  const onToggleHide = () => {
    haptic()
    setHidden((prev) => !prev)
  }

  return (
    <Card className="w-full md:basis-1/2">
      <CardHeader>
        <CardTitle className="font-semibold">{name} (Savings)</CardTitle>
        <CardDescription className="font-medium">Balance</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon-sm" onClick={onToggleHide}>
            {hidden ? <EyeIcon /> : <EyeClosedIcon />}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tabular-nums">
          {currency.symbol} {hidden ? "*****" : (balance ?? 0)}
        </p>
      </CardContent>
    </Card>
  )
}
