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
  expenseSchema,
  type ExpenseFormInput,
  type ExpenseFormValues,
} from "@/lib/schemas/expense.schema"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2Icon, CircleXIcon } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { CategorySelect } from "@/components/shared/category-select"
import { CURRENCY } from "@/config"
import { PaymentModeSelect } from "@/components/shared/payment-mode-select"
import { cn } from "@/lib/utils"

// Formats a Date as a local ISO string (no UTC conversion)
function formatLocalISO(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export function ExpenseForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ExpenseFormInput, unknown, ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      name: "",
      amount: "",
      description: "",
      category: undefined,
      payment_mode: undefined,
      spent_at: new Date(),
    },
  })

  async function onSubmit(data: ExpenseFormValues) {
    setServerError(null)
    setSuccess(false)
    console.log("[ExpenseForm] Submitting:", data)

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          spent_at: formatLocalISO(data.spent_at),
        }),
      })

      const json = await res.json()
      console.log("[ExpenseForm] Response:", res.status, json)

      if (!res.ok) {
        setServerError(json.error ?? "Failed to save expense.")
        return
      }

      setSuccess(true)
      reset()
      setResetKey((k) => k + 1)
    } catch (err) {
      console.error("[ExpenseForm] Fetch error:", err)
      setServerError(
        err instanceof Error ? err.message : "Failed to save expense."
      )
    }
  }

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      {success && (
        <Alert className="mb-3 border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-50">
          <CheckCircle2Icon />
          <AlertTitle>Expense submitted</AlertTitle>
          <AlertDescription>
            Your expense was submitted successfully
          </AlertDescription>
        </Alert>
      )}
      {serverError && (
        <Alert className="mb-3 border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-50">
          <CircleXIcon />
          <AlertTitle>Error while submitting your expense</AlertTitle>
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="expense-title">Expense Title</FieldLabel>
            <Input
              id="expense-title"
              placeholder="e.g. Dinner"
              {...register("name")}
            />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="amount">Amount</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="amount"
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
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              placeholder="e.g. Pizzas split with Ron and Gwen"
              className="resize-none"
              {...register("description")}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="category">Category</FieldLabel>
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
            <FieldLabel htmlFor="paymentMode">Payment Mode</FieldLabel>
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
                  if (field.value) {
                    updated.setHours(
                      field.value.getHours(),
                      field.value.getMinutes()
                    )
                  }
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
            {errors.spent_at && (
              <FieldError>{errors.spent_at.message}</FieldError>
            )}
          </Field>

          <Field orientation="horizontal">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner data-icon="inline-start" />}
              {isSubmitting ? "Submitting" : "Submit"}
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                reset()
                setResetKey((k) => k + 1)
                setServerError(null)
                setSuccess(false)
              }}
              disabled={isSubmitting || !isDirty}
            >
              Clear
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
