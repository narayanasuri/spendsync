"use client"

import { useRouter } from "next/navigation"
import { abbreviate, parseTimestamp } from "@/lib/utils"
import { CategoryIcon } from "@/components/shared/category-icon"
import { Expense } from "@/lib/types"
import { usePaymentMethods } from "@/lib/queries"
import { useCurrency } from "@/hooks/use-currency"
import { format } from "date-fns"

const LOG_TIME_FORMAT = "h:mm a"

export const LogItem = ({ log }: { log: Expense }) => {
  const router = useRouter()
  const { data: paymentMethods = [] } = usePaymentMethods()
  const {
    id,
    amount,
    category,
    name,
    payment_mode,
    spent_at,
    transaction_type,
  } = log
  const { currency } = useCurrency()

  const date = parseTimestamp(spent_at)

  const paymentModeLabel =
    paymentMethods.find((mode) => mode.id === payment_mode)?.name ||
    "Unknown payment mode"

  return (
    <div
      className="flex cursor-pointer items-center justify-between"
      onClick={() => router.push(`/logs/${id}`)}
    >
      <div className="flex items-center gap-3">
        <CategoryIcon
          categoryId={category}
          onlyIcon={false}
          size={45}
          iconSize={25}
        />
        <div className="flex flex-col">
          <p className="font-medium">{name}</p>
          <p className="text-sm font-medium text-muted-foreground">
            {format(date, LOG_TIME_FORMAT)} • {paymentModeLabel}
          </p>
        </div>
      </div>
      <p className="text-lg font-medium tabular-nums">
        {transaction_type === "expense" ? "-" : "+"}
        {currency.symbol}
        {abbreviate(amount)}
      </p>
    </div>
  )
}
