"use client"

import { CURRENCIES } from "@/lib/constants"
import { useMemo, useState, useEffect } from "react"

const LOCAL_STORAGE_KEY = "currency"

export const useCurrency = () => {
  // 1. Start with the default to match the Server-Side Render
  const [currencyId, setCurrencyId] = useState<number>(1)

  // 2. Sync with localStorage only after the component mounts
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY)
      if (item) {
        // Since you store it with JSON.stringify(number),
        // JSON.parse(item) returns a number directly.
        setCurrencyId(JSON.parse(item))
      }
    } catch (error) {
      console.error("Error fetching currency:", error)
    }
  }, [])

  const currency = useMemo(() => {
    return CURRENCIES.find((c) => c.id === currencyId) ?? CURRENCIES[0]
  }, [currencyId])

  const updateCurrency = (id: number) => {
    try {
      setCurrencyId(id)
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(id))
    } catch (error) {
      console.error("Error updating currency:", error)
    }
  }

  return { currency, updateCurrency }
}
