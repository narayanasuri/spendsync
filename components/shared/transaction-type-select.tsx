import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TransactionTypeSelectProps {
  value: string
  onChange: (value: string) => void
}

export function TransactionTypeSelect({
  value,
  onChange,
}: TransactionTypeSelectProps) {
  return (
    <Select defaultValue="expense" value={value} onValueChange={onChange}>
      <SelectTrigger id="transactionType">
        <SelectValue placeholder="Select a transaction type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="expense">Expense</SelectItem>
          <SelectItem value="income">Income</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
