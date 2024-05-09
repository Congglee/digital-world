import { Row } from '@tanstack/react-table'
import { Eye, FoldHorizontalIcon, LockKeyhole, Mail, Pencil, Trash2 } from 'lucide-react'
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
  enableViewDetail?: boolean

  onDelete?: () => void
  onEdit?: () => void
  onEditPassword?: () => void
  onSendMail?: () => void
  onViewDetail?: () => void
}

export default function DataTableRowActions<TData>(props: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'>
          <FoldHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        {props.enableViewDetail && (
          <>
            <DropdownMenuItem
              disabled={!props.enableViewDetail}
              className='cursor-pointer'
              onClick={() => {
                if (props.onViewDetail) props.onViewDetail()
              }}
            >
              <Eye className='w-4 h-4 mr-2' />
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          disabled={!props.enableEditing}
          onClick={() => {
            if (props.onEdit) props.onEdit()
          }}
          className='cursor-pointer'
        >
          <Pencil className='w-4 h-4 mr-2' />
          Cập nhật
        </DropdownMenuItem>
        {props.enableEditPassword && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={!props.enableEditPassword}
              className='cursor-pointer'
              onClick={() => {
                if (props.onEditPassword) props.onEditPassword()
              }}
            >
              <LockKeyhole className='w-4 h-4 mr-2' />
              Đổi mật khẩu
            </DropdownMenuItem>
          </>
        )}
        {props.enableSendMail && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={!props.enableSendMail}
              className='cursor-pointer'
              onClick={() => {
                if (props.onSendMail) props.onSendMail()
              }}
            >
              <Mail className='w-4 h-4 mr-2' />
              Gửi mail
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={!props.enableDeleting}
          className='cursor-pointer'
          onClick={() => {
            if (props.onDelete) props.onDelete()
          }}
        >
          <Trash2 className='w-4 h-4 mr-2' />
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
