import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from 'src/components/AdminPanel/DataTable'
import DataTableColumnHeader from 'src/components/AdminPanel/DataTableColumnHeader'
import DataTableRowActions from 'src/components/AdminPanel/DataTableRowActions'
import PageHeading from 'src/components/AdminPanel/PageHeading'
import ProductRating from 'src/components/ProductRating'
import { Checkbox } from 'src/components/ui/checkbox'
import path from 'src/constants/path'
import { useGetAllProductsQuery } from 'src/redux/apis/product.api'
import { Product, Rating } from 'src/types/product.type'

const exportDataHeaders = ['ID', 'Tên sản phẩm', 'Đánh giá', 'Số lượt đánh giá', 'Cập nhật vào']

export default function RatingList() {
  const { data: productsData } = useGetAllProductsQuery()
  const ratedProducts = useMemo(() => {
    return productsData ? productsData.data.products.filter((product) => product.total_ratings > 0) : []
  }, [productsData])
  const navigate = useNavigate()

  const csvExportRatingListData = useMemo(() => {
    const rows = ratedProducts
      ? ratedProducts.map((product) => [
          product._id,
          product.name,
          `${product.total_ratings} sao`,
          product.ratings.length,
          format(product.updatedAt, 'dd/MM/yyyy')
        ])
      : []
    return [exportDataHeaders, ...rows]
  }, [ratedProducts])

  const columns: ColumnDef<Product>[] = [
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
      accessorKey: '_id',
      header: ({ column }) => <DataTableColumnHeader column={column} title='ProductID' />,
      cell: ({ row }) => <div>{row.getValue('_id')}</div>,
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'thumb',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Ảnh' />,
      footer: 'Ảnh',
      cell: ({ row }) => {
        return (
          <div className='size-20 rounded-md overflow-hidden'>
            <img src={row.getValue('thumb')} alt='product-thumb' className='w-full h-full object-cover' />
          </div>
        )
      },
      enableSorting: false
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Tên sản phẩm' />,
      footer: 'Tên sản phẩm',
      cell: ({ row }) => {
        return <div className='font-medium line-clamp-2'>{row.getValue('name')}</div>
      }
    },
    {
      accessorKey: 'total_ratings',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Đánh giá' />,
      footer: 'Đánh giá',
      cell: ({ row }) => {
        return (
          <div className='flex items-center space-x-2'>
            <span className='font-semibold'>{row.getValue('total_ratings')}</span>
            <ProductRating
              rating={row.getValue('total_ratings')}
              activeClassname='fill-orange-400 text-orange-300 h-4 w-4'
              nonActiveClassname='fill-gray-300 text-gray-300 h-4 w-4'
            />
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes((row.getValue(id) as string).toString())
      }
    },
    {
      accessorKey: 'ratings',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Số lượt đánh giá' />,
      footer: 'Số lượt đánh giá',
      cell: ({ row }) => {
        return <div className='font-medium line-clamp-2'>{(row.getValue('ratings') as Rating[]).length} đánh giá</div>
      }
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Cập nhật vào' />,
      footer: 'Cập nhật vào',
      cell: ({ row }) => {
        return <div className='font-medium'>{format(row.getValue('updatedAt'), 'dd-MM-yyyy', { locale: vi })}</div>
      }
    },
    {
      id: 'actions',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Thao tác' />,
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          enableEditing={false}
          enableDeleting={false}
          enableViewDetail={true}
          onViewDetail={() => {
            navigate(path.detailRatingDashboard.replace(':product_id', row.original._id))
          }}
        />
      )
    }
  ]

  return (
    <>
      <PageHeading
        heading='Đánh giá sản phẩm'
        csvData={csvExportRatingListData}
        csvFileName='danh_sach_danh_gia.csv'
        hasPdfDownload={false}
      />
      <DataTable data={ratedProducts || []} columns={columns} placeholder='Lọc đánh giá...' />
    </>
  )
}
