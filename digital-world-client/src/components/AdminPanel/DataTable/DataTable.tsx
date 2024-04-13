import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import * as React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'src/components/ui/table'
import DataTablePagination from '../DataTablePagination/DataTablePagination'
import DataTableToolbar from '../DataTableToolbar'

interface DataTableProps<TData extends { _id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  placeholder: string
  handleSelectedRowsIds?: React.Dispatch<React.SetStateAction<string[]>>
  // queryConfig: QueryConfig
  // pageCount: number
}

export default function DataTable<TData extends { _id: string }, TValue>({
  columns,
  data,
  placeholder,
  handleSelectedRowsIds
  // queryConfig,
  // pageCount
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])

  // const { page, limit } = queryConfig
  // const [searchParams] = useSearchParams()
  // const location = useLocation()
  // const navigate = useNavigate()

  // Create query string
  // const createQueryString = React.useCallback(
  //   (params: Record<string, string | number | null>) => {
  //     const newSearchParams = new URLSearchParams(searchParams?.toString())

  //     for (const [key, value] of Object.entries(params)) {
  //       if (value === null) {
  //         newSearchParams.delete(key)
  //       } else {
  //         newSearchParams.set(key, String(value))
  //       }
  //     }

  //     return newSearchParams.toString()
  //   },
  //   [searchParams]
  // )

  // const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
  //   pageIndex: Number(page) - 1,
  //   pageSize: Number(limit)
  // })

  // const pagination = React.useMemo(
  //   () => ({
  //     pageIndex,
  //     pageSize
  //   }),
  //   [pageIndex, pageSize]
  // )

  // React.useEffect(() => {
  //   const newSearchParams = createQueryString({
  //     page: pageIndex + 1,
  //     limit: pageSize
  //   })
  //   navigate(`${location.pathname}?${newSearchParams}`, { replace: true })
  // }, [pageIndex, pageSize, location.pathname, navigate])

  const table = useReactTable({
    data,
    columns,
    // pageCount: pageCount ?? -1,
    state: {
      // pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters
    },
    getRowId: (row) => row._id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    // onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
    // manualPagination: true
  })

  React.useEffect(() => {
    const selectedRowModel = table.getSelectedRowModel().rows
    if (table.getIsAllPageRowsSelected()) {
      const selectedRowIds = selectedRowModel.map((row) => row.id)
      handleSelectedRowsIds && handleSelectedRowsIds(selectedRowIds)
    } else {
      if (selectedRowModel.length > 0) {
        handleSelectedRowsIds && handleSelectedRowsIds((prevSelectedRowsIds) => prevSelectedRowsIds)
      } else {
        handleSelectedRowsIds && handleSelectedRowsIds([])
      }
    }
  }, [table.getIsAllPageRowsSelected()])

  return (
    <div className='space-y-4'>
      <DataTableToolbar table={table} placeholder={placeholder} />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
