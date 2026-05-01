"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { PaymentMethod } from "@/lib/types"

const fetchPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const response = await fetch("/api/payment-methods")
  if (!response.ok) {
    throw new Error("Failed to fetch payment methods")
  }
  const data = await response.json()
  return Array.isArray(data) ? data : []
}

export const PAYMENT_METHODS_QUERY_KEY = ["payment-methods"] as const

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: PAYMENT_METHODS_QUERY_KEY,
    queryFn: fetchPaymentMethods,
  })
}

export const usePaymentMethodMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      name,
      type,
      balance,
      due,
      id,
    }: {
      name: string
      type: string
      balance: number
      due: number
      id?: string
    }) => {
      const isEditing = !!id
      const res = await fetch(
        isEditing ? `/api/payment-methods/${id}` : "/api/payment-methods",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, type, balance, due }),
        }
      )

      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Operation failed")
      return json
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEY })
    },
  })
}

export const useDeletePaymentMethodMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/payment-methods/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEY })
    },
  })
}

export const useInvalidatePaymentMethods = () => {
  const queryClient = useQueryClient()
  return () =>
    queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEY })
}
