"use client"

import { useRouter } from "next/navigation"
import { TableCell, TableRow } from "@/components/ui/table"
import { abbreviate } from "@/lib/utils"
import { CategoryIcon } from "@/components/shared/category-icon"
import { Expense } from "@/lib/types"
import { useAppStore } from "@/lib/store"
import { useCurrency } from "@/hooks/use-currency"
import { LOCALE, TIMEZONE } from "@/lib/constants"

export function LogItem({ log }: { log: Expense }) {
  const router = useRouter()
  const { paymentMethods } = useAppStore()
  const { amount, category, name, payment_mode, spent_at, transaction_type } =
    log
  const { currency } = useCurrency()

  const date = new Date(spent_at).toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "short",
    timeZone: TIMEZONE,
  })

  return (
    <TableRow
      className="cursor-pointer"
      onClick={() => router.push(`/logs/${log.id}`)}
    >
      <TableCell className="w-10">
        <CategoryIcon categoryId={category} onlyIcon={false} />
      </TableCell>
      <TableCell>
        <p className="font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">
          {paymentMethods.find((p) => p.id === payment_mode)?.name ?? "Unknown"}{" "}
          · {date}
        </p>
      </TableCell>
      <TableCell className="text-right">
        <p className="font-medium tabular-nums">
          {transaction_type === "expense" ? "-" : "+"}
          {currency.symbol}
          {abbreviate(amount)}
        </p>
      </TableCell>
    </TableRow>
  )
}
