import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PAYMENT_MODE_OPTIONS } from "@/lib/constants"
import { BankIcon } from "./bank-icon"

interface PaymentModeSelectProps {
  resetKey?: number
  value: string
  onChange: (value: string) => void
  allowSelectAll?: boolean
}

export function PaymentModeSelect({
  resetKey,
  value,
  onChange,
  allowSelectAll = false,
}: PaymentModeSelectProps) {
  return (
    <Select key={resetKey} value={value} onValueChange={onChange}>
      <SelectTrigger id="paymentMode">
        <SelectValue placeholder="Select a payment mode" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {allowSelectAll && <SelectItem value="all">All</SelectItem>}
          {PAYMENT_MODE_OPTIONS.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              <BankIcon mode={value} size="small" />
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
