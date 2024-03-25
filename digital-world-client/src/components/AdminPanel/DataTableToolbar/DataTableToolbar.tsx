import { X } from 'lucide-react'
import { Table } from '@tanstack/react-table'
import { Input } from 'src/components/ui/input'
import { Button } from 'src/components/ui/button'
import DataTableFacetedFilter from '../DataTableFacetedFilter'
import DataTableViewOptions from '../DateViewTableOptions'
import { useAppSelector } from 'src/redux/hook'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  placeholder: string
}

export default function DataTableToolbar<TData>({ table, placeholder }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const { brandsOptions } = useAppSelector((state) => state.brand)
  const { categoriesOptions } = useAppSelector((state) => state.category)

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          placeholder={placeholder}
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
          className='h-8 w-[150px] lg:w-[250px]'
        />
        {/* {table.getColumn('name') && (
          <DataTableFacetedFilter column={table.getColumn('name')} title='Tên danh mục' options={categoriesName} />
        )} */}
        {table.getColumn('brand') && (
          <DataTableFacetedFilter column={table.getColumn('brand')} title='Thương hiệu' options={brandsOptions} />
        )}
        {table.getColumn('category') && (
          <DataTableFacetedFilter column={table.getColumn('category')} title='Danh mục' options={categoriesOptions} />
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
