import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface LogTypeSelectProps {
  value: string
  onChange: (value: string) => void
}

export function LogTypeSelect({ value, onChange }: LogTypeSelectProps) {
  return (
    <Select defaultValue="expense" value={value} onValueChange={onChange}>
      <SelectTrigger id="transactionType" className="text-base md:text-sm">
        <SelectValue placeholder="Select a transaction type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="expense" className="text-base md:text-sm">
            Expense
          </SelectItem>
          <SelectItem value="income" className="text-base md:text-sm">
            Income
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
