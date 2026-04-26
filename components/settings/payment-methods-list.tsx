"use client"

import { Fragment } from "react"
import { Button } from "@/components/ui/button"
import {
  CreditCardIcon,
  LandmarkIcon,
  PencilIcon,
  PlusIcon,
} from "lucide-react"
import { PaymentMethod } from "@/lib/types"
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"

function EmptyPaymentMethodsState({ onAdd }: { onAdd: () => void }) {
  return (
    <Empty className="my-[50%] w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="size-8">
          <CreditCardIcon className="size-6" />
        </EmptyMedia>
        <EmptyTitle className="text-base">No payment methods added</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" onClick={onAdd}>
          <PlusIcon />
          Add New
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export function PaymentMethodsList({
  paymentMethods,
  onAdd,
  onEdit,
}: {
  paymentMethods: PaymentMethod[]
  onAdd: () => void
  onEdit: (paymentMethod: PaymentMethod) => void
}) {
  if (paymentMethods.length === 0) {
    return <EmptyPaymentMethodsState onAdd={onAdd} />
  }

  return (
    <ItemGroup className="gap-1">
      {paymentMethods.map((method, index) => (
        <Fragment key={method.id}>
          <Item onClick={() => onEdit(method)}>
            <ItemContent>
              <ItemTitle className="text-base">
                {method.type === "credit" ? (
                  <CreditCardIcon />
                ) : (
                  <LandmarkIcon />
                )}
                {method.name}
              </ItemTitle>
            </ItemContent>
            <ItemActions>
              <Button variant="ghost" size="icon-sm">
                <PencilIcon />
              </Button>
            </ItemActions>
          </Item>
          {index !== paymentMethods.length - 1 && (
            <ItemSeparator className="m-0 w-full" />
          )}
        </Fragment>
      ))}
      <Item onClick={onAdd}>
        <ItemContent>
          <Button variant="ghost">
            <PlusIcon />
            Add New
          </Button>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
