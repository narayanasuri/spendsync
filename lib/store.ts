import { create } from "zustand"
import type { Tables } from "./database.types"

export type Category = Tables<"Categories">
export type PaymentMethod = Tables<"PaymentMethods">
export type User = Tables<"Users">

type AppStore = {
  categories: Category[]
  paymentMethods: PaymentMethod[]
  users: User[]
  loading: boolean
  hydrated: boolean

  // Fetch all three — called once on app load, and after mutations
  refresh: () => Promise<void>
}

export const useAppStore = create<AppStore>((set, get) => ({
  categories: [],
  paymentMethods: [],
  users: [],
  loading: false,
  hydrated: false,

  refresh: async () => {
    // Skip if already loading
    if (get().loading) return
    set({ loading: true })

    try {
      const [catRes, pmRes, userRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/payment-methods"),
        fetch("/api/users"),
      ])
      const [categories, paymentMethods, users] = await Promise.all([
        catRes.json(),
        pmRes.json(),
        userRes.json(),
      ])
      set({
        categories: Array.isArray(categories) ? categories : [],
        paymentMethods: Array.isArray(paymentMethods) ? paymentMethods : [],
        users: Array.isArray(users) ? users : [],
        hydrated: true,
      })
    } finally {
      set({ loading: false })
    }
  },
}))
