"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useDeletePaymentMethodMutation,
  usePaymentMethodMutation,
} from "@/lib/queries"
import { PaymentMethod } from "@/lib/types"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { useCurrency } from "@/hooks/use-currency"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  paymentMethod?: PaymentMethod // present → edit mode
}

export const PaymentMethodDrawer = ({
  open,
  onOpenChange,
  paymentMethod,
}: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const deleteMutation = useDeletePaymentMethodMutation()
  const isEditing = !!paymentMethod

  const title = isEditing ? "Update Payment Method" : "Add Payment Method"

  const handleDelete = () => {
    if (!paymentMethod) return
    deleteMutation.mutate(paymentMethod.id.toString(), {
      onSuccess: () => onOpenChange(false),
    })
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <PaymentMethodForm
            paymentMethod={paymentMethod}
            onSuccess={() => onOpenChange(false)}
          />
          {isEditing && (
            <Button
              variant="destructive"
              className="mt-1 w-full"
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <PaymentMethodForm
            paymentMethod={paymentMethod}
            onSuccess={() => onOpenChange(false)}
            className="px-0"
          />
        </div>
        <DrawerFooter className="mt-1 mb-3">
          {isEditing && (
            <Button
              variant="destructive"
              className="mb-4 w-full"
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

const PaymentMethodForm = ({
  paymentMethod,
  onSuccess,
  className,
}: {
  paymentMethod?: PaymentMethod
  onSuccess: () => void
  className?: string
}) => {
  const isEditing = !!paymentMethod

  const mutation = usePaymentMethodMutation()
  const [name, setName] = useState(paymentMethod?.name ?? "New payment method")
  const [type, setType] = useState<"savings" | "credit">(
    (paymentMethod?.type as "savings" | "credit") ?? "savings"
  )
  const [balance, setBalance] = useState<number>(paymentMethod?.balance ?? 0)
  const [due, setDue] = useState<number>(paymentMethod?.due ?? 1)
  const { currency } = useCurrency()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    mutation.mutate(
      {
        name: name.trim(),
        type,
        balance,
        due,
        id: paymentMethod?.id.toString(),
      },
      {
        onSuccess: () => onSuccess(),
      }
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("grid items-start gap-6", className)}
    >
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              autoComplete="off"
              placeholder="e.g. Forex"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {!name && <FieldError>Name is required</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Type</FieldLabel>
            <Select
              value={type}
              onValueChange={(v) => setType(v as "savings" | "credit")}
            >
              <SelectTrigger className="w-full text-base md:text-sm">
                <SelectValue placeholder="Savings or Credit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="savings" className="text-base md:text-sm">
                    Savings
                  </SelectItem>
                  <SelectItem value="credit" className="text-base md:text-sm">
                    Credit
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="name">
              {type === "savings" ? "Balance" : "Limit"}
            </FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>{currency.symbol}</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id={type === "savings" ? "balance" : "limit"}
                type="number"
                autoComplete="off"
                className="text-base"
                placeholder={
                  type === "savings"
                    ? "Enter your starting balance"
                    : "Enter your monthly balance"
                }
                value={balance}
                onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>{currency.shortLabel}</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>

          {type === "credit" && (
            <Field>
              <FieldLabel htmlFor="due">Due Date</FieldLabel>
              <Input
                id="due"
                type="number"
                autoComplete="off"
                placeholder="e.g. 8 as in 8th of every month"
                value={due}
                onChange={(e) => setDue(parseInt(e.target.value))}
              />
              {(due < 1 || due > 31) && (
                <FieldError>Due date should be within 1 and 31</FieldError>
              )}
            </Field>
          )}
        </FieldGroup>
      </FieldSet>

      <Button
        type="submit"
        disabled={mutation.isPending || due < 1 || due > 31}
      >
        {mutation.isPending ? "Saving..." : isEditing ? "Save" : "Create"}
      </Button>
    </form>
  )
}
