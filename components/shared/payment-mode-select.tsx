import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppStore } from "@/lib/store"

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
  const { paymentMethods } = useAppStore()

  return (
    <Select key={resetKey} value={value} onValueChange={onChange}>
      <SelectTrigger id="paymentMode" className="text-base md:text-sm">
        <SelectValue placeholder="Select a payment mode" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {allowSelectAll && (
            <SelectItem value="all" className="text-base md:text-sm">
              All
            </SelectItem>
          )}
          {paymentMethods.map(({ id, name }) => (
            <SelectItem
              key={id}
              value={id.toString()}
              className="text-base md:text-sm"
            >
              {name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
