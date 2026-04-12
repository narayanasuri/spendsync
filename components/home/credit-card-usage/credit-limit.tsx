import { TableCell, TableRow } from "@/components/ui/table"
import { Progress } from "../../ui/progress"
import { CARD_LIMITS, PAYMENT_MODE_LABEL } from "@/lib/constants"
import { abbreviate } from "@/lib/utils"
import { BankIcon } from "@/components/shared/bank-icon"
import { CURRENCY } from "@/config"

export function CreditLimit({ mode, spent }: { mode: string; spent: number }) {
  const limit = CARD_LIMITS[mode]

  if (!limit) {
    return (
      <TableRow>
        <TableCell className="font-medium">
          {PAYMENT_MODE_LABEL[mode]}
        </TableCell>
        <TableCell>{CURRENCY}{abbreviate(spent)} spent</TableCell>
        <TableCell>Limit unknown</TableCell>
      </TableRow>
    )
  }

  const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
  const remaining = Math.max(limit - spent, 0)

  return (
    <TableRow>
      <TableCell className="w-10">
        <BankIcon mode={mode} />
      </TableCell>
      <TableCell className="font-medium">{PAYMENT_MODE_LABEL[mode]}</TableCell>
      <TableCell>
        <Progress value={percentage} className="my-1" />
        <span className="mt-1 text-sm text-muted-foreground">
          {percentage.toFixed(2)}% - {CURRENCY}{abbreviate(spent)} of {CURRENCY}
          {abbreviate(limit)}
        </span>
      </TableCell>
    </TableRow>
  )
}
