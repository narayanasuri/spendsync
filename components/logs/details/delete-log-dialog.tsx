import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useBackButton } from "@/hooks/use-back-button"
import { useLogDeleteDialogStore } from "@/lib/log-delete-dialog-store"
import { useDeleteLog } from "@/lib/mutations/use-log-mutations"
import { Trash2Icon } from "lucide-react"
import { useCallback } from "react"

export const DeleteLogDialog = () => {
  const { isOpen, toggleDialog, logIdToDelete } = useLogDeleteDialogStore()
  const back = useBackButton("/logs")
  const deleteLogMutation = useDeleteLog()

  const onConfirmDeletion = useCallback(async () => {
    if (!logIdToDelete) return

    try {
      await deleteLogMutation.mutateAsync(parseInt(logIdToDelete))
      back()
    } catch (error) {
      console.error("Failed to delete log:", error)
      // Error is already handled by the mutation
    }
  }, [logIdToDelete, deleteLogMutation, back])

  return (
    <AlertDialog open={isOpen} onOpenChange={toggleDialog}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete expense?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this expense and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            variant="outline"
            disabled={deleteLogMutation.isPending}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteLogMutation.isPending}
            onClick={onConfirmDeletion}
          >
            {deleteLogMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
