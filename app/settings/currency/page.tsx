"use client"

import { Button } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { CURRENCIES } from "@/lib/constants"
import { ArrowLeftIcon, CheckIcon } from "lucide-react"
import Link from "next/link"

export default function CurrencySettingsPage() {
  const [currency, setCurrency] = useLocalStorage("currency", "1")

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-4xl flex-1 p-6">
        <div className="mb-6 flex gap-3">
          <Link href="/settings">
            <Button variant="ghost" size="icon-xs" asChild>
              <ArrowLeftIcon />
            </Button>
          </Link>
          <h2 className="text-xl font-semibold tracking-tight">Currency</h2>
        </div>

        <div className="flex w-full flex-col rounded-md bg-muted">
          {CURRENCIES.map((c) => (
            <Item
              key={c.id}
              className="h-[50px]"
              onClick={() => setCurrency(c.id.toString())}
            >
              <ItemContent>
                <ItemTitle>
                  {c.flag} {c.fullLabel} ({c.shortLabel})
                </ItemTitle>
              </ItemContent>
              {parseInt(currency) === c.id && (
                <ItemActions>
                  <CheckIcon fontSize="12" />
                </ItemActions>
              )}
            </Item>
          ))}
        </div>
      </main>
    </div>
  )
}
