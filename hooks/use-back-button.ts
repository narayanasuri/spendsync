"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"

export const useBackButton = (target: string) => {
  const router = useRouter()

  const goBack = useCallback(() => {
    // Check if there is history to go back to within the app
    if (typeof window !== "undefined" && window.history.state?.idx > 0) {
      router.back()
    } else {
      router.replace(target)
    }
  }, [router, target])

  return goBack
}
