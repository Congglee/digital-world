import { Row } from '@tanstack/react-table'
import { FoldHorizontalIcon, LockKeyhole, Mail, Pencil, Trash2 } from 'lucide-react'
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
  enableEditPassword?: boolean
  enableSendMail?: boolean

  onDelete?: () => void
  onEdit?: () => void
  onEditPassword?: () => void
  onSendMail?: () => void
}

export default function DataTableRowActions<TData>({
  row,
  enableDeleting,
  enableEditing,
  enableEditPassword,
  enableSendMail,
  onEdit,
  onEditPassword,
  onSendMail,
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
        {enableEditPassword && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={!enableEditPassword}
              className='cursor-pointer'
              onClick={() => {
                if (onEditPassword) onEditPassword()
              }}
            >
              <LockKeyhole className='w-4 h-4 mr-2' />
              Đổi mật khẩu
            </DropdownMenuItem>
          </>
        )}
        {enableSendMail && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={!enableSendMail}
              className='cursor-pointer'
              onClick={() => {
                if (onSendMail) onSendMail()
              }}
            >
              <Mail className='w-4 h-4 mr-2' />
              Gửi mail
            </DropdownMenuItem>
          </>
        )}
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
