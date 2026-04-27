"use client"

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

import { Expense } from "@/lib/types"
import { FormProvider, useForm } from "react-hook-form"
import {
  LogFormInput,
  LogFormValues,
  logSchema,
} from "@/lib/schemas/expense.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { parseTimestamp } from "@/lib/utils"
import { LogDrawerFooter } from "./log-drawer-footer"
import { LogForm } from "./log-form"
import { useEffect, useState } from "react"
import { SubmitFailure } from "./submit-failure"
import { useAppStore } from "@/lib/store"
import { useLastSelectedUser } from "@/hooks/use-last-selected-user"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  log?: Expense
}

const DEFAULT_EXPENSE: LogFormInput = {
  transaction_type: "expense",
  name: "",
  amount: "0",
  description: "",
  category: "",
  payment_mode: "",
  spent_at: new Date(),
  paid_by: "1",
}

const getDefaultsFromLog = (log: Expense): LogFormInput => {
  return {
    transaction_type: log.transaction_type as "expense" | "income",
    name: log.name,
    amount: log.amount.toString(),
    description: log.description ?? "",
    category: log.category.toString(),
    payment_mode: log.payment_mode.toString(),
    spent_at: parseTimestamp(log.spent_at),
    paid_by: log.paid_by.toString(),
  }
}

export function LogDrawer({ open, onOpenChange, log }: Props) {
  const { setEditingLog } = useAppStore()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { user } = useLastSelectedUser()
  const isEditing = !!log

  const methods = useForm<LogFormInput, unknown, LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: { ...DEFAULT_EXPENSE, paid_by: user.toString() },
  })

  const { reset } = methods

  const onClose = () => {
    reset(DEFAULT_EXPENSE)
    setEditingLog(null)
    setErrorMessage(null)
  }

  useEffect(() => {
    reset(
      log
        ? getDefaultsFromLog(log)
        : { ...DEFAULT_EXPENSE, paid_by: user.toString() }
    )
  }, [log, reset, user])

  return (
    <Drawer
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
        onOpenChange(open)
      }}
    >
      <DrawerContent className="mx-auto w-full max-w-4xl flex-1 p-2 md:p-6">
        <FormProvider {...methods}>
          <DrawerHeader className="text-left">
            <DrawerTitle>{isEditing ? "Edit Log" : "New Log"}</DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <div className="no-scrollbar overflow-y-auto px-4">
            {errorMessage ? (
              <SubmitFailure
                message={errorMessage}
                onRetry={() => {
                  setErrorMessage(null)
                }}
              />
            ) : (
              <LogForm />
            )}
          </div>
          {!errorMessage && (
            <LogDrawerFooter
              onSuccess={() => {
                onClose()
                onOpenChange(false)
              }}
              onError={(error) => {
                setErrorMessage(error)
              }}
            />
          )}
        </FormProvider>
      </DrawerContent>
    </Drawer>
  )
}
