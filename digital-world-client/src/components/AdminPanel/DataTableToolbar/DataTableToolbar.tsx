import { X } from 'lucide-react'
import { Table } from '@tanstack/react-table'
import { Input } from 'src/components/ui/input'
import { Button } from 'src/components/ui/button'
import DataTableFacetedFilter from '../DataTableFacetedFilter'
import DataTableViewOptions from '../DateViewTableOptions'
import { useAppSelector } from 'src/redux/hook'
import {
  deliveryStatusOptions,
  orderStatusOptions,
  paymentStatusOptions,
  ratingsOptions,
  rolesOptions,
  verifyOptions
} from 'src/static/options'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  placeholder: string
}

export default function DataTableToolbar<TData>({ table, placeholder }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const { brandsOptions } = useAppSelector((state) => state.brand)
  const { categoriesOptions } = useAppSelector((state) => state.category)

  return (
    <div className='flex flex-wrap items-start justify-between'>
      <div className='flex flex-wrap flex-col w-full sm:flex-row sm:flex-1 sm:items-center gap-2'>
        <Input
          placeholder={placeholder}
          value={
            (table.getColumn('name')?.getFilterValue() as string) ??
            (table.getColumn('order_code')?.getFilterValue() as string) ??
            ''
          }
          onChange={(event) => {
            table.getColumn('name') && table.getColumn('name')?.setFilterValue(event.target.value)
            table.getColumn('order_code') && table.getColumn('order_code')?.setFilterValue(event.target.value)
          }}
          className='h-8 sm:w-[150px] lg:w-[250px]'
        />
        {table.getColumn('brand') && (
          <DataTableFacetedFilter column={table.getColumn('brand')} title='Thương hiệu' options={brandsOptions} />
        )}
        {table.getColumn('category') && (
          <DataTableFacetedFilter column={table.getColumn('category')} title='Danh mục' options={categoriesOptions} />
        )}
        {table.getColumn('total_ratings') && (
          <DataTableFacetedFilter column={table.getColumn('total_ratings')} title='Đánh giá' options={ratingsOptions} />
        )}
        {table.getColumn('star') && (
          <DataTableFacetedFilter column={table.getColumn('star')} title='Đánh giá' options={ratingsOptions} />
        )}
        {table.getColumn('roles') && (
          <DataTableFacetedFilter column={table.getColumn('roles')} title='Vai trò' options={rolesOptions} />
        )}
        {table.getColumn('verify') && (
          <DataTableFacetedFilter column={table.getColumn('verify')} title='Trạng thái' options={verifyOptions} />
        )}
        {table.getColumn('order_status') && (
          <DataTableFacetedFilter
            column={table.getColumn('order_status')}
            title='Trạng thái đơn hàng'
            options={orderStatusOptions}
          />
        )}
        {table.getColumn('delivery_status') && (
          <DataTableFacetedFilter
            column={table.getColumn('delivery_status')}
            title='Trạng thái vận chuyển'
            options={deliveryStatusOptions}
          />
        )}
        {table.getColumn('payment_status') && (
          <DataTableFacetedFilter
            column={table.getColumn('payment_status')}
            title='Trạng thái thanh toán'
            options={paymentStatusOptions}
          />
        )}
        {isFiltered && (
          <Button variant='ghost' onClick={() => table.resetColumnFilters()} className='h-8 px-2 lg:px-3'>
            Reset
            <X className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
