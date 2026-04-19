import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function PeriodSelect({
  value,
  onChange,
}: {
  value: "weekly" | "monthly" | "yearly"
  onChange: (value: "weekly" | "monthly" | "yearly") => void
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id="category">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={"weekly"}>Weekly</SelectItem>
          <SelectItem value={"monthly"}>Monthly</SelectItem>
          <SelectItem value={"yearly"}>Yearly</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
