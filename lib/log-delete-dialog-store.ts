import { create } from "zustand"

type LogDeleteDialogState = {
  isOpen: boolean
  showDialog: () => void
  hideDialog: () => void
  toggleDialog: () => void
  logIdToDelete: string | null
  setLogIdToDelete: (logId: string | null) => void
}

export const useLogDeleteDialogStore = create<LogDeleteDialogState>((set) => ({
  isOpen: false,
  showDialog: () => set({ isOpen: true }),
  hideDialog: () => set({ isOpen: false }),
  toggleDialog: () => set((state) => ({ isOpen: !state.isOpen })),

  logIdToDelete: null,
  setLogIdToDelete: (logId: string | null) => set({ logIdToDelete: logId }),
}))
