"use client"

import { Button } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { ChevronRightIcon } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"

export default function SettingsPage() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-4xl flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight">Settings</h2>
        </div>

        <div className="flex w-full flex-col rounded-md bg-muted">
          <Item
            className="h-[50px]"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            <ItemContent>
              <ItemTitle>Dark Mode</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Switch
                checked={resolvedTheme === "dark"}
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
              />
            </ItemActions>
          </Item>
          <Separator />
          <Item className="h-[50px]" asChild>
            <Link href="/settings/categories">
              <ItemContent>
                <ItemTitle>Categories</ItemTitle>
              </ItemContent>
              <ItemActions>
                <Button variant="ghost" size="icon-sm" asChild>
                  <ChevronRightIcon />
                </Button>
              </ItemActions>
            </Link>
          </Item>
          <Item className="h-[50px]" asChild>
            <Link href="/settings/payments">
              <ItemContent>
                <ItemTitle>Payment Methods</ItemTitle>
              </ItemContent>
              <ItemActions>
                <Button variant="ghost" size="icon-sm" asChild>
                  <ChevronRightIcon />
                </Button>
              </ItemActions>
            </Link>
          </Item>
          <Item className="h-[50px]" asChild>
            <Link href="/settings/users">
              <ItemContent>
                <ItemTitle>Users</ItemTitle>
              </ItemContent>
              <ItemActions>
                <Button variant="ghost" size="icon-sm" asChild>
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
