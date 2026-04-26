"use client"

import { Fragment } from "react"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { useBackButton } from "@/hooks/use-back-button"
import { CURRENCIES } from "@/lib/constants"
import { ArrowLeftIcon, CheckIcon } from "lucide-react"
import { useCurrency } from "@/hooks/use-currency"

export default function CurrencySettingsPage() {
  const { currency, updateCurrency } = useCurrency()
  const back = useBackButton("/settings")

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-4xl flex-1 p-6">
        <div className="mb-6 flex gap-3">
          <Button variant="ghost" size="icon-xs" onClick={back}>
            <ArrowLeftIcon />
          </Button>
          <h2 className="text-xl font-semibold tracking-tight">Currency</h2>
        </div>

        <ItemGroup className="gap-1">
          {CURRENCIES.map((c, index) => (
            <Fragment key={c.id}>
              <Item onClick={() => updateCurrency(c.id)}>
                <ItemContent>
                  <ItemTitle className="text-[16px]">
                    {c.flag} {c.fullLabel} ({c.shortLabel})
                  </ItemTitle>
                </ItemContent>
                {currency.id === c.id && (
                  <ItemActions>
                    <CheckIcon className="size-5" />
                  </ItemActions>
                )}
              </Item>
              {index !== CURRENCIES.length - 1 && (
                <ItemSeparator className="m-0 w-full" />
              )}
            </Fragment>
          ))}
        </ItemGroup>
      </main>
    </div>
  )
}
