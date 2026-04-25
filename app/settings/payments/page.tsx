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
import {
  ArrowLeftIcon,
  CreditCardIcon,
  PencilIcon,
  PlusIcon,
} from "lucide-react"
import Link from "next/link"
import { PaymentMethodDrawer } from "@/components/settings/payment-method-drawer"
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

function EmptyPaymentMethodsState({ onOpen }: { onOpen: () => void }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CreditCardIcon />
        </EmptyMedia>
        <EmptyTitle>No payment methods added</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm" onClick={onOpen}>
          Add New
        </Button>
      </EmptyContent>
    </Empty>
  )
}

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
        <div className="mb-6 flex items-center gap-3">
          <Link href="/settings">
            <Button variant="ghost" size="icon-xs" asChild>
              <ArrowLeftIcon />
            </Button>
          </Link>
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

        <div className="flex w-full flex-col rounded-md bg-muted">
          {paymentMethods.length === 0 && (
            <EmptyPaymentMethodsState onOpen={() => handleOpenChange(true)} />
          )}
          {paymentMethods.map((method, index) => (
            <Fragment key={method.id}>
              {index > 0 && <Separator key={`sep-${method.id}`} />}
              <Item key={`item-${method.id}`}>
                <ItemContent>
                  <ItemTitle className="text-[16px]">{method.name}</ItemTitle>
                  <ItemDescription className="text-sm capitalize">
                    {method.type}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    size="icon-sm"
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

        <div className="mt-3 flex w-full items-center justify-center">
          <Button
            variant="outline"
            className="w-full md:w-auto"
            onClick={() => handleOpenChange(true)}
          >
            <PlusIcon />
            Add New
          </Button>
        </div>

        <PaymentMethodDrawer
          open={open}
          onOpenChange={handleOpenChange}
          paymentMethod={editingMethod}
        />
      </main>
    </div>
  )
}
