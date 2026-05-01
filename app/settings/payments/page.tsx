"use client"

import { useState } from "react"
import { usePaymentMethods } from "@/lib/queries"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, PlusIcon } from "lucide-react"
import { PaymentMethodDrawer } from "@/components/settings/payment-method-drawer"
import { useBackButton } from "@/hooks/use-back-button"
import { PaymentMethodsList } from "@/components/settings/payment-methods-list"
import { PaymentMethod } from "@/lib/types"

export default () => {
  const { data: paymentMethods = [] } = usePaymentMethods()
  const [open, setOpen] = useState<boolean>(false)
  const [editingMethod, setEditingMethod] = useState<
    PaymentMethod | undefined
  >()
  const back = useBackButton("/settings")

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) setEditingMethod(undefined)
  }

  const onAddPaymentMethod = () => handleOpenChange(true)

  const onEditPaymentMethod = (method: PaymentMethod) => {
    setEditingMethod(method)
    setOpen(true)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-4xl flex-1 p-6">
        <div className="mb-6 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Go back to settings"
            onClick={back}
          >
            <ArrowLeftIcon />
          </Button>
          <h2 className="text-xl font-semibold tracking-tight">Payments</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Add new payment method"
            onClick={() => handleOpenChange(true)}
          >
            <PlusIcon />
          </Button>
        </div>

        <PaymentMethodsList
          paymentMethods={paymentMethods}
          onAdd={onAddPaymentMethod}
          onEdit={onEditPaymentMethod}
        />

        <PaymentMethodDrawer
          open={open}
          onOpenChange={handleOpenChange}
          paymentMethod={editingMethod}
        />
      </main>
    </div>
  )
}
