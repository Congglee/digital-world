import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DataTable from 'src/components/AdminPanel/DataTable'
import DataTableColumnHeader from 'src/components/AdminPanel/DataTableColumnHeader'
import DataTableRowActions from 'src/components/AdminPanel/DataTableRowActions'
import PageHeading from 'src/components/AdminPanel/PageHeading'
import { Button } from 'src/components/ui/button'
import { Checkbox } from 'src/components/ui/checkbox'
import path from 'src/constants/path'
import { useGetAllOrdersQuery } from 'src/redux/apis/order.api'
import { Order, OrderProductItem, OrderBy } from 'src/types/order.type'
import { formatCurrency } from 'src/utils/utils'

const exportDataHeaders = [
  'Mã đơn hàng',
  'Khách',
  'Email',
  'Số điện thoại',
  'Sản phẩm',
  'Số lượng sản phẩm',
  'Giá sản phẩm',
  'Thành tiền',
  'Ngày đặt',
  'Địa chỉ giao hàng',
  'Địa chỉ thanh toán',
  'Phương thức thanh toán',
  'Trạng thái đơn hàng',
  'Trạng thái vận chuyển',
  'Trạng thái thanh toán',
  'Tổng tiền'
]

export default function OrderList() {
  const { data: ordersData } = useGetAllOrdersQuery()
  const navigate = useNavigate()

  const csvExportOrdersData = useMemo(() => {
    const rows = ordersData
      ? ordersData.data.orders.flatMap((order) =>
          order.products.map((product) => [
            order.order_code,
            order.order_by.user_fullname,
            order.order_by.user_email,
            order.order_by.user_phone,
            product.product_name,
            product.buy_count,
            `${formatCurrency(product.product_price)}đ`,
            `${formatCurrency(product.buy_count * product.product_price)}đ`,
            format(order.date_of_order, 'dd/MM/yy'),
            `${order.shipping_address.address}, ${order.shipping_address.province}, ${order.shipping_address.district}, ${order.shipping_address.ward}`,
            `${order.billing_address.address}, ${order.billing_address.province}, ${order.billing_address.district}, ${order.billing_address.ward}`,
            order.payment_method,
            order.order_status,
            order.delivery_status,
            order.payment_status,
            `${formatCurrency(order.total_amount)}đ`
          ])
        )
      : []
    return [exportDataHeaders, ...rows]
  }, [ordersData])

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
        <div className='font-medium'>
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
        return <div className='font-medium'>{(row.getValue('order_by') as OrderBy).user_fullname}</div>
      }
    },
    {
      accessorKey: 'products',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Số lượng' />,
      footer: 'Số lượng',
      cell: ({ row }) => {
        return <div>{(row.getValue('products') as OrderProductItem[]).length} sản phẩm</div>
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
        return <div>{format(row.getValue('date_of_order'), 'dd/MM/yyyy', { locale: vi })}</div>
      }
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Cập nhật vào' />,
      footer: 'Cập nhật vào',
      cell: ({ row }) => {
        return <div>{format(row.getValue('updatedAt'), 'dd/MM/yyyy', { locale: vi })}</div>
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
          enableSendMail={true}
          onEdit={() => {
            navigate(path.updateUserOrder.replace(':order_id', row.original._id))
          }}
          onSendMail={() => {
            navigate(path.sendMailOrder.replace(':order_id', row.original._id))
          }}
        />
      )
    }
  ]

  return (
    <>
      <PageHeading
        heading='Đơn hàng'
        hasPdfDownload={false}
        csvData={csvExportOrdersData}
        csvFileName='danh_sach_don_hang.csv'
      />
      <DataTable data={ordersData?.data.orders || []} columns={columns} placeholder='Lọc đơn hàng...' />
    </>
  )
}
