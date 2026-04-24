"use client"

import { Button } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item"
import { Switch } from "@/components/ui/switch"
import { useCurrency } from "@/hooks/use-currency"
import { useAppStore } from "@/lib/store"
import { haptic } from "ios-haptics"
import { ChevronRightIcon } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"

export default function SettingsPage() {
  const { resolvedTheme, setTheme } = useTheme()
  const { categories, paymentMethods, users } = useAppStore()
  const { currency } = useCurrency()

  const toggleTheme = () => {
    haptic()
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-4xl flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight">Settings</h2>
        </div>

        <div className="flex w-full flex-col rounded-md bg-muted">
          <Item className="h-[50px]" onClick={toggleTheme}>
            <ItemContent>
              <ItemTitle>Dark Mode</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Switch
                checked={resolvedTheme === "dark"}
                onClick={toggleTheme}
              />
            </ItemActions>
          </Item>

          <Item className="h-[50px]" asChild onClick={haptic}>
            <Link href="/settings/currency">
              <ItemContent>
                <ItemTitle>Currency</ItemTitle>
              </ItemContent>
              <ItemActions>
                {currency.flag} {currency.shortLabel}
                <Button variant="ghost" size="icon-xs" asChild>
                  <ChevronRightIcon />
                </Button>
              </ItemActions>
            </Link>
          </Item>

          <Item className="h-[50px]" asChild onClick={haptic}>
            <Link href="/settings/categories">
              <ItemContent>
                <ItemTitle>Categories</ItemTitle>
              </ItemContent>
              <ItemActions>
                {categories.length}
                <Button variant="ghost" size="icon-xs" asChild>
                  <ChevronRightIcon />
                </Button>
              </ItemActions>
            </Link>
          </Item>

          <Item className="h-[50px]" asChild onClick={haptic}>
            <Link href="/settings/payments">
              <ItemContent>
                <ItemTitle>Payment Methods</ItemTitle>
              </ItemContent>
              <ItemActions>
                {paymentMethods.length}
                <Button variant="ghost" size="icon-xs" asChild>
                  <ChevronRightIcon />
                </Button>
              </ItemActions>
            </Link>
          </Item>

          <Item className="h-[50px]" asChild onClick={haptic}>
            <Link href="/settings/users">
              <ItemContent>
                <ItemTitle>Users</ItemTitle>
              </ItemContent>
              <ItemActions>
                {users.length}
                <Button variant="ghost" size="icon-xs" asChild>
                  <ChevronRightIcon />
                </Button>
              </ItemActions>
            </Link>
          </Item>
        </div>
      </main>
    </div>
  )
}
