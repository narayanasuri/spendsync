"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { Expense } from "@/lib/types"
import { formatToLocalDate } from "@/lib/utils"

const DATE_NOW = new Date()
const DATE_MONTH_START = new Date(
  DATE_NOW.getFullYear(),
  DATE_NOW.getMonth(),
  1
)

const PAGE_SIZE = 20

interface UseLogsParams {
  from?: Date
  to?: Date
  categoryId?: string
  paymentMethodId?: string
  transactionType?: string
}

const fetchLogs = async ({
  pageParam = 0,
  from = DATE_MONTH_START,
  to = DATE_NOW,
  categoryId,
  paymentMethodId,
  transactionType,
}: UseLogsParams & { pageParam?: number }): Promise<Expense[]> => {
  const params = new URLSearchParams({
    limit: PAGE_SIZE.toString(),
    page: pageParam.toString(),
  })

  if (categoryId && categoryId !== "all") params.set("category_id", categoryId)
  if (paymentMethodId && paymentMethodId !== "all")
    params.set("payment_mode_id", paymentMethodId)
  if (transactionType && transactionType !== "all")
    params.set("transaction_type", transactionType)
  if (from) params.set("from", formatToLocalDate(from))
  if (to) params.set("to", formatToLocalDate(to))

  const response = await fetch(`/api/logs?${params}`)
  if (!response.ok) {
    throw new Error("Failed to load expenses")
  }
  return response.json()
}

export const LOGS_QUERY_KEY = "logs"

export const useLogs = ({
  from = DATE_MONTH_START,
  to = DATE_NOW,
  categoryId,
  paymentMethodId,
  transactionType,
}: UseLogsParams = {}) => {
  const query = useInfiniteQuery({
    queryKey: [
      LOGS_QUERY_KEY,
      {
        from: formatToLocalDate(from),
        to: formatToLocalDate(to),
        categoryId,
        paymentMethodId,
        transactionType,
      },
    ],
    queryFn: ({ pageParam }) =>
      fetchLogs({
        pageParam,
        from,
        to,
        categoryId,
        paymentMethodId,
        transactionType,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has fewer items than PAGE_SIZE, we've reached the end
      if (lastPage.length < PAGE_SIZE) {
        return undefined
      }
      return allPages.length
    },
  })

  // Flatten all pages into a single array
  const logs = query.data?.pages.flat() ?? []

  return {
    logs,
    loading: query.isLoading,
    error: query.error?.message,
    hasMore: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  }
}
