"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { LOGS_QUERY_KEY } from "@/hooks/use-logs"
import { PAYMENT_METHODS_QUERY_KEY, LOG_QUERY_KEY } from "@/lib/queries"
import { Expense } from "@/lib/types"

// Formats a Date as a local ISO string (no UTC conversion)
const formatLocalISO = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`
}

interface CreateLogInput {
  transaction_type: "expense" | "income"
  name: string
  amount: number
  description?: string
  category: string
  payment_mode: string
  spent_at: Date
  paid_by: string
}

interface UpdateLogInput extends CreateLogInput {
  id: number
  old_amount: number
  old_payment_method_id: number
}

// CREATE LOG
const createLog = async (data: CreateLogInput): Promise<Expense> => {
  const response = await fetch("/api/logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      amount: data.amount.toString(),
      spent_at: formatLocalISO(data.spent_at),
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error ?? "Failed to create log")
  }

  return response.json()
}

export const useCreateLog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createLog,
    onSuccess: () => {
      // Invalidate logs query to refetch with new log
      queryClient.invalidateQueries({ queryKey: [LOGS_QUERY_KEY] })
      // Invalidate payment methods as balance may have changed
      queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEY })
    },
  })
}

// UPDATE LOG
const updateLog = async (data: UpdateLogInput): Promise<Expense> => {
  const { id, ...updateData } = data
  const response = await fetch(`/api/logs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...updateData,
      amount: updateData.amount.toString(),
      spent_at: formatLocalISO(updateData.spent_at),
      old_amount: data.old_amount,
      old_payment_method_id: data.old_payment_method_id,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error ?? "Failed to update log")
  }

  return response.json()
}

export const useUpdateLog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateLog,
    onSuccess: (data) => {
      // Invalidate logs query to refetch with updated log
      queryClient.invalidateQueries({ queryKey: [LOGS_QUERY_KEY] })
      // Invalidate the specific log query
      queryClient.invalidateQueries({
        queryKey: [LOG_QUERY_KEY, data.id.toString()],
      })
      // Invalidate payment methods as balance may have changed
      queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEY })
    },
  })
}

// DELETE LOG
const deleteLog = async (id: number): Promise<void> => {
  const response = await fetch(`/api/logs/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error ?? "Failed to delete log")
  }
}

export const useDeleteLog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteLog,
    onSuccess: (_, deletedId) => {
      // Invalidate logs query to refetch without deleted log
      queryClient.invalidateQueries({ queryKey: [LOGS_QUERY_KEY] })
      // Remove the specific log from cache
      queryClient.removeQueries({
        queryKey: [LOG_QUERY_KEY, deletedId.toString()],
      })
      // Invalidate payment methods as balance may have changed
      queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEY })
    },
  })
}
