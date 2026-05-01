"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Budget } from "@/lib/types"

const fetchBudgets = async (): Promise<Budget[]> => {
  const response = await fetch("/api/budgets")
  if (!response.ok) {
    throw new Error("Failed to fetch budgets")
  }
  const data = await response.json()
  return Array.isArray(data) ? data : []
}

export const BUDGETS_QUERY_KEY = ["budgets"] as const

export const useBudgets = () => {
  return useQuery({
    queryKey: BUDGETS_QUERY_KEY,
    queryFn: fetchBudgets,
  })
}

export const useInvalidateBudgets = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEY })
}
