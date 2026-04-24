"use client"

import { useState } from "react"
import { useForm, Controller, FormProvider, useWatch } from "react-hook-form"
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
  logSchema,
  type LogFormInput,
  type LogFormValues,
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
import { PaymentModeSelect } from "@/components/shared/payment-mode-select"
import { cn } from "@/lib/utils"
import { LogTypeSelect } from "@/components/shared/log-type-select"
import { UserSelect } from "@/components/shared/user-select"
import { useCurrency } from "@/hooks/use-currency"
import { useAppStore } from "@/lib/store"
import { haptic } from "ios-haptics"

// Formats a Date as a local ISO string (no UTC conversion)
function formatLocalISO(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export function LogForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const { currency } = useCurrency()
  const { refreshPaymentMethods } = useAppStore()

  const methods = useForm<LogFormInput, unknown, LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: {
      transaction_type: "expense",
      name: "",
      amount: "",
      description: "",
      category: undefined,
      payment_mode: undefined,
      spent_at: new Date(),
      paid_by: "1",
    },
  })

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = methods

  const transactionType = useWatch({ control, name: "transaction_type" })

  async function onSubmit(data: LogFormValues) {
    setServerError(null)
    setSuccess(false)
    console.log("[ExpenseForm] Submitting:", data)

    try {
      const res = await fetch("/api/logs", {
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

      await refreshPaymentMethods()

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
    <FormProvider {...methods}>
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        {success && (
          <Alert className="mb-3 border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-50">
            <CheckCircle2Icon />
            <AlertTitle>Transaction added</AlertTitle>
            <AlertDescription>
              Your transaction was addded successfully
            </AlertDescription>
          </Alert>
        )}
        {serverError && (
          <Alert className="mb-3 border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-50">
            <CircleXIcon />
            <AlertTitle>Error while submitting your form</AlertTitle>
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="transaction_type">
                Transaction Type
              </FieldLabel>
              <Controller
                control={control}
                name="transaction_type"
                render={({ field }) => (
                  <LogTypeSelect
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.transaction_type && (
                <FieldError>{errors.transaction_type.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                placeholder="e.g. Dinner"
                {...register("name")}
              />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="amount">Amount</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>{currency.symbol}</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="200.00"
                  {...register("amount")}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>{currency.shortLabel}</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {errors.amount && (
                <FieldError>{errors.amount.message}</FieldError>
              )}
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
                    transactionType={
                      transactionType as "expense" | "income" | undefined
                    }
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

            {transactionType === "expense" && (
              <Field>
                <FieldLabel htmlFor="paid_by">Paid by</FieldLabel>
                <Controller
                  control={control}
                  name="paid_by"
                  render={({ field }) => (
                    <UserSelect
                      value={field.value || "1"}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.payment_mode && (
                  <FieldError>{errors.payment_mode.message}</FieldError>
                )}
              </Field>
            )}

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
                            "w-full justify-start gap-2 text-base font-normal md:text-sm",
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
                            <FieldLabel htmlFor="spent-at-time">
                              Time
                            </FieldLabel>
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

            <Field orientation="responsive">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="md:text:sm w-full text-base md:w-[80px]"
                onClick={haptic.confirm}
              >
                {isSubmitting && <Spinner data-icon="inline-start" />}
                {isSubmitting ? "Submitting" : "Submit"}
              </Button>
              <Button
                variant="outline"
                type="button"
                className="w-full text-base md:w-[100px] md:text-sm"
                onClick={() => {
                  haptic.error()
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
    </FormProvider>
  )
}
