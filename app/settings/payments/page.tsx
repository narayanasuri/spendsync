"use client"

import { Fragment, useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import { ArrowLeftIcon, PencilIcon, PlusIcon } from "lucide-react"
import Link from "next/link"
import { PaymentMethodDrawer } from "@/components/settings/payment-method-drawer"

export default function PaymentsSettingsPage() {
  const { paymentMethods } = useAppStore()
  const [open, setOpen] = useState<boolean>(false)
  const [editingMethod, setEditingMethod] = useState<
    (typeof paymentMethods)[0] | undefined
  >()

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) setEditingMethod(undefined)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-4xl flex-1 p-6">
        <div className="mb-6 flex gap-3">
          <Link href="/settings">
            <Button variant="ghost" size="icon-xs" asChild>
              <ArrowLeftIcon />
            </Button>
          </Link>
          <h2 className="text-xl font-semibold tracking-tight">Payments</h2>
        </div>

        <div className="flex w-full flex-col rounded-md bg-muted">
          {paymentMethods.map((method, index) => (
            <Fragment key={method.id}>
              {index > 0 && <Separator key={`sep-${method.id}`} />}
              <Item key={`item-${method.id}`}>
                <ItemContent>
                  <ItemTitle>{method.name}</ItemTitle>
                  <ItemDescription className="capitalize">
                    {method.type}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    size="icon-xs"
                    aria-label="Edit Payment Method"
                    variant="ghost"
                    onClick={() => {
                      setEditingMethod(method)
                      setOpen(true)
                    }}
                  >
                    <PencilIcon />
                  </Button>
                </ItemActions>
              </Item>
            </Fragment>
          ))}
        </div>

        <Button
          variant="outline"
          className="mt-3"
          onClick={() => handleOpenChange(true)}
        >
          <PlusIcon />
          Add New
        </Button>

        <PaymentMethodDrawer
          open={open}
          onOpenChange={handleOpenChange}
          paymentMethod={editingMethod}
        />
      </main>
    </div>
  )
}
