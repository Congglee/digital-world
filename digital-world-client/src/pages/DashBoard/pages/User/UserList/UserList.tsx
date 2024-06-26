import { pdf } from '@react-pdf/renderer'
import { ColumnDef } from '@tanstack/react-table'
import { saveAs } from 'file-saver'
import { CircleUserRound, PlusCircle, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ConfirmDialog from 'src/components/AdminPanel/ConfirmDialog'
import DataTable from 'src/components/AdminPanel/DataTable'
import DataTableColumnHeader from 'src/components/AdminPanel/DataTableColumnHeader'
import DataTableRowActions from 'src/components/AdminPanel/DataTableRowActions'
import PageHeading from 'src/components/AdminPanel/PageHeading'
import { Badge } from 'src/components/ui/badge'
import { Button } from 'src/components/ui/button'
import { Checkbox } from 'src/components/ui/checkbox'
import path from 'src/constants/path'
import AddUserDrawer from 'src/pages/DashBoard/pages/User/components/AddUserDrawer'
import PDFUsersTableDocument from 'src/pages/DashBoard/pages/User/components/PDFUsersTable'
import { useDeleteManyUsersMutation, useDeleteUserMutation, useGetAllUsersQuery } from 'src/redux/apis/user.api'
import { useAppSelector } from 'src/redux/hook'
import { Role, User } from 'src/types/user.type'
import { getAvatarUrl, getVerifyStatusLabel } from 'src/utils/utils'

const exportDataHeaders = [
  'ID',
  'Họ và tên',
  'Email',
  'Avatar',
  'Ngày sinh',
  'Địa chỉ',
  'Tỉnh',
  'Quận huyện',
  'Phường',
  'SĐT'
]

export default function UserList() {
  const { data: usersData } = useGetAllUsersQuery()
  const [addUserDrawerOpen, setAddUserDrawerOpen] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedUsersIds, setSelectedUsersIds] = useState<string[]>([])
  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState<boolean>(false)
  const [deleteUsersDialogOpen, setDeleteUsersDialogOpen] = useState<boolean>(false)

  const { profile } = useAppSelector((state) => state.auth)
  const usersList = usersData?.data.users.filter((user) => user._id !== profile?._id)

  const [deleteUser, deleteUserResult] = useDeleteUserMutation()
  const [deleteManyUsers, deleteManyUsersResult] = useDeleteManyUsersMutation()
  const navigate = useNavigate()

  const csvExportUsersData = useMemo(() => {
    const rows = usersList
      ? usersList.map((user) => [
          user._id,
          user.name,
          user.email,
          user.avatar || '',
          user.date_of_birth || '',
          user.address || '',
          user.province || '',
          user.district || '',
          user.ward || '',
          user.phone || ''
        ])
      : []
    return [exportDataHeaders, ...rows]
  }, [usersList])

  const handleDeleteUser = async (id: string) => {
    await deleteUser(id)
  }

  const handleDeleteManyUsers = async (usersIds: string[]) => {
    await deleteManyUsers({ list_id: usersIds })
  }

  const handleDownloadPdf = useCallback(() => {
    pdf(<PDFUsersTableDocument users={usersList!} />)
      .toBlob()
      .then((blob) => saveAs(blob, 'danh_sach_nguoi_dung.pdf'))
  }, [usersList])

  useEffect(() => {
    if (deleteUserResult.isSuccess) {
      toast.success(deleteUserResult.data.data.message)
    }
  }, [deleteUserResult.isSuccess])

  useEffect(() => {
    if (deleteManyUsersResult.isSuccess) {
      toast.success(deleteManyUsersResult.data.data.message)
    }
  }, [deleteManyUsersResult.isSuccess])

  const columns: ColumnDef<User>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
          className='translate-y-[2px]'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value)
            const userId = row.original._id
            if (!row.getIsSelected()) {
              setSelectedUsersIds((prevIds) => [...prevIds, userId])
            } else {
              setSelectedUsersIds((prevIds) => prevIds.filter((id) => id !== userId))
            }
          }}
          aria-label='Select row'
          className='translate-y-[2px]'
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: '_id',
      header: ({ column }) => <DataTableColumnHeader column={column} title='UserID' />,
      cell: ({ row }) => <div>{row.getValue('_id')}</div>,
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Họ và tên' />,
      footer: 'Họ và tên',
      cell: ({ row }) => {
        return <div className='font-medium line-clamp-2'>{row.getValue('name')}</div>
      }
    },
    {
      accessorKey: 'email',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
      footer: 'Email',
      cell: ({ row }) => {
        return <div className='font-medium line-clamp-2'>{row.getValue('email')}</div>
      }
    },
    {
      accessorKey: 'avatar',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Avatar' />,
      footer: 'Avatar',
      cell: ({ row }) => {
        return (
          <div className='size-16 rounded-full overflow-hidden'>
            {row.getValue('avatar') ? (
              <img src={getAvatarUrl(row.getValue('avatar'))} alt='avatar' className='aspect-square w-full h-full' />
            ) : (
              <CircleUserRound strokeWidth={1.5} className='size-full text-foreground' />
            )}
          </div>
        )
      },
      enableSorting: false
    },
    {
      accessorKey: 'roles',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Vai trò' />,
      footer: 'Vai trò',
      cell: ({ row }) => {
        return <div className='font-medium'>{(row.getValue('roles') as Role)[0]}</div>
      },
      filterFn: (row, id, value) => {
        return value.includes((row.getValue(id) as Role)[0])
      }
    },
    {
      accessorKey: 'verify',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái xác thực' />,
      footer: 'Trạng thái xác thực',
      cell: ({ row }) => {
        return <Badge>{getVerifyStatusLabel(row.getValue('verify'))}</Badge>
      },
      filterFn: (row, id, value) => {
        const rowValue = (row.getValue(id) as number).toString()
        return value.includes(rowValue)
      }
    },
    {
      id: 'actions',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Thao tác' />,
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          enableEditing={false}
          enableDeleting={true}
          enableViewDetail={true}
          onViewDetail={() => {
            navigate(path.userProfileDashboard.replace(':user_id', row.original._id))
          }}
          onDelete={() => {
            setSelectedUser(row.original)
            setDeleteUserDialogOpen(true)
          }}
        />
      )
    }
  ]

  return (
    <>
      <PageHeading
        heading='Tài khoản người dùng'
        csvData={csvExportUsersData}
        csvFileName='danh_sach_nguoi_dung.csv'
        handleDownloadPdf={handleDownloadPdf}
        pdfViewDocument={<PDFUsersTableDocument users={usersList!} />}
      >
        <Button variant='outline' className='space-x-2 bg-blue-500' onClick={() => setAddUserDrawerOpen(true)}>
          <PlusCircle />
          <span>Thêm tài khoản</span>
        </Button>
        <Button
          variant='destructive'
          className='space-x-2'
          onClick={() => {
            if (selectedUsersIds.length > 0) {
              setDeleteUsersDialogOpen(true)
            } else {
              toast.info('Vui lòng chọn một người dùng')
            }
          }}
        >
          <Trash2 className='size-5' />
          <span>Xóa</span>
        </Button>
      </PageHeading>
      <DataTable
        data={usersList || []}
        columns={columns}
        placeholder='Lọc tài khoản...'
        handleSelectedRowsIds={setSelectedUsersIds}
      />
      <AddUserDrawer open={addUserDrawerOpen} onOpenChange={setAddUserDrawerOpen} />
      <ConfirmDialog
        open={deleteUserDialogOpen}
        onOpenStateChange={setDeleteUserDialogOpen}
        title='Bạn có chắc là muốn xóa tài khoản người dùng này chứ?'
        description='Người dùng sau khi bị xóa không thể khôi phục'
        onConfirm={() => {
          if (!deleteUserResult.isLoading) {
            handleDeleteUser(selectedUser?._id!)
            setSelectedUser(null)
          }
        }}
      />
      <ConfirmDialog
        open={deleteUsersDialogOpen}
        onOpenStateChange={setDeleteUsersDialogOpen}
        title='Bạn có chắc là muốn xóa những tài khoản người dùng này chứ?'
        description='Tài khoản sau khi bị xóa không thể khôi phục'
        onConfirm={() => {
          if (!deleteManyUsersResult.isLoading) {
            handleDeleteManyUsers(selectedUsersIds)
            setSelectedUsersIds([])
          }
        }}
      />
    </>
  )
}
