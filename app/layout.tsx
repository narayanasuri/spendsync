import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import "./globals.css"
import { Navbar } from "@/components/shared/navbar"
import { AppStoreInitializer } from "@/components/app-store-initializer"
import { APP_NAME } from "@/lib/constants"
import { CurrencyInitializer } from "@/components/currency-initializer"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: "",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="light dark" />
        <link rel="icon" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <ThemeProvider>
          <TooltipProvider>
            <Navbar />
            <AppStoreInitializer />
            <CurrencyInitializer />
            {children}
            {/* Prevent content from being hidden behind the mobile bottom nav */}
            <div className="h-16 sm:hidden" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
