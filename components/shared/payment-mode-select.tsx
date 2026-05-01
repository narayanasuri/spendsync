"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppStore } from "@/lib/store"
import { CreditCardIcon, LandmarkIcon } from "lucide-react"

export const PaymentModeSelect = ({
  value,
  onChange,
  allowSelectAll = false,
}: {
  value: string
  onChange: (value: string) => void
  allowSelectAll?: boolean
}) => {
  const { paymentMethods } = useAppStore()

  return (
    <Select value={value} onValueChange={onChange}>
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
          {paymentMethods.map(({ id, name, type }) => (
            <SelectItem
              key={id}
              value={id.toString()}
              className="text-base md:text-sm"
            >
              {type === "savings" ? <LandmarkIcon /> : <CreditCardIcon />}
              {name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
