"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUsers } from "@/lib/queries"

export const UserSelect = ({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) => {
  const { data: users = [] } = useUsers()

  return (
    <Select value={value} onValueChange={onChange} disabled={users.length <= 1}>
      <SelectTrigger id="user" className="text-base md:text-sm">
        <SelectValue placeholder="Select payer" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {users.map(({ id, name }) => (
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
