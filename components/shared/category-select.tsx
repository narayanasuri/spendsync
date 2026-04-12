import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CATEGORY_OPTIONS } from "@/lib/constants"
import { CategoryEnum } from "@/lib/enums"
import { CategoryIcon } from "./category-icon"

interface PaymentModeSelectProps {
  resetKey?: number
  value: string
  onChange: (value: string) => void
  allowSelectAll?: boolean
}

export function CategorySelect({
  resetKey,
  value,
  onChange,
  allowSelectAll = false,
}: PaymentModeSelectProps) {
  return (
    <Select key={resetKey} value={value} onValueChange={onChange}>
      <SelectTrigger id="category">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {allowSelectAll && <SelectItem value="all">All</SelectItem>}
          {CATEGORY_OPTIONS.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              <CategoryIcon category={value as CategoryEnum} />
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
