import { Row } from '@tanstack/react-table'
import { FoldHorizontalIcon, Pencil, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from 'src/components/ui/dropdown-menu'

import { Button } from 'src/components/ui/button'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  enableDeleting?: boolean
  enableEditing?: boolean
  onDelete?: () => void
  onEdit?: () => void
}

export default function DataTableRowActions<TData>({
  row,
  enableDeleting,
  enableEditing,
  onEdit,
  onDelete
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'>
          <FoldHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem
          disabled={!enableEditing}
          onClick={() => {
            if (onEdit) onEdit()
          }}
          className='cursor-pointer'
        >
          <Pencil className='w-4 h-4 mr-2' />
          Cập nhật
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={!enableDeleting}
          className='cursor-pointer'
          onClick={() => {
            if (onDelete) onDelete()
          }}
        >
          <Trash2 className='w-4 h-4 mr-2' />
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
