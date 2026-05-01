"use client"

import { EllipsisIcon, PencilIcon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLogDrawerStore } from "@/lib/log-drawer-store"
import { useLogDeleteDialogStore } from "@/lib/log-delete-dialog-store"
import { Expense } from "@/lib/types"

export const ExpenseActionMenu = ({ log }: { log: Expense }) => {
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
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={onEdit}>
              <PencilIcon />
              Edit
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              onSelect={(e) => {
                e.preventDefault()
                onDelete()
              }}
            >
              <TrashIcon />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
