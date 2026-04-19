import { LastSelectedType } from "@/lib/types"
import { useCallback, useState } from "react"

const LOCAL_STORAGE_KEY = "last_selected"

export function useLastSelected() {
  const [lastSelected, setLastSelectedState] = useState<LastSelectedType>(
    () => {
      try {
        const item = window.localStorage.getItem(LOCAL_STORAGE_KEY)
        if (item) {
          return JSON.parse(item)
        }
        return {
          categoryId: null,
          paymentMethodId: null,
          userId: null,
        }
      } catch (error) {
        console.error("Error fetching currency from localStorage")
        return {
          categoryId: null,
          paymentMethodId: null,
          userId: null,
        }
      }
    }
  )

  const setLastSelected = useCallback(
    (value: LastSelectedType) => {
      try {
        setLastSelectedState(value)
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value))
      } catch (error) {
        console.error("Error updating currency:", error)
      }
    },
    [lastSelected]
  )

  return {
    lastSelected,
    setLastSelected,
  }
}
