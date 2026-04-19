import { create } from "zustand"
import { Budget, Category, PaymentMethod, User } from "./types"

type AppStore = {
  categories: Category[]
  paymentMethods: PaymentMethod[]
  users: User[]
  budgets: Budget[]
  loading: boolean
  hydrated: boolean

  refreshCategories: () => Promise<void>
  refreshPaymentMethods: () => Promise<void>
  refreshUsers: () => Promise<void>
  refreshBudgets: () => Promise<void>
  // Fetch all four — called once on app load, and after mutations
  refresh: () => Promise<void>
}

export const useAppStore = create<AppStore>((set, get) => ({
  categories: [],
  paymentMethods: [],
  users: [],
  budgets: [],
  loading: false,
  hydrated: false,

  refreshCategories: async () => {
    // Skip if already loading
    if (get().loading) return
    set({ loading: true })

    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      set({
        categories: Array.isArray(data) ? data : [],
        hydrated: true,
      })
    } finally {
      set({ loading: false })
    }
  },
  refreshPaymentMethods: async () => {
    // Skip if already loading
    if (get().loading) return
    set({ loading: true })

    try {
      const response = await fetch("/api/payment-methods")
      const data = await response.json()
      set({
        paymentMethods: Array.isArray(data) ? data : [],
        hydrated: true,
      })
    } finally {
      set({ loading: false })
    }
  },
  refreshUsers: async () => {
    // Skip if already loading
    if (get().loading) return
    set({ loading: true })

    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      set({
        users: Array.isArray(data) ? data : [],
        hydrated: true,
      })
    } finally {
      set({ loading: false })
    }
  },
  refreshBudgets: async () => {
    // Skip if already loading
    if (get().loading) return
    set({ loading: true })

    try {
      const response = await fetch("/api/budgets")
      const data = await response.json()
      set({
        budgets: Array.isArray(data) ? data : [],
        hydrated: true,
      })
    } finally {
      set({ loading: false })
    }
  },
  refresh: async () => {
    // Skip if already loading
    if (get().loading) return
    set({ loading: true })

    try {
      const [catRes, pmRes, userRes, budgetsRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/payment-methods"),
        fetch("/api/users"),
        fetch("/api/budgets"),
      ])
      const [categories, paymentMethods, users, budgets] = await Promise.all([
        catRes.json(),
        pmRes.json(),
        userRes.json(),
        budgetsRes.json(),
      ])
      set({
        categories: Array.isArray(categories) ? categories : [],
        paymentMethods: Array.isArray(paymentMethods) ? paymentMethods : [],
        users: Array.isArray(users) ? users : [],
        budgets: Array.isArray(budgets) ? budgets : [],
        hydrated: true,
      })
    } finally {
      set({ loading: false })
    }
  },
}))
