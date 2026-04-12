"use client"

import { useRouter } from "next/navigation"
import { TableCell, TableRow } from "@/components/ui/table"
import { LOCALE, TIMEZONE } from "@/config"
import { PAYMENT_MODE_LABEL } from "@/lib/constants"
import { abbreviate } from "@/lib/utils"
import { CategoryIcon } from "@/components/shared/category-icon"

type TransactionItemProps = {
  id: number
  name: string
  description?: string | null
  category: string
  payment_mode: string
  amount: number
  spent_at: string
}

export function TransactionItem({
  id,
  name,
  description,
  category,
  payment_mode,
  amount,
  spent_at,
}: TransactionItemProps) {
  const router = useRouter()

  const date = new Date(spent_at).toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "short",
    timeZone: TIMEZONE,
  })

  return (
    <TableRow
      className="cursor-pointer"
      onClick={() => router.push(`/expenses/${id}`)}
    >
      <TableCell className="w-10">
        <CategoryIcon category={category} onlyIcon={false} />
      </TableCell>
      <TableCell>
        <p className="font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">
          {PAYMENT_MODE_LABEL[payment_mode]} · {date}
        </p>
      </TableCell>
      <TableCell className="text-right">
        <p className="font-medium tabular-nums">₹{abbreviate(amount)}</p>
      </TableCell>
    </TableRow>
  )
}
