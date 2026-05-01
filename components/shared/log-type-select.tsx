"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BanknoteArrowDownIcon, BanknoteArrowUpIcon } from "lucide-react"

interface LogTypeSelectProps {
  value: "all" | "expense" | "income"
  onChange: (value: "expense" | "income") => void
  defaultValue?: "expense" | "income"
  allowSelectAll?: boolean
}

export const LogTypeSelect = ({
  value,
  onChange,
  defaultValue = "expense",
  allowSelectAll = false,
}: LogTypeSelectProps) => {
  return (
    <Select defaultValue={defaultValue} value={value} onValueChange={onChange}>
      <SelectTrigger id="transactionType" className="text-base md:text-sm">
        <SelectValue placeholder="Select a transaction type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {allowSelectAll && (
            <SelectItem value="all" className="text-base md:text-sm">
              All
            </SelectItem>
          )}
          <SelectItem value="expense" className="text-base md:text-sm">
            <BanknoteArrowUpIcon />
            Expense
          </SelectItem>
          <SelectItem value="income" className="text-base md:text-sm">
            <BanknoteArrowDownIcon />
            Income
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
