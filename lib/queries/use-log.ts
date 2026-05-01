"use client"

import { useQuery } from "@tanstack/react-query"
import { Expense } from "@/lib/types"

const fetchLog = async (id: string): Promise<Expense> => {
  const response = await fetch(`/api/logs/${id}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error ?? "Failed to load expense")
  }

  return response.json()
}

export const LOG_QUERY_KEY = "log"

export const useLog = (id: string) => {
  return useQuery({
    queryKey: [LOG_QUERY_KEY, id],
    queryFn: () => fetchLog(id),
    enabled: !!id, // Only fetch if id exists
  })
}
