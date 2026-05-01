"use client"

import { LogDrawer } from "@/components/add/log-drawer"
import { DeleteLogDialog } from "@/components/logs/details/delete-log-dialog"

export const DialogProvider = () => {
  return (
    <>
      <LogDrawer />
      <DeleteLogDialog />
    </>
  )
}
