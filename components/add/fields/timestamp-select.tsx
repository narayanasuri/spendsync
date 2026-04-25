"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { LogFormInput, LogFormValues } from "@/lib/schemas/expense.schema"
import { Controller, useFormContext } from "react-hook-form"
import { CalendarIcon, Clock4Icon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { format } from "date-fns"
import { useState } from "react"

const SELECTED_TIMESTAMP_FORMAT = "d MMM yyyy, hh:mm a"

export function TimestampSelect() {
  const methods = useFormContext<LogFormInput, unknown, LogFormValues>()
  const {
    control,
    formState: { errors },
  } = methods

  return (
    <Field>
      <FieldLabel>Date & Time</FieldLabel>
      <Controller
        control={control}
        name="spent_at"
        render={({ field }) => {
          const [timeInput, setTimeInput] = useState(
            field.value
              ? `${String(field.value.getHours()).padStart(2, "0")}:${String(field.value.getMinutes()).padStart(2, "0")}`
              : "00:00"
          )

          function handleDateSelect(date: Date | undefined) {
            if (!date) return
            const updated = new Date(date)
            if (field.value) {
              updated.setHours(field.value.getHours(), field.value.getMinutes())
            }
            field.onChange(updated)
          }

          function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
            const val = e.target.value
            setTimeInput(val)
            if (!/^\d{2}:\d{2}$/.test(val)) return
            const [hours, minutes] = val.split(":").map(Number)
            const updated = new Date(field.value ?? new Date())
            updated.setHours(hours, minutes)
            field.onChange(updated)
          }

          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start gap-2 text-base font-normal md:text-sm",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="size-4" />
                  {field.value
                    ? format(field.value, SELECTED_TIMESTAMP_FORMAT)
                    : "Pick a date & time"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={handleDateSelect}
                  disabled={(date) => date > new Date()}
                  defaultMonth={field.value}
                  className="p-3"
                />
                <div className="border-t p-3">
                  <Field>
                    <FieldLabel htmlFor="spent-at-time">Time</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="spent-at-time"
                        type="time"
                        value={timeInput}
                        onChange={handleTimeChange}
                        className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      />
                      <InputGroupAddon>
                        <Clock4Icon className="text-muted-foreground" />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                </div>
              </PopoverContent>
            </Popover>
          )
        }}
      />
      {errors.spent_at && <FieldError>{errors.spent_at.message}</FieldError>}
    </Field>
  )
}
