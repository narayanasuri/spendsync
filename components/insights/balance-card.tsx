"use client"

import { PaymentMethod } from "@/lib/types"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { useCurrency } from "@/hooks/use-currency"
import { Button } from "../ui/button"
import { useState } from "react"
import { EyeClosedIcon, EyeIcon } from "lucide-react"

export function BalanceCard({
  paymentMethod,
}: {
  paymentMethod: PaymentMethod
}) {
  const { balance, name } = paymentMethod
  const { currency } = useCurrency()
  const [hidden, setHidden] = useState<boolean>(true)

  return (
    <Card size="sm" className="w-full md:basis-1/2">
      <CardHeader>
        <CardTitle>
          <span className="text-sm text-muted-foreground">{name}</span>
        </CardTitle>
        <CardDescription>
          <span className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {currency.symbol} {hidden ? "*****" : (balance ?? 0)}
          </span>
        </CardDescription>
        <CardAction>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setHidden((prev) => !prev)}
          >
            {hidden ? <EyeIcon /> : <EyeClosedIcon />}
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  )
}
