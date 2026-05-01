"use client"

import { Button } from "@/components/ui/button"
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer"
import { LogFormInput, LogFormValues } from "@/lib/schemas/expense.schema"
import { haptic } from "ios-haptics"
import { useFormContext } from "react-hook-form"
import { Spinner } from "../ui/spinner"
import { useLogDrawerStore } from "@/lib/log-drawer-store"
import { useCreateLog, useUpdateLog } from "@/lib/mutations/use-log-mutations"

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
  const { editingLog, closeDrawer } = useLogDrawerStore()

  const createLogMutation = useCreateLog()
  const updateLogMutation = useUpdateLog()

  const onSubmit = async (data: LogFormValues) => {
    try {
      if (editingLog) {
        // Update existing log
        await updateLogMutation.mutateAsync({
          ...data,
          id: editingLog.id,
          old_amount: editingLog.amount,
          old_payment_method_id: editingLog.payment_mode,
        })
      } else {
        // Create new log
        await createLogMutation.mutateAsync(data)
      }

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
      console.error("[LogForm] Mutation error:", err)
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
