import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CategoryIcon } from "./category-icon"
import { useAppStore } from "@/lib/store"

interface CategorySelectProps {
  resetKey?: number
  value: string
  onChange: (value: string) => void
  allowSelectAll?: boolean
  transactionType?: "expense" | "income"
}

export function CategorySelect({
  resetKey,
  value,
  onChange,
  allowSelectAll = false,
  transactionType,
}: CategorySelectProps) {
  const { categories } = useAppStore()

  const filteredCategories = transactionType
    ? categories.filter((c) => c.type === transactionType)
    : categories

  return (
    <Select key={resetKey} value={value} onValueChange={onChange}>
      <SelectTrigger id="category">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {allowSelectAll && <SelectItem value="all">All</SelectItem>}
          {filteredCategories.map(({ id, name }) => (
            <SelectItem key={id} value={id.toString()}>
              <CategoryIcon categoryId={id} />
              {name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
