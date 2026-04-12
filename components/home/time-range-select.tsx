"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field } from "../ui/field"
import { TIME_RANGE_OPTIONS } from "@/lib/constants"
import { TimeRangeEnum } from "@/lib/enums"

interface TimeRangeSelectProps {
  value: TimeRangeEnum
  onChange: (value: TimeRangeEnum) => void
}

export function TimeRangeSelect({ value, onChange }: TimeRangeSelectProps) {
  return (
    <Field className="w-[200]">
      <Select value={value} onValueChange={(v) => onChange(v as TimeRangeEnum)}>
        <SelectTrigger id="timeRange">
          <SelectValue placeholder="Select a time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {TIME_RANGE_OPTIONS.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
