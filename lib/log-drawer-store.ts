import { create } from "zustand"
import { Expense } from "./types"

type LogDrawerState = {
  isOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
  editingLog: Expense | null
  setEditingLog: (expense: Expense | null) => void
}

export const useLogDrawerStore = create<LogDrawerState>((set, get) => ({
  isOpen: false,
  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),
  toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),

  editingLog: null,
  setEditingLog: (expense: Expense | null) => set({ editingLog: expense }),
}))
