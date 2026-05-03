"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { haptic } from "ios-haptics"
import { ReceiptIcon } from "./icons/receipt-icon"
import { CogIcon } from "./icons/cog-icon"
import { ChartIcon } from "./icons/chart-icon"
import { GridIcon } from "./icons/grid-icon"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "./icons/plus-icon"
import { useLogDrawerStore } from "@/lib/log-drawer-store"

const navItems = [
  { label: "Overview", href: "/", icon: ChartIcon },
  { label: "Logs", href: "/logs", icon: ReceiptIcon },
  { label: "New", href: "/add", icon: PlusIcon, isCenter: true },
  { label: "Budgets", href: "/budgets", icon: GridIcon },
  { label: "Settings", href: "/settings", icon: CogIcon },
]

export const Navbar = () => {
  const pathname = usePathname()
  const { openDrawer } = useLogDrawerStore()

  const onNewLog = () => {
    haptic()
    openDrawer()
  }

  if (pathname === "/login") return null

  return (
    <>
      <nav className="fixed bottom-0 left-1/2 z-50 w-full -translate-x-1/2 border-t bg-background pt-1 pb-6 md:mb-3 md:w-md md:rounded-2xl md:border md:pb-1 md:shadow-lg">
        <div className="mx-auto grid h-16 max-w-lg grid-cols-5">
          {navItems.map(({ label, href, icon: Icon, isCenter }) => {
            const active = pathname === href

            // Special styling for the center "Plus" button
            if (isCenter) {
              return (
                <div key={href} className="flex items-center justify-center">
                  <Button
                    size="icon"
                    aria-label="Submit"
                    onClick={onNewLog}
                    className="w-[56px] bg-foreground"
                  >
                    <Icon className="size-5" />
                  </Button>
                </div>
              )
            }

            return (
              <Link
                key={href}
                href={href}
                replace
                onClick={haptic}
                data-active={active ? "" : undefined}
                className={cn(
                  "group inline-flex flex-col items-center justify-center px-5 transition-colors",
                  "text-muted-foreground/40 hover:text-foreground/60",
                  "data-active:font-medium data-active:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "text-body group-hover:text-fg-brand mb-1 h-6 w-6 transition-colors",
                    "data-active:text-fg-brand"
                  )}
                  data-active={active ? "true" : undefined}
                />
                <span className="sr-only">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
