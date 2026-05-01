"use client"

import { Fragment } from "react"
import { Button } from "@/components/ui/button"
import { PencilIcon, PlusIcon, UserIcon } from "lucide-react"
import { User } from "@/lib/types"
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"

const EmptyUsersState = ({ onAdd }: { onAdd: () => void }) => {
  return (
    <Empty className="my-[25%] w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="size-8">
          <UserIcon className="size-6" />
        </EmptyMedia>
        <EmptyTitle className="text-base">No users added</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" onClick={onAdd}>
          <PlusIcon />
          Add New
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export const UsersList = ({
  users,
  onAdd,
  onEdit,
}: {
  users: User[]
  onAdd: () => void
  onEdit: (user: User) => void
}) => {
  if (users.length === 0) {
    return <EmptyUsersState onAdd={onAdd} />
  }

  return (
    <ItemGroup className="gap-1">
      {users.map((user, index) => (
        <Fragment key={user.id}>
          <Item onClick={() => onEdit(user)}>
            <ItemContent>
              <ItemTitle className="text-base">{user.name}</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Button variant="ghost" size="icon-sm">
                <PencilIcon />
              </Button>
            </ItemActions>
          </Item>
          {index !== users.length - 1 && (
            <ItemSeparator className="m-0 w-full" />
          )}
        </Fragment>
      ))}
      <Item onClick={onAdd}>
        <ItemContent>
          <Button variant="ghost">
            <PlusIcon />
            Add New
          </Button>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
