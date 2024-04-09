import { ColumnDef } from '@tanstack/react-table'
import { Circle, CircleUserRound, PlusCircle, Trash2 } from 'lucide-react'
import DataTable from 'src/components/AdminPanel/DataTable'
import DataTableColumnHeader from 'src/components/AdminPanel/DataTableColumnHeader'
import DataTableRowActions from 'src/components/AdminPanel/DataTableRowActions'
import PageHeading from 'src/components/AdminPanel/PageHeading'
import { Button } from 'src/components/ui/button'
import { Checkbox } from 'src/components/ui/checkbox'
import { useDeleteManyUsersMutation, useDeleteUserMutation, useGetUsersQuery } from 'src/redux/apis/user.api'
import { Role, User } from 'src/types/user.type'
import { getAvatarUrl } from 'src/utils/utils'
import UpdateUserDrawer from '../components/UpdateUserDrawer'
import { useEffect, useMemo, useState } from 'react'
import { useGetAllVNProvincesQuery } from 'src/redux/apis/location.api'
import { useAppSelector } from 'src/redux/hook'
import ChangePasswordDrawer from '../components/ChangePasswordDrawer'
import AddUserDrawer from '../components/AddUserDrawer'
import ConfirmDialog from 'src/components/AdminPanel/ConfirmDialog'
import { toast } from 'react-toastify'
import { pdf } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'
import PDFUsersTableDocument from '../components/PDFUsersTable'

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
  'SĐT',
  'Vai trò',
  'Trạng thái tài khoản'
]

export default function UserList() {
  const { data: usersData } = useGetUsersQuery()
  const { data: vnProvincesData } = useGetAllVNProvincesQuery()
  const [addUserDrawerOpen, setAddUserDrawerOpen] = useState<boolean>(false)
  const [updateUserDrawerOpen, setUpdateUserDrawerOpen] = useState<boolean>(false)
  const [changePasswordDrawerOpen, setChangePasswordDrawerOpen] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedUsersIds, setSelectedUsersIds] = useState<string[]>([])
  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState<boolean>(false)
  const [deleteUsersDialogOpen, setDeleteUsersDialogOpen] = useState<boolean>(false)
  const { profile } = useAppSelector((state) => state.auth)
  const usersList = usersData?.data.users.filter((user) => user._id !== profile._id)
  const [deleteUser, deleteUserResult] = useDeleteUserMutation()
  const [deleteManyUsers, deleteManyUsersResult] = useDeleteManyUsersMutation()

  const csvExportUsersData = useMemo(() => {
    return (
      usersList && [
        exportDataHeaders,
        ...usersList.map((user) => [
          user._id,
          user.name,
          user.email,
          user.avatar || '',
          user.date_of_birth || '',
          user.address || '',
          user.province,
          user.district,
          user.ward,
          user.phone,
          user.roles?.[0],
          user.is_blocked ? 'Bị khóa' : 'Hoạt động'
        ])
      ]
    )
  }, [usersList])

  const handleDeleteUser = async (id: string) => {
    await deleteUser(id)
  }

  const handleDeleteManyUsers = async (usersIds: string[]) => {
    await deleteManyUsers({ list_id: usersIds })
  }

  const handleDownloadPdf = () => {
    pdf(<PDFUsersTableDocument users={usersList!} />)
      .toBlob()
      .then((blob) => saveAs(blob, 'danh_sach_nguoi_dung.pdf'))
  }

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
              <img src={getAvatarUrl(row.getValue('avatar'))} alt='avatar' className='w-full h-full object-cover' />
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
      accessorKey: 'is_blocked',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
      footer: 'Trạng thái',
      cell: ({ row }) => {
        return (
          <div className='font-medium flex items-center gap-2'>
            {row.getValue('is_blocked') ? (
              <>
                <Circle color='#d41111' fill='#d41111' className='size-4' />
                <span>Bị khóa</span>
              </>
            ) : (
              <>
                <Circle color='#11d30d' fill='#11d30d' className='size-4' />
                <span>Hoạt động</span>
              </>
            )}
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id)!.toString())
      }
    },
    {
      id: 'actions',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Thao tác' />,
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          enableEditing={true}
          enableDeleting={true}
          enableEditPassword={true}
          onEdit={() => {
            setSelectedUser(row.original)
            setUpdateUserDrawerOpen(true)
          }}
          onEditPassword={() => {
            setSelectedUser(row.original)
            setChangePasswordDrawerOpen(true)
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
      <AddUserDrawer
        open={addUserDrawerOpen}
        onOpenChange={setAddUserDrawerOpen}
        provinces={vnProvincesData?.data.results || []}
      />
      <UpdateUserDrawer
        open={updateUserDrawerOpen}
        onOpenChange={setUpdateUserDrawerOpen}
        selectedUser={selectedUser}
        onAfterUpdate={setSelectedUser}
        provinces={vnProvincesData?.data.results || []}
      />
      <ChangePasswordDrawer
        open={changePasswordDrawerOpen}
        onOpenChange={setChangePasswordDrawerOpen}
        selectedUser={selectedUser}
        onAfterUpdate={setSelectedUser}
      />
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
