"use client"

import { Button } from "@/components/ui/button"
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer"
import { LogFormInput, LogFormValues } from "@/lib/schemas/expense.schema"
import { useAppStore } from "@/lib/store"
import { haptic } from "ios-haptics"
import { useFormContext } from "react-hook-form"
import { Spinner } from "../ui/spinner"
import { useLogDrawerStore } from "@/lib/log-drawer-store"

// Formats a Date as a local ISO string (no UTC conversion)
const formatLocalISO = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export const LogDrawerFooter = ({
  setErrorMessage,
  onClose,
}: {
  setErrorMessage: (error: any) => void
  onClose: () => void
}) => {
  const methods = useFormContext<LogFormInput, unknown, LogFormValues>()
  const {
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = methods
  const { refreshPaymentMethods } = useAppStore()
  const { editingLog, closeDrawer } = useLogDrawerStore()

  const onSubmit = async (data: LogFormValues) => {
    try {
      const res = await fetch(
        `/api/logs${editingLog ? `/${editingLog.id}` : ``}`,
        {
          method: editingLog ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            spent_at: formatLocalISO(data.spent_at),
            // Only spreads these fields if editingLog is truthy
            ...(editingLog && {
              old_amount: editingLog.amount,
              old_payment_method_id: editingLog.payment_mode,
            }),
          }),
        }
      )

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error ?? "Failed to save expense.")
      }

      await refreshPaymentMethods()

      onClose()

      closeDrawer()

      haptic.confirm()

      reset()
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : "An unknown error occurred"

      setErrorMessage(errorMessage)
      haptic.error()
      console.error("[ExpenseForm] Fetch error:", err)
    }
  }

  return (
    <DrawerFooter className="mb-3">
      <Button
        className="mb-3 w-full"
        disabled={isSubmitting}
        onClick={() => handleSubmit(onSubmit)()}
      >
        {isSubmitting && <Spinner data-icon="inline-start" />}
        {isSubmitting ? "Submitting" : "Submit"}
      </Button>
      <DrawerClose asChild>
        <Button variant="outline" className="mb-3 w-full" onClick={onClose}>
          Cancel
        </Button>
      </DrawerClose>
    </DrawerFooter>
  )
}
