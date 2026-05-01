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
import { useLastSelectedUser } from "@/hooks/use-last-selected-user"
import { useLogDrawerStore } from "@/lib/log-drawer-store"

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

export const LogDrawer = () => {
  const { isOpen, toggleDrawer, editingLog, setEditingLog } =
    useLogDrawerStore()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { user } = useLastSelectedUser()
  const isEditing = !!editingLog

  const methods = useForm<LogFormInput, unknown, LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: { ...DEFAULT_EXPENSE, paid_by: user.toString() },
  })

  const { reset } = methods

  const onClose = () => {
    reset(DEFAULT_EXPENSE)
    setErrorMessage(null)
    setEditingLog(null)
  }

  useEffect(() => {
    reset(
      editingLog
        ? getDefaultsFromLog(editingLog)
        : { ...DEFAULT_EXPENSE, paid_by: user.toString() }
    )
  }, [editingLog, reset, user])

  return (
    <Drawer open={isOpen} onOpenChange={toggleDrawer}>
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
              onClose={onClose}
              setErrorMessage={setErrorMessage}
            />
          )}
        </FormProvider>
      </DrawerContent>
    </Drawer>
  )
}
