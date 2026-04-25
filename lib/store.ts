import { create } from "zustand"
import { Budget, Category, Expense, PaymentMethod, User } from "./types"

type AppStore = {
  editingLog: Expense | null

  loading: boolean
  hydrated: boolean

  categories: Category[]
  paymentMethods: PaymentMethod[]
  users: User[]
  budgets: Budget[]

  setEditingLog: (expense: Expense | null) => void

  refreshCategories: () => Promise<void>
  refreshPaymentMethods: () => Promise<void>
  refreshUsers: () => Promise<void>
  refreshBudgets: () => Promise<void>
  // Fetch all four — called once on app load, and after mutations
  refresh: () => Promise<void>
}

export const useAppStore = create<AppStore>((set, get) => ({
  loading: false,
  hydrated: false,

  editingLog: null,
  setEditingLog: (expense: Expense | null) => set({ editingLog: expense }),

  categories: [],
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

  paymentMethods: [],
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

  users: [],
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

  budgets: [],
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
