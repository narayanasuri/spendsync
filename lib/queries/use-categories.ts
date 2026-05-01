"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Category } from "@/lib/types"

const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch("/api/categories")
  if (!response.ok) {
    throw new Error("Failed to fetch categories")
  }
  const data = await response.json()
  return Array.isArray(data) ? data : []
}

export const CATEGORIES_QUERY_KEY = ["categories"] as const

export const useCategories = () => {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: fetchCategories,
  })
}

export const useCategoryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      name,
      icon,
      type,
      color,
      id,
    }: {
      name: string
      icon: string | null
      type: "expense" | "income"
      color: string
      id?: string
    }) => {
      const isEditing = !!id
      const res = await fetch(
        isEditing ? `/api/categories/${id}` : "/api/categories",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, icon, type, color }),
        }
      )

      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Operation failed")
      return json
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY })
    },
  })
}

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY })
    },
  })
}

export const useInvalidateCategories = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY })
}
