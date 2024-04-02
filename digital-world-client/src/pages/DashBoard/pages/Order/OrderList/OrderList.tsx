import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { CircleUserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import DataTable from 'src/components/AdminPanel/DataTable'
import DataTableColumnHeader from 'src/components/AdminPanel/DataTableColumnHeader'
import DataTableRowActions from 'src/components/AdminPanel/DataTableRowActions'
import PageHeading from 'src/components/AdminPanel/PageHeading'
import { Button } from 'src/components/ui/button'
import { Checkbox } from 'src/components/ui/checkbox'
import path from 'src/constants/path'
import { useGetOrdersQuery } from 'src/redux/apis/order.api'
import { Order } from 'src/types/order.type'
import { formatCurrency, getAvatarUrl } from 'src/utils/utils'

export default function OrderList() {
  const { data: ordersData } = useGetOrdersQuery()
  const navigate = useNavigate()

  const columns: ColumnDef<Order>[] = [
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
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
          className='translate-y-[2px]'
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'order_code',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Mã đơn hàng' />,
      footer: 'Mã đơn hàng',
      cell: ({ row }) => (
        <div>
          <Button variant='outline' asChild>
            <Link to={`${path.orderDashBoard}/${row.original._id}`}>{row.getValue('order_code')}</Link>
          </Button>
        </div>
      )
    },
    {
      accessorKey: 'order_by',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Khách hàng' />,
      footer: 'Khách hàng',
      cell: ({ row }) => {
        return (
          <div className='flex items-center gap-4'>
            <div className='size-14 rounded-lg overflow-hidden'>
              {(row.getValue('order_by') as any).user_avatar ? (
                <img
                  src={getAvatarUrl((row.getValue('order_by') as any).user_avatar)}
                  alt='user avatar'
                  className='w-full h-full object-cover'
                />
              ) : (
                <CircleUserRound strokeWidth={1.5} className='size-full text-foreground' />
              )}
            </div>
            <div className='font-medium'>{(row.getValue('order_by') as any).user_name}</div>
          </div>
        )
      }
    },
    {
      accessorKey: 'products',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Số lượng' />,
      footer: 'Số lượng',
      cell: ({ row }) => {
        return <div className='font-medium'>{(row.getValue('products') as any).length} sản phẩm</div>
      }
    },
    {
      accessorKey: 'total_amount',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Tổng tiền' />,
      footer: 'Tổng tiền',
      cell: ({ row }) => {
        return <div className='font-medium'>{formatCurrency(row.getValue('total_amount'))}đ</div>
      }
    },
    {
      accessorKey: 'order_status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái đơn hàng' />,
      footer: 'Trạng thái đơn hàng',
      cell: ({ row }) => {
        return <div className='font-medium'>{row.getValue('order_status')}</div>
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'delivery_status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái vận chuyển' />,
      footer: 'Trạng thái vận chuyển',
      cell: ({ row }) => {
        return <div className='font-medium line-clamp-2'>{row.getValue('delivery_status')}</div>
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'payment_status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái thanh toán' />,
      footer: 'Trạng thái thanh toán',
      cell: ({ row }) => {
        return <div className='font-medium'>{row.getValue('payment_status')}</div>
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'date_of_order',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày đặt' />,
      footer: 'Ngày đặt',
      cell: ({ row }) => {
        return <div className='font-medium'>{format(row.getValue('date_of_order'), 'dd/MM/yyyy', { locale: vi })}</div>
      }
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Cập nhật vào' />,
      footer: 'Cập nhật vào',
      cell: ({ row }) => {
        return <div className='font-medium'>{format(row.getValue('updatedAt'), 'dd/MM/yyyy', { locale: vi })}</div>
      }
    },
    {
      id: 'actions',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Thao tác' />,
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          enableEditing={true}
          enableDeleting={false}
          onEdit={() => {
            navigate(path.updateUserOrder.replace(':order_id', row.original._id))
          }}
        />
      )
    }
  ]

  return (
    <>
      <PageHeading heading='Đơn hàng' />
      <DataTable data={ordersData?.data.orders || []} columns={columns} placeholder='Lọc đơn hàng...' />
    </>
  )
}
