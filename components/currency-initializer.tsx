"use client"

import { useEffect } from "react"
import { useCurrency } from "@/hooks/use-currency"
import { CURRENCY_LOCAL_STORAGE_KEY } from "@/lib/constants"

export function CurrencyInitializer() {
  const { updateCurrency } = useCurrency()

  useEffect(() => {
    const stored = window.localStorage.getItem(CURRENCY_LOCAL_STORAGE_KEY)

    if (!stored) {
      updateCurrency(1)
    }
  }, [updateCurrency])

  return null
}
