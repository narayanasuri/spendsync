"use client"

import { useState } from "react"
import { type DateRange } from "react-day-picker"
import { addMonths, format, isAfter } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangeInputProps {
  value: DateRange
  onChange: (range: DateRange) => void
}

const DATE_RANGE_LABEL_FORMAT = "d MMM"

function formatRange(range: DateRange): string {
  const from = range.from
    ? format(range.from, DATE_RANGE_LABEL_FORMAT)
    : "Unknown"
  const to = range.to ? format(range.to, DATE_RANGE_LABEL_FORMAT) : "Unknown"

  return from + " - " + to
}

export function DateRangeInput({ value, onChange }: DateRangeInputProps) {
  const [draft, setDraft] = useState<DateRange>(value)
  const [open, setOpen] = useState(false)

  function handleSelect(range: DateRange | undefined) {
    // 1. If the user clicks the current 'from' date again,
    // they might want to clear the selection or restart.
    if (!range || (!range.from && !range.to)) {
      setDraft({ from: undefined, to: undefined })
      return
    }

    let newRange = range

    // 2. Logic to allow re-selecting a range within the current range:
    // If we already had a full range (from AND to), and the user clicks again,
    // we force the click to become the new 'from' date.
    if (draft.from && draft.to && range.from && range.to) {
      // If the newly selected 'to' is the same as the old 'to',
      // it means the user just clicked a single date.
      newRange = { from: range.to, to: undefined }
    }

    // 3. Your existing 2-month constraint logic
    if (newRange.from && newRange.to) {
      const maxTo = addMonths(newRange.from, 2)
      if (isAfter(newRange.to, maxTo)) {
        newRange = { from: newRange.from, to: maxTo }
      }
    }

    setDraft(newRange)
  }

  function handleApply() {
    if (draft.from && draft.to) {
      onChange({ from: draft.from, to: draft.to })
      setOpen(false)
    }
  }

  function handleOpenChange(next: boolean) {
    // Reset draft to committed value if popover closes without applying
    if (!next) setDraft(value)
    setOpen(next)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-56 justify-start gap-2 font-normal"
        >
          <CalendarIcon className="size-4 text-muted-foreground" />
          {formatRange(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={draft.from}
          selected={draft}
          onSelect={handleSelect}
          numberOfMonths={2}
          disabled={(date) => date > new Date()}
        />
        <div className="flex justify-end border-t p-3">
          <Button
            size="sm"
            onClick={handleApply}
            disabled={!draft.from || !draft.to}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
