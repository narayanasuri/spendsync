"use client"

import { useEffect } from "react"
import {
  CATEGORIES_QUERY_KEY,
  PAYMENT_METHODS_QUERY_KEY,
  USERS_QUERY_KEY,
} from "@/lib/queries"
import { useQueryClient } from "@tanstack/react-query"

export const AppStoreInitializer = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    // Prefetch all core data on app mount
    queryClient.prefetchQuery({
      queryKey: CATEGORIES_QUERY_KEY,
      queryFn: async () => {
        const res = await fetch("/api/categories")
        return res.json()
      },
    })
    queryClient.prefetchQuery({
      queryKey: PAYMENT_METHODS_QUERY_KEY,
      queryFn: async () => {
        const res = await fetch("/api/payment-methods")
        return res.json()
      },
    })
    queryClient.prefetchQuery({
      queryKey: USERS_QUERY_KEY,
      queryFn: async () => {
        const res = await fetch("/api/users")
        return res.json()
      },
    })
  }, [queryClient])

  return null
}
