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
  value: string
  onChange: (value: string) => void
  allowSelectAll?: boolean
  transactionType?: "expense" | "income"
}

export function CategorySelect({
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
    <Select
      key={value === "" ? "reset" : "active"}
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger id="category" className="text-base md:text-sm">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {allowSelectAll && (
            <SelectItem value="all" className="text-base md:text-sm">
              All
            </SelectItem>
          )}
          {filteredCategories.map(({ id, name }) => (
            <SelectItem
              key={id}
              value={id.toString()}
              className="text-base md:text-sm"
            >
              <CategoryIcon categoryId={id} />
              {name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
