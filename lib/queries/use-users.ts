"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { User } from "@/lib/types"

const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch("/api/users")
  if (!response.ok) throw new Error("Failed to fetch users")
  return response.json()
}

export const USERS_QUERY_KEY = ["users"] as const

export const useUsers = () => {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: fetchUsers,
  })
}

export const useUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ name, id }: { name: string; id?: string }) => {
      const isEditing = !!id
      const res = await fetch(isEditing ? `/api/users/${id}` : "/api/users", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Operation failed")
      return json
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
    },
  })
}

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
    },
  })
}

export const useInvalidateUsers = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
}
