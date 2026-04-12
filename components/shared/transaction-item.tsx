import { TableCell, TableRow } from "@/components/ui/table"
import { CategoryEnum, PaymentModeEnum } from "@/lib/enums"
import { CATEGORY_LABEL, PAYMENT_MODE_LABEL } from "@/lib/constants"
import { abbreviate } from "@/lib/utils"
import { CategoryIcon } from "@/components/shared/category-icon"

type TransactionItemProps = {
  name: string
  description?: string | null
  category: CategoryEnum
  payment_mode: PaymentModeEnum
  amount: number
  spent_at: string
}

export function TransactionItem({
  name,
  description,
  category,
  payment_mode,
  amount,
  spent_at,
}: TransactionItemProps) {
  const date = new Date(spent_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  })

  return (
    <TableRow>
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
