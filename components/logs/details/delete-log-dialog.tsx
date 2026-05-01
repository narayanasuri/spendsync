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
import { Trash2Icon } from "lucide-react"
import { useCallback, useState } from "react"

export const DeleteLogDialog = () => {
  const { isOpen, toggleDialog, logIdToDelete } = useLogDeleteDialogStore()
  const [deleting, setDeleting] = useState(false)
  const back = useBackButton("/logs")

  const onConfirmDeletion = useCallback(async () => {
    setDeleting(true)
    await fetch(`/api/logs/${logIdToDelete}`, { method: "DELETE" })
    setDeleting(false)
    back()
  }, [logIdToDelete, setDeleting])

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
          <AlertDialogCancel variant="outline" disabled={deleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleting}
            onClick={onConfirmDeletion}
          >
            {deleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
