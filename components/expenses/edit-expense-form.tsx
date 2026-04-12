"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, Clock4Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { CategorySelect } from "@/components/shared/category-select"
import { CURRENCY } from "@/config"
import { PaymentModeSelect } from "@/components/shared/payment-mode-select"
import {
  expenseSchema,
  type ExpenseFormInput,
  type ExpenseFormValues,
} from "@/lib/schemas/expense.schema"
import { cn } from "@/lib/utils"
import type { Tables } from "@/lib/database.types"

type Expense = Tables<"Expenses">

function formatLocalISO(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

// Parse a UTC ISO string into a local Date whose wall-clock values match
// the stored UTC time, so the form fields show the correct hours/minutes.
function utcToLocalDate(iso: string): Date {
  const d = new Date(iso)
  return new Date(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
    d.getUTCSeconds()
  )
}

interface EditExpenseFormProps {
  expense: Expense
  onSave: (updated: Expense) => void
  onCancel: () => void
}

export function EditExpenseForm({
  expense,
  onSave,
  onCancel,
}: EditExpenseFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [resetKey, setResetKey] = useState(0)

  const spentAt = utcToLocalDate(expense.spent_at)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormInput, unknown, ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      name: expense.name,
      amount: String(expense.amount),
      description: expense.description ?? "",
      category: expense.category as ExpenseFormInput["category"],
      payment_mode: expense.payment_mode as ExpenseFormInput["payment_mode"],
      spent_at: spentAt,
    },
  })

  async function onSubmit(data: ExpenseFormValues) {
    setServerError(null)
    try {
      const res = await fetch(`/api/expenses/${expense.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          spent_at: formatLocalISO(data.spent_at),
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        setServerError(json.error ?? "Failed to update expense.")
        return
      }

      onSave(json)
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Failed to update expense."
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel>Expense Title</FieldLabel>
            <Input placeholder="e.g. Dinner" {...register("name")} />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Amount</FieldLabel>
            <InputGroup>
              <InputGroupInput
                type="number"
                min="0.01"
                step="0.01"
                placeholder="200.00"
                {...register("amount")}
              />
              <InputGroupAddon>
                <InputGroupText>{CURRENCY}</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            {errors.amount && <FieldError>{errors.amount.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <Textarea
              placeholder="e.g. Dinner with friends"
              className="resize-none"
              {...register("description")}
            />
          </Field>

          <Field>
            <FieldLabel>Category</FieldLabel>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <CategorySelect
                  resetKey={resetKey}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.category && (
              <FieldError>{errors.category.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Payment Mode</FieldLabel>
            <Controller
              control={control}
              name="payment_mode"
              render={({ field }) => (
                <PaymentModeSelect
                  resetKey={resetKey}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.payment_mode && (
              <FieldError>{errors.payment_mode.message}</FieldError>
            )}
          </Field>

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
                  if (field.value)
                    updated.setHours(
                      field.value.getHours(),
                      field.value.getMinutes()
                    )
                  field.onChange(updated)
                }

                function handleTimeChange(
                  e: React.ChangeEvent<HTMLInputElement>
                ) {
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
                          "w-full justify-start gap-2 font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="size-4" />
                        {field.value
                          ? format(field.value, "d MMM yyyy, hh:mm a")
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
                          <FieldLabel htmlFor="edit-time">Time</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              id="edit-time"
                              type="time"
                              value={timeInput}
                              onChange={handleTimeChange}
                              className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
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
            {errors.spent_at && (
              <FieldError>{errors.spent_at.message}</FieldError>
            )}
          </Field>

          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}

          <Field orientation="horizontal">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner data-icon="inline-start" />}
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
