"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"

export const AppStoreInitializer = () => {
  const { hydrated, refresh } = useAppStore()

  useEffect(() => {
    if (!hydrated) refresh()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
