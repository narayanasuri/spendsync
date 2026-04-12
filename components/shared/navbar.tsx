"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  ChartSplineIcon,
  CirclePlusIcon,
  MoonIcon,
  Rows3Icon,
  SunIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { APP_NAME } from "@/config"

const navItems = [
  { label: "Summary", href: "/", icon: ChartSplineIcon },
  { label: "New Expense", href: "/add", icon: CirclePlusIcon },
  { label: "Expenses", href: "/expenses", icon: Rows3Icon },
]

export function Navbar() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()

  if (pathname === "/login") return null

  return (
    <>
      {/* Desktop: sticky top bar */}
      <header className="sticky top-0 z-50 hidden w-full border-b border-border bg-background/80 backdrop-blur-sm sm:block">
        <div className="mx-auto flex h-12 max-w-4xl items-center justify-between px-6">
          <div className="flex items-center gap-1.5">
            <Avatar>
              <AvatarImage src="/icon.png" alt={APP_NAME} />
              <AvatarFallback>
                {APP_NAME.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold tracking-tight">
              {APP_NAME}
            </span>
          </div>

          <nav className="flex items-center gap-1">
            {navItems.map(({ label, href, icon: Icon }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  <span>{label}</span>
                </Link>
              )
            })}
          </nav>

          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            aria-label="Toggle theme"
          >
            <SunIcon className="size-4 dark:hidden" />
            <MoonIcon className="hidden size-4 dark:block" />
          </Button>
        </div>
      </header>

      {/* Mobile: fixed bottom bar */}
      <nav className="fixed right-0 bottom-0 left-0 z-50 flex items-center border-t border-border bg-background/90 backdrop-blur-sm sm:hidden">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors",
                active ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("size-5", active && "stroke-[2.5]")} />
              <span>{label}</span>
            </Link>
          )
        })}
        <button
          className="flex flex-1 flex-col items-center gap-1 py-3 text-xs text-muted-foreground transition-colors"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <SunIcon className="size-5 dark:hidden" />
          <MoonIcon className="hidden size-5 dark:block" />
          <span>Theme</span>
        </button>
      </nav>
    </>
  )
}
