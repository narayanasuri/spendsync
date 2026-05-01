import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Expense } from "@/lib/types"
import { LogItem } from "@/components/logs/log-item"
import { PencilIcon, TrashIcon } from "lucide-react"
import { useLogDrawerStore } from "@/lib/log-drawer-store"
import { useLogDeleteDialogStore } from "@/lib/log-delete-dialog-store"

export function LogItemWrapper({ log }: { log: Expense }) {
  const { setEditingLog, openDrawer } = useLogDrawerStore()
  const { setLogIdToDelete, showDialog } = useLogDeleteDialogStore()

  const onEdit = () => {
    setEditingLog(log)
    openDrawer()
  }

  const onDelete = () => {
    setLogIdToDelete(log.id.toString())
    showDialog()
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger className="w-full">
        <LogItem log={log} />
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem onClick={onEdit}>
            <PencilIcon />
            Edit
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive" onClick={onDelete}>
            <TrashIcon />
            Delete
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  )
}
