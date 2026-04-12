"use client"

import { useState } from "react"
import { type DateRange } from "react-day-picker"
import { addMonths, isAfter } from "date-fns"
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

import { LOCALE } from "@/config"

function formatRange(range: DateRange): string {
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }
  const from = range.from?.toLocaleDateString(LOCALE, opts) ?? "—"
  const to = range.to?.toLocaleDateString(LOCALE, opts) ?? "—"
  return `${from} – ${to}`
}

export function DateRangeInput({ value, onChange }: DateRangeInputProps) {
  const [draft, setDraft] = useState<DateRange>(value)
  const [open, setOpen] = useState(false)

  function handleSelect(range: DateRange | undefined) {
    if (!range) return

    if (range.from && range.to) {
      const maxTo = addMonths(range.from, 2)
      if (isAfter(range.to, maxTo)) {
        range = { from: range.from, to: maxTo }
      }
    }

    setDraft(range)
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
