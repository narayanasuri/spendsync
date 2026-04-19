import { CURRENCIES } from "@/lib/constants"
import { useMemo, useState } from "react"

const LOCAL_STORAGE_KEY = "currency"

export function useCurrency() {
  const [currencyId, setCurrencyId] = useState<number>(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY)
      if (item) {
        const stringified = JSON.parse(item)
        return parseInt(stringified)
      }
      return 1
    } catch (error) {
      console.error("Error fetching currency from localStorage")
      return 1
    }
  })

  const currency = useMemo(() => {
    const match = CURRENCIES.find((c) => c.id === currencyId)
    return match ?? CURRENCIES[0]
  }, [currencyId])

  const updateCurrency = (currencyId: number) => {
    try {
      setCurrencyId(currencyId)
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currencyId))
    } catch (error) {
      console.error("Error updating currency:", error)
    }
  }

  return {
    currency,
    updateCurrency,
  }
}
